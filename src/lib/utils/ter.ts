export type TerCategory = 'A' | 'B' | 'C';

export function getTerCategory(maritalStatus: string): TerCategory {
    switch (maritalStatus) {
        case 'TK/0':
        case 'TK/1':
        case 'K/0':
            return 'A';
        case 'TK/2':
        case 'TK/3':
        case 'K/1':
        case 'K/2':
            return 'B';
        case 'K/3':
            return 'C';
        default:
            return 'A'; // Default to A
    }
}

// Simplified ranges representing common IT salaries.
// Full table has many small increments.
// This function returns the rate (e.g., 0.05 for 5%)
export function getTerRate(grossIncome: number, category: TerCategory): number {
    if (category === 'A') {
        if (grossIncome <= 5400000) return 0;
        if (grossIncome <= 5650000) return 0.0025;
        if (grossIncome <= 5950000) return 0.005;
        if (grossIncome <= 6300000) return 0.0075;
        if (grossIncome <= 6750000) return 0.01;
        if (grossIncome <= 7500000) return 0.0125;
        if (grossIncome <= 8550000) return 0.015;
        if (grossIncome <= 9650000) return 0.0175;
        if (grossIncome <= 10050000) return 0.02;
        if (grossIncome <= 10350000) return 0.0225;
        if (grossIncome <= 10700000) return 0.025;
        if (grossIncome <= 11050000) return 0.03;
        if (grossIncome <= 11600000) return 0.035;
        if (grossIncome <= 12500000) return 0.04;
        if (grossIncome <= 13750000) return 0.05;
        if (grossIncome <= 15100000) return 0.06;
        if (grossIncome <= 16950000) return 0.07;
        if (grossIncome <= 19750000) return 0.08;
        if (grossIncome <= 24150000) return 0.09;
        if (grossIncome <= 26450000) return 0.10;
        if (grossIncome <= 28000000) return 0.11;
        if (grossIncome <= 30050000) return 0.12;
        if (grossIncome <= 32400000) return 0.13;
        if (grossIncome <= 35400000) return 0.14;
        if (grossIncome <= 39100000) return 0.15;
        if (grossIncome <= 43850000) return 0.16;
        if (grossIncome <= 47800000) return 0.17;
        if (grossIncome <= 51400000) return 0.18;
        if (grossIncome <= 56300000) return 0.19;
        return 0.20; // Simplified max for MVP
    } else if (category === 'B') {
        if (grossIncome <= 6200000) return 0;
        if (grossIncome <= 6500000) return 0.0025;
        if (grossIncome <= 6850000) return 0.005;
        if (grossIncome <= 7300000) return 0.0075;
        if (grossIncome <= 7800000) return 0.01;
        if (grossIncome <= 8400000) return 0.0125;
        if (grossIncome <= 9050000) return 0.015;
        if (grossIncome <= 9750000) return 0.0175;
        if (grossIncome <= 10600000) return 0.02;
        if (grossIncome <= 11400000) return 0.03;
        return 0.12; // Simplified
    } else { // C
        if (grossIncome <= 6600000) return 0;
        if (grossIncome <= 6950000) return 0.0025;
        if (grossIncome <= 7350000) return 0.005;
        if (grossIncome <= 7800000) return 0.0075;
        if (grossIncome <= 8300000) return 0.01;
        if (grossIncome <= 9000000) return 0.0125;
        if (grossIncome <= 9650000) return 0.015;
        if (grossIncome <= 10350000) return 0.0175;
        return 0.10; // Simplified
    }
}
