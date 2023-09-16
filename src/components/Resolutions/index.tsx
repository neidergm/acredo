import { useEffect, useState } from 'react'
import { I_Resolutions } from '../../interfaces/programs.interface'
import Card from '../Card'
import classnames from 'classnames'
import { Badge, Button, Nav, NavItem, NavLink, TabContent, TabPane, Table } from 'reactstrap'
import { CheckCircleFill, Edit, ExclamationCircleFill, FilePDF, Folder2Open, XCircle, XCircleFill } from '../Icons'
import { getDateDiff, getNormalDate } from '../../utils/dateUtils'
import { Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON, closeModal } from '../Modal'
import Alert from '../Alert'
import { AXIOS_REQUEST } from '../../services/axiosService'
import { toast } from 'react-hot-toast'
import { DELETE_PROGRAM_RESOLUTION, SAVE_PROGRAM_RESOLUTION } from '../../services/endPointsService'
import Loader from '../Loader'
import confirmDeleteAlertObject from '../../utils/confirmDeleteAlertObject'
import Form from 'react-ngm-form'
import resolutionForm from '../../forms/resolution.form'
import { I_JSONObject } from '../../interfaces/generic.interface'
import { getDifferenceBetweenData, jsonToFormData } from '../../utils/formUtils'
import useLoader from '../../hooks/useLoader'
import useAlert from '../../hooks/useAlert'

type T_Props = {
    list?: I_Resolutions[] | null,
    actives?: I_Resolutions[] | null,
    program_id: number,
    canEdit?: boolean,
    saveCallback?: () => void,
    children?: (addResoFunction: () => void, updateResoFunction: () => void, hasActives: boolean) => JSX.Element,
}

const Resolutions = ({ list, program_id, saveCallback, canEdit = false, actives, children }: T_Props) => {

    const [modal, setModal] = useState<T_ModalJSON | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    const { alertData, openAlert, closeAlert } = useAlert()

    // const { loading, closeLoader, openLoader } = useLoader()
const { closeLoader, openLoader } = useLoader()

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
                icon = <CheckCircleFill size={16} />;
            } else {
                text += " y vencida"
                color = expiredColor;
                icon = <XCircleFill size={16} />;
            }
        } else {
            text = "Inactiva"

            if (v >= 0) {
                icon = <ExclamationCircleFill size={16} />;
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

            AXIOS_REQUEST(`${DELETE_PROGRAM_RESOLUTION}`, "PUT", d).then(res => {
                toast.success("Resolución eliminada correctamente", { position: "top-right" });
                closeLoader(() => {
                    saveCallback?.();
                })
            }).catch(e => {
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
            const { fech_ejec, fech_reso, ncre_snies, nper_snies, vige_reso, peri_acad, reso_apro, reco_min, jres_deta, just_reso, estado } = reso;
            defaultValues = { fech_ejec, fech_reso, ncre_snies, nper_snies, vige_reso, reso_apro, peri_acad, reco_min, jres_deta, just_reso, estado: `${estado}` }
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
                        data = getDifferenceBetweenData(defaultValues, data)
                        if (Object.keys(data).length) {
                            data.reso_apro ||= reso?.reso_apro;
                            reso?.id_reso && (data.id_reso = reso.id_reso);
                            saveResolutionData(data, reso ? "PUT" : "POST")
                        } else {
                            toast.error("No hay cambios para actualizar", { position: "top-right", icon: <i className='text-warning'><ExclamationCircleFill /> </i> })
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
        openLoader(type === "PUT" ? "Actualizando resolución" : "Registrando resolución", () => {
            const d = jsonToFormData(data, "resoluciones[0].");
            d.append("id_prog", `${program_id}`)

            AXIOS_REQUEST(SAVE_PROGRAM_RESOLUTION, type, d)
                .then(res => {
                    closeModal(setModal)
                    toast.success(`Resolución ${type === "PUT" ? "actualizada" : "registrada"} correctamente`, { position: "top-right" });
                    closeLoader(() => {
                        saveCallback?.();
                    })
                })
                .catch(err => {
                    closeLoader()
                    toast.error(`No se pudo ${type === "PUT" ? "actualizar" : "registrar"} la resolución`, { position: "top-right" });
                })
        })
    }

    useEffect(() => {
        if (actives?.length && !(actives[activeTab])) {
            setActiveTab(0)
        }
    }, [actives])

    return (
        <>
            {/* <Loader {...loading} /> */}
            <Modal isOpen={modal?.isOpen} size={modal?.size}>
                <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                <ModalBody>{modal?.children}</ModalBody>
                {modal?.footer}
            </Modal>
            <Alert {...alertData} />

            {!actives?.length && !list && <div className='text-center p-5 text-muted opacity-50'>
                <p><Folder2Open size={30} /></p>
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
                                            {r.doc_reso ? <a className='link-dark' href={r.doc_reso} target='_blank' rel="noreferrer">
                                                <FilePDF size={18} /> Ver documento
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

            {list?.map((r, idx) => <div key={r.reso_apro}>
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
                                    <Edit />
                                </Button>
                            </div>
                                <div>
                                    <Button
                                        size="sm"
                                        color='transparent'
                                        className={classnames('text-danger rounded-circle p-1 d-inline-flex align-items-center')}
                                        onClick={() => confirmDelete(r)}
                                    >
                                        <XCircle />
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

            {children?.(onAdd, () => { actives && onEdit(actives[activeTab]) }, !!(actives?.length))}
        </>
    )
}

export default Resolutions
