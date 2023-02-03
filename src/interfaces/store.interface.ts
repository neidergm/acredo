import { I_Condition, T_ConditionDetails } from "./conditions.interface";
import { I_Process } from "./process.interface";
import { I_User } from "./user.interface";

export interface I_Action<T = any> { type: string, payload: T }

export interface I_UserState {
    userInfo: I_User | null,
    unauthorized: string,
}

export interface I_ProcessState {
    list: Array<I_Process> | null;
}

export interface I_ConditionsState {
    list: { [id_process: string]: Array<I_Condition> };
    details: { [id_condition: string]: T_ConditionDetails };
}