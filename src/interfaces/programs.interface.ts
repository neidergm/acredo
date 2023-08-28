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
    fech_ejec: string;
    fech_reso: string;
    fech_vige: string;
    id_prog: number;
    id_reso: number;
    jres_deta: null | string;
    just_reso: null | string;
    ncre_snies: number;
    nper_snies: number;
    peri_acad: string;
    reco_min: string;
    reso_apro: string;
    vige_reso: number;
}

export interface I_DecaAndDirector {
    iden_resp: string,
    nomb_resp: string,
    nomb_cargo: string
}

export interface I_Program {
    ciud_prog: string;
    cod_prog: string;
    cod_snies: string;
    deca_dire: I_DecaAndDirector[];
    depa_prog: string;
    est_prog: 0 | 1;
    estado: string;
    eventos: null | I_ProgramEvent[];
    facultad: string;
    fech_reso?: {
        fech_ven: string
        reco_mim: string;
        reso_apro: string
    }[];
    freg_snies: string;
    id_facu: number;
    id_prog: number;
    moda_prog: string;
    nivel_prog: string;
    nomb_ciud: string;
    nomb_depa: string;
    nomb_prog: string;
    procesos: null | I_ProgramProcess[];
    resoluciones: I_Resolutions[] | null;
    tform_prog: string;
    titu_prog: string;
    // est_resolution: "Activa" | "Sin resolución" | "Vencida";
}

