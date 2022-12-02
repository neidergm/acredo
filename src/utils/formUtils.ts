import { I_FormField } from "../interfaces/conditions.interface"

export type T_FetchedFormData = {
    fields: { [name: string]: any },
    defaultValues: { [name: string]: any },
    fetchedForm: I_FormField[] | null,
}

type T_Items = {
    json_campo: { [x: string]: any },
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
                type: "HTML",
                tag: "div",
                props: { className: "d-flex gap-2 flex-wrap" },
                value: obj.type === "url"
                    ? `<div><a href="${c.respuesta}" target="_blank">Abrir enlace</a></div>`
                    : !!(c.respuesta) && c.respuesta.reduce((p: string, c: T_FileItem) =>
                        `${p}<div><a class="btn btn-light link-primary" href="${c.ruta}" target="_blank">${c.nombreReal}</a></div>`, "")
            }
        }
        return {
            fields: [...p.fields, obj],
            defaultValues: { ...p.defaultValues, [obj.name]: c.respuesta }
        }
    }, { fields: [] as { [x: string]: any }[], defaultValues: {} })
}

export const formToSubmitData = (
    data: { [x: string]: any },
    fields: I_FormField[],
    prefixes: Array<keyof I_FormField>,
    commonData: { [x: string]: any } = {}
) => {
    let form = new FormData();
    let i = 0;
    Object.keys(data).forEach((e) => {
        if (!!(data[e])) {
            let fieldProps = fields.find((f) => f.json_campo.name === e)

            if ((fieldProps)) {
                if (fieldProps.json_campo.tag === "file") {
                    if (data[e].length > 0) {
                        prefixes.forEach((p) => form.append(`resp[${i}].${p}`, `${fieldProps![p]}`))
                        for (let f_i = 0; f_i < data[e].length; f_i++) { form.append(`resp[${i}].archivos`, data[e][f_i]); }
                        i++;
                    }
                } else {
                    prefixes.forEach((p) => form.append(`resp[${i}].${p}`, `${fieldProps![p]}`))
                    form.append(`resp[${i}].respuesta`, data[e]);
                    i++;
                }
            }

        }
    })

    Object.keys(commonData).forEach(c => form.append(`${c}`, `${commonData[c]}`));

    return form;
}
