import { type I_Condition, type T_FileAnswer } from "./conditions.interface";
import { type T_UserRole } from "./generic.interface";

type T_UserOfAction = {
    nomb_cargo: string;
    responsable: string;
    rol: T_UserRole;
    rol_nombre: string;
    id_cargo: number;
    id_rc: number;
}

export type T_Action = {
    est_accion: 0 | 1 | 2; //0: created; 1: Notificated; 2: Completed
    finalizar: 0 | 1;
    fecha_accion: string;
    marc_update: string;
    marc_temp: string;
    id_accion: number;
    nomb_accion: string;
    orden: number;
    rol_accion: T_UserRole;
    rol_nombre: string;
    usuarios?: T_UserOfAction[] | null;
    usua_finalizar: null | string;
}

export type T_Stage = {
    name: string;
    id: number;
    status: 0 | 1;
    actions_completed?: number;
    actions?: Array<T_Action> | null;
};

export type T_Phase = {
    name: string;
    id: number;
    stages?: Array<T_Stage>;
    stages_completed?: number;
}

export type T_SelectedPhase = {
    phase?: T_Phase,
    stage?: T_Stage,
    action?: T_Action
}

export type T_PhasesWithConditions = {
    condiciones: I_Condition[] | null;
    fech_fin: string;
    fech_ini: string;
    id_conv: number;
    id_fase: number;
    marc_temp: string;
    marc_update: string;
    nomb_fase: number;
    porcentaje: number;
    orden: number;
}

export type T_AttachmentInPhase = {
    est_anexo: null | 0 | 1;
    id_resp: number;
    grupo_resp: string,
    nomb_campo: string,
    nomb_form: string,
    respuesta: Array<T_FileAnswer>,
    usuario: string,
    name_campo: string,
    nomb_anexo?: string,
    marc_temp: string,
    marc_update: string,
}

export type T_AttachmentsOfPhases = Array<{
    id_phase: number,
    id_fcam: number,
    nomb_cond: string,
    orden: number,
    anexos: Array<T_AttachmentInPhase>,
    anexos_by_group_resp?: { [group: string]: Array<T_AttachmentInPhase> }
}>