import { T_UserRole } from "../interfaces/generic.interface";

export const isAdmin = (rol?: T_UserRole) => rol === 'C';
export const isOnlyView = (rol?: T_UserRole) => rol === 'D';
