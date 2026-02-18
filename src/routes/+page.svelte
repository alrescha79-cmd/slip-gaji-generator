<script lang="ts">
    import InputForm from "$lib/components/InputForm.svelte";
    import PayslipPreview from "$lib/components/PayslipPreview.svelte";
    import { calculatePayroll } from "$lib/utils/calculations";
    import type {
        Company,
        Employee,
        SalaryComponent,
        PayrollResult,
        Attendance,
        PayslipMeta,
    } from "$lib/types";
    import { generatePdf } from "$lib/utils/pdfGenerator";

    // Default Data
    let company = $state<Company>({
        name: "PT. Teknologi Masa Depan",
        address: "Gedung Cyber 2, Jl. HR Rasuna Said Blok X-5 No. 13",
        city: "Jakarta Selatan",
        postalCode: "12950",
        logo: "",
        hasLogoError: false,
    });

    let employee = $state<Employee>({
        id: "EMP-2024-001",
        name: "Ahmad Staff",
        position: "Senior Staff",
        department: "Operations",
        joinDate: "2022-01-10",
        status: "permanent",
        maritalStatus: "TK/0",
        basicSalary: 15000000,
    });

    let salaryComponents = $state<SalaryComponent[]>([
        {
            id: "1",
            name: "Tunjangan Transport",
            amount: 1000000,
            type: "allowance",
            isTaxable: true,
        },
        {
            id: "2",
            name: "Tunjangan Makan",
            amount: 500000,
            type: "allowance",
            isTaxable: true,
        },
        {
            id: "3",
            name: "Tunjangan Internet",
            amount: 300000,
            type: "allowance",
            isTaxable: true,
        },
    ]);

    let attendance = $state<Attendance>({
        workingDays: 20,
        present: 20,
        sick: 0,
        permission: 0,
        leave: 0,
        alpha: 0,
        overtimeHours: 0,
    });

    let meta = $state<PayslipMeta>({
        period: new Date().toISOString().slice(0, 7), // YYYY-MM
        issuanceDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        paperSize: "F4",
    });

    // Derived Calculation
    let result = $derived(
        calculatePayroll(employee, salaryComponents, attendance, meta.period),
    );

    async function handleDownload() {
        const elementId = "payslip-wrapper";
        const fileName = `Slip_Gaji_${employee.name.replace(/\s+/g, "_")}_${result.period.replace(/\s+/g, "_")}.pdf`;
        await generatePdf(elementId, fileName, meta.paperSize);
    }
</script>

<svelte:head>
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://slip-gaji.vercel.app/" />
    <meta
        property="og:title"
        content="Payslip Generator Indonesia - Cepat & Profesional"
    />
    <meta
        property="og:description"
        content="Buat slip gaji profesional secara instan dengan perhitungan pajak TER 2024 dan BPJS otomatis."
    />
    <meta property="og:image" content="/logo.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="Payslip Generator Indonesia" />
    <meta
        property="twitter:description"
        content="Generator slip gaji online gratis dengan standar perhitungan Indonesia terbaru."
    />
    <meta property="twitter:image" content="/logo.png" />

    <meta
        name="keywords"
        content="payslip generator, slip gaji online, pph 21 ter 2024, bpjs kesehatan, slip gaji indonesia"
    />
</svelte:head>

<div class="min-h-screen bg-base-300 p-4 md:p-8">
    <div
        class="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8"
    >
        <!-- Sidebar / Input -->
        <div class="space-y-4">
            <div class="flex items-center gap-3 mb-4">
                <div
                    class="bg-primary p-2 rounded-lg text-primary-content shadow-lg shadow-primary/20"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                        />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                </div>
                <h2 class="text-2xl font-black tracking-tight uppercase">
                    Payslip Generator
                </h2>
            </div>
            <InputForm
                bind:company
                bind:employee
                bind:salaryComponents
                bind:attendance
                bind:meta
            />
        </div>

        <!-- Preview Area -->
        <div class="space-y-4">
            <div
                class="flex flex-wrap justify-center sm:justify-between items-center bg-base-100 p-4 rounded-box shadow gap-4 text-center sm:text-left"
            >
                <div class="flex items-center gap-2">
                    <h2 class="text-xl font-bold">Live Preview</h2>
                    <span
                        class="badge badge-sm badge-neutral font-mono opacity-50"
                        >{meta.paperSize}</span
                    >
                </div>
                <div class="flex items-center gap-2">
                    <div class="dropdown dropdown-end">
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <div
                            tabindex="0"
                            role="button"
                            class="btn btn-ghost btn-sm gap-2 border border-base-300"
                            aria-label="Pilih Ukuran Kertas"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path
                                    d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
                                />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            <span class="text-xs font-bold"
                                >{meta.paperSize}</span
                            >
                        </div>
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <ul
                            tabindex="0"
                            class="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-32 border border-base-200 mt-2"
                            role="menu"
                        >
                            <li>
                                <button
                                    class={meta.paperSize === "A4"
                                        ? "active"
                                        : ""}
                                    onclick={() => (meta.paperSize = "A4")}
                                    role="menuitem">A4</button
                                >
                            </li>
                            <li>
                                <button
                                    class={meta.paperSize === "F4"
                                        ? "active"
                                        : ""}
                                    onclick={() => (meta.paperSize = "F4")}
                                    role="menuitem">F4</button
                                >
                            </li>
                            <li>
                                <button
                                    class={meta.paperSize === "Legal"
                                        ? "active"
                                        : ""}
                                    onclick={() => (meta.paperSize = "Legal")}
                                    role="menuitem">Legal</button
                                >
                            </li>
                        </ul>
                    </div>
                    <button
                        class="btn btn-primary"
                        onclick={handleDownload}
                        aria-label="Download PDF Slip Gaji"
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            <div class="overflow-auto pb-8">
                <PayslipPreview
                    {company}
                    {employee}
                    {result}
                    {attendance}
                    {meta}
                />
            </div>
        </div>
    </div>
</div>
