import { useEffect, useState } from 'react'
import { SubHeader } from '../../components/SubHeader'
import { I_Program } from '../../interfaces/programs.interface';
import Loader from '../../components/Loader';
import { ExclamationCircleFill } from '../../components/Icons';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { GET_PROGRAMS_LIST, SAVE_PROGRAM_DATA } from '../../services/endPointsService';
import Card from '../../components/Card';
import { Badge, Button, CardBody, CardHeader } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils';
import { Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON, closeModal } from '../../components/Modal';
import Alert, { I_AlertObject } from '../../components/Alert';
import Form from 'react-ngm-form';
import programForm from '../../forms/program.form';
import { jsonToFormData } from '../../utils/formUtils';
import { I_JSONObject } from '../../interfaces/generic.interface';
import { toast } from 'react-hot-toast';
import classnames from 'classnames';
import { isAdmin } from '../../utils/userRolUtils';
import { useAppSelector } from '../../hooks/useAppSelector';
import ProgramFilter from '../../components/ProgramFilter';
import CustomDropdown from '../../components/CustomDropdown';

const Programs = () => {

    const [programsList, setProgramsList] = useState<null | I_Program[]>(null);
    const navigate = useNavigate();

    const is_admin = isAdmin(useAppSelector(s => s.user.userInfo?.rol));

    const [modal, setModal] = useState<T_ModalJSON | null>(null)
    const [alert, setAlert] = useState<I_AlertObject | null>(null)
    const [loader, setLoader] = useState<string | null>(null)

    const newProgram = () => {
        const FORM_ID = "PROGRAM_FORM";
        const defaultValues = {};

        const form = programForm(defaultValues)

        setModal({
            isOpen: true,
            title: "Registrar programa",
            size: "lg",
            children: <>
                <Form
                    formProps={{ id: FORM_ID }}
                    defaultValues={defaultValues}
                    onSubmit={data => {
                        setAlert({
                            isOpen: true,
                            type: "question",
                            title: `¿Está seguro?`,
                            subtitle: "Se registrará un nuevo programa",
                            closeButton: { value: "No, cancelar" },
                            onClosed: () => closeModal(setAlert),
                            submitButton: {
                                value: "Sí, registrar", onClick: () => {
                                    saveProgramData(data);
                                    closeModal(setAlert)
                                }
                            }
                        })
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
        setLoader("Registrando programa")
        departamento && (data.depa_prog = departamento);

        AXIOS_REQUEST(SAVE_PROGRAM_DATA, "POST", jsonToFormData(data, "[0].")).then(resp => {
            toast.success("Programa registrado correctamente", { position: 'top-right' })
            closeModal(setModal);
            getPrograms();
        }).catch(err => {
            toast.error("No se pudo registrar el programa", { position: 'top-right' })
        }).finally(() => {
            setLoader(null)
        })
    }

    const getPrograms = () => {
        setProgramsList(null)
        AXIOS_REQUEST(GET_PROGRAMS_LIST).then(resp => {
            setProgramsList(resp.data)
        })
    }

    useEffect(() => {
        getPrograms()
    }, [])

    return (
        <>
            <SubHeader
                showBackButton
                text="Programas"
                className="container-xxxl"
            />

            <Loader isOpen={!!(loader)} subtitle={loader}></Loader>
            <Modal isOpen={modal?.isOpen} size={modal?.size}>
                <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                <ModalBody>{modal?.children}</ModalBody>
                {modal?.footer}
            </Modal>

            <Alert isOpen={!!alert} {...alert} />

            <div className="container-fluid container-xxxl">
                {!!(programsList) && <>
                    <div className='mb-3'>

                        {is_admin && <div className='float-end'>
                            <Button color='primary' size='sm' onClick={() => newProgram()}>+ Nuevo programa</Button>
                        </div>}
                        <ProgramFilter list={programsList} updateList={l => setProgramsList(l)} />

                    </div>

                    <div className='mb-4 pt-2 d-inline-flex align-items-center gap-3 mb-4'>
                        <div className='d-inline-block'>
                            <div
                                className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 d-inline-block'
                                style={{ borderRadius: "2px 10px 10px 2px" }}
                            >
                                <small className='fw-semibold'>{programsList?.length} Programas encontrados</small>
                            </div>
                        </div>
                    </div>
                </>}
                <div className="mb-5">
                    {programsList ?
                        (programsList.length ?
                            <div className='row h-100'>
                                {programsList
                                    .map((item, i) => <div className='col-12 col-md-6 col-xl-4 mb-4' key={`${item.id_prog}-${i}`}>
                                        <Card className='h-100 p-0 hover-scale-up' onClick={() => navigate(`${item.id_prog}`)}>
                                            <CardHeader className={classnames("p-0", 'text-white border-0',
                                                {
                                                    "bg-success bg-opacity-75": item.est_prog === 1,
                                                    'bg-dark bg-opacity-25': item.est_prog === 0,
                                                })}>
                                                <div className='px-3 pt-3 pb-2'>
                                                    <div style={{ minHeight: "2rem" }} className='d-flex align-items-center'>
                                                        <h6 className='lh-1 m-0 align-middle'>{item.nomb_prog}</h6>
                                                    </div>
                                                </div>
                                                <div className='bg-dark bg-opacity-10 opacity-50 px-3 py-1 small text-truncate'>
                                                    <small className='text-white fw-semibold'>Facultad de <span className='text-lowercase'>{item.facultad}</span></small>
                                                </div>
                                            </CardHeader>
                                            <CardBody className=''>
                                                <div className='row'>
                                                    <div className='col-auto small text-secondary text-center text-wrap'>
                                                        <div className='mb-2'>
                                                            <b className='d-block'>Código</b>
                                                            <span>{item.cod_prog}</span>
                                                        </div>
                                                        <div className='mb-2'>
                                                            <b className='d-block'>SNIES</b>
                                                            <span>{item.cod_snies || "00000"}</span>
                                                        </div>
                                                        <div className='mb-2'>
                                                            <b className='d-block'>Estado</b>
                                                            <span >{item.estado}</span>
                                                        </div>
                                                    </div>

                                                    <div className='vr p-0 bg-secondary bg-opacity-50'></div>

                                                    <div className='col small'>
                                                        {/* <div className='mb-1'>
                                                            <b>Facultad: </b>
                                                            <span>{item.facultad}</span>
                                                        </div> */}
                                                        <div className='mb-1'>
                                                            <b>Ciudad: </b>
                                                            <span>{item.nomb_ciud} | {item.nomb_depa}</span>
                                                        </div>
                                                        <div className='mb-1'>
                                                            <b>Nivel: </b>
                                                            <span>{item.nivel_prog}</span>
                                                        </div>
                                                        <div className='mb-1'>
                                                            <b>Formación: </b>
                                                            <span>{item.tform_prog}</span>
                                                        </div>
                                                        <div className='mb-1'>
                                                            <b>Modalidad: </b>
                                                            <span>{item.moda_prog}</span>
                                                        </div>
                                                        <div className='mb-1'>
                                                            <b>Resolución: </b>
                                                            {
                                                                item.fech_reso?.length ?
                                                                    (item.fech_reso.length === 1 ?
                                                                        <>
                                                                            <span>{item.fech_reso[0].reso_apro} - {item.fech_reso[0].reco_mim}</span>
                                                                            <p className='mb-0 text-secondary'>
                                                                                {
                                                                                    getDateDiff(item.fech_reso[0].fech_ven) >= 0 ?
                                                                                        <span>
                                                                                            Vigente hasta <span>{getNormalDate(item.fech_reso[0].fech_ven, { dateStyle: "long" })}</span>
                                                                                        </span>
                                                                                        :
                                                                                        <span className='text-danger fw-semibold'>
                                                                                            Vencida desde <span>{getNormalDate(item.fech_reso[0].fech_ven, { dateStyle: "long" })}</span>
                                                                                        </span>
                                                                                }
                                                                            </p>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <b className='text-secondary fw-semibold'>Tiene {item.fech_reso.length} resoluciones </b>
                                                                            <div className="hstack gap-2">
                                                                                {item.fech_reso.map(fr =>
                                                                                    <div title={"Vencida - " + fr.reco_mim} key={fr.reso_apro} className={classnames({ "text-danger fw-bold": getDateDiff(fr.fech_ven) >= 0 })}>
                                                                                        {fr.reso_apro}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </>
                                                                    )
                                                                    :
                                                                    <span className='text-warning'>Sin resoluciones</span>
                                                            }
                                                        </div>
                                                        <div className='text-end position-absolute end-0 pb-1 pe-1'>
                                                            {item.eventos?.length && <Badge color='primary' className='me-1'>
                                                                <span>{item.eventos.length} eventos</span>
                                                            </Badge>}
                                                            {item.procesos?.length && <Badge color='warning'>
                                                                <span>{item.procesos.length} proceso</span>
                                                            </Badge>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    )
                                }
                            </div>
                            :
                            <div className='py-5 text-center text-secondary'>
                                <p className='text-warning'><ExclamationCircleFill size={30} /></p>
                                Sin programas
                            </div>
                        )
                        :
                        <div className="p-5">
                            <Loader loaderAsModal={false} isOpen />
                        </div>
                    }
                </div>
            </div >
        </>
    )
}

export default Programs