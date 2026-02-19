<script lang="ts">
    import type {
        Company,
        Employee,
        PayrollResult,
        Attendance,
        PayslipMeta,
    } from "../../types";

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
                (c: import("../../types").SalaryComponent) =>
                    c.type === "allowance",
            )
            .forEach((c: import("../../types").SalaryComponent) => {
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
                (c: import("../../types").SalaryComponent) =>
                    c.type === "deduction",
            )
            .forEach((c: import("../../types").SalaryComponent) => {
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
                        class="bg-white relative overflow-hidden payslip-page mb-12 last:mb-0 border-b-2 border-dashed border-base-300 pb-8"
                        data-theme="light"
                        style="width: {dims.width}mm; padding: 10mm; font-family: 'Courier New', Courier, monospace;"
                    >
                        <!-- No Watermark for Compact -->

                        <div class="relative z-10 h-full flex flex-col">
                            {#if i === 0}
                                <!-- Header (Compact) -->
                                <div
                                    class="text-center border-b-2 border-black border-dashed pb-4 mb-4"
                                >
                                    <h1
                                        class="text-xl font-bold uppercase mb-2"
                                    >
                                        {company.name}
                                    </h1>
                                    <p class="text-xs">{company.address}</p>
                                    <p class="text-xs">
                                        {company.city}
                                        {company.postalCode}
                                    </p>
                                    <div
                                        class="mt-4 pt-2 border-t border-black"
                                    >
                                        <h2 class="text-lg font-bold">
                                            SLIP GAJI
                                        </h2>
                                        <p class="text-sm">
                                            {new Date(
                                                meta.period,
                                            ).toLocaleDateString("id-ID", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <!-- Employee Info (Compact) -->
                                <div class="mb-4 text-xs font-mono">
                                    <div class="flex justify-between">
                                        <span>Nama:</span>
                                        <span class="font-bold"
                                            >{employee.name}</span
                                        >
                                    </div>
                                    <div class="flex justify-between">
                                        <span>ID:</span>
                                        <span>{employee.id || "-"}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Jabatan:</span>
                                        <span>{employee.position}</span>
                                    </div>
                                </div>
                            {:else}
                                <!-- Header for subsequent pages (Simplified) -->
                                <div
                                    class="text-center border-b border-black border-dashed pb-2 mb-4"
                                >
                                    <h1 class="text-sm font-bold opacity-50">
                                        {company.name} - Lanjutan
                                    </h1>
                                </div>
                            {/if}

                            <!-- Dynamic Content Rows -->
                            <div class="text-sm font-mono">
                                {#each page.rows as row}
                                    {#if row.type === "header"}
                                        <h3
                                            class="font-bold border-b border-black mt-4 mb-2 uppercase text-xs"
                                        >
                                            {row.label}
                                        </h3>
                                    {:else if row.type === "item"}
                                        <div
                                            class="flex justify-between items-start py-1"
                                        >
                                            <span>{row.label}</span>
                                            <span
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
                                            class="flex justify-between py-1 border-t border-dashed border-black mt-1 mb-2 font-bold"
                                        >
                                            <span>{row.label}</span>
                                            <span
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
                                <!-- Net Pay (Receipt Style) -->
                                <div
                                    class="border-t-2 border-black border-dashed pt-4 mt-4"
                                >
                                    <div
                                        class="flex justify-between items-center font-bold text-lg"
                                    >
                                        <span>TAKE HOME PAY</span>
                                        <span
                                            >{formatMoney(
                                                result.takeHomePay,
                                            )}</span
                                        >
                                    </div>
                                    <div
                                        class="text-center text-[10px] mt-8 opacity-70"
                                    >
                                        <p class="mb-1">*** TERIMA KASIH ***</p>
                                        <p class="font-mono">
                                            {new Date(
                                                meta.issuanceDate,
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
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
