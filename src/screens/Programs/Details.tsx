import React, { useEffect, useState } from 'react'
import { SubHeader } from '../../components/SubHeader'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { DELETE_PROGRAM, GET_PROGRAMS_LIST, SAVE_PROGRAM_DATA } from '../../services/endPointsService';
import { I_Program } from '../../interfaces/programs.interface';
import Loader from '../../components/Loader';
import { Button, Col, Offcanvas, OffcanvasBody, OffcanvasHeader, Row, Table } from 'reactstrap';
import { getNormalDate } from '../../utils/dateUtils';
import { ArrowRightShort, Edit, ExclamationCircleFill, Kanban, Plus, XCircle } from '../../components/Icons';
import { isAdmin, isSupervisor } from '../../utils/userRolUtils';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ProcessResumeItem } from '../Dashboard/ProcessResume';
import ProgramEvent from '../../components/ProgramEvents';
import Resolutions from '../../components/Resolutions';
import { Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON, closeModal } from '../../components/Modal';
import Alert, { I_AlertObject } from '../../components/Alert';
import Form from 'react-ngm-form';
import programForm from '../../forms/program.form';
import { I_JSONObject } from '../../interfaces/generic.interface';
import { getDifferenceBetweenData, jsonToFormData } from '../../utils/formUtils';
import { toast } from 'react-hot-toast';
import confirmDeleteAlertObject from '../../utils/confirmDeleteAlertObject';

const EVENT_LIMITS_SHOW = 3;

const Details = () => {

    const navigate = useNavigate();
    const userRol = useAppSelector(state => state.user.userInfo?.rol);
    const is_admin = !isSupervisor(userRol) && isAdmin(userRol);

    const [modal, setModal] = useState<T_ModalJSON | null>(null)
    const [alert, setAlert] = useState<I_AlertObject | null>(null)
    const [loader, setLoader] = useState<string | null>(null)

    const { id_program } = useParams();
    const [program, setProgram] = useState<I_Program | null>(null);
    const [showSidePanel, setShowSidePanel] = useState<null | { title: string; body: any; toggler: (close: boolean) => void }>(null);

    const getProgramInfo = () => {
        return AXIOS_REQUEST(`${GET_PROGRAMS_LIST}/${id_program}`).then(resp => {
            setProgram(resp.data[0])
        })
    }

    const deleteProgram = () => {
        const hasProcess = program?.procesos?.length;
        const hastReso = program?.resoluciones?.length;

        if (hastReso || hasProcess) {
            let subtitle = "El programa no puede ser eliminado ";

            if (hastReso) {
                subtitle += "debido a que cuenta con resoluciones"
                if (hasProcess) { subtitle += " y " }
            } else { subtitle += "debido a que " }
            if (hasProcess) { subtitle += "tiene procesos en curso" }

            return setAlert({
                subtitle,
                isOpen: true,
                title: "No se puede eliminar",
                type: "error",
                onClosed: () => closeModal(setAlert),
                closeButton: { value: "Ok, cerrar" }
            });
        }
        setAlert(
            confirmDeleteAlertObject(
                <span>Se eliminará permanentemente el programa <b>{program!.nomb_prog}</b></span>,
                () => {
                    setLoader("Eliminando resolución")
                    AXIOS_REQUEST(`${DELETE_PROGRAM}`, "PUT", jsonToFormData({ est_prog: -1, id_prog: program?.id_prog }, "[0].")).then(res => {
                        toast.success("Programa eliminado correctamente", { position: "top-right" });
                    }).catch(e => {
                        toast.error("No se pudo eliminar el programa", { position: "top-right" });
                    }).finally(() => {
                        setLoader(null)
                    })
                    closeModal(setAlert)
                },
                setAlert
            )
        )
    }

    const updateProgramData = () => {

        const FORM_ID = "PROGRAM_FORM";
        let defaultValues = {};
        if (program) {
            const { ciud_prog, est_prog, moda_prog, nivel_prog, nomb_prog, tform_prog, titu_prog, cod_snies, freg_snies, cod_prog } = program;

            defaultValues = {
                departamento: program?.depa_prog,
                ciud_prog, est_prog, moda_prog, nivel_prog, nomb_prog, tform_prog, titu_prog, cod_snies, freg_snies, cod_prog
            }
        }

        const form = programForm(defaultValues)

        setModal({
            isOpen: true,
            title: "Modificar programa",
            size: "lg",
            children: <>
                <Form
                    formProps={{ id: FORM_ID }}
                    defaultValues={defaultValues}
                    onSubmit={data => {
                        data = getDifferenceBetweenData(defaultValues, data)
                        if (Object.keys(data).length) {
                            setAlert({
                                isOpen: true,
                                type: "question",
                                title: `¿Está seguro?`,
                                subtitle: "Se actualizarán los datos de este programa",
                                closeButton: { value: "No, cancelar" },
                                onClosed: () => closeModal(setAlert),
                                submitButton: {
                                    value: "Sí, actualizar", onClick: () => {
                                        saveProgramData(data);
                                        closeModal(setAlert)
                                    }
                                }
                            })
                        } else {
                            toast.error("No hay cambios para actualizar", { position: "top-right", icon: <i className='text-warning'><ExclamationCircleFill /> </i> })
                        }
                    }}
                    fields={form}
                />
            </>,
            footer: <ModalFooter>
                <Button color='primary2' onClick={() => closeModal(setModal)}>Cancelar</Button>
                <Button form={FORM_ID} color='primary'>Guardar cambios</Button>
            </ModalFooter>
        })
    }

    const saveProgramData = ({ departamento, ...data }: I_JSONObject) => {

        setLoader("Actualizando datos")
        departamento && (data.depa_prog = departamento);
        data.id_prog = program?.id_prog;

        AXIOS_REQUEST(SAVE_PROGRAM_DATA, "PUT", jsonToFormData(data, "[0].")).then(resp => {
            toast.success("Datos del programa actualizados correctamente", { position: 'top-right' })
            closeModal(setModal);
            getProgramInfo()
        }).catch(err => {
            toast.error("No se pudo actualizar datos del programa", { position: 'top-right' })
        }).finally(() => {
            setLoader(null)
        })
    }

    const showAllEvents = (show = true) => {
        if (program && show) {
            setShowSidePanel({
                title: "Eventos del programa",
                body: <ProgramEvent events={program.eventos} program_id={program.id_prog} callback={getProgramInfo} canEdit={is_admin} />,
                toggler: showAllEvents
            })
        } else {
            setShowSidePanel(null)
        }
    }

    const showAllResolutions = (show = true) => {
        if (program && show) {
            setShowSidePanel({
                title: "Resoluciones del programa",
                body: <Resolutions list={program.resoluciones} program_id={program.id_prog} canEdit={is_admin}
                    callback={() => {
                        setShowSidePanel({ ...showSidePanel!, body: <><Loader isOpen subtitle={"Espere"} /></> })
                        getProgramInfo().finally(() => {
                            showAllResolutions()
                        })
                    }}
                />,
                toggler: showAllResolutions
            })
        } else {
            setShowSidePanel(null)
        }
    }

    useEffect(() => {
        if (!id_program) {
            navigate(-1)
        } else {
            getProgramInfo()
        }
    }, [])

    return (
        <>
            <SubHeader
                showBackButton
                text={program?.nomb_prog || "Detalles de programa"}
                className="container-xl"
            />

            <Loader isOpen={!!(loader)} subtitle={loader} />
            <Modal isOpen={modal?.isOpen} size={modal?.size}>
                <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                <ModalBody>{modal?.children}</ModalBody>
                {modal?.footer}
            </Modal>

            <Alert isOpen={!!alert} {...alert} />

            <div className="container-xl">
                <div>
                    {!program ? <div className='p-5 mt-5'><Loader loaderAsModal={false} isOpen /></div>
                        : <>
                            <Offcanvas isOpen={!!(showSidePanel)} style={{ minWidth: "40%" }} >
                                <OffcanvasHeader toggle={() => { showAllEvents(false) }}>
                                    <span className='ps-3 border-start border-success border-4 py-1'>{showSidePanel?.title}</span>
                                </OffcanvasHeader>
                                <OffcanvasBody>{showSidePanel?.body}</OffcanvasBody>
                            </Offcanvas>
                            <Row>
                                <Col md="6" className='mb-4'>
                                    <Card className='h-100 justify-content-between'>
                                        <div>
                                            <div>
                                                <div
                                                    className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2 d-inline-block'
                                                    style={{ borderRadius: "2px 10px 10px 2px" }}
                                                >
                                                    <small className='fw-bold text-uppercase'>INFORMACIÓN</small>
                                                </div>
                                            </div>
                                            <div className='mt-4'>
                                                <Table>
                                                    <tbody className='border-top'>
                                                        <tr>
                                                            <td><b className="fw-semibold">Código de programa</b></td>
                                                            <td>{program.cod_prog}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Estado</b></td>
                                                            <td>{program.estado}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Ciudad</b></td>
                                                            <td>{program.nomb_ciud} - <small className='text-muted'>{program.nomb_depa}</small></td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">SNIES</b></td>
                                                            <td>{program.cod_snies} <small className='text-muted'>({getNormalDate(program.freg_snies, { dateStyle: "long" })})</small></td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Nivel de formación</b></td>
                                                            <td>{program.nivel_prog}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Modalidad</b></td>
                                                            <td>{program.moda_prog}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Tipo de formación</b></td>
                                                            <td>{program.tform_prog}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Título otorgado</b></td>
                                                            <td>{program.titu_prog}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Resolución válida hasta</b></td>
                                                            <td>{getNormalDate(program.fech_reso, { dateStyle: "long" })}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                        {is_admin && <div className='d-flex justify-content-between gap-3'>
                                            <div className='text-end mt-3'>
                                                <Button size='sm' color='danger' onClick={() => deleteProgram()}>
                                                    <i className='me-1'><XCircle size={15} /></i> Eliminar
                                                </Button>
                                            </div>
                                            <div className='text-end mt-3'>
                                                <Button size='sm' color='primary' onClick={() => updateProgramData()}>
                                                    <i className='me-1'><Edit size={15} /></i> Actualizar información
                                                </Button>
                                            </div>
                                        </div>
                                        }
                                    </Card>
                                </Col>
                                <Col md="6" className='mb-4'>
                                    <Card className='h-100 justify-content-between'>
                                        <div>
                                            <div className='mb-4'>
                                                <div
                                                    className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2 d-inline-block'
                                                    style={{ borderRadius: "2px 10px 10px 2px" }}
                                                >
                                                    <small className='fw-bold text-uppercase '>RESOLUCIÓN ACTUAL</small>
                                                </div>
                                            </div>
                                        </div>
                                        <Resolutions current={program.resoluciones?.[0]} program_id={program.id_prog} canEdit={is_admin} callback={getProgramInfo}>
                                            {(add, edit) => (
                                                <div className='flex-grow-1 mt-3 d-flex justify-content-between gap-1 align-items-end'>
                                                    <div className='d-inline-block'>
                                                        {program.resoluciones?.[0] && <Button size='sm' color='link' onClick={() => showAllResolutions()}>
                                                            Ver todas las resoluciones <ArrowRightShort size={16} />
                                                        </Button>}
                                                    </div>
                                                    {is_admin && <>
                                                        {program.resoluciones?.[0] && <div className='ms-auto d-inline-block'>
                                                            <Button size='sm' color='primary' onClick={() => edit()}>
                                                                <i className='me-1'><Edit size={15} /></i> Editar
                                                            </Button>
                                                        </div>}
                                                        <div className='d-inline-block text-end'>
                                                            <Button size='sm' color='primary' onClick={() => add()}>
                                                                <i className='me-1'><Plus size={16} /></i> Nueva resolución
                                                            </Button>
                                                        </div>
                                                    </>}
                                                </div>
                                            )}
                                        </Resolutions>
                                    </Card>
                                </Col>
                                <Col md="6" className='mb-4'>
                                    <Card className='h-100'>
                                        <div>
                                            <div
                                                className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2 d-inline-block'
                                                style={{ borderRadius: "2px 10px 10px 2px" }}
                                            >
                                                <small className='fw-bold text-uppercase '>Procesos</small>
                                            </div>
                                        </div>
                                        <div className='mt-4'>
                                            {program.procesos ?
                                                program.procesos.map((p, idx) => <React.Fragment key={`${p.id_conv}-${idx}`}>
                                                    {idx !== 0 && <div className='mx-3 opacity-50'><hr className='border-secondary' /></div>}
                                                    <ProcessResumeItem process={p as any} pickItem={() => navigate(`/proceso/${p.id_conv}`)} />
                                                </React.Fragment>)
                                                :
                                                <div className='p-5 text-center text-secondary opacity-50'>
                                                    <p className='text-secondary'><Kanban size={30} /></p>
                                                    <span>No tiene procesos en curso</span>
                                                </div>
                                            }
                                        </div>
                                        {is_admin && <div className='h-100 d-flex align-items-end'>
                                            <Button size='sm' color='primary' className='ms-auto' onClick={() => navigate("/proceso")}>
                                                <Plus size={16} />
                                                Crear proceso para el programa
                                            </Button>
                                        </div>}
                                    </Card>
                                </Col>
                                <Col md="6" className='mb-4'>
                                    <Card className='h-100'>
                                        <div className='mb-4'>
                                            <div
                                                className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2 d-inline-block'
                                                style={{ borderRadius: "2px 10px 10px 2px" }}
                                            >
                                                <small className='fw-bold text-uppercase '>Eventos</small>
                                            </div>
                                        </div>
                                        <ProgramEvent
                                            events={program.eventos}
                                            limit={EVENT_LIMITS_SHOW}
                                            program_id={program.id_prog}
                                            callback={getProgramInfo}
                                            canEdit={is_admin}
                                        >
                                            {(addEventFunction) => (
                                                <div className='mt-3 d-flex justify-content-between gap-1'>
                                                    {program.eventos && program.eventos.length > EVENT_LIMITS_SHOW && <Button size='sm' color='link' onClick={() => showAllEvents()}>
                                                        Ver todos los eventos <ArrowRightShort size={16} />
                                                    </Button>}
                                                    <Button size='sm' color='primary' className='ms-auto' onClick={() => addEventFunction()}>
                                                        <Plus size={16} />
                                                        Registrar evento
                                                    </Button>
                                                </div>
                                            )}
                                        </ProgramEvent>
                                    </Card>
                                </Col>
                            </Row>
                        </>}
                </div>
            </div>
        </>
    )
}

export default Details