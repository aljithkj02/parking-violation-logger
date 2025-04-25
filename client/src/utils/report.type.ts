export type ReportFilter = "UNDER_REVIEW" | "ACTION_TAKEN";

export interface ReportedUser {
    email: string;
    name: string;
    profileImg?: string;
    _id: string
}
export interface Report {
    _id: string;
    text: string;
    location: string;
    assets: string[];
    status: ReportFilter;
    createdAt: string;
    updatedAt: string;
    reportedUserId: string | ReportedUser;
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