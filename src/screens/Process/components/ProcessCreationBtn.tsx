import { useState } from "react"
import { Button } from "react-bootstrap"
import { LuFolderPlus } from "react-icons/lu"
import ProcessFormModal from "./ProcessFormModal"
import { useCreateProcessMutation } from "../../../services/api/process.api"
import useLoader from "../../../hooks/useLoader"
import useAlert from "../../../hooks/useAlert"
import type { I_JSONObject } from "../../../interfaces/generic.interface"
import toast from "react-hot-toast"
import Alert from "../../../components/Alert"

const ProcessCreationBtn = () => {

    const [modal, setModal] = useState(false)

    const [createProcess] = useCreateProcessMutation();

    const { alertData, openAlert, closeAlert } = useAlert();
    const { openLoader, closeLoader } = useLoader();


    const handleCreate = (data: I_JSONObject) => {
        openAlert({
            type: "question",
            title: "¿Está seguro?",
            children: "Se creará un nuevo proceso con los datos indicados",
            submitButton: {
                value: "Sí, crear",
                onClick: () => {
                    closeAlert();
                    openLoader("Creando proceso", () => {
                        createProcess(data)
                            .unwrap()
                            .then(() => {
                                toast.success("Se ha creado el proceso correctamente", { position: "top-right" });
                                setModal(false);
                            })
                            .catch(() => {
                                toast.error("No se pudo crear el proceso", { position: "top-right" });
                            })
                            .finally(() => closeLoader());
                    });
                },
            },
            closeButton: { value: "No, cancelar" },
        });
    };

    return (<>
        <ProcessFormModal
            isOpen={modal}
            mode={"create"}
            onClose={() => setModal(false)}
            onSubmit={(data) => {
                handleCreate(data);
            }}
        />

        <Alert {...alertData} />
            
        <Button onClick={() => setModal(true)}>
            <LuFolderPlus size={20} /> Nuevo <span className="d-none d-sm-inline">proceso</span>
        </Button>
    </>
    )
}

export default ProcessCreationBtn