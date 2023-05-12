import { I_FormField } from "../interfaces/conditions.interface";
import { I_JSONObject, T_FieldsTypes } from "../interfaces/generic.interface";
import { AXIOS_REQUEST } from "../services/axiosService";
import { CAMPUS_LIST, GET_PROCESS_TYPE, GET_PROGRAMS_LIST } from "../services/endPointsService";
import mapField from "../utils/mapField";

const fetchedTypes = []

const processForm: T_FieldsTypes[] = [
    {
        "name": "nomb_conv",
        "label": "Nombre",
        "tag": "input",
        "type": "text",
        "wrapperClassName": "col-md-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "id_tcond",
        "label": "Tipo de proceso",
        "tag": "select",
        "type": "simple",
        "wrapperClassName": "col-md-6",
        doRequest: ({ method, params, url }: I_JSONObject) => {
            return AXIOS_REQUEST(url, method, params).then(resp => {
                return { 
                    options: resp.data.map((i: I_JSONObject) => ({ value: i.id_tcond, label: i.nomb_tcond }))
                 };
            })
        },
        "options": null,
        "request": {
            method: "GET",
            params: {},
            url: GET_PROCESS_TYPE
        },
        "children": [
            {
                name: 'id_prog',
                showWhenValue: '2'
            }
        ],
        "validations": {
            "required": true
        }
    },
    // {
    //     "name": "id_tcond",
    //     "label": "Tipo de proceso",
    //     "tag": "select",
    //     "type": "simple",
    //     "wrapperClassName": "col-md-6",
    //     "options": [
    //         { value: "1", label: "Institucional" },
    //         { value: "2", label: "Programa" }
    //     ],
    //     "children": [
    //         {
    //             name: 'id_prog',
    //             showWhenValue: '2'
    //         }
    //     ],
    //     "validations": {
    //         "required": true
    //     }
    // },
    {
        "name": "id_prog",
        "label": "Programa",
        "tag": "select",
        "type": "simple",
        "wrapperClassName": "col-md-6",
        "options": null,
        "request": {
            method: "GET",
            params: {},
            url: GET_PROGRAMS_LIST
        },
        "dependsOn": "id_tcond",
        doRequest: ({ method, params, url }: I_JSONObject) => {
            return AXIOS_REQUEST(url, method, params).then(resp => {
                return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_prog, label: i.nomb_prog })) };
            })
        },
        "validations": {
            "required": true
        }
    },
    {
        "name": "id_sede",
        "label": "Sede",
        "tag": "select",
        "type": "simple",
        "wrapperClassName": "col-md-6",
        "options": null,
        "request": {
            method: "GET",
            params: {},
            url: CAMPUS_LIST
        },
        doRequest: ({ method, params, url }: I_JSONObject) => {
            return AXIOS_REQUEST(url, method, params).then(resp => {
                return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_sede, label: i.nomb_sede })) };
            })
        },
        "validations": {
            "required": true
        }
    },
    {
        "name": "comment",
        "label": "Comentarios / observaciones",
        "tag": "input",
        "placeholder": "(Opcional) Normatividades, comentarios u observaciones para el proceso",
        "type": "textarea",
        "wrapperClassName": "col-12",
        "validations": {}
    },
].map(i => mapField({ json_campo: i } as I_FormField))

export default processForm;
