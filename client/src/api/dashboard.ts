// GET Dashboard Data
import { toast } from 'react-hot-toast';
import { RangeFilter } from '../utils/dashboard.type';
import { api } from './axios';

export const getDashboardData = async (range: RangeFilter) => {
    try {
        const query = new URLSearchParams({ range }).toString();
        const res = await api.get(`/dashboard?${query}`);
        
        return res.data;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Failed to fetch dashboard data");
        return null;
    }
};
