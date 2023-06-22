import { T_AppDispatch } from "..";
import { I_Condition } from "../../interfaces/conditions.interface";
import { I_JSONObject } from "../../interfaces/generic.interface";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { CONDITION_DETAILS, PHASES_WITH_COND_BY_PROCESS, STAGES } from "../../services/endPointsService";
import { T_Phase, T_PhasesWithConditions, T_Stage } from "../../interfaces/phasesAndStages.interface";
import { T_SelectedConditionData } from "../../interfaces/store.interface";

export const SET_FETCHED_CONDITION_DATA = "SET_FETCHED_CONDITION_DATA";
export const SELECT_CONDITION = "SELECT_CONDITION";
export const SET_PHASES_CONDITIONS = "SET_PHASES_CONDITIONS";
export const SELECTED_CONDITION_DATA = "SELECTED_CONDITION_DATA";

// export const setFetchedConditionData = (id_process: string, id_condition: string, list: Array<I_Condition> | null) => (
//     { type: SET_FETCHED_CONDITION_DATA, payload: { id_process, id_condition} }
// );
export const setSelectedConditionData = (payload: T_SelectedConditionData | null) => ({ type: SELECTED_CONDITION_DATA, payload });

export const selectCondition = (payload: I_Condition | null) => ({ type: SELECT_CONDITION, payload });

export const setProcessPhasesWithConditions = (id_process: number, payload: T_PhasesWithConditions[] | null) =>
    ({ type: SET_PHASES_CONDITIONS, payload: { id_process, data: payload } });

type T_AsyncResp<T> = Promise<T | null>

export const getContionData = (id_cond: number) =>
    (dispatch: T_AppDispatch): T_AsyncResp<I_Condition> =>
        AXIOS_REQUEST(`${CONDITION_DETAILS}${id_cond}`)
            .then((res: { data: I_Condition[] } & I_JSONObject) => {
                if (!(res?.data?.length)) throw Error();
                dispatch(selectCondition({ ...res.data[0] }))
                return res.data[0];
            })
            .catch(() => {
                return null
            })

export const getPhasesWithConditions = (id_process: number) => {
    return (dispatch: T_AppDispatch): T_AsyncResp<T_PhasesWithConditions[]> =>
        AXIOS_REQUEST(`${PHASES_WITH_COND_BY_PROCESS}${id_process}`)
            .then((res: { data: T_PhasesWithConditions[] } & I_JSONObject) => {
                dispatch(setProcessPhasesWithConditions(id_process, res.data))
                return res.data;
            })
            .catch(err => {
                return null
            })
}

export const getPhasesAndStagesOfCondition = (id_cond: number) => {
    return (dispatch: T_AppDispatch): T_AsyncResp<any> =>
        AXIOS_REQUEST(STAGES + id_cond).then((resp: any) => {
            const ps: any = (resp.data as any[]).reduce((p, c, idx) => {
                const stage: T_Stage = {
                    name: c.nomb_etapa,
                    id: c.id_etapa,
                    actions: c.acciones,
                    status: !(c.acciones) ? 0 : c.est_etapa,
                    actions_completed: c.acciones?.reduce((p: number, c: I_JSONObject) => c.est_accion === 2 ? p += 1 : p, 0)
                }

                const phase = p[c.id_fase];

                if (phase) {
                    phase.stages.push(stage);
                    phase.stages_completed += stage.status;
                } else {
                    p[c.id_fase] = {
                        name: c.nomb_fase,
                        id: c.id_fase,
                        stages: [stage],
                        stages_completed: stage.status
                    }
                }
                return p;
            }, {});

            const all: T_Phase[] = Object.values(ps);
            const phase = all.find(i => !(i.stages_completed === i.stages?.length));
            const stage = phase?.stages?.find(i => i.status === 0);
            const action = stage?.actions?.find(i => i.est_accion === 1 || i.est_accion === 0);

            dispatch(
                setSelectedConditionData({
                    active: { phase, stage, action },
                    phases: all
                })
            )

            return true;
        })
}
