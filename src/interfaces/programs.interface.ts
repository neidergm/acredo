interface I_ProgramEvent {
    desc_evento: string;
    fech_evento: string;
    id_evento: number;
    nomb_evento: string;
    reco_evento: null | any
}

interface I_ProgramProcess {
    id_conv: number;
    nomb_conv: string;
    porcentaje: number;
    programa: string;
    sede: string;
    tipo_cond: string;
}

export interface I_Program {
    ciud_prog: string;
    est_prog: 0 | 1;
    estado: string;
    eventos: null | I_ProgramEvent[];
    freg_prog: string;
    id_prog: string;
    nivel_prog: string;
    nomb_prog: string;
    procesos: null | I_ProgramProcess[];
    regcal_prog: string;
    snies_prog: string;
    tform_prog: string;
}
