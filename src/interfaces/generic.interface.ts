export interface I_JSONObject { [key: string]: any }

export interface I_FieldProps extends I_JSONObject {
    name: string;
    tag: string;
    type: string;
    label: string;
}