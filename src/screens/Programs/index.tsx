import { useEffect, useRef, useState } from 'react'
import { SubHeader } from '../../components/SubHeader'
import { I_Program } from '../../interfaces/programs.interface';
import Loader from '../../components/Loader';
import { ExclamationCircleFill } from '../../components/Icons';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { GET_PROGRAMS_LIST, SAVE_PROGRAM_DATA } from '../../services/endPointsService';
import Card from '../../components/Card';
import { Badge, Button, CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap';
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
import { isAdmin, isSupervisor } from '../../utils/userRolUtils';
import { useAppSelector } from '../../hooks/useAppSelector';

type T_Filter = {
    [key: string]: {
        label: string;
        values?: Array<string>; //For selects
        selectedValue: string;
    }
}

// const est_resolution_colors: any = {
//     "Vencida": "danger",
//     "Sin resolución": "warning",
//     "Activa": "success"
// };

const Programs = () => {

    const [programsList, setProgramsList] = useState<null | I_Program[]>();
    const fetchedList = useRef<I_Program[]>([])
    const navigate = useNavigate();

    const is_admin = isAdmin(useAppSelector(s => s.user.userInfo?.rol));

    const [modal, setModal] = useState<T_ModalJSON | null>(null)
    const [alert, setAlert] = useState<I_AlertObject | null>(null)
    const [loader, setLoader] = useState<string | null>(null)

    const [filter, setFilter] = useState<T_Filter>({
        nomb_prog: {
            label: "Buscar por nombre",
            selectedValue: ""
        },
        est_resolution: {
            label: "Resolución",
            values: [],
            selectedValue: ""
        },
        estado: {
            label: "Estado",
            values: [],
            selectedValue: ""
        },
        nomb_ciud: {
            label: "Ciudad",
            values: [],
            selectedValue: ""
        },
        nivel_prog: {
            label: "Nivel",
            values: [],
            selectedValue: ""
        },
        moda_prog: {
            label: "Modalidad",
            values: [],
            selectedValue: ""
        },
        facultad: {
            label: "Facultad",
            values: [],
            selectedValue: ""
        },
    })

    const doFilter = (value: string, property: string, list = fetchedList.current) => {
        const f = filter;
        f[property].selectedValue = value;

        const keys = Object.keys(f).filter(i => !!(f[i].selectedValue));

        if (!keys.length) return list;
        setFilter({ ...f })
        return list.filter(p => keys.every(k => f[k].values ? !!((p as any)[k] === f[k].selectedValue) : new RegExp(f[k].selectedValue, "i").test((p as any)[k])))
    }

    const searchByFilter = (value: string, property: string) => {
        setProgramsList(doFilter(value, property))
    }

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
            fetchedList.current = resp.data;
            setProgramsList(resp.data)

            const f = filter;
            for (let i = 0; i < resp.data.length; i++) {
                const p: I_Program = resp.data[i];
                p.est_resolution = p.fech_reso ? (getDateDiff(p.fech_reso, new Date()) < 0 ? "Vencida" : "Activa") : "Sin resolución";
                for (const key in filter) {
                    if (f[key].values) {
                        const val = (p as any)[`${key}`];
                        if (!!val && !f[key].values!.includes(val))
                            f[key].values!.push(val);
                    }
                }
            }
            setFilter(f)
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
                {!!(fetchedList.current.length) && !!(programsList) && <> <div className='d-flex flex-column-reverse flex-xl-row'>
                    <div className='d-flex gap-3 mb-3 align-items-center flex-wrap'>
                        {Object.keys(filter).map(f => <div key={f}>
                            {!filter[f].values ?
                                <>
                                    <label htmlFor={f} className="form-label small mb-1">{filter[f].label}</label>
                                    <input
                                        placeholder='Búsqueda'
                                        className='form-control'
                                        type='search'
                                        style={{ width: "200px" }}
                                        onChange={e => searchByFilter(e.target.value, f)}
                                    />
                                </>
                                :
                                !!((filter[f].values?.length || 0) > 1) && <>
                                    <label htmlFor={f} className="form-label small mb-1">{filter[f].label}</label>
                                    <select value={filter[f].selectedValue} id={f} className='form-select w-auto border text-secondary' onChange={e => searchByFilter(e.target.value, f)}>
                                        <option value="">Filtrar</option>
                                        {filter[f].values!.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </>
                            }
                        </div>)
                        }
                    </div>
                    {is_admin && <div className='flex-grow-1 mb-2 text-end'>
                        <Button color='primary' size='sm' onClick={() => newProgram()}>+ Nuevo programa</Button>
                    </div>}
                </div>
                    <div className='mb-4 pt-2 d-inline-flex align-items-center gap-3 mb-2'>
                        <div className='d-inline-block'>
                            <div
                                className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 d-inline-block'
                                style={{ borderRadius: "2px 10px 10px 2px" }}
                            >
                                <small className='fw-semibold'>{programsList?.length} Programas filtrados</small>
                            </div>
                        </div>
                        {/* {filter.est_resolution.values?.length && <div className='d-inline-flex gap-1'>
                            {filter.est_resolution.values.map((e, i) => <div key={i}>
                                <UncontrolledTooltip target={`BTN_ID_${i}`}>Estado de resolución: {e}</UncontrolledTooltip>
                                <Button className="opacity-75 p-2 rounded-circle" active={e === filter.est_resolution.selectedValue}
                                    onClick={() => searchByFilter(e, "est_resolution")}
                                    id={`BTN_ID_${i}`} color={`${est_resolution_colors[e]}`}></Button>
                            </div>
                            )}
                        </div>} */}
                    </div>
                </>}
                <div className="mb-5">
                    {programsList ?
                        (programsList.length ?
                            <div className='row h-100'>
                                {programsList
                                    .map((item, i) => <div className='col-12 col-sm-6 col-xl-4 mb-4' key={`${item.id_prog}-${i}`}>
                                        <Card className='h-100 p-0 hover-scale-up' onClick={() => navigate(`${item.id_prog}`)}>
                                            <CardHeader className={classnames('text-white border-0 py-3',
                                                {
                                                    "bg-success bg-opacity-75": item.est_prog === 1,
                                                    'bg-dark bg-opacity-25': item.est_prog === 0,
                                                })}>
                                                <div style={{ minHeight: "2rem" }} className='d-flex align-items-center'>
                                                    <h6 className='lh-1 m-0 align-middle'>{item.nomb_prog}</h6>
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

                                                    <div className='vr p-0 bg-secondary opacity-10'></div>

                                                    <div className='col small'>
                                                        <div className='mb-1'>
                                                            <b>Facultad: </b>
                                                            <span>{item.facultad}</span>
                                                        </div>
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
                                                            <b
                                                                className={classnames({
                                                                    'text-danger': item.est_resolution === "Vencida",
                                                                })}
                                                            >
                                                                Resolución hasta: </b>
                                                            <span>{
                                                                item.fech_reso ?
                                                                    <span className={classnames({
                                                                        'text-danger': item.est_resolution === "Vencida"
                                                                    })}>
                                                                        {getNormalDate(item.fech_reso, { dateStyle: "long" })} &nbsp;
                                                                        {item.est_resolution === "Vencida" && <Badge color='danger'>Vencida</Badge>}
                                                                    </span>
                                                                    :
                                                                    <span className='text-warning'>{item.est_resolution}</span>
                                                            }
                                                            </span>
                                                        </div>
                                                        <div className='text-end'>
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
            </div>
        </>
    )
}

export default Programs