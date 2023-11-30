export interface I_Process {
    coment_conv: string;
    cod_snies: string | null;
    est_conv: number,
    fase_actual: string | null,
    id_conv: number,
    // id_fase: null | number,
    id_prog: null | number,
    id_sede: number,
    id_tcond: number,
    marc_temp: string,
    marc_update: string,
    nomb_conv: string,
    porcentaje: number,
    programa: null | string,
    sede: string,
    tipo_cond: string,
}