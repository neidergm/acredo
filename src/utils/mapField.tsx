import { Button } from "reactstrap";
import { BoxArrowUpRight } from "../components/Icons";
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
        } else if (field.type === "googledocs") {
            field.render = ({ field: { ref, onChange, onBlur, value, ...f } }: any) => {
                let url = `https://docs.google.com/document/d/${value}?embedded=true`;
                return <>
                    <Button
                        outline
                        color="primary"
                        className="rounded-pill btn-sm px-3 mb-4"
                        onClick={() => { window.open(url, "_blank") }}
                    >
                        <div className='d-flex gap-2 justify-content-center align-items-center'>
                            <BoxArrowUpRight size={16} /> Abrir documento en pestaña nueva
                        </div>
                    </Button>
                    <div style={{ height: "90vh" }} className="shadow-sm">
                        <iframe
                            onLoad={() => {
                                console.log("OK");
                            }}
                            // src="https://drive.google.com/file/d/16sNCAcgzNWE-PKNyG4OUlkRFIsxMwBytdYdyo955SZI/preview"
                            src={url}
                            // src="https://docs.google.com/document/d/16sNCAcgzNWE-PKNyG4OUlkRFIsxMwBytdYdyo955SZI/preview?embedded=true"
                            // src="https://docs.google.com/document/d/e/2PACX-1vRrhp5FFuALDqI5zhtjXIJKP-9HnmJK7wndmKXhY0Y6TifdVKA6dj78dFFydLQpVA/pub?embedded=true"
                            width={"100%"}
                            height="100%"
                        ></iframe>
                    </div>
                </>
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

    } else if (field.tag === "list") {
        field.fields = field.fields.map(f => mapField({ json_campo: f } as any)!)
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
