import { type I_Process, type I_ProcessType } from "../process.interface";
import { type I_ProcessIndicators } from "../dashboard.interface";

export type T_ProcessListArgs = { status?: string } | void;
export type T_ProcessListResponse = I_Process[];

export type T_ProcessIndicatorsResponse = I_ProcessIndicators[];

export type T_ProcessTypesResponse = I_ProcessType[];
