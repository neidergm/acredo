import { Button } from "reactstrap";
import { BoxArrowUpRight } from "../components/Icons";
import TextEditor from "../components/TextEditor";
import { type I_FormField, type I_FormFieldWithAnswer } from "../interfaces/conditions.interface";
import { type I_JSONObject, type T_FieldsTypes } from "../interfaces/generic.interface";
import { AXIOS_REQUEST } from "../services/axiosService";
import { getFormItemDefaultValue } from "./formUtils";
import EvidenceSelect from "../components/EvidenceSelect";
import DataListAttachmentInput from "../components/DataListAttachmentInput";

export const isAGoogleDocField = (type: string) => ["googledocs", "googlesheets", "googleslides"].includes(type)

/**
 * Map fetched field item with custom fields 
 * @param {I_FormField} item 
 * @return {I_JSONObject} JSON FIELD
 */
const mapField = (item: I_FormField, defaultValue?: any) => {
    let field = item.json_campo;
    field.key = field.name;

    if (field.tag === "custom") {
        if (field.type === "ckeditor") {
            field.render = ({ field: { ref, onChange, onBlur, value, ...f } }: any) => {
                // console.log({ field, f });
                return <TextEditor
                    {...f}
                    className={f.invalid ? "is-invalid" : ""}
                    // config={field.config}
                    // style={field.style}
                    data={defaultValue || value}
                    inputRef={ref}
                    // style={f.style}
                    onChange={(_event: any, editor: any) => {
                        // console.log({ event, editor, data });
                        onChange(editor.getData())
                    }}
                    onBlur={(_event: any, editor: any) => {
                        // console.log({ event, editor, data });
                        onBlur(editor.getData())
                    }}
                />
            }
        } else if (isAGoogleDocField(field.type)) {
            const baseurl = field.defaultValue;
            field.render = ({ field: { value } }: any) => {
                return <>
                    <div className="text-end">
                        <Button
                            outline
                            color="link"
                            className="rounded-pill btn-sm px-3 mb-3"
                            onClick={() => { window.open(`${baseurl}${value}`, "_blank") }}
                        >
                            <div className='d-flex gap-2 justify-content-center align-items-center'>
                                <BoxArrowUpRight size={16} /> Abrir documento en pestaña nueva
                            </div>
                        </Button>
                    </div>
                    <div style={{ height: "90vh" }}>
                        <iframe
                            title={"Document"}
                            // src="https://drive.google.com/file/d/16sNCAcgzNWE-PKNyG4OUlkRFIsxMwBytdYdyo955SZI/preview"
                            src={`${baseurl}${value}?embedded=true`}
                            // src="https://docs.google.com/document/d/16sNCAcgzNWE-PKNyG4OUlkRFIsxMwBytdYdyo955SZI/preview?embedded=true"
                            // src="https://docs.google.com/document/d/e/2PACX-1vRrhp5FFuALDqI5zhtjXIJKP-9HnmJK7wndmKXhY0Y6TifdVKA6dj78dFFydLQpVA/pub?embedded=true"
                            width={"100%"}
                            height="100%"
                        ></iframe>
                    </div>
                </>
            }
        } else if (field.type === "pick_attach_ref") {
            field.render = ({ field: { ref, onChange, onBlur, value, name, ...f } }: any) => {
                const { validations, type, tag, ...props } = f;
                return <DataListAttachmentInput
                    name={name}
                    onChange={onChange}
                    innerRef={ref}
                    onBlur={onBlur}
                    className={f.className}
                    value={value}
                {...props}
                />
            }

        } else if (field.type === "select") {
            if (field.dependsOn) {
                field.watchingCallback = (value, callback) => {
                    if (!value) {
                        callback({ request: undefined })
                    } else {
                        (field.request?.params as any)[field.dependsOn as any] = value;
                        callback({ request: { ...field.request } })
                    }
                    // if (!value) {
                    //     callback({ options: undefined })
                    // } else {
                    //     // callback({ options: value })

                    //     (field.request?.params as any)[field.dependsOn as any] = value;
                    //     callback({ request: { ...field.request }, options: value })
                    // }
                }
            }

            field.render = ({ field: { tag, validations, ref, ...f } }: any) => {
                return <EvidenceSelect
                    {...f}
                    innerRef={ref}
                // request={field.request}
                />
            }
        } else {
            field = {
                ...field,
                label: 'Error',
                tag: 'HTML' as any,
                type: 'div',
                value: `<p>Campo tipo ${field.type} (${field.tag}) no soportado</p>`
            }
        }
    } else if (field.tag === "select") {

        if (field.request && !(field.doRequest)) {
            field.doRequest = ({ method, params, url }) => {
                return AXIOS_REQUEST(url, method, params).then(resp => {
                    return { options: resp.data };
                })
            }
        }
        if (field.dependsOn) {
            field.watchingCallback = (value, callback, _formMethods) => {
                // console.log(field)
                // formMethods?.setValue(field.name, "")
                if (!value) {
                    callback({ options: [] })
                }
            }
        }

    } else if (field.tag === "list") {
        field.fields = field.fields.map((f, _i) => mapField({ json_campo: f } as typeof item)!)
    }else if(field.tag){
        field.defaultValue = defaultValue;
    }

    return field;
}

/**
 * Map fields with default values 
 * @param {Array<I_FormFieldWithAnswer>} list List with saved values, its the complete form
 * @param {Array<I_FormFieldWithAnswer>} list2 Optional list WITH SAVED VALUES, the form posibility its incomplete
 * @returns {I_JSONObject} 
 */
export const mapFieldAndDefaultValues = (list: Array<I_FormFieldWithAnswer | I_FormField>, list2?: Array<I_FormFieldWithAnswer> | null) => {
    const defaultValues = (list2 || []).reduce((p, c) => ({ ...p, [c.json_campo.name]: getFormItemDefaultValue(c) }), {} as I_JSONObject);
    return {
        defaultValues,
        fields: list.map(c => mapField(c, defaultValues[c.json_campo.name])) as T_FieldsTypes[]
    }
}

export default mapField;
