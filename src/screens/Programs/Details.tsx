import React, { useEffect, useState } from 'react'
import { SubHeader } from '../../components/SubHeader'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { DELETE_PROGRAM, GET_PROGRAMS_LIST, SAVE_PROGRAM_DATA } from '../../services/endPointsService';
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
import Alert from '../../components/Alert';
import Form from 'react-ngm-form';
import programForm from '../../forms/program.form';
import { I_JSONObject } from '../../interfaces/generic.interface';
import { getDifferenceBetweenData, jsonToFormData } from '../../utils/formUtils';
import { toast } from 'react-hot-toast';
import confirmDeleteAlertObject from '../../utils/confirmDeleteAlertObject';
import classnames from 'classnames';
import { I_Process } from '../../interfaces/process.interface';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getProgramsList, selectProgram, setNeedRefreshList } from '../../store/actions/programsActions';
import useLoader from '../../hooks/useLoader';
import useAlert from '../../hooks/useAlert';

const EVENT_LIMITS_SHOW = 3;

const Details = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userRol = useAppSelector(state => state.user.userInfo?.rol);
    const program = useAppSelector(state => state.programs.selected);
    const is_admin = !isSupervisor(userRol) && isAdmin(userRol);
    const needRefreshList = useAppSelector(s => s.programs.needRefreshList);

    const { alertData, closeAlert, openAlert } = useAlert();

    const [modal, setModal] = useState<T_ModalJSON | null>(null)

    const { loading, openLoader, closeLoader } = useLoader()

    const { id_program } = useParams();
    const [showSidePanel, setShowSidePanel] = useState<null | { title: string; body: JSX.Element; toggler: (close: boolean) => void }>(null);

    const getProgramInfo = async (refreshList = false) => {
        if (refreshList) dispatch(setNeedRefreshList(true))

        return AXIOS_REQUEST(`${GET_PROGRAMS_LIST}/${id_program}`).then(resp => {
            if (!resp.data[0]) {
                return navigate(-1)
            }
            dispatch(selectProgram(resp.data[0]))
            return resp.data[0]
        }).catch(() => selectProgram(null))
    }

    const deleteProgram = () => {
        const hasProcess = program?.procesos?.length;
        const hastReso = program?.resoluciones?.length;

        if (hastReso || hasProcess) {
            let children = "El programa no puede ser eliminado ";

            if (hastReso) {
                children += "debido a que cuenta con resoluciones"
                if (hasProcess) { children += " y " }
            } else { children += "debido a que " }
            if (hasProcess) { children += "tiene procesos en curso" }

            return openAlert({
                children,
                title: "No se puede eliminar",
                type: "error",
                closeButton: { value: "Ok, cerrar" }
            });
        }
        openAlert(
            confirmDeleteAlertObject(
                <span>Se eliminará permanentemente el programa <b>{program!.nomb_prog}</b></span>,
                {
                    onClick: () => closeAlert(() => {
                        openLoader("Eliminando resolución")
                        AXIOS_REQUEST(`${DELETE_PROGRAM}`, "PUT", jsonToFormData({ est_prog: -1, id_prog: program?.id_prog }, "[0].")).then(res => {
                            dispatch(setNeedRefreshList(true))
                            dispatch(selectProgram(null))
                            toast.success("Programa eliminado correctamente", { position: "top-right" });
                            navigate(-1)
                        }).catch(e => {
                            toast.error("No se pudo eliminar el programa", { position: "top-right" });
                        }).finally(() => {
                            closeLoader()
                        })
                    })
                }
            )
        )
    }

    const updateProgramData = () => {

        const FORM_ID = "PROGRAM_FORM";
        let defaultValues = {};
        if (program) {
            const { ciud_prog, est_prog, moda_prog, nivel_prog, nomb_prog, tform_prog, titu_prog, cod_snies, freg_snies, cod_prog, id_facu } = program;

            defaultValues = {
                departamento: program?.depa_prog,
                ciud_prog, est_prog: `${est_prog}`, moda_prog, nivel_prog, nomb_prog, tform_prog, titu_prog, cod_snies, freg_snies, cod_prog, id_facu
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
                            openAlert({
                                type: "question",
                                title: `¿Está seguro?`,
                                children: "Se actualizarán los datos de este programa",
                                closeButton: { value: "No, cancelar" },
                                submitButton: {
                                    value: "Sí, actualizar", onClick: () => {
                                        saveProgramData(data);
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
        openLoader("Actualizando datos", () => {
            departamento && (data.depa_prog = departamento);
            data.id_prog = program?.id_prog;

            AXIOS_REQUEST(SAVE_PROGRAM_DATA, "PUT", jsonToFormData(data, "[0].")).then(resp => {
                toast.success("Datos del programa actualizados correctamente", { position: 'top-right' })
                closeLoader(() => closeModal(setModal))
                return getProgramInfo(true)
            }).catch(err => {
                closeLoader()
                toast.error("No se pudo actualizar datos del programa", { position: 'top-right' })
            })
        })
    }

    const showAllEvents = (show = true, prog = program) => {
        if (program && show) {
            setShowSidePanel({
                title: "Eventos del programa",
                body: <ProgramEvent events={prog!.eventos} program_id={prog!.id_prog} callback={updateEventCallback} canEdit={is_admin} />,
                toggler: showAllEvents
            })
        } else {
            setShowSidePanel(null)
        }
    }

    const updateResolutionCallback = (showAllInPanel = true) => {
        openLoader("Espere", () => {
            getProgramInfo(true).then((p) => {
                showAllInPanel && showAllResolutions(true, p);
            }).finally(() => closeLoader())
        })
    }

    const updateEventCallback = (showAllInPanel = true) => {
        openLoader("Espere", () => {
            getProgramInfo(true).then((p) => {
                showAllInPanel && showAllEvents(true, p)
            }).finally(() => closeLoader())
        })
    }

    const showAllResolutions = (show = true, prog = program) => {
        if (prog && show) {
            setShowSidePanel({
                title: "Resoluciones del programa",
                body: <Resolutions list={prog.resoluciones} program_id={prog.id_prog} canEdit={is_admin} saveCallback={updateResolutionCallback} />,
                toggler: showAllResolutions
            })
        } else {
            setShowSidePanel(null)
        }
    }

    const showProgramUsers = (show = true) => {
        if (program && show) {
            setShowSidePanel({
                title: "Decanos y directores",
                body: <div>
                    {
                        program.deca_dire.map((d, i) => <Card key={i} className='shadow-none bg-light mb-3'>
                            <p className='fw-semibold'>{d.nomb_cargo}</p>
                            <p className='mb-0'>{d.nomb_resp}</p>
                            <span className='text-muted small'>Identificación: {d.iden_resp}</span>
                        </Card>)
                    }
                </div>,
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
            !program && getProgramInfo()
        }
        return () => {
            if (needRefreshList) dispatch(getProgramsList())
        }
    }, [])

    return (
        <>
            <SubHeader
                showBackButton
                text={program?.nomb_prog || "Detalles del programa"}
                className="container-xxxl"
            />

            <Modal isOpen={modal?.isOpen} size={modal?.size}>
                <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                <ModalBody>{modal?.children}</ModalBody>
                {modal?.footer}
            </Modal>

            <Alert {...alertData} />
            <Loader {...loading} />

            <div className="container-fluid container-xxxl">
                <div>
                    {!program ? <div className='p-5 mt-5'><Loader loaderAsModal={false} isOpen /></div>
                        : <>
                            <Offcanvas isOpen={!!(showSidePanel)} style={{ minWidth: "40%", width: "auto" }} fade>
                                <OffcanvasHeader toggle={() => { showAllEvents(false) }}>
                                    <span className='ps-3 border-start border-success border-4 py-1'>{showSidePanel?.title}</span>
                                </OffcanvasHeader>
                                <OffcanvasBody>{showSidePanel?.body}</OffcanvasBody>
                            </Offcanvas>
                            <Row>
                                <Col lg="6" className='mb-4'>
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
                                                            <td><b className="fw-semibold">Facultad</b></td>
                                                            <td>{program.facultad}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold text-nowrap">Código de programa</b></td>
                                                            <td>{program.cod_prog}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Estado</b></td>
                                                            <td className={classnames({ "text-danger fw-bold": program.est_prog === 0 })}>{program.estado}</td>
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
                                                            <td><b className="fw-semibold text-nowrap">Nivel de formación</b></td>
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
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between gap-3 mt-3'>
                                            <div>
                                                <Button size='sm' color='link' onClick={() => showProgramUsers()}>
                                                    Decanos y directores <ArrowRightShort size={16} />
                                                </Button>
                                            </div>
                                            {is_admin && <div className='d-flex gap-1'>
                                                <div className='text-end'>
                                                    <Button size='sm' color='danger' onClick={() => deleteProgram()}>
                                                        <i className='me-1'><XCircle size={15} /></i> Eliminar
                                                    </Button>
                                                </div>
                                                <div className='text-end'>
                                                    <Button size='sm' color='primary' onClick={() => updateProgramData()}>
                                                        <i className='me-1'><Edit size={15} /></i> Actualizar información
                                                    </Button>
                                                </div>
                                            </div>}
                                        </div>
                                    </Card>
                                </Col>
                                <Col lg="6" className='mb-4'>
                                    <Card className='h-100 justify-content-between'>
                                        <div>
                                            <div className='mb-4'>
                                                <div
                                                    className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2 d-inline-block'
                                                    style={{ borderRadius: "2px 10px 10px 2px" }}
                                                >
                                                    <small className='fw-bold text-uppercase '>RESOLUCIONES ACTIVAS</small>
                                                </div>
                                            </div>
                                        </div>
                                        <Resolutions
                                            actives={program.resoluciones?.filter(r => r.estado === 1)}
                                            program_id={program.id_prog}
                                            canEdit={is_admin}
                                            saveCallback={() => updateResolutionCallback(false)}>
                                            {(add, edit, hasActives) => (
                                                <div className='flex-grow-1 mt-3 d-flex justify-content-between gap-1 align-items-end'>
                                                    <div className='d-inline-block'>
                                                        {!!program.resoluciones?.length && <Button size='sm' color='link' onClick={() => showAllResolutions()}>
                                                            Ver todas las resoluciones <ArrowRightShort size={16} />
                                                        </Button>}
                                                    </div>
                                                    {is_admin && <>
                                                        {hasActives && <div className='ms-auto d-inline-block'>
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
                                                    <ProcessResumeItem process={p as I_Process} pickItem={() => navigate(`/proceso/${p.id_conv}`)} />
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
                                            callback={() => updateEventCallback(false)}
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