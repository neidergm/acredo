import React, { useState, useEffect, useRef, ChangeEvent } from 'react'
import processForm from './../forms/process.form';
import mapField from '../utils/mapField';
import { I_FormField } from '../interfaces/conditions.interface';
import { I_JSONObject, T_FieldsTypes } from '../interfaces/generic.interface';
import { AXIOS_REQUEST } from '../services/axiosService';
import { CAMPUS_LIST, GET_PROCESS_TYPE, GET_PROGRAMS_LIST } from '../services/endPointsService';

const useNewProcessForm = () => {

    const [form, setForm] = useState<T_FieldsTypes[]>([]);
    const [selectProgram, setSelectProgram] = useState(false);
    const fetchedProcessType = useRef<any>([]);

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
                    let options = resp.data.map((i: I_JSONObject) => ({ value: i.id_tcond, label: i.nomb_tcond }))
                    fetchedProcessType.current = resp.data;
                    return { options };
                })
            },
            "options": null,
            "request": {
                method: "GET",
                params: {},
                url: GET_PROCESS_TYPE
            },
            // "children": [
            //     {
            //         name: 'id_prog',
            //         showWhenValue: '2'
            //     }
            // ],
            "validations": {
                "required": true,
                onChange: (e: ChangeEvent<HTMLSelectElement>) => {
                    let selOpt = fetchedProcessType.current.find((i: any) => `${i.id_tcond}` === e.target.value);
                    setSelectProgram(selOpt.id_tcond === 2)
                }
            } as any
        }
        //   {
        //         "name": "id_prog",
        //         "label": "Programa",
        //         "tag": "select",
        //         "type": "simple",
        //         "wrapperClassName": "col-md-6",
        //         "options": null,
        //         "request": {
        //             method: "GET",
        //             params: {},
        //             url: GET_PROGRAMS_LIST
        //         },
        //         "dependsOn": "id_tcond",
        //         doRequest: ({ method, params, url }: I_JSONObject) => {
        //             return AXIOS_REQUEST(url, method, params).then(resp => {
        //                 return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_prog, label: i.nomb_prog })) };
        //             })
        //         },
        //         "validations": {
        //             "required": true
        //         }
        //     } 
        // {
        //     "name": "id_sede",
        //     "label": "Sede",
        //     "tag": "select",
        //     "type": "simple",
        //     "wrapperClassName": "col-md-6",
        //     "options": null,
        //     "request": {
        //         method: "GET",
        //         params: {},
        //         url: CAMPUS_LIST
        //     },
        //     doRequest: ({ method, params, url }: I_JSONObject) => {
        //         return AXIOS_REQUEST(url, method, params).then(resp => {
        //             return { options: resp.data.map((i: I_JSONObject) => ({ value: i.id_sede, label: i.nomb_sede })) };
        //         })
        //     },
        //     "validations": {
        //         "required": true
        //     }
        // },
        // {
        //     "name": "comment",
        //     "label": "Comentarios / observaciones",
        //     "tag": "input",
        //     "placeholder": "(Opcional) Normatividades, comentarios u observaciones para el proceso",
        //     "type": "textarea",
        //     "wrapperClassName": "col-12",
        //     "validations": {}
        // },
    ]


    useEffect(() => {
        // if (!form.length) {

        if (selectProgram) {
            processForm.push({
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
            })
        }
        let f = processForm.map(i => mapField({ json_campo: i } as I_FormField));

        setForm(f)
        // }
        // else{

        // }

    }, [selectProgram])

    console.log({ form, selectProgram })

    return {
        form
    }
}

export default useNewProcessForm