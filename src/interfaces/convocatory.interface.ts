export interface I_Convocatory {
    condiciones: string,
    est_conv: number,
    fech_fin: string,
    fech_ini: string,
    id_conv: number,
    id_prog: null | number,
    id_tcond: number,
    marc_temp: string,
    marc_update: string,
    nomb_conv: string,
    programa: null | string,
    tipo_cond: "Institucional" | "Programa",
}