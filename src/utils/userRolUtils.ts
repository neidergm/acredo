import { type T_UserRole } from "../interfaces/generic.interface";

export const isAdmin = (rol?: T_UserRole) => rol === 'C';
export const isOnlyView = (rol?: T_UserRole) => rol === 'D';
export const isLead = (rol?: T_UserRole) => rol === 'A';
export const isSupervisor = (rol?: T_UserRole) => rol === 'E';
// export const isAdmin = (rol?: T_UserRole) => false;
// export const isOnlyView = (rol?: T_UserRole) => false;
// export const isLead = (rol?: T_UserRole) => false;
// export const isSupervisor = (rol?: T_UserRole) => false;

