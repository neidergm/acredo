import { Col, Row } from "react-bootstrap";
import { LuCircleAlert, LuSquareDashedKanban } from "react-icons/lu";
import { type I_Process } from "../../../interfaces/process.interface";
import ProcessCard from "./ProcessCard";
import ProcessFormModal from "./ProcessFormModal";
import { useState } from "react";
import { useDeleteProcessMutation, useUpdateProcessMutation } from "../../../services/api/process.api";
import Alert from "../../../components/Alert";
import type { I_JSONObject } from "../../../interfaces/generic.interface";
import { getDifferenceBetweenData } from "../../../utils/formUtils";
import useAlert from "../../../hooks/useAlert";
import toast from "react-hot-toast";
import useLoader from "../../../hooks/useLoader";
import confirmDeleteAlertObject from "../../../utils/confirmDeleteAlertObject";
import { useNavigate, useSearchParams } from "react-router";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { selectProcess } from "../../../store/slices/processSlice";

type Props = {
    processes: I_Process[];
    canManage: boolean;
};

export default function ProcessList({ processes, canManage }: Props) {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [updateProcess] = useUpdateProcessMutation();
    const [deleteProcess] = useDeleteProcessMutation();

    const [modal, setModal] = useState(false)
    const [process, setProcess] = useState<I_Process>()

    const { alertData, openAlert, closeAlert } = useAlert();
    const { openLoader, closeLoader } = useLoader();

    const selectProcessToUpdate = (process: I_Process) => {
        setProcess(process)
        setModal(true)
    }

    const goToConditionsScreen = (process: I_Process) => {
        dispatch(selectProcess(process));
        // let link = `/proceso/${process.id_conv}`;
        // if (searchParams) link += `?status=${scope}`;

        const link = `/proceso/${process.id_conv}?${searchParams.toString()}`;

        navigate(link);
    };

    const handleEdit = (data: I_JSONObject) => {
        if (!process) return;

        const original = {
            nomb_conv: data.nomb_conv,
            id_tcond: data.id_tcond.toString(),
            id_sede: data.id_sede.toString(),
            id_prog: data.id_prog?.toString() ?? "",
            coment_conv: data.coment_conv,
        };
        const diff = getDifferenceBetweenData(original, data);
        if (!Object.keys(diff).length) {
            toast.error("No hay modificaciones para guardar", {
                icon: <i className="text-warning"><LuCircleAlert /></i>,
                position: "top-right",
            });
            return;
        }
        openAlert({
            type: "question",
            title: "¿Está seguro?",
            children: "Se modificarán datos en el proceso",
            submitButton: {
                value: "Sí, modificar",
                onClick: () => {
                    closeAlert();
                    openLoader("Modificando proceso", () => {
                        updateProcess({ id_conv: process.id_conv, ...diff })
                            .unwrap()
                            .then(() => {
                                toast.success("Se ha modificado el proceso correctamente", { position: "top-right" });
                                setModal(false);
                                setProcess(undefined);
                            })
                            .catch(() => {
                                toast.error("No se pudo modificar el proceso", { position: "top-right" });
                            })
                            .finally(() => closeLoader());
                    });
                },
            },
            closeButton: { value: "No, cancelar" },
        });
    };

    const confirmDelete = (process: I_Process) => {
        if (process.porcentaje) {
            openAlert({
                type: "warning",
                title: "Espere",
                closeButton: { value: "Ok" },
                children: "Este proceso no puede ser eliminado debido a que cuenta con un progreso",
            });
            return;
        }
        openAlert(
            confirmDeleteAlertObject("Se eliminará el proceso con todo lo que se incluye en el mismo", {
                onClick: () =>
                    closeAlert(() => {
                        openLoader("Eliminando proceso");
                        deleteProcess(process.id_conv)
                            .unwrap()
                            .then(() => {
                                toast.success("Se ha eliminado el proceso correctamente", { position: "top-right" });
                            })
                            .catch(() => {
                                toast.error("No se pudo eliminar el proceso", { position: "top-right" });
                            })
                            .finally(() => closeLoader());
                    }),
            })
        );
    };

    if (!processes.length) {
        return (
            <div className="text-center py-5 text-secondary opacity-50">
                <LuSquareDashedKanban size={60} />
                <h5 className="mt-3 mb-0">No hay nada para mostrar</h5>
            </div>
        );
    }

    return (<>
        <ProcessFormModal
            isOpen={modal}
            mode={"edit"}
            process={process}
            onClose={() => setModal(false)}
            onSubmit={(data) => {
                handleEdit(data);
            }}
        />

        <Alert {...alertData} />

        <Row className="g-3">
            {processes.map((p) => (
                <Col xs={12} md={6} xl={4} key={p.id_conv}>
                    <ProcessCard
                        process={p}
                        canManage={canManage}
                        onOpen={goToConditionsScreen}
                        onEdit={selectProcessToUpdate}
                        onDelete={confirmDelete}
                    />
                </Col>
            ))}
        </Row>
    </>
    );
}
