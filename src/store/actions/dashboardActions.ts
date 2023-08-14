import { T_AppDispatch } from "..";
import { I_Condition } from "../../interfaces/conditions.interface";
import { I_JSONObject } from "../../interfaces/generic.interface";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { CONDITION_DETAILS, PHASES_WITH_COND_BY_PROCESS, STAGES } from "../../services/endPointsService";
import { T_Phase, T_PhasesWithConditions, T_Stage } from "../../interfaces/phasesAndStages.interface";
import { T_SelectedConditionData } from "../../interfaces/store.interface";

export const SET_PROCESS_INDICATORS = "SET_PROCESS_INDICATORS";
export const SET_PROCESS_FILTER = "SET_PROCESS_FILTER";
export const SET_PROCESS_LIST = "SET_PROCESS_LIST";
