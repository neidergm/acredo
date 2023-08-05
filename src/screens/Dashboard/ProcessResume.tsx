import React, { useState, useEffect } from "react"
import Card from "../../components/Card"
import { I_ProcessIndicators } from "../../interfaces/dashboard.interface";
import Loader from "../../components/Loader";
import classnames from "classnames";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { GET_PROCESS_BY_STATE, GET_PROCESS_INDICATORS, PROCESS_LIST } from "../../services/endPointsService";
import { I_Process } from "../../interfaces/process.interface";
import CircleProgress from "../../components/CircleProgress";
import { ExclamationCircleFill } from "../../components/Icons";
import { useNavigate } from "react-router-dom";

const ProcessResume = () => {

    const [indicators, setIndicators] = useState<I_ProcessIndicators[] | null>(null);
    const [filter, setFilter] = useState<I_ProcessIndicators | null>(null);
    const [processList, setProcessList] = useState<I_Process[] | null>(null)

    const navigate = useNavigate();

    const chooseFilter = (_filter: typeof filter) => {
        setProcessList(null)
        setFilter(_filter)
        getProcess(_filter)
    }

    const getIndicators = () => {
        AXIOS_REQUEST(GET_PROCESS_INDICATORS).then(resp => {
            setIndicators(resp.data)
            chooseFilter(resp.data[0])
        })
    }

    const getProcess = (_filter: typeof filter) => {
        const url = (indicators && _filter?.estado !== indicators?.[0].estado) ? `${GET_PROCESS_BY_STATE}${_filter?.estado}` : PROCESS_LIST
        AXIOS_REQUEST(url).then(resp => {
            setProcessList(resp.data)
        })
    }

    const doItem = (process: I_Process, idx: number) => {
        return <React.Fragment key={`${process.id_conv}-${idx}`}>
            {idx !== 0 && <div className='mx-3 opacity-50'><hr className='border-secondary' /></div>}
            <div className="mx-3 cursor hover-scale-up" onClick={() => pickItem(process)}>
                <div className='mb-2'>
                    <small>{process.nomb_conv}</small>
                </div>
                <div className="gap-3 d-flex flex-column flex-md-row">
                    <div>
                        <CircleProgress
                            progress={process.porcentaje || 0}
                            stroke={5}
                            radius={30}
                            color={process.porcentaje >= 100 ? "#0d6efd" : undefined}
                            content={<small>{process.porcentaje || 0}%</small>}
                        />
                    </div>
                    <div className="flex-grow-1">
                        <div className='d-flex flex-column text-secondary text-opacity-75'>
                            <div>
                                <b className="small">Sede: </b>
                                <small>{process.sede}</small>
                            </div>
                            {!!(process.id_prog) && <div>
                                <b className="small">Programa: </b>
                                <small>{process.programa}</small>
                            </div>
                            }
                            {!!(process.fase_actual) && <div>
                                <b className="small">Fase actual: </b>
                                <small>{process.fase_actual}</small>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }

    const pickItem = (process: I_Process) => {
        navigate(`proceso/${process.id_conv}`)
    }

    useEffect(() => {
        getIndicators()
    }, [])

    return (<>
        <div>
            <Card className="px-4">
                <div className='row h-100'>
                    {indicators ?
                        indicators.map(i => {
                            const notActive = i.estado !== filter?.estado;
                            const cols = Math.round(12 / indicators.length)
                            return <div className={`col-6 col-md-${cols} col-lg-6 col-xl-${cols} px-0`} key={i.estado}>
                                <Card
                                    className={classnames("h-100 cursor-pointer", { "bg-primary bg-opacity-10": !notActive, "shadow-none": notActive })}
                                    onClick={() => chooseFilter(i)}
                                >
                                    <div className='d-flex flex-xl-column gap-3 align-items-center text-xl-center h-100 justify-content-xl-between'>
                                        <h1 className={classnames("mb-0 fw-bold text-dark", { "text-opacity-75": notActive })}>{i.cantidad}</h1>
                                        <span style={{ height: "48px", display: "contents" }}
                                            className={classnames("text-dark vertical-align-middle", { "text-opacity-75": notActive })}>
                                            {i.texto || i.estado}
                                        </span>
                                    </div>
                                </Card>
                            </div>
                        })
                        : <div className="p-5">
                            <Loader loaderAsModal={false} isOpen />
                        </div>
                    }
                </div>
            </Card>
        </div>
        <div className="mt-4">
            <Card className="px-0">
                <div className="ps-3">
                    {filter && <div
                        className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2 d-inline-block'
                        style={{ borderRadius: "2px 10px 10px 2px" }}
                    >
                        <small className='fw-bold text-uppercase  text-uppercase'>{filter?.texto}</small>
                    </div>}
                </div>
                <div className="pt-4 pb-2" style={{ minHeight: "37vh", overflowY: "auto", overflowX: "hidden" }}>
                    {processList ?
                        (processList.length ? <div style={{ maxHeight: "80vh" }}>
                            {processList.map((item, i) => doItem(item, i))}
                        </div>
                            :
                            <div className='py-5 text-center text-secondary'>
                                <p className='text-warning'><ExclamationCircleFill size={30} /></p>
                                Sin procesos
                            </div>
                        )
                        :
                        <div className="p-5">
                            <Loader loaderAsModal={false} isOpen />
                        </div>
                    }
                </div>
            </Card>
        </div>
    </>)
}

export default ProcessResume