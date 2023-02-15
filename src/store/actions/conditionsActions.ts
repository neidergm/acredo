import { I_Condition, T_ConditionDetails } from "../../interfaces/conditions.interface";

export const SET_CONDITIONS = "SET_CONDITIONS";
export const SET_CONDITION_DETAILS = "SET_CONDITION_DETAILS";

export const setConditions = (id_process: string, list: Array<I_Condition> | null) => ({ type: SET_CONDITIONS, payload: { [id_process]: list } });

export const setConditionDetails = (id_condition: string, details: T_ConditionDetails | null) => ({ type: SET_CONDITION_DETAILS, payload: { [id_condition]: details } });
