
export enum RangeFilter {
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
}

export interface ReportOverTime {
    label: string;
    count: number;
}

export interface DashboardData {
    totalReports: number;
    reportsInRange: number;
    solvedReports: number;
    pendingReports: number;
    reportsOverTime: ReportOverTime[];
}

