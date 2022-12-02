export interface I_Condition {
    estado: string,
    form_anexo: number,
    form_cond: number,
    form_obse: number,
    form_respuesta: number,
    id_cond: number,
    id_esta: number,
    id_form: number,
    marc_temp: string,
    marc_update: string,
    nomb_cond: string,
    sede: string
}

export interface I_AttachmentsConditions {
    id: string;
    nombre: string;
    descripcion: string;
    link: string;
}

export interface I_HistoryItem {
    grupo_resp: string,
    id_cond: number,
    id_resp: number,
    id_fcamp: 4,
    json_campo: { [x: string]: any },
    marc_temp: string,
    respuesta: any,
    usuario: string,
    tipo: string,
}

export interface I_FormField {
    grupo_resp: string,
    id_campo: number,
    id_fcamp: number,
    id_form: number,
    id_resp: number,
    json_campo: { [x: string]: any },
    marc_temp: string,
    marc_update: string,
    nomb_campo: string,
    nomb_form: string,
    respuesta: any,
    usuario?: string
}
