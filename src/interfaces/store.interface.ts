import { I_Condition } from "./conditions.interface";
import { I_ProcessIndicators, T_ProgramsIndicators } from "./dashboard.interface";
import { I_JSONObject } from "./generic.interface";
import { I_Notification } from "./notification.interface";
import { T_ActivePhase, T_Phase, T_PhasesWithConditions } from "./phasesAndStages.interface";
import { I_Process } from "./process.interface";
import { I_Program } from "./programs.interface";
import { I_User } from "./user.interface";

export interface I_AppAction<T = any> { type: string, payload: T }

export interface I_UserState {
    userInfo: I_User | null,
    unauthorized: string,
}

export interface I_NotificationsState {
    list: I_Notification[] | null,
    unreadCount: number,
}

export interface I_ProcessState {
    list: Array<I_Process> | null;
    selected: I_Process | null;
}

export interface I_ProgramsState {
    list: Array<I_Program> | null;
    selected: I_Program | null;
    needRefreshList: boolean;
    filter: I_JSONObject | null;
    withActionInProgress: string[]
}

export type T_SelectedConditionData = {
    phases?: T_Phase[] | null,
    active?: T_ActivePhase | null,
}

export interface I_ConditionsState {
    phasesWithConditions: { [id_process: string]: T_PhasesWithConditions[] };
    selected: I_Condition | null;
    selectedData: T_SelectedConditionData;
}

export interface I_DashboardState {
    processList: { [filter: string]: Array<I_Process> };
    processSelectedFilter: I_ProcessIndicators | null;
    processIndicators: I_ProcessIndicators[] | null;

    programsList: { [filter: string]: Array<I_Program> };
    programsSelectedFilter: T_ProgramsIndicators | null;
    programsIndicators: T_ProgramsIndicators[] | null;
}
