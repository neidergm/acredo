import { useEffect, useState, useMemo } from 'react'
import { type I_Resolutions } from '../../interfaces/programs.interface'
import Card from '../Card'
import classnames from 'classnames'
import { Badge, Button, Nav, NavItem, NavLink, Offcanvas, OffcanvasBody, OffcanvasHeader, TabContent, TabPane, Table } from 'reactstrap'
import { BsCheckCircleFill, BsPencilSquare, BsExclamationCircleFill, BsFilePdf, BsFolder2Open, BsXCircle, BsXCircleFill } from 'react-icons/bs';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils'
import { Modal, ModalBody, ModalFooter, ModalHeader, type T_ModalJSON, closeModal } from '../Modal'
import Alert from '../Alert'
import { AXIOS_REQUEST } from '../../services/axiosService'
import { toast } from 'react-hot-toast'
import { DELETE_PROGRAM_RESOLUTION, GET_PROGRAM_RESOLUTIONS, SAVE_PROGRAM_RESOLUTION } from '../../services/endPointsService'
import confirmDeleteAlertObject from '../../utils/confirmDeleteAlertObject'
import Form from 'react-ngm-form'
import resolutionForm from '../../forms/resolution.form'
import { type I_JSONObject } from '../../interfaces/generic.interface'
import { getDifferenceBetweenData, jsonToFormData } from '../../utils/formUtils'
import useLoader from '../../hooks/useLoader'
import useAlert from '../../hooks/useAlert'
import Loader from '../Loader'

type T_Props = {
    program_id: number,
    canEdit?: boolean,
    saveCallback?: (needRefreshList?: boolean) => void,
    children?: (addResoFunction: () => void,
        updateResoFunction: () => void,
        showAllResolutions: () => void,
        hasActives: boolean) => JSX.Element,
}

const Resolutions = ({ program_id, saveCallback, canEdit = false, children }: T_Props) => {

    const [modal, setModal] = useState<T_ModalJSON | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [resolutions, setResolutions] = useState<null | false | I_Resolutions[]>(null);
    const [showAll, setShowAll] = useState(false);

    const actives = useMemo(() => resolutions ? resolutions.filter(e => e.estado === 1) : [], [resolutions])

    const { alertData, openAlert, closeAlert } = useAlert()

    const { closeLoader, openLoader } = useLoader();

    const getStatusName = (est: 0 | 1,
        expiration: string,
        render?: (content: string, color: null | string, icon?: JSX.Element) => JSX.Element | string,
        expiredColor = "danger",
        inactiveColor = "warning",
        defaultColor = "success"
    ) => {
        let text = "";
        let color = defaultColor;
        let icon = undefined;
        const v = getDateDiff(expiration);

        if (est === 1) {
            text = "Activa"
            if (v >= 0) {
                text += " y vigente"
                icon = <BsCheckCircleFill size={16} />;
            } else {
                text += " y vencida"
                color = expiredColor;
                icon = <BsXCircleFill size={16} />;
            }
        } else {
            text = "Inactiva"

            if (v >= 0) {
                icon = <BsExclamationCircleFill size={16} />;
                text += " y vigente"
                color = inactiveColor;
            } else {
                color = "dark";
                text += " y vencida"
            }
        }

        return render ? render(text, color, icon) : text;
    }

    const confirmDelete = (item: I_Resolutions) => {
        openAlert(
            confirmDeleteAlertObject(
                <span>Se eliminará permanentemente la resolución <b>{item.reso_apro}</b></span>,
                {
                    onClick: () => closeAlert(() => onDelete(item.id_reso))
                },
            )
        )
    }

    const onDelete = (id_reso: number) => {
        openLoader("Eliminando resolución", () => {
            const d = jsonToFormData({ id_reso, estado: -1 }, "resoluciones[0].");
            d.append(`id_prog`, `${program_id}`)

            AXIOS_REQUEST(`${DELETE_PROGRAM_RESOLUTION}`, "PUT", d).then(_res => {
                toast.success("Resolución eliminada correctamente", { position: "top-right" });
                loadResolutions().then(() => {
                    closeLoader(() => saveCallback?.(true))
                })
            }).catch(_e => {
                closeLoader()
                toast.error("No se pudo eliminar la resolución", { position: "top-right" });
            })
        })
    }

    const onAdd = () => onEdit()

    const onEdit = (reso?: I_Resolutions) => {
        const FORM_ID = "FORM_RESO";
        const form = structuredClone(resolutionForm);
        let defaultValues = {};

        if (reso) {
            const { fech_ejec, fech_reso, ncre_snies, nper_snies, vige_reso, peri_acad, reso_apro, reco_min, jres_deta, just_reso, estado, url_reso } = reso;
            defaultValues = {
                fech_ejec, fech_reso, ncre_snies, nper_snies, vige_reso, reso_apro, peri_acad, reco_min, jres_deta, just_reso, estado: `${estado}`,
                file_reso: [{ name: "Documento resolución", url: url_reso}]
            }
        }

        setModal({
            isOpen: true,
            title: reso ? "Modificar resolución" : "Registrar resolución",
            size: "lg",
            children: <>
                <Form
                    formProps={{ id: FORM_ID }}
                    defaultValues={defaultValues}
                    onSubmit={data => {
                        data = getDifferenceBetweenData(defaultValues, data, false)
                        if (Object.keys(data).length) {
                            data.reso_apro ||= reso?.reso_apro;
                            reso?.id_reso && (data.id_reso = reso.id_reso);
                            saveResolutionData(data, reso ? "PUT" : "POST")
                        } else {
                            toast.error("No hay cambios para actualizar", { position: "top-right", icon: <i className='text-warning'><BsExclamationCircleFill /> </i> })
                        }
                    }}
                    fields={form}
                />
            </>,
            footer: <ModalFooter>
                <Button color='primary2' onClick={() => closeModal(setModal)}>Cancelar</Button>
                <Button form={FORM_ID} color='primary'>Guardar{reso ? " cambios" : ""}</Button>
            </ModalFooter>
        })
    }

    const saveResolutionData = (data: I_JSONObject, type: string) => {
        openLoader(type === "PUT" ? "Modificando resolución" : "Registrando resolución", () => {
            const d = jsonToFormData(data, "resoluciones[0].");
            d.append("id_prog", `${program_id}`)

            AXIOS_REQUEST(SAVE_PROGRAM_RESOLUTION, type, d)
                .then(_res => {
                    toast.success(`Resolución ${type === "PUT" ? "actualizada" : "registrada"} correctamente`, { position: "top-right" });
                    openLoader("Actualizando listado", null)
                    loadResolutions().then(() => {
                        closeModal(setModal)
                        closeLoader(() => saveCallback?.(true))
                    })
                })
                .catch(_err => {
                    closeLoader()
                    toast.error(`No se pudo ${type === "PUT" ? "actualizar" : "registrar"} la resolución`, { position: "top-right" });
                })
        })
    }

    const loadResolutions = () => {
        return AXIOS_REQUEST(GET_PROGRAM_RESOLUTIONS + program_id).then(resp => {
            setResolutions(resp.data)
        }).catch(() => {
            setResolutions(false)
        })
    }

    const printAllResolutions = () => {
        return resolutions && <>
            {resolutions.map((r, idx) => <div key={r.reso_apro}>
                {getStatusName(r.estado, r.fech_vige, (content, color) =>
                    <Card className={`bg-${color} bg-opacity-10 shadow-none mb-3 px-2 px-lg-3 overflow-hidden`} key={idx}>
                        <div className='d-flex gap-2 justify-content-between'>
                            <div className='flex-grow-1 d-flex gap-1'>
                                <div
                                    className={`d-flex rounded-pill align-items-center pe-4 gap-2 bg-opacity-25 p-1 bg-${color || "success"}`}>
                                    <Badge color={color || "success"} className={'bg-opacity-75 fs-6 py-1 px-2 rounded-pill'}>
                                        <b className='fw-semibold'>{r.reso_apro}</b>
                                    </Badge>
                                    <div className={`text-${color} small fw-semibold ps-1`}>{content}</div>
                                </div>

                            </div>
                            {canEdit && <><div>
                                <Button
                                    size="sm"
                                    color="transparent"
                                    className={classnames('rounded-circle p-1 d-inline-flex align-items-center')}
                                    onClick={() => onEdit(r)}
                                >
                                    <BsPencilSquare />
                                </Button>
                            </div>
                                <div>
                                    <Button
                                        size="sm"
                                        color='transparent'
                                        className={classnames('text-danger rounded-circle p-1 d-inline-flex align-items-center')}
                                        onClick={() => confirmDelete(r)}
                                    >
                                        <BsXCircle />
                                    </Button>
                                </div>
                            </>
                            }
                        </div>
                        <div className='small mt-3'>
                            <b>Reconocimiento del ministerio: </b>{r.reco_min}
                        </div>
                        <div className='d-flex gap-4 mt-3 small mb-3 flex-wrap'>
                            <div>
                                <b className='d-block'>Fecha de resolución</b>
                                <span>{r.fech_reso}</span>
                            </div>
                            <div>
                                <b className='d-block'>Vigencia</b>
                                <span>{r.vige_reso} año{r.vige_reso > 1 && "s"} ({r.fech_vige})</span>
                            </div>
                            <div>
                                <b className='d-block'>Créditos</b>
                                <span>{r.ncre_snies} créditos</span>
                            </div>

                        </div>
                        <div className='small d-flex flex-column gap-2 text-secondary'>
                            <div>
                                <b className='fw-semibold'>Fecha de ejecución: </b>{getNormalDate(r.fech_ejec, { dateStyle: "long" })}
                            </div>
                            <div>
                                <b className='fw-semibold'>Periodos: </b>
                                <span>{r.nper_snies} periodo{r.nper_snies > 1 && "s"} | {r.peri_acad}</span>
                            </div>

                            <div>
                                <b className='fw-semibold'>Justificación de resolución: </b>{r.just_reso || "No tiene"}
                            </div>
                            <div>
                                <b className='fw-semibold'>Justificación detallada: </b>{r.jres_deta || "No tiene"}
                            </div>
                            {r.url_reso && <div>
                                <b className='fw-semibold'>Documento: </b><a target='_blank' href={r.url_reso}>Ver resolución</a>
                            </div>}
                        </div>
                        {/* <div className={`position-absolute text-${color}`} style={{
                    bottom: "15%",
                    opacity: 0.1,
                    right: "7%",
                    transform: "scale(6.5)"
                }}>
                    {icon}
                </div> */}
                    </Card>
                )}
            </div>)
            }
        </>
    }

    useEffect(() => {
        if (actives?.length && !(actives[activeTab])) {
            setActiveTab(0)
        }
    }, [actives])

    useEffect(() => { loadResolutions() }, [])

    if (resolutions === false) {
        return <>
            <div className='p-5 text-center text-secondary opacity-50'>
                <p className='text-secondary'><BsExclamationCircleFill size={30} /></p>
                <span>No se pudo cargar las resoluciones</span>
            </div>
            <div></div>
        </>
    } else if (resolutions === null) {
        return <>
            <div className='p-5 text-center'>
                <Loader loaderAsModal={false} >
                    <div className='small'>Consultando resoluciones</div>
                </Loader>
            </div>
            <div></div>
        </>
    }

    return (
        <>
            <Offcanvas isOpen={showAll} style={{ minWidth: "40%", width: "auto" }} fade>
                <OffcanvasHeader toggle={() => { setShowAll(false) }}>
                    <span className='ps-3 border-start border-success border-4 py-1'>Eventos del programa</span>
                </OffcanvasHeader>
                <OffcanvasBody>{printAllResolutions()}</OffcanvasBody>
            </Offcanvas>
            <Modal isOpen={modal?.isOpen} size={modal?.size}>
                <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                <ModalBody>{modal?.children}</ModalBody>
                {modal?.footer}
            </Modal>
            <Alert {...alertData} />

            {!actives?.length && <div className='text-center p-5 text-muted opacity-50'>
                <p><BsFolder2Open size={30} /></p>
                No tiene resoluciones activas
            </div>}

            {!!actives?.length && <div>
                <Nav tabs className="group-subtitle p-0 mb-3 border-bottom justify-content-md-start d-flex flex-nowrap align-items-center lh-1">
                    {actives.map((re, idx) =>
                        <NavItem onClick={() => setActiveTab(idx)} className='cursor-pointer text-truncate' key={idx}>
                            <NavLink className={classnames("border-0 text-secondary pt-0 text-truncate px-2 px-lg-3", {
                                "active border-4 border-bottom border-warning text-warning fw-semibold": activeTab === idx
                            })}>
                                {re.reco_min || re.reso_apro}
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
                <TabContent activeTab={activeTab} className="tab-content-item">
                    {actives.map((r, idx) =>
                        <TabPane tabId={idx} key={idx}>
                            <div className='mb-3 mt-4'>
                                <div className='d-flex gap-1 small justify-content-between text-secondary'>
                                    <div className='bg-light py-2 px-2 px-lg-3 rounded-3 flex-grow-1'>
                                        <span className='d-block mb-2'>
                                            <b className='text-dark'>Resolución: </b><span>{r.reso_apro}</span>
                                        </span>
                                        <span>{getNormalDate(r.fech_reso, { dateStyle: "long" })}</span>
                                    </div>
                                    <div className='bg-light py-2 px-2 px-lg-3 rounded-3 flex-grow-1'>
                                        <b className='d-block mb-2 text-dark'>Fecha de ejecución</b>
                                        <span>{getNormalDate(r.fech_ejec, { dateStyle: "long" })}</span>
                                    </div>
                                    <div className='bg-light py-2 px-2 px-lg-3 rounded-3 flex-grow-1'>
                                        <span className='d-block mb-2'>
                                            <b className='text-dark'>Vigencia: </b><span>{r.vige_reso} año{r.vige_reso > 1 && "s"}</span>
                                        </span>
                                        <span>
                                            {getNormalDate(r.fech_vige, { dateStyle: "long" })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Table className='small'>
                                <tbody>
                                    <tr>
                                        <td><b className="fw-semibold">Reconocimiento del ministerio</b></td>
                                        <td>{r.reco_min}</td>
                                    </tr>
                                    <tr>
                                        <td><b className="fw-semibold">Estado</b></td>
                                        <td>{getStatusName(r.estado, r.fech_vige, (content, color, icon) => <span className={`text-${color}`}>
                                            <i className='me-1'>{icon}</i>{content}</span>)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b className="fw-semibold">Periodos académicos</b></td>
                                        <td>{r.nper_snies} periodo{r.nper_snies > 1 && "s"} <span className='text-muted'>( {r.peri_acad} )</span></td>
                                    </tr>
                                    <tr>
                                        <td><b className="fw-semibold">Nro. Créditos</b></td>
                                        <td>{r.ncre_snies} créditos</td>
                                    </tr>
                                    <tr>
                                        <td><b className="fw-semibold">Documento de resolución</b></td>
                                        <td>
                                            {r.url_reso ? <a className='link-dark' href={r.url_reso} target='_blank' rel="noreferrer">
                                                <BsFilePdf size={18} /> Ver documento
                                            </a> : <span className='text-secondary'>Sin documento registrado</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b className="fw-semibold">Justificación de resolución</b></td>
                                        <td>{r.just_reso}</td>
                                    </tr>
                                    <tr>
                                        <td><b className="fw-semibold">Justificación detallada</b></td>
                                        <td>{r.jres_deta}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </TabPane>
                    )}
                </TabContent>
            </div>}

            {children?.(onAdd, () => { actives && onEdit(actives[activeTab]) }, () => setShowAll(true), !!(actives?.length))}
        </>
    )
}

export default Resolutions
