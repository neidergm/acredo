export interface I_JSONObject { [key: string]: any }

/**
 * A = Lider; B = Revisor; C = Admin; D = Solo lectura
 */
export type T_UserRole = "A" | "B" | "C" | "D";

export interface I_FieldProps extends I_JSONObject {
    name: string;
    tag: string;
    type: string;
    label: string;
}