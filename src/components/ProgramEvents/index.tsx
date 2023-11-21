import { useState, useEffect, useRef } from 'react'
import { I_ProgramEvent } from '../../interfaces/programs.interface'
import { Calendar2Event, Check, Edit, ExclamationCircleFill, History, People, XCircle } from '../Icons'
import styles from "./styles.module.css";
import classnames from "classnames";
import { getNormalDate } from '../../utils/dateUtils';
import { Button, DropdownToggle, Nav, NavItem, NavLink, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import CustomDropdown from '../CustomDropdown'
import { Modal, ModalHeader, ModalBody, T_ModalJSON, closeModal, ModalFooter } from '../Modal';
import Form from 'react-ngm-form';
import eventForm from '../../forms/event.form';
import { I_JSONObject } from '../../interfaces/generic.interface';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { DELETE_PROGRAM_EVENT, GET_PROGRAM_EVENTS, SAVE_PROGRAM_EVENT } from '../../services/endPointsService';
import { jsonToFormData } from '../../utils/formUtils';
import { toast } from 'react-hot-toast';
import Alert from '../Alert';
import useLoader from '../../hooks/useLoader';
import useAlert from '../../hooks/useAlert';
import Loader from '../Loader';

type T_Props = {
    events?: I_ProgramEvent[] | null,
    program_id: number,
    limit?: number,
    canEdit?: boolean,
    callback?: (arg?: boolean) => void,
    children?: (addEventFunction: () => void, showAllEvents: () => void) => JSX.Element,
    extraData?: I_JSONObject
}

const ProgramEvents = ({ events: evs, limit, program_id, callback, children, canEdit = false, extraData }: T_Props) => {
    const [modal, setModal] = useState<T_ModalJSON | null>(null);
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [events, setEvents] = useState<I_ProgramEvent[] | null | false>(evs || null);
    const [oldEvents, setOldEvents] = useState<I_ProgramEvent[] | null | false>(null);
    const [tab, setTab] = useState(1);


    const { alertData, openAlert } = useAlert();

    const { closeLoader, openLoader } = useLoader()

    const loadEvents = (_tab = tab) => {
        if (_tab === 2) return loadOldEvents()
        if (events) return new Promise((r) => r(true))
        return AXIOS_REQUEST(`${GET_PROGRAM_EVENTS + program_id}`).then(resp => {
            setEvents(resp.data)
            return true;
        }).catch(() => {
            setEvents(false)
            return false;
        })
    }
    const loadOldEvents = () => {
        if (oldEvents) return new Promise((r) => r(true))

        return AXIOS_REQUEST(`${GET_PROGRAM_EVENTS + program_id}/2`).then(resp => {
            setOldEvents(resp.data)
            return true;
        }).catch(() => {
            setOldEvents(false)
            return false;
        })
    }

    const deleteEvent = (event: I_ProgramEvent) => {
        openAlert({
            title: "¿Está seguro?",
            children: "El evento quedará eliminado",
            closeButton: { value: "No, cancelar" },
            submitButton: {
                value: "Si, eliminar", onClick: () => {
                    openLoader("Eliminando evento", () => {
                        AXIOS_REQUEST(`${DELETE_PROGRAM_EVENT}${event.id_evento}`, "DELETE").then(res => {
                            toast.success("Evento eliminado correctamente", { position: "top-right" });
                            openLoader("Actualizando lista", null)
                            loadEvents().then(() => {
                                closeLoader(() => callback?.(true))
                            })
                        }).catch(e => {
                            closeLoader()
                            toast.error("No se pudo eliminar el evento", { position: "top-right" });
                        })
                    })
                }
            },
            type: "question",
        })
    }

    const addEvent = () => editEvent()

    const editEvent = (event?: I_ProgramEvent) => {
        const FORM_ID = "FORM_EVENT";
        const form = structuredClone(eventForm);

        if (extraData?.deansAndDirectors) {
            form.splice(form.length - 1, 0, {
                label: <b className='fw-semibold'>Usuarios a notificar</b>,
                props: {
                    // className: 'col col-md-6'
                },
                wrapperClassName: "border-top pt-3",
                tag: 'HTML',
                type: 'div',
                value: `<div class="pt-2">
               ${extraData.deansAndDirectors.map((i: I_JSONObject) => `<input style="width: 300px" class="form-control" disabled value="${i.nomb_resp}">`)}
                </div>`
            } as any)
        }

        const defaultValues = event ? {
            nomb_evento: event.nomb_evento,
            desc_evento: event.desc_evento,
            fech_evento: event.fech_evento.split("T")[0],
            reco_evento: event.reco_evento?.map(e => ({ days: e.num_dia })) || [],
            correo_add: !event.correo_add ? [] : event.correo_add.split(",").map(correo => ({ correo })),
        } : {}

        setModal({
            isOpen: true,
            title: event ? "Modificar evento" : "Crear evento",
            size: "lg",
            fullscreen: "md",
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
        openLoader(data.id_evento ? "Modificando evento" : "Registrando evento", () => {
            data.reco_evento = data.reco_evento.map(({ days }: { days: number }) => days)
            data.correo_add = data.correo_add.map(({ correo }: { correo: string }) => correo).join(",")
            AXIOS_REQUEST(SAVE_PROGRAM_EVENT, type, jsonToFormData({ ...data, id_prog: program_id }, "[0]."))
                .then(res => {
                    toast.success(`Evento ${data.id_evento ? "actualizado" : "registrado"} correctamente`, { position: "top-right" });
                    openLoader("Actualizando listado", null)
                    loadEvents().then(() => {
                        closeModal(setModal)
                        closeLoader(() => !data.id_evento && callback?.(true))
                    })
                })
                .catch(err => {
                    closeLoader()
                    toast.error(`No se pudo ${data.id_evento ? "actualizar" : "registrar"} el evento`, { position: "top-right" });
                })
        })
    }

    const printEventList = (list: typeof events, limit?: number) => {
        return list && <>
            {list.slice(0, limit).map(event => {
                const emails = !(event.correo_add) ? [] : event.correo_add.split(",")
                return <div key={event.id_evento} className={styles["event-item"]}>
                    <div className='d-flex justify-content-between'>
                        <div className={classnames("small bg-success bg-opacity-10 fw-semibold text-success text-opacity-75", styles["event-date"])}>
                            <small>{getNormalDate(event.fech_evento, { dateStyle: "full" })}</small>
                        </div>
                        {event.reco_evento && <div className='position-relative me-3' title='Recordatorios'>
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
                        </div>}
                        {!!(emails.length) && <div className='position-relative' title='Usuarios'>
                            <CustomDropdown
                                options={
                                    [
                                        { text: `Otros usuarios a notificar`, optionProps: { header: true } },
                                        ...(emails.map?.((e) => ({ text: `${e}`, optionProps: { disabled: true } })) || [])
                                    ]
                                }                                >
                                <DropdownToggle size="sm" color='link' className='text-dark p-0 position-relative'>
                                    <span className="position-absolute top-0 start-100 translate-middle rounded-pill badge bg-warning bg-opacity-25">
                                        <span className='text-warning fw-bold'>{emails.length}</span>
                                    </span>
                                    <i className='text-secondary'><People /></i>
                                </DropdownToggle>
                            </CustomDropdown>
                        </div>}

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
            })}
            {(!limit || limit >= list.length) && <div className={classnames(styles["event-item"], styles["no-more-item"])}>
                <div>
                    <i className='me-2 text-success'><Check /></i>
                    <small>No hay más eventos para mostrar</small>
                </div>
            </div>}
        </>
    }

    useEffect(() => { loadEvents() }, [tab])

    return (<>
        <Alert {...alertData} />
        <Modal isOpen={modal?.isOpen} size={modal?.size} onClosed={modal?.onClosed} fullscreen={modal?.fullscreen}>
            <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
            <ModalBody>{modal?.children}</ModalBody>
            {modal?.footer}
        </Modal>
        <Offcanvas isOpen={showAllEvents} style={{ minWidth: "40%", width: "auto" }} fade>
            <OffcanvasHeader toggle={() => { setShowAllEvents(false) }} className='align-items-start'>
                <span className='ps-3 border-start border-success border-4 py-1'>Eventos del programa</span>
                <div className='pb-2 mt-4'>
                    <div className={classnames('d-flex align-items-center', styles["toggler-container"])}>
                        <div className='bg-secondary bg-opacity-10 p-1 rounded-3'>
                            <Button color={tab === 1 ? 'primary2 fw-semibold' : "link-secondary"}
                                className='rounded-3 px-3' size='sm' onClick={() => setTab(1)}>
                                Próximos
                            </Button>
                            <Button color={tab === 2 ? 'primary2 fw-semibold' : "link-secondary"}
                                className='rounded-3 px-3' size='sm' onClick={() => setTab(2)}>
                                Pasados
                            </Button>
                        </div>
                    </div>
                </div>
            </OffcanvasHeader>
            <OffcanvasBody>
                {tab === 2 && !oldEvents && <div><Loader loaderAsModal={false}><p>Cargando eventos pasados</p></Loader></div>}
                {printEventList(tab === 2 ? oldEvents : events)}
            </OffcanvasBody>
        </Offcanvas>
        <div>
            {events === false ?
                <div className='p-5 text-center text-secondary opacity-50'>
                    <p className='text-secondary'><ExclamationCircleFill size={30} /></p>
                    <span>No se pudo cargar eventos</span>
                </div>
                :
                (events === null ?
                    <div className='p-5 text-center'>
                        <Loader loaderAsModal={false} >
                            <div className='small'>Consultando eventos</div>
                        </Loader>
                    </div>
                    :
                    (events.length ? <div className={styles["events-container"]}>{printEventList(events, limit)}</div>
                        :
                        <div className='p-5 text-center text-secondary opacity-50'>
                            <p className='text-secondary'><Calendar2Event size={30} /></p>
                            <span>No tiene eventos</span>
                        </div>
                    )
                )
            }
        </div>
        {events && canEdit && children?.(addEvent, () => setShowAllEvents(true))}
    </>)
}

export default ProgramEvents;
