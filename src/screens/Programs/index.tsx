import { useEffect, useRef, useState } from 'react'
import { SubHeader } from '../../components/SubHeader'
import { I_Program } from '../../interfaces/programs.interface';
import Loader from '../../components/Loader';
import { ExclamationCircleFill } from '../../components/Icons';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { GET_PROGRAMS_LIST } from '../../services/endPointsService';
import Card from '../../components/Card';
import { Badge, CardBody, CardHeader } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getNormalDate } from '../../utils/dateUtils';

type T_Filter = {
    [key: string]: {
        label: string;
        values?: Array<string>; //For selects
        selectedValue: string;
    }
}

const Programs = () => {

    const [programsList, setProgramsList] = useState<null | I_Program[]>();
    const fetchedList = useRef<I_Program[]>([])
    const navigate = useNavigate();

    const [filter, setFilter] = useState<T_Filter>({
        nomb_prog: {
            label: "Buscar por nombre",
            selectedValue: ""
        },
        estado: {
            label: "Estado",
            values: [],
            selectedValue: ""
        },
        ciud_prog: {
            label: "Ciudad",
            values: [],
            selectedValue: ""
        }
    })

    const doFilter = (value: string, property: string, list = fetchedList.current) => {
        const f = filter;
        f[property].selectedValue = value;

        const keys = Object.keys(f).filter(i => !!(f[i].selectedValue));

        if (!keys.length) return list;
        return list.filter(p => keys.every(k => f[k].values ? !!((p as any)[k] === f[k].selectedValue) : new RegExp(f[k].selectedValue, "i").test((p as any)[k])))
    }

    const searchByFilter = (value: string, property: string) => {
        setProgramsList(doFilter(value, property))
    }

    useEffect(() => {
        AXIOS_REQUEST(GET_PROGRAMS_LIST).then(resp => {
            fetchedList.current = resp.data;
            setProgramsList(resp.data)

            const f = filter;
            for (let i = 0; i < resp.data.length; i++) {
                const p = resp.data[i];

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
    }, [])

    return (
        <>
            <SubHeader
                showBackButton
                text="Programas"
                className="container-xl"
            />

            <div className="container-xl">
                <div className='d-flex gap-3 mb-4 align-items-center flex-wrap'>
                    {Object.keys(filter)
                        .map(f => <div key={f}>
                            <label htmlFor={f} className="form-label small">{filter[f].label}</label>
                            {!filter[f].values ?
                                <input
                                    placeholder='Búsqueda'
                                    className='form-control'
                                    type='search'
                                    style={{ width: "200px" }}
                                    onChange={e => searchByFilter(e.target.value, f)}
                                />
                                :
                                <select id={f} className='form-select w-auto border text-secondary' onChange={e => searchByFilter(e.target.value, f)}>
                                    <option value="">Filtrar</option>
                                    {filter[f].values!.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            }
                        </div>)}
                    <div className='flex-grow-1 small text-secondary text-end'>
                        <b className='d-block'>{programsList?.length}</b>
                        <span>programas</span>
                    </div>
                </div>
                <div className="mb-5">
                    {programsList ?
                        (programsList.length ?
                            <div className='row h-100'>
                                {programsList
                                    .map((item, i) => <div className='col-12 col-sm-6 col-xl-4 mb-4' key={`${item.id_prog}-${i}`}>
                                        <Card className='h-100 p-0 hover-scale-up' onClick={() => navigate(`${item.id_prog}`)}>
                                            <CardHeader className='bg-success text-white border-0 py-3'>
                                                <div style={{ minHeight: "2rem" }} className='d-flex align-items-center'>
                                                    <h6 className='lh-1 m-0 align-middle'>{item.nomb_prog}</h6>
                                                </div>
                                            </CardHeader>
                                            <CardBody className=''>
                                                <div className='row'>
                                                    <div className='col-auto small text-secondary text-center text-wrap'>
                                                        <div className='mb-2'>
                                                            <b className='d-block'>Código</b>
                                                            <span>{item.id_prog}</span>
                                                        </div>
                                                        <div className='mb-2'>
                                                            <b className='d-block'>SNIES</b>
                                                            <span>{item.resoluciones?.[0]?.cod_snies || "00000"}</span>
                                                        </div>
                                                        <div className='mb-2'>
                                                            <b className='d-block'>Estado</b>
                                                            <span >{item.estado}</span>
                                                        </div>
                                                    </div>

                                                    <div className='vr p-0 bg-secondary opacity-10'></div>

                                                    <div className='col small'>
                                                        <div className='mb-1'>
                                                            <b>Ciudad: </b>
                                                            <span>{item.ciud_prog} | {item.depa_prog}</span>
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
                                                            <span >{getNormalDate(item.fech_reso, { dateStyle: "long" })}</span>
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
                                    </div>)}
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