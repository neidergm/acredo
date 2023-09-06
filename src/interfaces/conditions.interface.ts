import { T_UserRole, T_FieldsTypes } from "./generic.interface";

type T_UserOfTask = {
    nomb_cargo: string;
    responsable: string;
    rol: T_UserRole;
    rol_nombre: string;
    id_cargo: number;
    id_rc: number;
}

type T_UserInResume = {
    accion: null | string,
    nomb_resp: string,
    nomb_rol: string,
    rol_cond: T_UserRole
}

export interface I_Condition {
    /**
     * condition relation
     */
    cod_cond: number;
    color: string;
    detalle: string;
    estado: string;
    etapa_actual: {
        nomb_accion: string;
        nomb_etapa: string;
        responsables: string;
    };
    form_cond: string;
    /**
     * TASK id
    */
    id_cond: number;
    id_esta: number;
    id_sede: number;
    // form_obse: number;
    marc_temp: string;
    marc_update: string;
    nomb_cond: string;
    num_obs: number;
    porcentaje: number;
    resumen_usuario: T_UserInResume[],
    rol: T_UserRole;
    rol_nombre: string;
    sede: string;
    usuarios: Array<T_UserOfTask>
    condicion?: string;
}

export type T_FileAnswer = { url: string, name: string }

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
    id_fcamp: number;
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
    nomb_anexo: null | string;
    usuario?: string;
    num_obs?: number;
}

// export interface I_AttachmentsAnswer extends I_FormFieldWithAnswer {
//     nomb_anexo?: string;
//     nomb_usua?: string;
// }

export interface I_Form {
    campos: string;
    est_resp: 0 | 1;
    id_fcamp: number;
    marc_temp: string;
    marc_update: string;
    nomb_form: string;
    /**
     * 0: Default form type
     * 1: Modal form type
     */
    tipo_form: 0 | 1;
    /**
     * 0: Form can't have observations.
     * 1: Form can have observations.
     * 2: Form can have observations in every one response item.
     * 
     * If it's 2, the num_obs property will be an object
     */
    tipo_obs: 0 | 1 | 2;
    num_obs: number | Array<T_ObservationsInFormResp> | null;
}

export type T_ObservationsInFormResp = {
    grupo_resp: string;
    num_obs: number
}

export type T_TemplateCategories = {
    id_pcate: number,
    nomb_pcate: string,
    cantidad: number;
}

export type T_Template = {
    desc_plantilla: string;
    id_plantilla: number;
    nomb_plantilla: string
}