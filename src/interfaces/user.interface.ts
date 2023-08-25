import { T_UserRole } from "./generic.interface";

export interface I_User {
    token: string;
    codProg: string;
    codnum: string;
    displayName: string;
    dni: string;
    mail: string;
    nombProg: string;
    rol: T_UserRole;
    rol_nomb?: string;
    type: string;
    prog_cond?: string;
    picture?: string;
    cargo?: string;
}
