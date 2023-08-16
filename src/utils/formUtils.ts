import { I_FormField, I_FormFieldWithAnswer, T_FileAnswer } from "../interfaces/conditions.interface"
import { I_JSONObject, T_FieldsTypes } from "../interfaces/generic.interface"
import { dateToString, stringToDate } from "./dateUtils";
import mapField from "./mapField";

export type T_FetchedFormData = {
    fields: { [name: string]: any },
    defaultValues: { [name: string]: any },
    fetchedForm: I_FormFieldWithAnswer[] | null,
}

// export const formToObjectWithFieldsAndValues = (items: T_Items[]) => {
//     // return items.reduce((p, c) => {
//     //     let obj: I_JSONObject = c.json_campo;
//     //     if (obj.type === "url" || obj.tag === "file") {
//     //         obj = {
//     //             label: obj.label,
//     //             type: "div",
//     //             tag: "HTML",
//     //             props: { className: "d-flex gap-2 flex-wrap" },
//     //             value: obj.type === "url"
//     //                 ? `<div><a href="${c.respuesta}" target="_blank">Abrir enlace</a></div>`
//     //                 : !!(c.respuesta) && c.respuesta.reduce((p: string, c: T_FileItem) =>
//     //                     `${p}<div><a class="btn btn-light link-primary" href="${c.ruta}" target="_blank">${c.nombreReal}</a></div>`, "")
//     //         }
//     //     } else if (obj.tag === "custom") {
//     //         obj = mapField(c as any) as any;
//     //     } else if (obj.tag === "list") {
//     //         // obj.fields = obj.fields.map((f:any) => ({...f, value: c.respuesta}));
//     //         obj.fields = obj.fields.map((f: any) => ({ ...f, tag: "input", "type": "text", dependsOn: null, disabled: true }));
//     //         obj = mapField(c as any) as any;
//     //     }
//     //     return {
//     //         fields: [...p.fields, obj],
//     //         defaultValues: { ...p.defaultValues, [obj.name]: c.respuesta }
//     //     }
//     // }, { fields: [], defaultValues: {} } as I_JSONObject)
// }

/**
 * Build a formData to send
 * @param {I_JSONObject} data Object with fields values
 * @param {Array<I_JSONObject>} fields  
 * @param {string[]} keysOnField keys for search value in every one form item
 * @param {I_JSONObject} commonData object for every one form item
 * @param {I_JSONObject} extraData object for form
 * @returns FormData object to submit
 */
export const formToSubmitData = (
    data: I_JSONObject,
    fields: Array<{ json_campo: I_JSONObject } & I_JSONObject | T_FieldsTypes>,
    keysOnField: string[],
    commonData: I_JSONObject = {},
    extraData: I_JSONObject = {},
    dataPrefix = "resp"
) => {
    const form = new FormData();
    let i = 0;

    const fieldsAsJson = fields.reduce((p, c: any) => {
        const jc: any = !(Object.prototype.hasOwnProperty.call(c, "json_campo")) ? { json_campo: c } : c;
        return { ...p, [jc.json_campo.name]: jc }
    }, {} as { [name: string]: { json_campo: I_JSONObject } & I_JSONObject })

    Object.keys(data).forEach((e) => {
        const prefix = `${dataPrefix}[${i}]`;
        const currentData = data[e];

        if ((currentData)) {
            // let fieldProps = fields.find((f) => f.json_campo.name === e)
            const fieldProps = fieldsAsJson[e];
            if ((fieldProps)) {
                if (fieldProps.json_campo.tag === "file" && (currentData instanceof FileList)) {
                    if (currentData.length > 0) {
                        keysOnField.forEach((p) => form.append(`${prefix}.${p}`, `${fieldProps![p]}`))
                        const files = setFileAnswer(currentData);
                        files.forEach(f => form.append(`${prefix}.archivos`, f))
                    }
                } else if (fieldProps.json_campo.tag === "list") {
                    keysOnField.forEach((p) => form.append(`${prefix}.${p}`, `${fieldProps![p]}`));

                    currentData.forEach((row: any, rowID: number) => {
                        fieldProps!.json_campo.fields.forEach((item: I_JSONObject, idx: number) => {
                            const itemid = `${prefix}.item[${rowID}].campo[${idx}]`;
                            form.append(`${itemid}.nombre`, item.name);
                            if (item.tag === "file" && (row[item.name] instanceof FileList)) {
                                const files = setFileAnswer(row[item.name]);
                                files.forEach(f => form.append(`${itemid}.archivos`, f))
                            } else {
                                form.append(`${itemid}.respuesta`, typeof row[item.name] === "object" ? JSON.stringify(row[item.name]) : (row[item.name] || null));
                            }
                        })
                    })

                } else {
                    // Object.keys(commonData).forEach(c => form.append(`resp[${i}].${c}`, `${commonData[c]}`));
                    keysOnField.forEach((p) => form.append(`${prefix}.${p}`, `${fieldProps![p]}`))
                    form.append(`${prefix}.respuesta`, typeof currentData === "object" ? JSON.stringify(currentData) : currentData);
                }

                Object.keys(commonData).forEach(c => form.append(`${prefix}.${c}`, `${commonData[c]}`));
                i++;
            }
        }
    })

    Object.keys(extraData).forEach(c => form.append(`${c}`, `${extraData[c]}`));

    return form;
}

/**
 * Build array for send files from FileList object
 * @param {FileList} data 
 * @returns Array<file>
 */
const setFileAnswer = (data: FileList) => {
    const array = [];
    for (let f_i = 0; f_i < data.length; f_i++) { array.push(data[f_i]); }
    return array;
}

/**
 * Transform JSON to FormData object
 * @param {I_JSONObject} json 
 * @returns FormData
 */
export const jsonToFormData = (json: I_JSONObject, prefix = "", formData = new FormData()): FormData => {

    for (const key in json) {
        let val = json[key]
        if (json[key] instanceof Date) val = dateToString(val, undefined, true)
        formData.append(`${prefix}${key}`, val || "");
    }
    return formData;
}

/**
 * Transform saved array files to format required by the form library
 * @param {Array<T_FileAnswer>} files  
 * @returns { "name": string, "url": string } Array of files object
 */
export const transformFileValue = (files: T_FileAnswer[]) => files.map((e) => ({ name: e.name || e.name, url: e.url }))

/**
 * Get correct item default value
 * @param {I_FormFieldWithAnswer} item  
 * @returns value
 */
export const getFormItemDefaultValue = ({ respuesta, json_campo }: I_FormFieldWithAnswer) => {
    let rta = respuesta;
    if (json_campo.tag === "file" && respuesta) {
        rta = transformFileValue(rta)
    } else if (json_campo.tag === "list") {
        const filesFields = json_campo.fields.reduce((p, c) => c.tag === "file" ? [...p, c.name] : p, [] as string[]);
        if ((filesFields.length)) {
            rta = respuesta.map((r: I_JSONObject) => {
                filesFields.forEach(t => { r[t] = transformFileValue(r[t]) })
                return r;
            })
        }
    }
    return rta
}

export const getDifferenceBetweenData = (oldValues: I_JSONObject, newValues: I_JSONObject) => {

    const diff: I_JSONObject = {};

    for (const key in newValues) {

        let ov: any = oldValues[key];
        const nv: any = newValues[key];
        let nvs: any = newValues[key];

        if (
            (nv === "")
            &&
            (ov === null || ov === undefined)
        ) continue

        if (nvs instanceof Date && ov) {
            ov = stringToDate(ov)
        }

        if (typeof nv === "object") nvs = JSON.stringify(nvs);
        if (typeof ov === "object") ov = JSON.stringify(ov);

        if (ov != nvs) diff[key] = nv;
    }
    return diff;
}