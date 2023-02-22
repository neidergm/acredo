import { T_FieldsTypes } from "react-ngm-form/dist/interfaces/FormElements.interface";
import { T_UserRole } from "./generic.interface";

export interface I_Condition {
    estado: string;
    rol: T_UserRole;
    form_anexo: number;
    form_cond: string;
    form_obse: number;
    form_respuesta: number;
    id_cond: number;
    id_esta: number;
    marc_temp: string;
    marc_update: string;
    nomb_cond: string;
    sede: string;
    etapa_por?: number;
    num_obs: number;
}

export type T_Stage = {
    internalId: number;
    est_etapa: 0 | 1 | 2; //0: created; 1: Notificated; 2: Completed
    fech_etapa: string;
    id_cond: number;
    id_nodo: number;
    nomb_nodo: string;
    resp_etapa: T_UserRole;
    responsable?: string;
};
export type T_ConditionDetails = Array<{ label: string, value: any, obs_anex?: number, obs_cond?: number }>;
export type T_FileAnswer = { ruta: string, nombreReal: string }

export interface I_AttachmentsConditions {
    id: string;
    nombre: string;
    descripcion: string;
    link: string;
}

export interface I_HistoryItem {
    grupo_resp: string;
    id_cond: number;
    id_resp: number;
    id_fcamp: 4;
    json_campo: { [x: string]: any };
    marc_temp: string;
    respuesta: any;
    usuario: string;
    tipo: string;
}

export interface I_FormField {
    id_campo: number;
    // json_campo: { [x: string]: any };
    json_campo: T_FieldsTypes;
    marc_temp: string;
    marc_update: string;
    nomb_campo: string;
}

export interface I_FormFieldWithAnswer extends I_FormField {
    grupo_resp: string;
    id_fcamp: number;
    id_resp: number;
    nomb_form: string;
    respuesta: any | Array<T_FileAnswer>;
    usuario?: string;
    num_obs?: number;
}

export interface I_AttachmentsAnswer extends I_FormFieldWithAnswer {
    nomb_anexo?: string;
    nomb_usua?: string;
}

export interface I_Form {
    campos: string;
    est_resp: 0 | 1;
    id_fcamp: number;
    marc_temp: string;
    marc_update: string;
    nomb_form: string;
    num_obs?: number;
}
