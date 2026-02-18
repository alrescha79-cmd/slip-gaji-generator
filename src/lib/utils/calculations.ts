import type { Employee, PayrollResult, SalaryComponent } from '../types';
import { calculateBpjs } from './bpjs';
import { getTerCategory, getTerRate } from './ter';

export function calculatePayroll(employee: Employee, components: SalaryComponent[], attendance?: import('../types').Attendance, periodInput?: string): PayrollResult {
    const periodDate = periodInput ? new Date(periodInput + '-01') : new Date();
    const period = periodDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const basicSalary = employee.basicSalary;

    const overtimePay = attendance?.overtimeHours
        ? Math.floor((attendance.customOvertimeRate || (basicSalary / 173) * 1.5) * attendance.overtimeHours)
        : 0;

    const baseAllowances = components
        .filter(c => c.type === 'allowance')
        .reduce((sum, c) => sum + c.amount, 0);

    const allowances = baseAllowances + overtimePay;

    const bpjsResult = calculateBpjs(basicSalary);

    const insuranceBenefits =
        bpjsResult.employer.jkk +
        bpjsResult.employer.jkm +
        bpjsResult.employer.kesehatan;

    const grossIncomeForTax = basicSalary + allowances + insuranceBenefits;

    const terCategory = getTerCategory(employee.maritalStatus);
    const terRate = getTerRate(grossIncomeForTax, terCategory);
    const pph21 = Math.floor(grossIncomeForTax * terRate);
    const bpjsDeductions =
        bpjsResult.employee.jht +
        bpjsResult.employee.jp +
        bpjsResult.employee.kesehatan;
    const otherDeductions = components
        .filter(c => c.type === 'deduction')
        .reduce((sum, c) => sum + c.amount, 0);

    const totalDeductions = bpjsDeductions + otherDeductions + pph21;

    const takeHomePay = basicSalary + allowances - totalDeductions;

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
