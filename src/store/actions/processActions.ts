import { T_AppDispatch } from "..";
import { I_JSONObject } from "../../interfaces/generic.interface";
import { I_Process } from "../../interfaces/process.interface";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { PROCESS_LIST } from "../../services/endPointsService";

export const SET_PROCESS_LIST = "SET_PROCESS_LIST";
export const SELECT_PROCESS = "SELECT_PROCESS";
export const SET_PROCESS_PHASES_CONDITIONS = "SET_PROCESS_PHASES_CONDITIONS";

export const setProcessList = (payload: Array<I_Process> | null) => ({ type: SET_PROCESS_LIST, payload });
export const selectProcess = (payload: I_Process | null) => ({ type: SELECT_PROCESS, payload });

export const getProcessList = (id_process?: number) => {
    return (dispatch: T_AppDispatch): Promise<null | I_Process[]> => AXIOS_REQUEST(PROCESS_LIST)
        .then((res: { data: I_Process[] } & I_JSONObject) => {
            dispatch(setProcessList([...res.data]));
            if (id_process) {
                let process = res.data.find(p => p.id_conv === id_process) || null;
                dispatch(selectProcess(process));
            }

            return res.data;
        })
        .catch(err => {
            dispatch(setProcessList([]))
            return null
        })
}
