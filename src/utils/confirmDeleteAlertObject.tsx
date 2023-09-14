import { I_AlertObject } from "../components/Alert"
import Form from 'react-ngm-form';

const confirmDeleteAlertObject = (subtitle: I_AlertObject["children"], submitBtn: Required<I_AlertObject["submitButton"]>): I_AlertObject => {
    return {
        isOpen: true,
        needFillConfirmation: true,
        // onClosed: () => { },
        title: "¿Está seguro?",
        type: "question",
        children: <>
            {subtitle}
            <div className='mt-4' >
                <Form
                    formProps={{ id: "DELETE-CONFIRM-ALERT" }}
                    fields={
                        [{
                            name: "delete",
                            tag: "input",
                            type: "text",
                            placeholder: 'Escriba la palabra "ELIMINAR"',
                            validations: {
                                required: true,
                                pattern: /^ELIMINAR$/
                            },
                            customValidationsMessages: {
                                pattern: "Debe escribir la palabra \"ELIMINAR\""
                            }
                        }]}
                    defaultValues={{}}
                    onSubmit={() => submitBtn?.onClick()}
                />
            </div>
        </>,
        submitButton: {
            form: "DELETE-CONFIRM-ALERT",
            type: "submit",
            value: submitBtn?.value || "Sí, eliminar"
        },
        closeButton: { value: "No, cancelar" }
    }
}

export default confirmDeleteAlertObject;
