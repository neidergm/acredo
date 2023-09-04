import { T_AppDispatch } from "..";
import { I_JSONObject } from "../../interfaces/generic.interface";
import { I_Program } from "../../interfaces/programs.interface";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { GET_PROGRAMS_LIST } from "../../services/endPointsService";

export const SET_PROGRAMS_LIST = "SET_PROGRAMS_LIST";
export const SELECT_PROGRAM = "SELECT_PROGRAM";
export const SET_REFRESH_STATE = "SET_REFRESH_STATE";

export const setProgramsList = (payload: Array<I_Program> | null) => ({ type: SET_PROGRAMS_LIST, payload });
export const selectProgram = (payload: I_Program | null) => ({ type: SELECT_PROGRAM, payload });
export const setNeedRefreshList = (payload: boolean) => ({ type: SET_REFRESH_STATE, payload });

export const getProgramsList = (id_program?: number) => {
    return (dispatch: T_AppDispatch): Promise<null | I_Program[] | I_Program> => AXIOS_REQUEST(GET_PROGRAMS_LIST)
        .then((res: { data: I_Program[] } & I_JSONObject) => {
            dispatch(setProgramsList([...res.data]));
            if (id_program) {
                const program = res.data.find(p => p.id_prog === id_program) || null;
                dispatch(selectProgram(program));
                return program;
            }

            return res.data;
        })
        .catch(err => {
            return null
        })
}
