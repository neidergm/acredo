import { type I_FormField } from '../interfaces/conditions.interface';
import { type I_JSONObject, type T_FieldsTypes } from '../interfaces/generic.interface';
import { AXIOS_REQUEST } from '../services/axiosService';
import { FORMATION_TYPES_LIST } from '../services/constantsService';
import { CITIES_BY_DEPARTMENT, DEPARTMENT_LIST, GET_FACULTAD } from '../services/endPointsService';
import mapField from '../utils/mapField';

const programForm = (_defaultValues: I_JSONObject): T_FieldsTypes[] => [
    {
        "name": "nomb_prog",
        "label": "Nombre del programa",
        "tag": "input",
        "type": "text",
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "cod_prog",
        "label": "Código interno de programa",
        "tag": "input",
        "placeholder": "Opcional",
        "type": "text",
        "wrapperClassName": "col-6",
        "validations": {}
    },
    {
        "name": "id_facu",
        "label": "Facultad",
        "tag": "select",
        "type": "simple",
        "options": null,
        "request": {
            method: "GET",
            params: {},
            url: GET_FACULTAD
        },
        "doRequest": ({ method, params, url }: I_JSONObject) => AXIOS_REQUEST(url, method, params).then(resp => {
            return { options: resp.data?.map((i: I_JSONObject) => ({ value: i.id_facu, label: i.nomb_facu })) };
        }),
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "est_prog",
        "label": "Estado",
        "tag": "select",
        "type": "simple",
        "options": [{ label: "Activo", value: 1 }, { label: "Cerrado", value: 0 }],
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "departamento",
        "label": "Departamento",
        "tag": "select",
        "type": "simple",
        "options": null,
        "request": {
            method: "GET",
            params: {},
            url: DEPARTMENT_LIST
        },
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "ciud_prog",
        "label": "Ciudad",
        "tag": "select",
        "type": "simple",
        "options": null,
        "request": {
            method: "GET",
            params: { "departamento": null },
            url: CITIES_BY_DEPARTMENT
        },
        "dependsOn": "departamento",
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "nivel_prog",
        "label": "Nivel de formación",
        "tag": "select",
        "type": "simple",
        "options": ["PREGRADO", "POSGRADO"],
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "moda_prog",
        "label": "Modalidad",
        "tag": "select",
        "type": "simple",
        "options": ["PRESENCIAL", "VIRTUAL", "A DISTANCIA"],
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "tform_prog",
        "label": "Tipo de formación",
        "tag": "select",
        "type": "simple",
        "options": FORMATION_TYPES_LIST,
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "titu_prog",
        "label": "Título otorgado",
        "tag": "input",
        "type": "text",
        "wrapperClassName": "col-6",
        "validations": {
            "required": true
        }
    },
    {
        "name": "cod_snies",
        "label": "Código SNIES",
        "tag": "input",
        "type": "number",
        "wrapperClassName": "col-6",
        "validations": {
            // "required": true
        }
    },
    {
        "name": "freg_snies",
        "label": "Fecha de registro SNIES",
        "tag": "date",
        "type": "date",
        "wrapperClassName": "col-6",
        "validations": {
            // "required": true
        }
    }
].map(i => mapField({ json_campo: i } as I_FormField))

export default programForm;
