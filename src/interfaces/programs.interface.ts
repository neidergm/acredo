export interface I_ProgramEvent {
    desc_evento: string;
    fech_evento: string;
    id_evento: number;
    nomb_evento: string;
    reco_evento: null | {
        id_evento: number;
        marc_temp: string;
        marc_update: string;
        num_dia: number
    }[];
}

interface I_ProgramProcess {
    id_conv: number;
    nomb_conv: string;
    porcentaje: number;
    programa: string;
    sede: string;
    tipo_cond: string;
}

export interface I_Resolutions {
    estado: 1 | 0;
    id_prog: number;
    reco_min: string;
    cod_snies: string;
    fech_ejec: string;
    fech_reso: string;
    jres_deta: null | string;
    just_reso: null | string;
    peri_acad: string;
    reso_apro: string;
    vige_reso: number;
    freg_snies: string;
    ncre_snies: number;
    nper_snies: number;
}

export interface I_Program {
    ciud_prog: string;
    depa_prog: string;
    est_prog: 0 | 1;
    estado: string;
    eventos: null | I_ProgramEvent[];
    fech_reso: string;
    id_prog: number;
    moda_prog: string;
    nivel_prog: string;
    nomb_prog: string;
    procesos: null | I_ProgramProcess[];
    resoluciones: I_Resolutions[]
    tform_prog: string;
    titu_prog: string;
}

