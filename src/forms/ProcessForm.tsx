import { useMemo } from 'react'
import Form from 'react-ngm-form'
import mapField from '../utils/mapField';
import { type I_FormField } from '../interfaces/conditions.interface';
import { type I_JSONObject, type T_FieldsTypes } from '../interfaces/generic.interface';
import { AXIOS_REQUEST } from '../services/axiosService';
import { CAMPUS_LIST, GET_PROCESS_TYPE, GET_PROGRAMS_FOR_SELECT } from '../services/endPointsService';

type T_Props = {
    formProps: Record<string, unknown>,
    onSubmit: (data: I_JSONObject) => void,
    defaultValues: I_JSONObject,
}

const ProcessForm = ({
    formProps,
    defaultValues,
    onSubmit
}: T_Props) => {

    const form: T_FieldsTypes[] = useMemo(() => [
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
                    const options = resp.data.map((i: I_JSONObject) => ({ value: i.id_tcond, label: i.nomb_tcond }))
                    return { options };
                })
            },
            "options": null,
            "request": {
                method: "GET",
                params: {},
                url: GET_PROCESS_TYPE
            },
            "children": [
                { name: 'id_prog', showWhenValue: 2 }
            ],
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
            "name": "id_prog",
            "label": "Programa",
            "tag": "select",
            "type": "simple",
            "wrapperClassName": "col-md-6",
            "options": null,
            "request": {
                method: "GET",
                params: "{id_sede}",
                url: GET_PROGRAMS_FOR_SELECT + "/all/"
            },
            "dependsOn": "id_sede",
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
            "name": "coment_conv",
            "label": "Comentarios / observaciones",
            "tag": "input",
            "placeholder": "(Opcional) Normatividades, comentarios u observaciones para el proceso",
            "type": "textarea",
            "wrapperClassName": "col-12",
            "validations": {}
        }
    ].map(i => mapField({ json_campo: i } as I_FormField)), [])

    return (
        <Form
            formProps={formProps}
            fields={form}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
        />
    )
}

export default ProcessForm
