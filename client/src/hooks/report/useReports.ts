import { useEffect } from "react";
import { useAppDispatch } from "../useAppDispatch";
import { useAppSelector } from "../useAppSelector";
import { fetchReports } from "../../store/slices/reportSlice";
import { ReportFilter } from "../../utils/report.type";

export const useReports = (page: number, limit: number, filter?: ReportFilter) => {
    const dispatch = useAppDispatch();
    const reportState = useAppSelector((state) => state.report);

    useEffect(() => {
        dispatch(fetchReports({ page, limit, filter }));
    }, [page, limit, filter, reportState.refetch]);

    return { ...reportState };
};
