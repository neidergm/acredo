import { I_AlertObject } from "../components/Alert"
import Form from 'react-ngm-form';
import { closeModal } from "../components/Modal";

export default (subtitle: any, onSubmit: () => void, stateFunction: React.Dispatch<any>): I_AlertObject => {
    return {
        needFillConfirmation: true,
        isOpen: true,
        onClosed: () => { },
        title: "¿Está seguro?",
        type: "question",
        subtitle: <>
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
                    onSubmit={onSubmit}
                />
            </div>
        </>,
        submitButton: {
            form: "DELETE-CONFIRM-ALERT",
            type: "submit",
            onClick: () => { }, value: "Sí, eliminar"
        },
        closeButton: { value: "No, cancelar", onClick: () => closeModal(stateFunction) }
    }
}