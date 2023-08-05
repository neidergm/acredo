export interface I_ProcessIndicators {
    estado: string;
    cantidad: number;
    texto: string;
}

export interface I_ProgramsIndicators extends I_ProcessIndicators {}

// interface I_Calendar {
//     ciud_prog: string;
//     freg_prog: string;
//     id_prog: number;
//     nivel_prog: string;
//     nomb_prog: string;
//     proceso: null | {
//         sede: string;
//         id_conv: number;
//         programa: string;
//         nomb_conv: string;
//         tipo_cond: string;
//         porcentaje: number;
//     }[];
//     regcal_prog: string;
//     snies_prog: string;
//     tform_prog: string;
// }

// interface I_Resume_Proceso {
//     cantidad: 1;
//     estado: string;
// }

// interface I_Resume {
//     fase_actual: string;
//     id_conv: number;
//     id_prog: number;
//     nomb_conv: string;
//     porcentaje: number;
//     porfase_actual: number;
//     programa: string;
//     sede: string;
//     tipo_cond: string;
// }

// export interface I_GeneralResume {
//     cale_prog: I_Calendar[];
//     num_pro: string;
//     res_conv: I_Resume_Proceso[];
//     resumen: I_Resume[]
// }


