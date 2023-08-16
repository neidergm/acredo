import { useState } from 'react'
import { I_Resolutions } from '../../interfaces/programs.interface'
import Card from '../Card'
import classnames from 'classnames'
import { Button, Table } from 'reactstrap'
import { Edit, ExclamationCircleFill, Folder2Open, XCircle } from '../Icons'
import { getNormalDate } from '../../utils/dateUtils'
import { Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON, closeModal } from '../Modal'
import Alert, { I_AlertObject } from '../Alert'
import { AXIOS_REQUEST } from '../../services/axiosService'
import { toast } from 'react-hot-toast'
import { DELETE_PROGRAM_RESOLUTION, SAVE_PROGRAM_RESOLUTION } from '../../services/endPointsService'
import Loader from '../Loader'
import confirmDeleteAlertObject from '../../utils/confirmDeleteAlertObject'
import Form from 'react-ngm-form'
import resolutionForm from '../../forms/resolution.form'
import { I_JSONObject } from '../../interfaces/generic.interface'
import { getDifferenceBetweenData, jsonToFormData } from '../../utils/formUtils'

type T_Props = {
    list?: I_Resolutions[] | null,
    current?: I_Resolutions,
    program_id: number,
    canEdit?: boolean,
    callback?: () => void,
    children?: (addResoFunction: () => void, updateResoFunction: () => void) => JSX.Element,
}

const Resolutions = ({ list, program_id, callback, canEdit = false, current, children }: T_Props) => {

    const [modal, setModal] = useState<T_ModalJSON | null>(null);
    const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);
    const [loader, setLoader] = useState<string | null>(null);

    const confirmDelete = (item: I_Resolutions) => {
        setAlertConfirm(
            confirmDeleteAlertObject(
                <span>Se eliminará permanentemente la resolución <b>{item.reso_apro}</b></span>,
                () => {
                    onDelete(item.reso_apro);
                    closeModal(setAlertConfirm)
                },
                setAlertConfirm
            )
        )
    }

    const onDelete = (reso_apro: string) => {
        setLoader("Eliminando resolución")

        const d = jsonToFormData({ reso_apro, estado: -1 }, "resoluciones[0].");
        d.append(`id_prog`, `${program_id}`)

        AXIOS_REQUEST(`${DELETE_PROGRAM_RESOLUTION}`, "PUT", d).then(res => {
            toast.success("Resolución eliminada correctamente", { position: "top-right" });
            callback?.();
        }).catch(e => {
            toast.error("No se pudo eliminar la resolución", { position: "top-right" });
        }).finally(() => {
            setLoader(null)
        })
    }

    const onAdd = () => {
        onEdit()
    }

    const onEdit = (reso?: I_Resolutions) => {
        const FORM_ID = "FORM_RESO";
        const form = structuredClone(resolutionForm);
        let defaultValues = {};

        if (reso) {
            form.shift();
            const { fech_ejec, fech_reso, ncre_snies, nper_snies, vige_reso, peri_acad, reco_min, jres_deta, just_reso } = reso;
            defaultValues = { fech_ejec, fech_reso, ncre_snies, nper_snies, vige_reso, peri_acad, reco_min, jres_deta, just_reso }
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
                            data.reso_apro ||= reso!.reso_apro;
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
        setLoader(type === "PUT" ? "Actualizando resolución" : "Registrando resolución")

        const d = jsonToFormData(data, "resoluciones[0].");
        d.append("id_prog", `${program_id}`)

        AXIOS_REQUEST(SAVE_PROGRAM_RESOLUTION, type, d)
            .then(res => {
                toast.success(`Resolución ${type === "PUT" ? "actualizada" : "registrada"} correctamente`, { position: "top-right" });
                closeModal(setModal)
                callback?.();
            })
            .catch(err => {
                toast.error(`No se pudo ${type === "PUT" ? "actualizar" : "registrar"} la resolución`, { position: "top-right" });
            })
            .finally(() => {
                setLoader(null)
            })
    }

    return (
        <>
            <Loader isOpen={!!(loader)} subtitle={loader}></Loader>
            <Modal isOpen={modal?.isOpen} size={modal?.size}>
                <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                <ModalBody>{modal?.children}</ModalBody>
                {modal?.footer}
            </Modal>

            <Alert isOpen={!!alertConfirm} {...alertConfirm} />

            {!current && !list && <div className='text-center p-5 text-muted opacity-50'>
                <p><Folder2Open size={30} /></p>
                No tiene resoluciones registradas
            </div>}

            {current && <div>
                <Table>
                    <tbody className='border-top'>
                        <tr>
                            <td><b className="fw-semibold">Aprobación</b></td>
                            <td>{current.reso_apro}
                                <small className='text-secondary ms-2'>({getNormalDate(current.fech_reso, { dateStyle: "long" })})</small>
                            </td>
                        </tr>
                        <tr>
                            <td><b className="fw-semibold">Fecha de ejecución</b></td>
                            <td>{getNormalDate(current.fech_ejec, { dateStyle: "long" })}</td>
                        </tr>
                        <tr>
                            <td><b className="fw-semibold">Vigencia</b></td>
                            <td>{current.vige_reso} años</td>
                        </tr>
                        <tr>
                            <td><b className="fw-semibold">Nro. Periodos</b></td>
                            <td>{current.nper_snies} periodos</td>
                        </tr>
                        <tr>
                            <td><b className="fw-semibold">Periodos académicos</b></td>
                            <td>{current.peri_acad}</td>
                        </tr>
                        <tr>
                            <td><b className="fw-semibold">Nro. Créditos</b></td>
                            <td>{current.ncre_snies} créditos</td>
                        </tr>
                        <tr>
                            <td><b className="fw-semibold">Reconocimiento del ministerio</b></td>
                            <td>{current.reco_min}</td>
                        </tr>
                        <tr>
                            <td><b className="fw-semibold">Justificación de resolución</b></td>
                            <td>{current.just_reso}</td>
                        </tr>
                        <tr>
                            <td><b className="fw-semibold">Justificación detallada</b></td>
                            <td>{current.jres_deta}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>}

            {list?.map((r, idx) => <div key={r.reso_apro}>
                <Card className='bg-light shadow-none mb-3 px-2 px-lg-3' key={idx}>
                    <div className='d-flex gap-2 justify-content-between'>
                        <div className='flex-grow-1 d-flex gap-1'>
                            <div>
                                <div className={classnames(
                                    'd-flex rounded-pill align-items-center pe-4 gap-2 bg-opacity-25',
                                    "bg-secondary text-muted"
                                )}>
                                    <div
                                        className={classnames('rounded-circle text-white position-relative d-inline-block', "bg-dark bg-opacity-75")}
                                        style={{ padding: "14px" }}
                                    >
                                        <b className='fw-semibold position-absolute top-50 start-50 translate-middle'>{idx + 1}</b>
                                    </div>
                                    <div>
                                        <small className='fw-semibold ps-1'>
                                            R. aprobación:  {r.reso_apro}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {canEdit && <><div>
                            <Button
                                size="sm"
                                color='light'
                                className={classnames('rounded-circle p-1 d-inline-flex align-items-center')}
                                onClick={() => onEdit(r)}
                            >
                                <Edit />
                            </Button>
                        </div>
                            <div>
                                <Button
                                    size="sm"
                                    color='light'
                                    className={classnames('text-danger rounded-circle p-1 d-inline-flex align-items-center')}
                                    onClick={() => confirmDelete(r)}
                                >
                                    <XCircle />
                                </Button>
                            </div>
                        </>
                        }
                    </div>
                    <div className='d-flex gap-3 mt-3 small mb-3 flex-wrap'>
                        <div>
                            <b className='d-block'>Fecha de resolución</b>
                            <span>{r.fech_reso}</span>
                        </div>
                        <div>
                            <b className='d-block'>Periodos</b>
                            <span>{r.peri_acad}</span>
                        </div>
                        <div>
                            <b className='d-block'>Créditos</b>
                            <span>{r.ncre_snies}</span>
                        </div>
                        <div>
                            <b className='d-block'>Vigencia</b>
                            <span>{r.vige_reso} años</span>
                        </div>
                    </div>
                    <div className='small d-flex flex-column gap-2 text-secondary'>
                        <div>
                            <b className='fw-semibold'>Fecha de ejecución: </b>{getNormalDate(r.fech_ejec, { dateStyle: "long" })}
                        </div>
                        <div>
                            <b className='fw-semibold'>Reconocimiento del ministerio: </b>{r.reco_min}
                        </div>
                        <div>
                            <b className='fw-semibold'>Justificación de resolución: </b>{r.just_reso || "No tiene"}
                        </div>
                        <div>
                            <b className='fw-semibold'>Justificación detallada: </b>{r.jres_deta || "No tiene"}
                        </div>
                    </div>
                </Card>
            </div>)
            }

            {children?.(onAdd, () => { current && onEdit(current) })}
        </>
    )
}

export default Resolutions