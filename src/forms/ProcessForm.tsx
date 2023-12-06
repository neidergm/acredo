import React, { useState, useEffect, useRef, useMemo } from 'react'
import Form from 'react-ngm-form'
import mapField from '../utils/mapField';
import { I_FormField } from '../interfaces/conditions.interface';
import { I_JSONObject, T_FieldsTypes } from '../interfaces/generic.interface';
import { AXIOS_REQUEST } from '../services/axiosService';
import { CAMPUS_LIST, GET_PROCESS_TYPE, GET_PROGRAMS_FOR_SELECT } from '../services/endPointsService';


type T_Props = {
    formProps: any,
    onSubmit: any,
    defaultValues: any
}

const ProcessForm = ({
    formProps,
    defaultValues,
    onSubmit
}: T_Props) => {

    // const [form, setForm] = useState<T_FieldsTypes[]>([]);
    // const [selectProgram, setSelectProgram] = useState<any>();
    const fetchedProcessTypeRef = useRef<any>([]);
    const [_, setFP] = useState<any>([]);

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
                    fetchedProcessTypeRef.current = resp.data;
                    setFP(resp.data)
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
                {
                    name: 'id_prog',
                    showWhenValue: 2
                    // showWhenValue: (val: any) => {
                    //     // if (defaultValues.id_tcond && !fetchedProcessType.current.length) { return true }
                    //     return !!fetchedProcessTypeRef.current.find((i: any) => `${i.id_tcond}` === val && i.camp_prog === 1)
                    // }
                }
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

    // useEffect(() => {
    //     setForm(
    //         processForm.map(i => mapField({ json_campo: i } as I_FormField))
    //     )
    // }, [])

    // if (!form.length) return <></>

    return (
        <Form
            formProps={formProps}
            fields={[...form]}
            // fields={processForm}
            defaultValues={{ ...defaultValues }}
            onSubmit={onSubmit}
        />
    )
}

export default ProcessForm
