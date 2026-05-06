/* eslint-disable react-refresh/only-export-components -- archivo mixto: util `mapField` + componentes auxiliares. */
import { lazy, type Ref, Suspense } from "react";
import { Button, Spinner } from "reactstrap";
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { type I_FormField, type I_FormFieldWithAnswer } from "../interfaces/conditions.interface";
import { type I_JSONObject, type T_FieldsTypes } from "../interfaces/generic.interface";
import { AXIOS_REQUEST } from "../services/axiosService";
import { getFormItemDefaultValue } from "./formUtils";
import EvidenceSelect from "../components/EvidenceSelect";
import DataListAttachmentInput from "../components/DataListAttachmentInput";

// Forma del `field` que `react-ngm-form` (vía Controller de RHF) inyecta a la
// función render. Genérico sobre el tipo de value para permitir narrowing por
// tipo de campo (ej. ckeditor → string, pick_attach_ref → unknown, etc.).
type T_RenderField<TValue = unknown> = {
    name: string;
    value: TValue;
    onChange: (value: TValue) => void;
    onBlur: () => void;
    ref: unknown;
    invalid?: boolean;
    className?: string;
    [k: string]: unknown;
};

// Tipos mínimos del editor reflejando solo lo que consumimos acá.
type T_CKEditorInstance = { getData: () => string; setData: (data: string) => void };
type T_CKEvent = { name: string };

const TextEditor = lazy(() => import("../components/TextEditor"));

const EditorPlaceholder = () => (
    <div
        className="border rounded d-flex align-items-center justify-content-center text-muted small"
        style={{ minHeight: 240 }}
    >
        <Spinner size="sm" />
        <span className="ms-2">Cargando editor...</span>
    </div>
);

export const isAGoogleDocField = (type: string) => ["googledocs", "googlesheets", "googleslides"].includes(type)

/**
 * Map fetched field item with custom fields 
 * @param {I_FormField} item 
 * @return {I_JSONObject} JSON FIELD
 */
const mapField = (item: I_FormField, defaultValue?: unknown) => {
    let field = item.json_campo;
    field.key = field.name;

    if (field.tag === "custom") {
        if (field.type === "ckeditor") {
            field.render = ({ field: { ref, onChange, onBlur, value, ...f } }: { field: T_RenderField<string> }) => {
                return <Suspense fallback={<EditorPlaceholder />}>
                    <TextEditor
                        {...f}
                        className={f.invalid ? "is-invalid" : ""}
                        data={String(defaultValue ?? value ?? "")}
                        inputRef={ref}
                        onChange={(_event: T_CKEvent, editor: T_CKEditorInstance) => {
                            onChange(editor.getData())
                        }}
                        onBlur={() => {
                            // RHF.onBlur no recibe args (solo marca touched); el valor ya se
                            // sincronizó vía onChange en cada keystroke del editor.
                            onBlur()
                        }}
                    />
                </Suspense>
            }
        } else if (isAGoogleDocField(field.type)) {
            const baseurl = field.defaultValue;
            field.render = ({ field: { value } }: { field: T_RenderField<string> }) => {
                return <>
                    <div className="text-end">
                        <Button
                            outline
                            color="link"
                            className="rounded-pill btn-sm px-3 mb-3"
                            onClick={() => { window.open(`${baseurl}${value}`, "_blank") }}
                        >
                            <div className='d-flex gap-2 justify-content-center align-items-center'>
                                <BsBoxArrowUpRight size={16} /> Abrir documento en pestaña nueva
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
            field.render = ({ field: { ref, onChange, onBlur, value, name, ...f } }: { field: T_RenderField }) => {
                const { validations, type, tag, ...props } = f;
                return <DataListAttachmentInput
                    name={name}
                    onChange={onChange}
                    innerRef={ref as Ref<HTMLInputElement>}
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
                        const params = field.request?.params as Record<string, unknown> | undefined;
                        if (params) params[field.dependsOn as string] = value;
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

            field.render = ({ field: { tag, validations, ref, ...f } }: { field: T_RenderField<string> }) => {
                return <EvidenceSelect
                    {...f}
                    innerRef={ref as Ref<HTMLInputElement>}
                // request={field.request}
                />
            }
        } else {
            // Fallback para tipos no soportados — el `tag: 'HTML'` ensancha el literal
            // permitido en T_FieldsTypes. La asignación es deliberada pero TS la rechaza.
            field = {
                ...field,
                label: 'Error',
                tag: 'HTML',
                type: 'div',
                value: `<p>Campo tipo ${field.type} (${field.tag}) no soportado</p>`
            } as unknown as typeof field
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
    } else if (field.tag) {
        field.defaultValue = defaultValue as typeof field.defaultValue;
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
