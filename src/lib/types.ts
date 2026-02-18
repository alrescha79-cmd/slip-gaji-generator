export interface Company {
    name: string;
    logo?: string;
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
    joinDate: string; // YYYY-MM-DD
    status: 'permanent' | 'contract';
    maritalStatus: MaritalStatus;
    basicSalary: number;
}

export interface SalaryComponent {
    id: string; // Add ID for UI handling
    name: string;
    amount: number;
    type: 'allowance' | 'deduction' | 'benefit';
    isTaxable: boolean;
}

export interface Attendance {
    workingDays: number; // Hari Kerja Efektif
    present: number;     // Hari Hadir
    sick: number;        // Sakit
    permission: number;  // Izin
    leave: number;       // Cuti
    alpha: number;       // Alpha
    overtimeHours: number;// Lembur (Jam)
    customOvertimeRate?: number; // Custom rate per jam
}

export type PaperSize = 'A4' | 'F4' | 'Legal';

export interface PayslipMeta {
    period: string; // YYYY-MM
    issuanceDate: string; // YYYY-MM-DD
    paperSize: PaperSize;
}


export interface PayrollResult {
    period: string; // Month Year
    grossIncome: number;
    totalAllowances: number;
    totalDeductions: number;
    takeHomePay: number;
    components: SalaryComponent[];
    tax: number; // PPh 21
    bpjsKesehatan: number;
    bpjsKetenagakerjaan: number;
    attendance?: Attendance;
}
