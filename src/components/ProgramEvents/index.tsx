import { useState } from 'react'
import { I_ProgramEvent } from '../../interfaces/programs.interface'
import { Calendar2Event, Check, Edit, History, XCircle } from '../Icons'
import styles from "./styles.module.css";
import classnames from "classnames";
import { getNormalDate } from '../../utils/dateUtils';
import { Button, DropdownToggle } from 'reactstrap';
import CustomDropdown from '../CustomDropdown'
import { Modal, ModalHeader, ModalBody, T_ModalJSON, closeModal, ModalFooter } from '../Modal';
import Form from 'react-ngm-form';
import eventForm from '../../forms/event.form';
import Loader from '../Loader';
import { I_JSONObject } from '../../interfaces/generic.interface';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { DELETE_PROGRAM_EVENT, SAVE_PROGRAM_EVENT } from '../../services/endPointsService';
import { jsonToFormData } from '../../utils/formUtils';
import { toast } from 'react-hot-toast';
import Alert, { I_AlertObject } from '../Alert';

type T_Props = {
    events: I_ProgramEvent[] | null,
    program_id: number,
    limit?: number,
    canEdit?: boolean,
    callback?: () => void,
    children?: (addEventFunction: () => void) => JSX.Element,
}

const ProgramEvents = ({ events, limit, program_id, callback, children, canEdit = false }: T_Props) => {

    const [modal, setModal] = useState<T_ModalJSON | null>(null)
    const [alert, setAlert] = useState<I_AlertObject | null>(null)
    const [loader, setLoader] = useState<string | null>(null)

    if (!events) {
        return <div className='p-5 text-center text-secondary'>
            <p className='text-secondary'><Calendar2Event size={30} /></p>
            <span>No tiene eventos</span>
        </div>
    }

    const deleteEvent = (event: I_ProgramEvent) => {
        setAlert({
            isOpen: true,
            title: "¿Está seguro?",
            subtitle: "El evento quedará eliminado",
            closeButton: { value: "No, cancelar" },
            submitButton: {
                value: "Si, eliminar", onClick: () => {
                    setLoader("Eliminando evento")
                    AXIOS_REQUEST(`${DELETE_PROGRAM_EVENT}${event.id_evento}`, "DELETE").then(res => {
                        toast.success("Evento eliminado correctamente", { position: "top-right" });
                        callback?.();
                    }).catch(e => {
                        toast.error("No se pudo eliminar el evento", { position: "top-right" });
                    }).finally(() => {
                        setLoader(null)
                    })
                }
            },
            type: "question",
            onClosed: () => closeModal(setAlert)
        })
    }

    const addEvent = () => editEvent()

    const editEvent = (event?: I_ProgramEvent) => {
        const FORM_ID = "FORM_EVENT";
        const form = structuredClone(eventForm);
        const defaultValues = event ? {
            nomb_evento: event.nomb_evento,
            desc_evento: event.desc_evento,
            fech_evento: event.fech_evento,
            reco_evento: event.reco_evento?.map(e => ({ days: e.num_dia })) || []
        } : {}
        setModal({
            isOpen: true,
            title: event ? "Modificar evento" : "Crear evento",
            size: "lg",
            children: <>
                <Form
                    formProps={{ id: FORM_ID }}
                    defaultValues={defaultValues}
                    onSubmit={data => {
                        if (event?.id_evento) {
                            data.id_evento = event.id_evento
                        }
                        saveEventData(data, event ? "PUT" : "POST")
                    }}
                    fields={form}
                />
            </>,
            footer: <ModalFooter>
                <Button color='primary2' onClick={() => closeModal(setModal)}>Cancelar</Button>
                <Button form={FORM_ID} color='primary'>Guardar{event ? " cambios" : ""}</Button>
            </ModalFooter>
        })
    }

    const saveEventData = (data: I_JSONObject, type: string) => {
        setLoader(data.id_evento ? "Actualizando evento" : "Registrando evento")

        data.reco_evento = data.reco_evento.map(({ days }: { days: number }) => days)
        AXIOS_REQUEST(SAVE_PROGRAM_EVENT, type, jsonToFormData({ ...data, id_prog: program_id }, "[0]."))
            .then(res => {
                toast.success(`Evento ${data.id_evento ? "actualizado" : "registrado"} correctamente`, { position: "top-right" });
                callback?.();
            })
            .catch(err => {
                toast.error(`No se pudo ${data.id_evento ? "actualizar" : "registrar"} el evento`, { position: "top-right" });
            })
            .finally(() => {
                setLoader(null)
            })
    }

    return (<>

        <Loader isOpen={!!(loader)} subtitle={loader}></Loader>
        <Modal isOpen={modal?.isOpen} size={modal?.size}>
            <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
            <ModalBody>{modal?.children}</ModalBody>
            {modal?.footer}
        </Modal>

        <Alert isOpen={!!alert} {...alert} />

        <div className={styles["events-container"]}>
            {events.slice(0, limit).map(event =>
                <div key={event.id_evento} className={styles["event-item"]}>
                    <div className='d-flex justify-content-between'>
                        <div className={classnames("small bg-success bg-opacity-10 fw-semibold text-success text-opacity-75", styles["event-date"])}>
                            <small>{getNormalDate(event.fech_evento, { dateStyle: "full" })}</small>
                        </div>
                        {event.reco_evento && <>
                            {/* <UncontrolledTooltip target={`recordatory-${event.id_evento}`}>{event.reco_evento.length} Recordatorios</UncontrolledTooltip> */}
                            <div className='position-relative' title='Recordatorios'>
                                <CustomDropdown
                                    options={
                                        [
                                            { text: `${event.reco_evento.length} Recordatorios`, optionProps: { header: true } },
                                            ...(event.reco_evento.map?.((e) => ({ text: `${e.num_dia} días antes del evento`, optionProps: { disabled: true } })) || [])
                                        ]
                                    }                                >
                                    <DropdownToggle size="sm" color='link' className='text-dark p-0 position-relative'>
                                        <span className="position-absolute top-0 start-100 translate-middle rounded-pill badge bg-warning bg-opacity-25">
                                            <span className='text-warning fw-bold'>{event.reco_evento.length}</span>
                                        </span>
                                        <i className='text-secondary'><History /></i>
                                    </DropdownToggle>
                                </CustomDropdown>
                            </div>
                        </>}

                        {canEdit && <div className='flex-grow-1 text-end'>
                            <div>
                                <Button size='sm' color='link' className='py-0 px-1' onClick={() => editEvent(event)}>
                                    <Edit size={18} />
                                </Button>
                                <Button size='sm' color='link link-danger' className='py-0 ps-1 pe-0' onClick={() => deleteEvent(event)}>
                                    <XCircle size={18} />
                                </Button>
                            </div>
                        </div>}
                    </div>
                    <div className='mt-2'>
                        <p className='fw-semibold mb-1'>{event.nomb_evento}</p>
                        <p className='text-secondary small'>{event.desc_evento ? `Descripción: ${event.desc_evento}` : "Sin descripción"}</p>
                    </div>
                </div>
            )}
            {(!limit || limit >= events.length) && <div className={classnames(styles["event-item"], styles["no-more-item"])}>
                <div>
                    <i className='me-2 text-success'><Check /></i>
                    <small>No hay más eventos para mostrar</small>
                </div>
            </div>}
        </div>
        {children?.(addEvent)}
    </>)
}

export default ProgramEvents;
