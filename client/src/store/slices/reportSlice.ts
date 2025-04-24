import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReports } from "../../api/report";
import { Report, ReportFilter } from "../../utils/report.type";

interface ReportState {
    data: Report[];
    refetch: boolean;
    loading: boolean;
    error: string | null;
    total: number;
    currentPage: number;
    totalPages: number;
}

const initialState: ReportState = {
    data: [],
    loading: false,
    refetch: false,
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
};

export const fetchReports = createAsyncThunk(
    "reports/fetchReports",
    async (
        {
            page,
            limit,
            filter,
        }: { page: number; limit: number; filter?: ReportFilter },
        { rejectWithValue }
    ) => {
        const response = await getReports(page, limit, filter);
        if (!response) return rejectWithValue("Failed to fetch reports");
        return response;
    }
);

const reportSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {
        refetchData: (state) => {
            state.refetch = !state.refetch;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.total = action.payload.pagination.total;
                state.currentPage = action.payload.pagination.currentPage;
                state.totalPages = action.payload.pagination.totalPages;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { refetchData } = reportSlice.actions;
export default reportSlice.reducer;