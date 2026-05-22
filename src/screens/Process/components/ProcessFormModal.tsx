import { Button } from "reactstrap";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../../../components/Modal";
import ProcessForm from "../../../forms/ProcessForm";
import { type I_JSONObject } from "../../../interfaces/generic.interface";
import { type I_Process } from "../../../interfaces/process.interface";

type Props = {
    isOpen: boolean;
    mode: "create" | "edit";
    process?: I_Process;
    onClose: () => void;
    onSubmit: (data: I_JSONObject) => void;
};

const FORM_ID_CREATE = "CREATE-PROCESS";
const FORM_ID_EDIT = "EDIT-PROCESS";

export default function ProcessFormModal({ isOpen, mode, process, onClose, onSubmit }: Props) {
    const formId = mode === "create" ? FORM_ID_CREATE : FORM_ID_EDIT;
    const title = mode === "create" ? "Crear nuevo proceso" : "Modificar proceso";

    const defaultValues: I_JSONObject = mode === "edit" && process
        ? {
              nomb_conv: process.nomb_conv,
              id_tcond: process.id_tcond.toString(),
              id_sede: process.id_sede.toString(),
              id_prog: process.id_prog?.toString() ?? "",
              coment_conv: process.coment_conv,
          }
        : {};

    return (
        <Modal backdrop="static" size="lg" isOpen={isOpen} toggle={() => onClose()}>
            <ModalHeader textCenter toggle={() => onClose()}>
                {title}
            </ModalHeader>
            <ModalBody>
                <ProcessForm
                    formProps={{ id: formId }}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                />
            </ModalBody>
            <ModalFooter className="justify-content-between">
                <Button color="primary-surface" onClick={() => onClose()}>
                    Cancelar
                </Button>
                <Button color="primary" form={formId}>
                    Continuar
                </Button>
            </ModalFooter>
        </Modal>
    );
}
