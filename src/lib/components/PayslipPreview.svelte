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
</script>

<div
    class="bg-white w-full max-w-[216mm] mx-auto relative overflow-hidden"
    id="payslip-container"
    data-theme="light"
    style="min-height: 356mm; padding: 25mm;"
>
    <!-- Tiled Watermark - Using base64 encoded SVG for better compatibility with html-to-image/PDF -->
    <div
        class="absolute inset-0 pointer-events-none select-none z-0 opacity-[0.06]"
        style="background-image: url('data:image/svg+xml;base64,{btoa(
            `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><text x="50%" y="50%" font-size="14" font-weight="900" font-family="sans-serif" text-anchor="middle" transform="rotate(-35, 100, 75)" fill="#000">${company.name}</text></svg>`,
        )}'); background-repeat: repeat;"
    ></div>

    <div class="relative z-10 h-full flex flex-col">
        <!-- Header -->
        <div
            class="flex justify-between items-start border-b-2 border-primary pb-4 mb-8 gap-8"
        >
            <div class="flex gap-4 items-center flex-1">
                {#if company.logo}
                    <img
                        src={company.logo}
                        alt="Company Logo"
                        class="w-16 h-16 object-contain"
                    />
                {:else}
                    <div
                        class="w-16 h-16 bg-neutral text-neutral-content grid place-items-center font-bold text-2xl rounded"
                    >
                        {company.name.charAt(0)}
                    </div>
                {/if}
                <div class="flex-1">
                    <h1 class="text-2xl font-bold">{company.name}</h1>
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
                <h2 class="text-3xl font-bold text-primary">SLIP GAJI</h2>
                <p class="text-lg opacity-70 mt-1">
                    Periode: {new Date(meta.period).toLocaleDateString(
                        "id-ID",
                        { month: "long", year: "numeric" },
                    )}
                </p>
            </div>
        </div>

        <!-- Employee Info -->
        <div class="grid grid-cols-2 gap-x-8 gap-y-2 mb-8 text-sm">
            <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                <span class="font-semibold opacity-70">Nama</span>
                <span class="opacity-70">:</span>
                <span class="font-bold">{employee.name}</span>
            </div>
            <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                <span class="font-semibold opacity-70">ID Karyawan</span>
                <span class="opacity-70">:</span>
                <span>{employee.id || "-"}</span>
            </div>
            <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                <span class="font-semibold opacity-70">Jabatan</span>
                <span class="opacity-70">:</span>
                <span>{employee.position}</span>
            </div>
            <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                <span class="font-semibold opacity-70">Departemen</span>
                <span class="opacity-70">:</span>
                <span>{employee.department}</span>
            </div>
            <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                <span class="font-semibold opacity-70">Status</span>
                <span class="opacity-70">:</span>
                <span class="capitalize">{employee.status}</span>
            </div>
            <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                <span class="font-semibold opacity-70">PTKP</span>
                <span class="opacity-70">:</span>
                <span>{employee.maritalStatus}</span>
            </div>
            {#if attendance}
                <div class="col-span-2 border-t border-dashed my-2"></div>
                <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                    <span class="font-semibold opacity-70">Hari Kerja</span>
                    <span class="opacity-70">:</span>
                    <span
                        >{attendance.workingDays
                            ? `${attendance.workingDays} Hari`
                            : "-"}</span
                    >
                </div>
                <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                    <span class="font-semibold opacity-70">Hadir</span>
                    <span class="opacity-70">:</span>
                    <span
                        >{attendance.present
                            ? `${attendance.present} Hari`
                            : "-"}</span
                    >
                </div>
                <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                    <span class="font-semibold opacity-70">Sakit</span>
                    <span class="opacity-70">:</span>
                    <span
                        >{attendance.sick
                            ? `${attendance.sick} Hari`
                            : "-"}</span
                    >
                </div>
                <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                    <span class="font-semibold opacity-70">Izin</span>
                    <span class="opacity-70">:</span>
                    <span
                        >{attendance.permission
                            ? `${attendance.permission} Hari`
                            : "-"}</span
                    >
                </div>
                <div
                    class="grid grid-cols-[100px_1fr] gap-2 md:grid-cols-[100px_10px_1fr] md:gap-1"
                >
                    <span class="font-semibold opacity-70">Cuti</span>
                    <span class="opacity-70 hidden md:inline">:</span>
                    <span
                        >{attendance.leave
                            ? `${attendance.leave} Hari`
                            : "-"}</span
                    >
                </div>
                <div class="grid grid-cols-[100px_10px_1fr] gap-1">
                    <span class="font-semibold opacity-70">Alpha</span>
                    <span class="opacity-70">:</span>
                    <span
                        >{attendance.alpha
                            ? `${attendance.alpha} Hari`
                            : "-"}</span
                    >
                </div>
            {/if}
        </div>

        <!-- Earnings -->
        <div class="mb-6">
            <h3 class="font-bold text-lg mb-2 border-b border-base-200 pb-1">
                PENDAPATAN (EARNINGS)
            </h3>
            <div class="space-y-1">
                <div class="flex justify-between py-1">
                    <span>Gaji Pokok</span>
                    <span class="font-mono"
                        >{formatMoney(employee.basicSalary)}</span
                    >
                </div>
                {#each result.components.filter((c: import("../types").SalaryComponent) => c.type === "allowance") as component}
                    <div class="flex justify-between py-1">
                        <span>{component.name}</span>
                        <span class="font-mono"
                            >{formatMoney(component.amount)}</span
                        >
                    </div>
                {/each}
                <div
                    class="flex justify-between py-2 border-t border-dashed mt-2 font-bold bg-base-200 px-2 rounded"
                >
                    <span>Total Pendapatan Bruto</span>
                    <span class="font-mono"
                        >{formatMoney(
                            result.totalAllowances + employee.basicSalary,
                        )}</span
                    >
                </div>
            </div>
        </div>

        <!-- Deductions -->
        <div class="mb-6">
            <h3
                class="font-bold text-lg mb-2 border-b border-base-200 pb-1 text-error"
            >
                POTONGAN (DEDUCTIONS)
            </h3>
            <div class="space-y-1">
                {#each result.components.filter((c: import("../types").SalaryComponent) => c.type === "deduction") as component}
                    <div class="flex justify-between py-1 text-error">
                        <span>{component.name}</span>
                        <span class="font-mono"
                            >({formatMoney(component.amount)})</span
                        >
                    </div>
                {/each}
                <div
                    class="flex justify-between py-2 border-t border-dashed mt-2 font-bold bg-error/10 text-error px-2 rounded"
                >
                    <span>Total Potongan</span>
                    <span class="font-mono"
                        >({formatMoney(result.totalDeductions)})</span
                    >
                </div>
            </div>
        </div>

        <div class="grow"></div>

        <!-- Net Pay -->
        <div
            class="bg-primary text-primary-content p-4 rounded-lg flex justify-between items-center mb-8"
        >
            <div>
                <span class="block text-sm opacity-80 uppercase tracking-wider"
                    >Gaji Bersih (Take Home Pay)</span
                >
                <span class="text-3xl font-bold"
                    >{formatMoney(result.takeHomePay)}</span
                >
            </div>
            <div
                class="text-right text-xs opacity-70 italic max-w-xs hidden sm:block"
            >
                *Ditransfer ke rekening terdaftar
            </div>
        </div>

        <!-- Footer -->
        <div
            class="mt-auto pt-8 border-t border-base-200 text-center text-[10px] opacity-70"
        >
            <p class="font-bold text-error uppercase mb-1">
                SANGAT RAHASIA (Dokumen ini hanya untuk internal dan tidak boleh
                dibagikan kepada pihak ketiga).
            </p>
            <p class="font-mono italic">
                * Dokumen ini digenerate otomatis oleh sistem pada {new Date(
                    meta.issuanceDate,
                ).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}. Tanda tangan basah tidak diperlukan.
            </p>
        </div>
    </div>
</div>
