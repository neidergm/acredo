import { I_Process } from "../../interfaces/process.interface";

export const SET_PROCESS_LIST = "SET_PROCESS_LIST";

export const setProcessList = (payload: Array<I_Process> | null) => ({ type: SET_PROCESS_LIST, payload });
