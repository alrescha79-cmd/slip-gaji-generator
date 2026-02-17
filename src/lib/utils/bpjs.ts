export const BPJS_LIMITS_2024 = {
    KESEHATAN: 12000000,
    JP: 10042300, // March 2024
};

export const BPJS_RATES = {
    KESEHATAN: {
        EMPLOYEE: 0.01,
        EMPLOYER: 0.04,
    },
    JHT: {
        EMPLOYEE: 0.02,
        EMPLOYER: 0.037,
    },
    JKK: {
        // Range 0.24% - 1.74%. taking lowest for office/IT
        EMPLOYER_LOW: 0.0024,
    },
    JKM: {
        EMPLOYER: 0.003,
    },
    JP: {
        EMPLOYEE: 0.01,
        EMPLOYER: 0.02,
    }
};

export function calculateBpjs(grossSalary: number) {
    // BPJS Kesehatan
    const kesehatanBase = Math.min(grossSalary, BPJS_LIMITS_2024.KESEHATAN);
    const kesehatanEmployee = kesehatanBase * BPJS_RATES.KESEHATAN.EMPLOYEE;
    const kesehatanEmployer = kesehatanBase * BPJS_RATES.KESEHATAN.EMPLOYER;

    // BPJS Ketenagakerjaan
    const jhtBase = grossSalary; // No limit
    const jhtEmployee = jhtBase * BPJS_RATES.JHT.EMPLOYEE;
    const jhtEmployer = jhtBase * BPJS_RATES.JHT.EMPLOYER;

    const jkkBase = grossSalary;
    const jkkEmployer = jkkBase * BPJS_RATES.JKK.EMPLOYER_LOW;

    const jkmBase = grossSalary;
    const jkmEmployer = jkmBase * BPJS_RATES.JKM.EMPLOYER;

    const jpBase = Math.min(grossSalary, BPJS_LIMITS_2024.JP);
    const jpEmployee = jpBase * BPJS_RATES.JP.EMPLOYEE;
    const jpEmployer = jpBase * BPJS_RATES.JP.EMPLOYER;

    return {
        employee: {
            kesehatan: kesehatanEmployee,
            jht: jhtEmployee,
            jp: jpEmployee,
            total: kesehatanEmployee + jhtEmployee + jpEmployee
        },
        employer: {
            kesehatan: kesehatanEmployer,
            jht: jhtEmployer,
            jkk: jkkEmployer,
            jkm: jkmEmployer,
            jp: jpEmployer,
            total: kesehatanEmployer + jhtEmployer + jkkEmployer + jkmEmployer + jpEmployer
        }
    };
}
