import type { Employee, PayrollResult, SalaryComponent } from '../types';
import { calculateBpjs } from './bpjs';
import { getTerCategory, getTerRate } from './ter';

export function calculatePayroll(employee: Employee, components: SalaryComponent[], attendance?: import('../types').Attendance): PayrollResult {
    const period = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    // 1. Calculate Gross Salary components
    const basicSalary = employee.basicSalary;

    // Overtime Calculation: Use custom rate if provided, otherwise (Basic / 173) * Hours * 1.5
    const overtimePay = attendance?.overtimeHours
        ? Math.floor((attendance.customOvertimeRate || (basicSalary / 173) * 1.5) * attendance.overtimeHours)
        : 0;

    const baseAllowances = components
        .filter(c => c.type === 'allowance')
        .reduce((sum, c) => sum + c.amount, 0);

    const allowances = baseAllowances + overtimePay;

    // Initial Gross for BPJS Calculation (usually Basic + Fixed Allowances, simplified to Basic here or Basic+Allowances depending on company policy. 
    // For SaaS, usually we assume Basic is the basis, or we can add a flag. Let's use BasicSalary for BPJS basis for simplicity, or max of Basic.)
    // Actually BPJS basis is usually Basic + Fixed Allowances.
    // We will use basicSalary as the basis for now.
    const bpjsResult = calculateBpjs(basicSalary);

    // 2. Calculate Taxable Income (Bruto)
    // Bruto = Basic + Allowances + Overtime + JKK(Employer) + JKM(Employer) + Kesehatan(Employer)
    // Note: JP(Employer) and JHT(Employer) are NOT taxable income.

    // Check if JKK/JKM are already in 'components' as benefits? 
    // Usually they are calculated. We will add them to the result components but calculate tax based on them.

    const insuranceBenefits =
        bpjsResult.employer.jkk +
        bpjsResult.employer.jkm +
        bpjsResult.employer.kesehatan;

    const grossIncomeForTax = basicSalary + allowances + insuranceBenefits;

    // 3. Calculate PPh 21
    const terCategory = getTerCategory(employee.maritalStatus);
    const terRate = getTerRate(grossIncomeForTax, terCategory);
    const pph21 = Math.floor(grossIncomeForTax * terRate);

    // 4. Calculate Deductions
    // Employee shares of BPJS
    const bpjsDeductions =
        bpjsResult.employee.jht +
        bpjsResult.employee.jp +
        bpjsResult.employee.kesehatan;

    // Other deductions from components
    const otherDeductions = components
        .filter(c => c.type === 'deduction')
        .reduce((sum, c) => sum + c.amount, 0);

    const totalDeductions = bpjsDeductions + otherDeductions + pph21;

    // 5. Net Salary
    const takeHomePay = basicSalary + allowances - totalDeductions;

    // Construct Result Components
    const resultComponents: SalaryComponent[] = [
        ...(overtimePay > 0 ? [{ id: 'overtime', name: `Lembur (${attendance?.overtimeHours} Jam)`, amount: overtimePay, type: 'allowance' as const, isTaxable: true }] : []),
        { id: 'bpjs-jht', name: 'BPJS Ketenagakerjaan (JHT 2%)', amount: bpjsResult.employee.jht, type: 'deduction', isTaxable: false },
        { id: 'bpjs-jp', name: 'BPJS Pensiun (JP 1%)', amount: bpjsResult.employee.jp, type: 'deduction', isTaxable: false },
        { id: 'bpjs-kes', name: 'BPJS Kesehatan (1%)', amount: bpjsResult.employee.kesehatan, type: 'deduction', isTaxable: false },
        { id: 'pph21', name: 'PPh 21', amount: pph21, type: 'deduction', isTaxable: false },
        ...components
    ];

    return {
        period,
        grossIncome: grossIncomeForTax,
        totalAllowances: allowances,
        totalDeductions,
        takeHomePay,
        components: resultComponents,
        tax: pph21,
        bpjsKesehatan: bpjsResult.employee.kesehatan,
        bpjsKetenagakerjaan: bpjsResult.employee.jht + bpjsResult.employee.jp
    };
}
