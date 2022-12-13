import TextEditor from "../components/TextEditor";
import { I_FormFieldWithAnswer } from "../interfaces/conditions.interface";

/**
 * Map fetched field list with custom fields
 * @param list Fields Array
 * @param callback executed every map item
 * @returns 
 */
const mapFields = (list: I_FormFieldWithAnswer[], callback: (field: { [x: string]: any }, originalItem: I_FormFieldWithAnswer) => void) => {

    return list.map((item: I_FormFieldWithAnswer) => {
        let field = item.json_campo;

        if (field.tag === "custom") {
            if (field.type === "ckeditor") {
                field.render = ({ field: { ref, onChange, onBlur, value, ...f } }: any) => {
                    // console.log({ field, rest });
                    return <TextEditor
                        {...f}
                        config={field.config}
                        style={field.style}
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
        }

        return callback(field, item)

        //  formData.est_resp === 1 && (data.defaultValues[field.name] = item.respuesta);
    })
}

export default mapFields;
