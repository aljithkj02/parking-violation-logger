import { useSelector } from "react-redux";
import { RootState } from "../store";

export const useAppSelector = useSelector as <T>(selector: (state: RootState) => T) => T;
