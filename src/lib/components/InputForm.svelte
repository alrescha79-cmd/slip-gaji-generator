<script lang="ts">
    import type {
        Company,
        Employee,
        SalaryComponent,
        MaritalStatus,
        Attendance,
        PayslipMeta,
    } from "../types";

    let {
        company = $bindable(),
        employee = $bindable(),
        attendance = $bindable(),
        salaryComponents = $bindable(),
        meta = $bindable(),
    } = $props<{
        company: Company;
        employee: Employee;
        attendance: Attendance;
        salaryComponents: SalaryComponent[];
        meta: PayslipMeta;
    }>();

    function addComponent(type: "allowance" | "deduction") {
        salaryComponents = [
            ...salaryComponents,
            {
                id: crypto.randomUUID(),
                name: type === "allowance" ? "New Allowance" : "New Deduction",
                amount: 0,
                type,
                isTaxable: type === "allowance", // Allowances usually taxable
            },
        ];
    }

    function removeComponent(id: string) {
        salaryComponents = salaryComponents.filter(
            (c: SalaryComponent) => c.id !== id,
        );
    }

    $effect(() => {
        if (attendance.workingDays !== undefined) {
            const absent =
                (attendance.sick || 0) +
                (attendance.permission || 0) +
                (attendance.leave || 0) +
                (attendance.alpha || 0);
            attendance.present = attendance.workingDays - absent;
        }
    });
</script>

<div class="space-y-6 p-4 bg-base-100 rounded-box shadow-lg">
    <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" checked />
        <div class="collapse-title text-xl font-medium">Company Details</div>
        <div class="collapse-content space-y-4">
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Company Name</span>
                </div>
                <input
                    type="text"
                    bind:value={company.name}
                    class="input input-bordered w-full"
                />
            </label>
            <div class="grid grid-cols-1 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Address</span>
                    </div>
                    <textarea
                        bind:value={company.address}
                        class="textarea textarea-bordered w-full h-24"
                        placeholder="Full company address..."
                    ></textarea>
                </label>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">City</span>
                    </div>
                    <input
                        type="text"
                        bind:value={company.city}
                        class="input input-bordered w-full"
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Postal Code</span>
                    </div>
                    <input
                        type="text"
                        bind:value={company.postalCode}
                        class="input input-bordered w-full"
                    />
                </label>
            </div>
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Logo URL</span>
                </div>
                <input
                    type="text"
                    bind:value={company.logo}
                    class="input input-bordered w-full"
                    placeholder="https://..."
                />
            </label>
        </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div class="collapse-title text-xl font-medium">Payslip Details</div>
        <div class="collapse-content space-y-4">
            <div class="grid grid-cols-1 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text"
                            >Periode Gaji (Bulan - Tahun)</span
                        >
                    </div>
                    <input
                        type="month"
                        bind:value={meta.period}
                        class="input input-bordered w-full"
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Tanggal Terbit</span>
                    </div>
                    <input
                        type="date"
                        bind:value={meta.issuanceDate}
                        class="input input-bordered w-full"
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Ukuran Kertas PDF</span>
                    </div>
                    <select
                        bind:value={meta.paperSize}
                        class="select select-bordered"
                    >
                        <option value="A4">A4 (210 x 297 mm)</option>
                        <option value="F4">F4 (215 x 330 mm)</option>
                        <option value="Legal">Legal (216 x 356 mm)</option>
                    </select>
                </label>
            </div>
        </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div class="collapse-title text-xl font-medium">Employee Details</div>
        <div class="collapse-content space-y-4">
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Full Name</span>
                </div>
                <input
                    type="text"
                    bind:value={employee.name}
                    class="input input-bordered w-full"
                />
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Id Karyawan</span>
                    </div>
                    <input
                        type="text"
                        bind:value={employee.id}
                        class="input input-bordered w-full"
                        placeholder="Contoh: EMP-2024-001"
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Position</span>
                    </div>
                    <input
                        type="text"
                        bind:value={employee.position}
                        class="input input-bordered w-full"
                    />
                </label>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Department</span>
                    </div>
                    <input
                        type="text"
                        bind:value={employee.department}
                        class="input input-bordered w-full"
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Join Date</span>
                    </div>
                    <input
                        type="date"
                        bind:value={employee.joinDate}
                        class="input input-bordered w-full"
                    />
                </label>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Status</span>
                    </div>
                    <select
                        bind:value={employee.status}
                        class="select select-bordered"
                    >
                        <option value="permanent">Permanent</option>
                        <option value="contract">Contract</option>
                    </select>
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Marital Status (PTKP)</span>
                    </div>
                    <select
                        bind:value={employee.maritalStatus}
                        class="select select-bordered"
                    >
                        <option value="TK/0">TK/0 (Single, 0 Dep)</option>
                        <option value="TK/1">TK/1 (Single, 1 Dep)</option>
                        <option value="TK/2">TK/2 (Single, 2 Dep)</option>
                        <option value="TK/3">TK/3 (Single, 3 Dep)</option>
                        <option value="K/0">K/0 (Married, 0 Dep)</option>
                        <option value="K/1">K/1 (Married, 1 Dep)</option>
                        <option value="K/2">K/2 (Married, 2 Dep)</option>
                        <option value="K/3">K/3 (Married, 3 Dep)</option>
                    </select>
                </label>
            </div>
        </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div class="collapse-title text-xl font-medium">
            Attendance (Kehadiran)
        </div>
        <div class="collapse-content space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Hari Kerja</span>
                    </div>
                    <input
                        type="number"
                        bind:value={attendance.workingDays}
                        class="input input-bordered w-full"
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Hadir (Hari)</span>
                    </div>
                    <input
                        type="number"
                        bind:value={attendance.present}
                        class="input input-bordered w-full"
                    />
                </label>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Sakit (Hari)</span>
                    </div>
                    <input
                        type="number"
                        bind:value={attendance.sick}
                        class="input input-bordered w-full"
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Izin (Hari)</span>
                    </div>
                    <input
                        type="number"
                        bind:value={attendance.permission}
                        class="input input-bordered w-full"
                    />
                </label>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Cuti (Hari)</span>
                    </div>
                    <input
                        type="number"
                        bind:value={attendance.leave}
                        class="input input-bordered w-full"
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Alpha (Hari)</span>
                    </div>
                    <input
                        type="number"
                        bind:value={attendance.alpha}
                        class="input input-bordered w-full"
                    />
                </label>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Lembur (Jam)</span>
                    </div>
                    <input
                        type="number"
                        bind:value={attendance.overtimeHours}
                        class="input input-bordered w-full"
                    />
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text"
                            >Tarif Lembur per Jam (Opsional)</span
                        >
                    </div>
                    <input
                        type="number"
                        bind:value={attendance.customOvertimeRate}
                        class="input input-bordered w-full"
                        placeholder="Otomatis jika kosong"
                    />
                </label>
            </div>
        </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="my-accordion-2" />
        <div class="collapse-title text-xl font-medium">Salary Details</div>
        <div class="collapse-content space-y-4">
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Basic Salary (Rp)</span>
                </div>
                <input
                    type="number"
                    bind:value={employee.basicSalary}
                    class="input input-bordered w-full"
                />
            </label>

            <div class="divider">Allowances</div>
            {#each salaryComponents.filter((c: import("../types").SalaryComponent) => c.type === "allowance") as component}
                <div class="flex gap-2 items-end">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text-alt">Name</span>
                        </div>
                        <input
                            type="text"
                            bind:value={component.name}
                            class="input input-bordered input-sm w-full"
                        />
                    </label>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text-alt">Amount</span>
                        </div>
                        <input
                            type="number"
                            bind:value={component.amount}
                            class="input input-bordered input-sm w-full"
                        />
                    </label>
                    <button
                        class="btn btn-square btn-sm btn-error"
                        onclick={() => removeComponent(component.id)}>X</button
                    >
                </div>
            {/each}
            <button
                class="btn btn-sm btn-outline btn-primary w-full"
                onclick={() => addComponent("allowance")}
                >+ Add Allowance</button
            >

            <div class="divider">Other Deductions</div>
            {#each salaryComponents.filter((c: import("../types").SalaryComponent) => c.type === "deduction") as component}
                <div class="flex gap-2 items-end">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text-alt">Name</span>
                        </div>
                        <input
                            type="text"
                            bind:value={component.name}
                            class="input input-bordered input-sm w-full"
                        />
                    </label>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text-alt">Amount</span>
                        </div>
                        <input
                            type="number"
                            bind:value={component.amount}
                            class="input input-bordered input-sm w-full"
                        />
                    </label>
                    <button
                        class="btn btn-square btn-sm btn-error"
                        onclick={() => removeComponent(component.id)}>X</button
                    >
                </div>
            {/each}
            <button
                class="btn btn-sm btn-outline btn-warning w-full"
                onclick={() => addComponent("deduction")}
                >+ Add Deduction</button
            >
        </div>
    </div>
</div>
