import { type I_Condition } from "./conditions.interface";
import { type I_ProcessIndicators, type T_ProgramsIndicators } from "./dashboard.interface";
import { type I_JSONObject } from "./generic.interface";
import { type T_SelectedPhase, type T_Phase, type T_PhasesWithConditions } from "./phasesAndStages.interface";
import { type I_Process } from "./process.interface";
import { type I_Program } from "./programs.interface";
import { type I_User } from "./user.interface";

export interface I_UserState {
    userInfo: I_User | null,
    unauthorized?: string | null | false,
}

export interface I_ProcessState {
    selected: I_Process | null | undefined;
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
    active?: T_SelectedPhase | null,
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
