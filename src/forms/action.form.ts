import { I_FormField } from "../interfaces/conditions.interface";
import { I_JSONObject, T_FieldsTypes } from "../interfaces/generic.interface";
import { AXIOS_REQUEST } from "../services/axiosService";
import { CHARGE, RESPONSIBLES_BY_CHARGE } from "../services/endPointsService";
import mapField from "../utils/mapField";

export const actionFields = (id_condicion: string | number, id_action?: string | number): T_FieldsTypes[] => [
  {
    "label": "Nombre",
    "name": "nomb_accion",
    "tag": "input",
    "type": "text",
    "wrapperClassName": "col-md-6",
    "validations": {
      "required": true
    }
  },
  {
    "label": "Fecha límite",
    "name": "fecha_accion",
    "tag": "date",
    "type": "date",
    "wrapperClassName": "col-md-6",
    "validations": {
      "required": true
    }
  },
  {
    "label": `<br/>Usuarios responsable(s) <br/>
    <span class="fw-normal text-secondary mb-2">El <b>líder de la tarea</b> es por defecto el responsable en esta acción si no se agregan más usuarios</span><br/>`,
    "help": "No puede modificar los usuarios que son líderes o solo lectura",
    "name": "responsible",
    "tag": "list",
    "type": "table",
    "validations": {},
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
        doRequest: ({ method, params, url }: I_JSONObject) => {
          return AXIOS_REQUEST(url, method, params).then(resp => {
            return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_cargo, label: i.nomb_cargo })) };
          })
        }
      },
      {
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
          params: `{cargo}/${id_condicion}${id_action ? `/${id_action}` : ""}`,
          url: RESPONSIBLES_BY_CHARGE
        },
        "dependsOn": "cargo",
        doRequest: ({ method, params, url }: I_JSONObject) => {
          return AXIOS_REQUEST(url, method, params).then(resp => {
            return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_rc, label: i.nomb_resp })) };
          })
        }
      },
    ]
  }
].map(i => mapField({ json_campo: i } as I_FormField))