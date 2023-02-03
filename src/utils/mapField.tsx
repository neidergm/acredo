import TextEditor from "../components/TextEditor";
import { I_FormFieldWithAnswer } from "../interfaces/conditions.interface";
import { AXIOS_REQUEST } from "../services/axiosService";

/**
 * Map fetched field item with custom fields 
 * @param item 
 * @return JSON FIELD
 */
const mapField = (item: I_FormFieldWithAnswer) => {
    let field = item.json_campo;

    if (field.tag === "custom") {
        if (field.type === "ckeditor") {
            field.render = ({ field: { ref, onChange, onBlur, value, ...f } }: any) => {
                // console.log({ field, f });
                return <TextEditor
                    {...f}
                    // config={field.config}
                    // style={field.style}
                    data={item.respuesta || value}
                    inputRef={ref}
                    // style={f.style}
                    onChange={(event: any, editor: any) => {
                        // console.log({ event, editor, data });
                        onChange(editor.getData())
                    }}
                    onBlur={(event: any, editor: any) => {
                        // console.log({ event, editor, data });
                        onBlur(editor.getData())
                    }}
                />
            }
        } else {
            return null;
        }
    } else if (field.tag === "select") {
        if (field.request) {
            field.doRequest = ({ method, params, url }) => {
                return AXIOS_REQUEST(url, method, params).then(resp => {
                    return { options: resp.data };
                })
            }
        }
        if (field.dependsOn) {
            field.watchingCallback = (value, callback, formMethods) => {
                if (!value) {
                    callback({ options: [] })
                }
            }
        }
    }


    return field;
}

export const mapFieldAndDefaultValues = (list: I_FormFieldWithAnswer[]) => {
    return list.reduce((p, c) => {
        return {
            fields: [...p.fields, mapField(c)],
            defaultValues: { ...p.defaultValues, [c.json_campo.name]: c.respuesta }
        }
    }, {
        fields: [],
        defaultValues: {}
    } as { fields: any[], defaultValues: { [x: string]: any } })
}

export default mapField;
