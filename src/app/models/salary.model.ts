export interface Salary{
    id: string;
    userId: string;
    year: number;
    month: number;
    totalHours: number;
    overtimeHours?: number;
    overtimePay?: number;
    totalSalary: number;
    baseSalary: number;
    userName: string;
}