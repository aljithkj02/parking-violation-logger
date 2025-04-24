export type ReportFilter = "UNDER_REVIEW" | "ACTION_TAKEN";

export interface Report {
    _id: string;
    text: string;
    location: string;
    assets: string[];
    status: ReportFilter;
    createdAt: string;
    updatedAt: string;
}

export interface ReportResponse {
    status: boolean;
    data: Report[];
    pagination: {
        total: number;
        currentPage: number;
        totalPages: number;
    }
}