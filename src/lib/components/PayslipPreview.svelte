<script lang="ts">
    import type {
        Company,
        Employee,
        PayrollResult,
        Attendance,
        PayslipMeta,
    } from "../types";

    let { company, employee, result, attendance, meta } = $props<{
        company: Company;
        employee: Employee;
        result: PayrollResult;
        attendance?: Attendance;
        meta: PayslipMeta;
    }>();

    const currencyFormatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const formatMoney = (amount: number) => currencyFormatter.format(amount);

    const paperDimensions = $derived(() => {
        switch (meta.paperSize) {
            case "A4":
                return { width: 210, height: 297, label: "A4" };
            case "F4":
                return { width: 215, height: 330, label: "F4" };
            case "Legal":
                return { width: 216, height: 356, label: "Legal" };
            default:
                return { width: 210, height: 297, label: "A4" };
        }
    });

    const dims = $derived(paperDimensions());
    const paperWidthPx = $derived(dims.width * 3.78);
    const paperHeightPx = $derived(dims.height * 3.78);

    let zoom = $state(1.0);

    $effect(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                const screenWidth = window.innerWidth;
                const containerPadding = 32;
                const availableWidth = screenWidth - containerPadding;

                if (availableWidth < paperWidthPx) {
                    zoom = Number((availableWidth / paperWidthPx).toFixed(2));
                } else if (screenWidth < 1280) {
                    zoom = 0.85;
                } else {
                    zoom = 1.0;
                }
            };

            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    });

    // Pagination Logic
    interface PayslipRow {
        type: "header" | "item" | "subtotal";
        label: string;
        amount?: number;
        isDeduction?: boolean;
        color?: string;
    }

    const MAX_SINGLE_PAGE_ROWS = 12;
    const MAX_FIRST_PAGE_OF_MULTI_ROWS = 12;
    const MAX_OTHER_PAGE_ROWS = 28;
    const PAGE_GAP_PX = 48;

    const rows = $derived.by(() => {
        const r: PayslipRow[] = [];
        r.push({ type: "header", label: "PENDAPATAN (EARNINGS)" });
        r.push({
            type: "item",
            label: "Gaji Pokok",
            amount: employee.basicSalary,
        });
        result.components
            .filter(
                (c: import("../types").SalaryComponent) =>
                    c.type === "allowance",
            )
            .forEach((c: import("../types").SalaryComponent) => {
                r.push({ type: "item", label: c.name, amount: c.amount });
            });
        r.push({
            type: "subtotal",
            label: "Total Pendapatan Bruto",
            amount: result.totalAllowances + employee.basicSalary,
        });
        r.push({
            type: "header",
            label: "POTONGAN (DEDUCTIONS)",
            color: "error",
        });
        result.components
            .filter(
                (c: import("../types").SalaryComponent) =>
                    c.type === "deduction",
            )
            .forEach((c: import("../types").SalaryComponent) => {
                r.push({
                    type: "item",
                    label: c.name,
                    amount: c.amount,
                    isDeduction: true,
                    color: "error",
                });
            });
        r.push({
            type: "subtotal",
            label: "Total Potongan",
            amount: result.totalDeductions,
            isDeduction: true,
            color: "error",
        });
        return r;
    });

    const pages = $derived.by(() => {
        const allRows = rows;

        // If it fits on one page (including Net Pay and Footer), keep it on one page
        if (allRows.length <= MAX_SINGLE_PAGE_ROWS) {
            return [{ rows: allRows }];
        }

        // Otherwise, split it.
        const p = [];
        p.push({ rows: allRows.slice(0, MAX_FIRST_PAGE_OF_MULTI_ROWS) });

        let currentRow = MAX_FIRST_PAGE_OF_MULTI_ROWS;
        while (currentRow < allRows.length) {
            const nextRows = allRows.slice(
                currentRow,
                currentRow + MAX_OTHER_PAGE_ROWS,
            );
            if (nextRows.length > 0) {
                p.push({ rows: nextRows });
            }
            currentRow += MAX_OTHER_PAGE_ROWS;
        }

        return p;
    });
</script>

<div class="flex flex-col gap-4">
    <!-- Preview Controls -->
    <div
        class="flex flex-wrap items-center justify-between gap-4 bg-base-200 p-4 rounded-xl shadow-sm border border-base-300 mx-4"
    >
        <div class="flex items-center gap-2">
            <span class="text-sm font-semibold opacity-70">Zoom Preview:</span>
            <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.05"
                bind:value={zoom}
                class="range range-primary range-sm w-24 md:w-48"
            />
            <span class="text-xs font-mono w-10">{Math.round(zoom * 100)}%</span
            >
        </div>
        <div class="flex gap-2">
            <button
                class="btn btn-xs btn-outline"
                onclick={() => {
                    const availableWidth = window.innerWidth - 32;
                    zoom = availableWidth / paperWidthPx;
                }}>Fit Width</button
            >
            <button class="btn btn-xs btn-outline" onclick={() => (zoom = 1.0)}
                >100%</button
            >
        </div>
    </div>

    <div
        class="payslip-viewer w-full flex justify-center py-12 px-2 overflow-x-auto bg-base-300/50"
    >
        <!-- The Scaler Div: Account for multiple pages in height -->
        <div
            class="scaler-container"
            style="width: {paperWidthPx * zoom}px; height: {paperHeightPx *
                pages.length *
                zoom +
                (pages.length - 1) * PAGE_GAP_PX * zoom}px;"
        >
            <div
                id="payslip-wrapper"
                class="origin-top-left"
                style="transform: scale({zoom});"
            >
                {#each pages as page, i}
                    <div
                        class="bg-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] payslip-page mb-12 last:mb-0 border border-base-300 ring-1 ring-base-content/5"
                        data-theme="light"
                        style="width: {dims.width}mm; height: {dims.height}mm; padding: 20mm; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;"
                    >
                        <!-- Tiled Watermark -->
                        <div
                            class="absolute inset-0 pointer-events-none select-none z-0 opacity-[0.06]"
                            style="background-image: url('data:image/svg+xml;base64,{btoa(
                                `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><text x="50%" y="50%" font-size="14" font-weight="900" font-family="sans-serif" text-anchor="middle" transform="rotate(-35, 100, 75)" fill="#000">${company.name}</text></svg>`,
                            )}'); background-repeat: repeat;"
                        ></div>

                        <div class="relative z-10 h-full flex flex-col">
                            {#if i === 0}
                                <!-- Header (Only on First Page) -->
                                <div
                                    class="flex justify-between items-start border-b-2 border-primary pb-4 mb-8 gap-8"
                                >
                                    <div class="flex gap-4 items-center flex-1">
                                        <img
                                            src={company.logo || "/logo.png"}
                                            alt="Company Logo"
                                            class="w-16 h-16 object-contain rounded-md"
                                            crossorigin={company.logo?.startsWith(
                                                "http",
                                            )
                                                ? "anonymous"
                                                : undefined}
                                            onload={() =>
                                                (company.hasLogoError = false)}
                                            onerror={(e) => {
                                                const target =
                                                    e.currentTarget as HTMLImageElement;
                                                if (
                                                    target.src !==
                                                    window.location.origin +
                                                        "/logo.png"
                                                ) {
                                                    company.hasLogoError = true;
                                                    target.removeAttribute(
                                                        "crossorigin",
                                                    );
                                                    target.src = "/logo.png";
                                                }
                                            }}
                                        />
                                        <div class="flex-1">
                                            <h1 class="text-2xl font-bold">
                                                {company.name}
                                            </h1>
                                            <p
                                                class="text-xs opacity-70 whitespace-pre-line leading-relaxed"
                                            >
                                                {company.address}
                                            </p>
                                            <p class="text-xs opacity-70">
                                                {company.city}
                                                {company.postalCode}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="text-right flex-shrink-0">
                                        <h2
                                            class="text-3xl font-bold text-primary"
                                        >
                                            SLIP GAJI
                                        </h2>
                                        <p class="text-lg opacity-70 mt-1">
                                            Periode: {new Date(
                                                meta.period,
                                            ).toLocaleDateString("id-ID", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                        {#if pages.length > 1}
                                            <p
                                                class="text-xs font-bold text-primary mt-1"
                                            >
                                                Halaman {i + 1} dari {pages.length}
                                            </p>
                                        {/if}
                                    </div>
                                </div>

                                <!-- Employee Info (Only on First Page) -->
                                <div
                                    class="grid grid-cols-2 gap-x-8 gap-y-2 mb-8 text-sm"
                                >
                                    <div
                                        class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                    >
                                        <span class="font-semibold opacity-70"
                                            >Nama</span
                                        >
                                        <span class="opacity-70">:</span>
                                        <span class="font-bold"
                                            >{employee.name}</span
                                        >
                                    </div>
                                    <div
                                        class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                    >
                                        <span class="font-semibold opacity-70"
                                            >ID Karyawan</span
                                        >
                                        <span class="opacity-70">:</span>
                                        <span>{employee.id || "-"}</span>
                                    </div>
                                    <div
                                        class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                    >
                                        <span class="font-semibold opacity-70"
                                            >Jabatan</span
                                        >
                                        <span class="opacity-70">:</span>
                                        <span>{employee.position}</span>
                                    </div>
                                    <div
                                        class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                    >
                                        <span class="font-semibold opacity-70"
                                            >Departemen</span
                                        >
                                        <span class="opacity-70">:</span>
                                        <span>{employee.department}</span>
                                    </div>
                                    <div
                                        class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                    >
                                        <span class="font-semibold opacity-70"
                                            >Status</span
                                        >
                                        <span class="opacity-70">:</span>
                                        <span class="capitalize"
                                            >{employee.status}</span
                                        >
                                    </div>
                                    <div
                                        class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                    >
                                        <span class="font-semibold opacity-70"
                                            >PTKP</span
                                        >
                                        <span class="opacity-70">:</span>
                                        <span>{employee.maritalStatus}</span>
                                    </div>
                                    {#if attendance}
                                        <div
                                            class="col-span-2 border-t border-dashed my-2"
                                        ></div>
                                        <div
                                            class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                        >
                                            <span
                                                class="font-semibold opacity-70"
                                                >Hari Kerja</span
                                            >
                                            <span class="opacity-70">:</span>
                                            <span
                                                >{attendance.workingDays
                                                    ? `${attendance.workingDays} Hari`
                                                    : "-"}</span
                                            >
                                        </div>
                                        <div
                                            class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                        >
                                            <span
                                                class="font-semibold opacity-70"
                                                >Hadir</span
                                            >
                                            <span class="opacity-70">:</span>
                                            <span
                                                >{attendance.present
                                                    ? `${attendance.present} Hari`
                                                    : "-"}</span
                                            >
                                        </div>
                                        <div
                                            class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                        >
                                            <span
                                                class="font-semibold opacity-70"
                                                >Sakit</span
                                            >
                                            <span class="opacity-70">:</span>
                                            <span
                                                >{attendance.sick
                                                    ? `${attendance.sick} Hari`
                                                    : "-"}</span
                                            >
                                        </div>
                                        <div
                                            class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                        >
                                            <span
                                                class="font-semibold opacity-70"
                                                >Izin</span
                                            >
                                            <span class="opacity-70">:</span>
                                            <span
                                                >{attendance.permission
                                                    ? `${attendance.permission} Hari`
                                                    : "-"}</span
                                            >
                                        </div>
                                        <div
                                            class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                        >
                                            <span
                                                class="font-semibold opacity-70"
                                                >Cuti</span
                                            >
                                            <span class="opacity-70">:</span>
                                            <span
                                                >{attendance.leave
                                                    ? `${attendance.leave} Hari`
                                                    : "-"}</span
                                            >
                                        </div>
                                        <div
                                            class="grid grid-cols-[100px_10px_1fr] gap-1 whitespace-nowrap"
                                        >
                                            <span
                                                class="font-semibold opacity-70"
                                                >Alpha</span
                                            >
                                            <span class="opacity-70">:</span>
                                            <span
                                                >{attendance.alpha
                                                    ? `${attendance.alpha} Hari`
                                                    : "-"}</span
                                            >
                                        </div>
                                    {/if}
                                </div>
                            {:else}
                                <!-- Header for subsequent pages (Simplified) -->
                                <div
                                    class="flex justify-between items-end border-b-2 border-primary pb-4 mb-8 gap-8"
                                >
                                    <div>
                                        <h1
                                            class="text-xl font-bold opacity-50"
                                        >
                                            {company.name} - Lanjutan
                                        </h1>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-xs opacity-50">
                                            Halaman {i + 1} dari {pages.length}
                                        </p>
                                    </div>
                                </div>
                            {/if}

                            <!-- Dynamic Content Rows -->
                            <div>
                                {#each page.rows as row}
                                    {#if row.type === "header"}
                                        <h3
                                            class="font-bold text-lg mb-2 border-b border-base-200 pb-1 mt-4 {row.color ===
                                            'error'
                                                ? 'text-error'
                                                : ''}"
                                        >
                                            {row.label}
                                        </h3>
                                    {:else if row.type === "item"}
                                        <div
                                            class="flex justify-between items-start py-1.5 leading-tight {row.color ===
                                            'error'
                                                ? 'text-error'
                                                : ''}"
                                        >
                                            <span>{row.label}</span>
                                            <span
                                                class="font-mono whitespace-nowrap"
                                                >{row.isDeduction
                                                    ? "("
                                                    : ""}{formatMoney(
                                                    row.amount || 0,
                                                )}{row.isDeduction
                                                    ? ")"
                                                    : ""}</span
                                            >
                                        </div>
                                    {:else if row.type === "subtotal"}
                                        <div
                                            class="flex justify-between py-2 border-t border-dashed mt-2 mb-4 font-bold rounded px-2 {row.color ===
                                            'error'
                                                ? 'bg-error/10 text-error'
                                                : 'bg-base-200'}"
                                        >
                                            <span>{row.label}</span>
                                            <span
                                                class="font-mono whitespace-nowrap"
                                                >{row.isDeduction
                                                    ? "("
                                                    : ""}{formatMoney(
                                                    row.amount || 0,
                                                )}{row.isDeduction
                                                    ? ")"
                                                    : ""}</span
                                            >
                                        </div>
                                    {/if}
                                {/each}
                            </div>

                            {#if i === pages.length - 1}
                                <!-- Net Pay (Only on Last Page) -->
                                <div
                                    class="bg-primary text-primary-content p-4 rounded-lg flex justify-between items-center mb-8 mt-8"
                                >
                                    <div>
                                        <span
                                            class="block text-sm opacity-80 uppercase tracking-wider"
                                            >Gaji Bersih (Take Home Pay)</span
                                        >
                                        <span
                                            class="text-3xl font-bold whitespace-nowrap"
                                            >{formatMoney(
                                                result.takeHomePay,
                                            )}</span
                                        >
                                    </div>
                                    <div
                                        class="text-right text-xs opacity-70 italic max-w-xs"
                                    >
                                        *Ditransfer ke rekening terdaftar
                                    </div>
                                </div>

                                <!-- Footer (Only on Last Page) -->
                                <div
                                    class="pt-8 border-t border-base-200 text-center text-[10px] opacity-70"
                                >
                                    <p
                                        class="font-bold text-error uppercase mb-1"
                                    >
                                        SANGAT RAHASIA (Dokumen ini hanya untuk
                                        internal dan tidak boleh dibagikan
                                        kepada pihak ketiga).
                                    </p>
                                    <p class="font-mono italic">
                                        * Dokumen ini digenerate otomatis oleh
                                        sistem pada {new Date(
                                            meta.issuanceDate,
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}. Tanda tangan basah tidak
                                        diperlukan.
                                    </p>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .payslip-viewer {
        background-color: #f3f4f6;
        min-height: 400px;
        -webkit-overflow-scrolling: touch;
    }

    .scaler-container {
        position: relative;
        overflow: hidden;
        transition: all 0.2s ease-out;
    }

    .payslip-page {
        display: block;
        transition: transform 0.2s ease-out;
    }

    .range {
        cursor: pointer;
    }

    @media print {
        .scaler-container {
            width: auto !important;
            height: auto !important;
            overflow: visible !important;
        }
        .payslip-page {
            transform: scale(1) !important;
            box-shadow: none !important;
            margin: 0 !important;
            break-after: always;
        }
        .payslip-page:last-child {
            break-after: auto;
        }
        .flex.flex-col.gap-4 > div:first-child {
            display: none;
        }
    }
</style>
