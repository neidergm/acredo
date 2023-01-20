import { I_FormFieldWithAnswer } from "../interfaces/conditions.interface"
import mapField from "./mapField";

type T_GENERIC_JSON = { [x: string]: any };

export type T_FetchedFormData = {
    fields: { [name: string]: any },
    defaultValues: { [name: string]: any },
    fetchedForm: I_FormFieldWithAnswer[] | null,
}

type T_Items = {
    json_campo: T_GENERIC_JSON,
    respuesta: any,
    [x: string]: any
}

type T_FileItem = {
    ruta: string;
    nombreReal: string;
}

export const formToObjectWithFieldsAndValues = (items: T_Items[]) => {
    return items.reduce((p, c) => {
        let obj = c.json_campo;
        if (obj.type === "url" || obj.tag === "file") {
            obj = {
                label: obj.label,
                type: "div",
                tag: "HTML",
                props: { className: "d-flex gap-2 flex-wrap" },
                value: obj.type === "url"
                    ? `<div><a href="${c.respuesta}" target="_blank">Abrir enlace</a></div>`
                    : !!(c.respuesta) && c.respuesta.reduce((p: string, c: T_FileItem) =>
                        `${p}<div><a class="btn btn-light link-primary" href="${c.ruta}" target="_blank">${c.nombreReal}</a></div>`, "")
            }
        } else if (obj.tag === "custom") {
            obj = mapField(c as any) as any;
        }
        return {
            fields: [...p.fields, obj],
            defaultValues: { ...p.defaultValues, [obj.name]: c.respuesta }
        }
    }, { fields: [], defaultValues: {} } as T_GENERIC_JSON)
}

export const formToSubmitData = (
    // prefixes: Array<keyof I_FormFieldWithAnswer>,
    data: T_GENERIC_JSON,
    fields: Array<{ json_campo: T_GENERIC_JSON } & T_GENERIC_JSON>,
    /**
     * keys for every one form item 
     */
    keysOnField: string[],
    /**
     * Keys and values for every one form item has to have 
     */
    commonData: T_GENERIC_JSON = {},
    /**
    * Keys and values for the general form 
    */
    extraData: T_GENERIC_JSON = {},
) => {
    let form = new FormData();
    let i = 0;
    Object.keys(data).forEach((e) => {
        if (!!(data[e])) {
            let fieldProps = fields.find((f) => f.json_campo.name === e)

            if ((fieldProps)) {
                if (fieldProps.json_campo.tag === "file") {
                    if (data[e].length > 0) {
                        keysOnField.forEach((p) => form.append(`resp[${i}].${p}`, `${fieldProps![p]}`))
                        for (let f_i = 0; f_i < data[e].length; f_i++) { form.append(`resp[${i}].archivos`, data[e][f_i]); }
                        i++;
                    }
                } else {
                    Object.keys(commonData).forEach(c => form.append(`resp[${i}].${c}`, `${commonData[c]}`));
                    keysOnField.forEach((p) => form.append(`resp[${i}].${p}`, `${fieldProps![p]}`))
                    form.append(`resp[${i}].respuesta`, data[e]);
                    i++;
                }
            }

        }
    })

    Object.keys(extraData).forEach(c => form.append(`${c}`, `${extraData[c]}`));

    return form;
}
