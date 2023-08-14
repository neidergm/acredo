import React, { useEffect, useState } from 'react'
import { SubHeader } from '../../components/SubHeader'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { GET_PROGRAMS_LIST } from '../../services/endPointsService';
import { I_Program } from '../../interfaces/programs.interface';
import Loader from '../../components/Loader';
import { Button, Col, Offcanvas, OffcanvasBody, OffcanvasHeader, Row, Table } from 'reactstrap';
import { getNormalDate } from '../../utils/dateUtils';
import { ArrowRightShort, Edit, Kanban, Plus } from '../../components/Icons';
import { isAdmin } from '../../utils/userRolUtils';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ProcessResumeItem } from '../Dashboard/ProcessResume';
import ProgramEvent from '../../components/ProgramEvents';
import Resolutions from '../../components/Resolutions';

const EVENT_LIMITS_SHOW = 3;

const Details = () => {

    const navigate = useNavigate();
    const is_admin = isAdmin(useAppSelector(state => state.user.userInfo?.rol));

    const { id_program } = useParams();
    const [program, setProgram] = useState<I_Program | null>(null);
    const [showSidePanel, setShowSidePanel] = useState<null | { title: string; body: any; toggler: (close: boolean) => void }>(null);


    const getProgramInfo = () => {
        AXIOS_REQUEST(`${GET_PROGRAMS_LIST}/${id_program}`).then(resp => {
            setProgram(resp.data[0])
        })
    }

    const updateProgramData = () => {
        console.log(program)
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
                body: <Resolutions list={program.resoluciones} program_id={program.id_prog} canEdit={is_admin} />,
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

            <div className="container-xl">
                <div>
                    {!program ? <div className='p-5 mt-5'><Loader loaderAsModal={false} isOpen /></div>
                        : <>
                            <Offcanvas isOpen={!!(showSidePanel)} style={{ minWidth: "40%" }}>
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
                                                            <td>{program.id_prog}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Estado</b></td>
                                                            <td>{program.estado}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Ciudad</b></td>
                                                            <td>{program.ciud_prog}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b className="fw-semibold">Departamento</b></td>
                                                            <td>{program.depa_prog}</td>
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
                                        {is_admin && <div className='text-end mt-3'>
                                            <Button size='sm' color='primary' onClick={() => updateProgramData()}>
                                                <i className='me-1'><Edit size={15} /></i> Actualizar información
                                            </Button>
                                        </div>}
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
                                        <Resolutions current={program.resoluciones[0]} program_id={program.id_prog} canEdit={is_admin}>
                                            {(add, edit) => (
                                                <div className='flex-grow-1 mt-3 d-flex justify-content-between gap-1 align-items-end'>
                                                    <div className='d-inline-block'>
                                                        <Button size='sm' color='link' onClick={() => showAllResolutions()}>
                                                            Ver todas las resoluciones <ArrowRightShort size={16} />
                                                        </Button>
                                                    </div>
                                                    {is_admin && <>
                                                        <div className='ms-auto d-inline-block'>
                                                            <Button size='sm' color='primary' onClick={() => edit()}>
                                                                <i className='me-1'><Edit size={15} /></i> Editar
                                                            </Button>
                                                        </div>
                                                        <div className='d-inline-block'>
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
                                                <div className='p-5 text-center text-secondary'>
                                                    <p className='text-secondary'><Kanban size={30} /></p>
                                                    <span>No tiene procesos en curso</span>
                                                </div>
                                            }
                                        </div>
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