import { useState } from 'react'
import { I_Resolutions } from '../../interfaces/programs.interface'
import Card from '../Card'
import classnames from 'classnames'
import { Button } from 'reactstrap'
import { Edit, XCircle } from '../Icons'
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
import { jsonToFormData } from '../../utils/formUtils'

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
                <span>Se eliminará la permanentemente la resolución <b>{item.reso_apro}</b></span>,
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
        AXIOS_REQUEST(`${DELETE_PROGRAM_RESOLUTION}${reso_apro}`, "DELETE").then(res => {
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
        const FORM_ID = "FORM_EVENT";
        const form = structuredClone(resolutionForm);
        let defaultValues = {};

        if (reso) {
            const { cod_snies, fech_ejec, fech_reso, freg_snies, ncre_snies, nper_snies, reso_apro, vige_reso, peri_acad, reco_min } = reso;
            defaultValues = { cod_snies, fech_ejec, fech_reso, freg_snies, ncre_snies, nper_snies, reso_apro, vige_reso, peri_acad, reco_min }
        }

        setModal({
            isOpen: true,
            title: reso ? "Modificar resolución" : "Registrar resolución",
            size: "lg",
            children: <>
                <Form
                    formProps={{ id: FORM_ID }}
                    defaultValues={defaultValues}
                    onSubmit={data => saveResolutionData(data, reso ? "PUT" : "POST")}
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

        data.reco_evento = data.reco_evento.map(({ days }: { days: number }) => days)
        AXIOS_REQUEST(SAVE_PROGRAM_RESOLUTION, type, jsonToFormData({ ...data, id_prog: program_id }, "[0]."))
            .then(res => {
                toast.success("Resolución creada correctamente", { position: "top-right" });
                callback?.();
            })
            .catch(err => {
                toast.error("No se pudo crear la resolución", { position: "top-right" });
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

            {current && <div>
                <div className="hstack gap-3 mb-3 pb-3 text-center justify-content-between">
                    <div className="py-1">
                        <b className='d-block small'>SNIES</b>
                        <span>{current.cod_snies}</span>
                    </div>
                    <div className='vr'></div>
                    <div className="py-1">
                        <b className='d-block small'>Fecha de registro</b>
                        <span>{getNormalDate(current.freg_snies, { dateStyle: "long" })}</span>
                    </div>
                    <div className='vr'></div>
                    <div className="py-1">
                        <b className='d-block small'>Nro. periodos</b>
                        <span>{current.nper_snies}</span>
                    </div>
                    <div className='vr'></div>
                    <div className="py-1">
                        <b className='d-block small'>Nro. Créditos</b>
                        <span>{current.ncre_snies}</span>
                    </div>
                </div>
                <div>
                    <p>
                        <b className='fw-semibold'>Fecha de ejecución: </b>
                        <span className='text-secondary'>{getNormalDate(current.fech_ejec, { dateStyle: "long" })}</span>
                    </p>
                    <p>
                        <b className='fw-semibold'>Reconocimiento del ministerio: </b>
                        <span className='text-secondary'>{current.reco_min}</span>
                    </p>
                    <p>
                        <b className='fw-semibold'>Resolución de aprobación: </b>
                        <span className='text-secondary'>{current.reso_apro}</span>
                    </p>
                    <p>
                        <b className='fw-semibold'>Vigencia: </b>
                        <span className='text-secondary'>{current.vige_reso} años</span>
                    </p>
                </div>
                <div>
                    <p>
                        <b className='fw-semibold'>Justificación de resolución: </b>
                        <span className='text-secondary'>{current.just_reso || "No tiene"}</span>
                    </p>
                    <p>
                        <b className='fw-semibold'>Justificación detallada: </b>
                        <span className='text-secondary'>{current.jres_deta || "No tiene"}</span>
                    </p>
                </div>
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
                            <b className='d-block'>SNIES</b>
                            <span>{r.cod_snies}</span>
                        </div>
                        <div>
                            <b className='d-block'>Fecha de registro</b>
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