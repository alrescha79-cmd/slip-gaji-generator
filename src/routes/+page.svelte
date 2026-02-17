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
    });

    let employee = $state<Employee>({
        id: "EMP-2024-001",
        name: "Ahmad Developer",
        position: "Senior Backend Engineer",
        department: "Engineering",
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
    });

    // Derived Calculation
    let result = $derived(
        calculatePayroll(employee, salaryComponents, attendance),
    );

    async function handleDownload() {
        const elementId = "payslip-container";
        const fileName = `Slip_Gaji_${employee.name.replace(/\s+/g, "_")}_${result.period.replace(/\s+/g, "_")}.pdf`;
        await generatePdf(elementId, fileName);
    }
</script>

<div class="min-h-screen bg-base-300 p-4 md:p-8">
    <div
        class="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8"
    >
        <!-- Sidebar / Input -->
        <div class="space-y-4">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
                🇮🇩 IT Payslip Generator
            </h2>
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
                class="flex justify-between items-center bg-base-100 p-4 rounded-box shadow"
            >
                <h2 class="text-xl font-bold">Live Preview</h2>
                <button class="btn btn-primary" onclick={handleDownload}>
                    Download PDF
                </button>
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
