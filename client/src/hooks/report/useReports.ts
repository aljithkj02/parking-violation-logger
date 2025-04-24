import { useEffect, useState } from "react";
import { useAppDispatch } from "../useAppDispatch";
import { useAppSelector } from "../useAppSelector";
import { fetchReports } from "../../store/slices/reportSlice";
import { ReportFilter } from "../../utils/report.type";

export const useReports = (page: number, limit: number, filter?: ReportFilter) => {
    const dispatch = useAppDispatch();
    const reportState = useAppSelector((state) => state.report);
    const [refetch, setRefetch] = useState(false);

    useEffect(() => {
        dispatch(fetchReports({ page, limit, filter }));
    }, [page, limit, filter, refetch]);

    const refetchReports = () => {
        setRefetch(!refetch);
    }

    return { ...reportState, refetchReports };
};
