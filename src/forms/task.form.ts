import { I_FormField } from "../interfaces/conditions.interface";
import { I_JSONObject, T_FieldsTypes } from "../interfaces/generic.interface";
import { AXIOS_REQUEST } from "../services/axiosService";
import { CHARGE, CONDITIONS_TYPES, RESPONSIBLES_BY_CHARGE, ROLS } from "../services/endPointsService";
import mapField from "../utils/mapField";

// export const taskForm = (showGoogleDocField = true, showConditionTypeField = true): T_FieldsTypes[] => {

let fetchedCharge: any;
const fetchedUsers: any = {};
let fetchedRole: any;

export const taskForm = (showConditionTypeField = true, process_type?: number): T_FieldsTypes[] => {

    const f: T_FieldsTypes[] = [
        {
            "name": "nomb_cond",
            "label": "Nombre",
            "tag": "input",
            "type": "text",
            "wrapperClassName": "col-sm-6",
            "validations": {
                "required": true
            }
        },
        // {
        //     "name": "sede",
        //     "label": "Sede",
        //     "tag": "select",
        //     "type": "simple",
        //     "wrapperClassName": "col-sm-6",
        //     "options": null,
        //     "request": {
        //         method: "GET",
        //         url: CAMPUS_LIST,
        //         params: {}
        //     },
        //     doRequest: ({ method, params, url }) => {
        //         return AXIOS_REQUEST(url, method, params).then(resp => {
        //             return { options: resp.data.map((i: any) => ({ value: i.id_sede, label: i.nomb_sede })) };
        //         })
        //     },
        //     "validations": {
        //         "required": true
        //     }
        // }
    ];

    // if (showConditionTypeField) {
    f.push({
        "name": "cod_cond",
        "label": "Condición a la que se relaciona",
        "tag": "select",
        "type": "simple",
        "wrapperClassName": "col-sm-6",
        "options": null,
        disabled: !showConditionTypeField,
        "request": {
            method: "GET",
            url: `${CONDITIONS_TYPES}${process_type ? `/${process_type}` : ""}`,
            params: {}
        },
        doRequest: ({ method, params, url }) => {
            return AXIOS_REQUEST(url, method, params).then(resp => {
                return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_condicion, label: i.nomb_condicion, title: `Condición de tipo ${i.tipo_condicion.toUpperCase()}` })) };
            })
        },
        "validations": {}
    });

    f.push({
        "label": "Usuarios líderes y de solo lectura",
        "name": "responsable",
        "tag": "list",
        "type": "table",
        "validations": {
            required: true
        },
        // wrapperClassName: "row",
        "classNameForEveryItem": "col-12",
        "fields": [
            {
                "label": "Cargo",
                "name": "cargo",
                "tag": "select",
                "type": "simple",
                "validations": {
                    "required": true
                },
                "options": null,
                "request": {
                    method: "GET",
                    params: {},
                    url: CHARGE
                },
                doRequest: async ({ method, params, url }: I_JSONObject) => {
                    if (!fetchedCharge) {
                        const resp = await AXIOS_REQUEST(url, method, params)
                        fetchedCharge = { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_cargo, label: i.nomb_cargo })) };
                    }
                    return fetchedCharge;
                }
                // doRequest: ({ method, params, url }) => {
                //     return AXIOS_REQUEST(url, method, params).then(resp => {
                //         return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_cargo, label: i.nomb_cargo })) };
                //     })
                // }
            },
            mapField({
                json_campo: {
                    "label": "Usuario",
                    "name": "user",
                    "tag": "select",
                    "type": "simple",
                    "validations": {
                        "required": true
                    },
                    "options": null,
                    "request": {
                        method: "GET",
                        params: `{cargo}`,
                        url: RESPONSIBLES_BY_CHARGE
                    },
                    "dependsOn": "cargo",
                    doRequest: async ({ method, params, url }: I_JSONObject) => {
                        console.log(fetchedUsers, params)
                        if (!fetchedUsers[params]) {
                            const resp = await AXIOS_REQUEST(url, method, params)
                            fetchedUsers[params] = { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_rc, label: i.nomb_resp })) };
                        }
                        return fetchedUsers[params];
                    }
                    // doRequest: ({ method, params, url }: I_JSONObject) => {
                    //     return AXIOS_REQUEST(url, method, params).then(resp => {
                    //         return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_rc, label: i.nomb_resp })) };
                    //     })
                    // }
                }
            } as unknown as I_FormField),
            {
                "label": "Rol",
                "name": "role",
                "tag": "select",
                "type": "simple",
                "validations": {
                    "required": true
                },
                "options": null,
                "request": {
                    method: "GET",
                    params: {},
                    url: ROLS + '/1'
                },
                doRequest: async ({ method, params, url }: I_JSONObject) => {
                    if (!fetchedRole) {
                        const resp = await AXIOS_REQUEST(url, method, params)
                        fetchedRole = { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_rol, label: i.nomb_rol, title: i.desc_rol })) }
                    }
                    return fetchedRole;
                }
                // doRequest: ({ method, params, url }: I_JSONObject) => {
                //     return AXIOS_REQUEST(url, method, params).then(resp => {
                //         return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_rol, label: i.nomb_rol, title: i.desc_rol })) };
                //     });
                // }
            }
        ]
    });

    f.push(mapField(
        {
            json_campo: {
                "label": "Detalles",
                "name": "detalle",
                "tag": "custom",
                "validateAs": "input",
                "type": "ckeditor",
                "wrapperClassName": "col-12",
                "validations": {
                }
            }
        } as unknown as I_FormField)
    )

    // if (showGoogleDocField) {
    //     f.push({
    //         "name": "googledoc",
    //         "label": "Requiere crear documento de Google",
    //         "tag": "checkbox",
    //         "type": "simple",
    //         "wrapperClassName": "col-12",
    //         "validations": {
    //             required: false
    //         }
    //     })
    // }

    return f;
}