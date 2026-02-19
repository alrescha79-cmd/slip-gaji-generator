export interface Company {
    name: string;
    logo?: string;
    hasLogoError?: boolean;
    address: string;
    city: string;
    postalCode: string;
    phone?: string;
    email?: string;
}

export type MaritalStatus = 'TK/0' | 'TK/1' | 'TK/2' | 'TK/3' | 'K/0' | 'K/1' | 'K/2' | 'K/3';

export interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    joinDate: string;
    status: 'permanent' | 'contract';
    maritalStatus: MaritalStatus;
    basicSalary: number;
}

export interface SalaryComponent {
    id: string;
    name: string;
    amount: number;
    type: 'allowance' | 'deduction' | 'benefit';
    isTaxable: boolean;
}

export interface Attendance {
    workingDays: number;
    present: number;
    sick: number;
    permission: number;
    leave: number;
    alpha: number;
    overtimeHours: number;
    customOvertimeRate?: number;
}

export type PaperSize = 'A4' | 'F4' | 'Legal';

export type PayslipTemplate = 'modern' | 'classic' | 'compact' | 'landscape';

export interface PayslipMeta {
    period: string;
    issuanceDate: string;
    paperSize: PaperSize;
    template: PayslipTemplate;
}


export interface PayrollResult {
    period: string;
    grossIncome: number;
    totalAllowances: number;
    totalDeductions: number;
    takeHomePay: number;
    components: SalaryComponent[];
    tax: number;
    bpjsKesehatan: number;
    bpjsKetenagakerjaan: number;
    attendance?: Attendance;
}
