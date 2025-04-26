import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardData, RangeFilter } from '../../utils/dashboard.type';
import { getDashboardData } from '../../api/dashboard';

interface DashboardState {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    data: null,
    loading: false,
    error: null,
};

export const fetchDashboard = createAsyncThunk(
    'dashboard/fetch',
    async (range: RangeFilter, { rejectWithValue }) => {
        const data = await getDashboardData(range);
        if (!data) return rejectWithValue('No data received');
        return data;
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default dashboardSlice.reducer;
