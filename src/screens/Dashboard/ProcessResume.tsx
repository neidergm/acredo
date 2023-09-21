import React, { useRef, useEffect } from "react"
import Card from "../../components/Card"
import Loader from "../../components/Loader";
import classnames from "classnames";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { GET_PROCESS_BY_STATE, PROCESS_LIST } from "../../services/endPointsService";
import { I_Process } from "../../interfaces/process.interface";
import CircleProgress from "../../components/CircleProgress";
import { ExclamationCircleFill } from "../../components/Icons";
import { useNavigate } from "react-router-dom";
import { getProcessIndicators, setProcessList, setProcessSelectedFilter } from "../../store/slices/dashboardSlice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";

export const ProcessResumeItem = ({ process, pickItem }: { process: I_Process, pickItem: (process: I_Process) => void }) => {
    return <div className="cursor hover-scale-up" onClick={() => pickItem(process)}>
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
                    {process.id_tcond === 2 ? <div className="small">
                        <b >Programa: </b>
                        <small>{process.programa}</small>
                    </div>
                        : <div className="small">
                            <b >Tipo: </b>
                            <small className="text-uppercase ">{process.tipo_cond}</small>
                        </div>
                    }
                    <div className="small">
                        <b>Sede: </b>
                        <small>{process.sede}</small>
                    </div>
                    {!!(process.fase_actual) && <div className="small">
                        <b>Fase actual: </b>
                        <small>{process.fase_actual}</small>
                    </div>
                    }
                </div>
            </div>
        </div>
    </div>
}

const ProcessResume = () => {

    const dispatch = useAppDispatch();
    const indicators = useAppSelector(s => s.dashboard.processIndicators);
    const filter = useAppSelector(s => s.dashboard.processSelectedFilter);
    const processDictionary = useAppSelector(s => s.dashboard.processList);
    const loadedList = useRef<{ [filter: string]: boolean }>({})

    const markAsLoadedList = (filter: string) => loadedList.current[filter] = true

    const processList = filter ? processDictionary[filter?.estado] : null;
    const navigate = useNavigate();

    const chooseFilter = (_filter: typeof filter) => {
        if ((_filter?.estado !== filter?.estado)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            dispatch(setProcessSelectedFilter(_filter!))
        }
    }

    const doItem = (process: I_Process, idx: number) => {
        return <React.Fragment key={`${process.id_conv}-${idx}`}>
            {idx !== 0 && <div className='mx-3 opacity-50'><hr className='border-secondary' /></div>}
            <div className="mx-3">
                <ProcessResumeItem process={process} pickItem={pickItem} />
            </div>
        </React.Fragment>
    }

    const pickItem = (process: I_Process) => {
        navigate(`proceso/${process.id_conv}`)
    }

    useEffect(() => {
        dispatch(getProcessIndicators(filter))
    }, [])

    useEffect(() => {
        const getProcess = () => {
            const f = filter?.estado || "Todos";
            if (loadedList.current[f]) return null;

            const url = f !== "Todos" ? `${GET_PROCESS_BY_STATE}${filter?.estado}` : PROCESS_LIST
            AXIOS_REQUEST(url).then(resp => {
                dispatch(setProcessList(f, resp.data));
                markAsLoadedList(f)
            })
        }

        filter && getProcess()
    }, [filter])

    return (<>
        <div className="pb-2 ps-2">
            <span className="text-secondary fw-semibold opacity-50">
                <span className="">
                    RESUMEN DE PROCESOS
                </span>
            </span>
        </div>
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
                    {filter && <>
                        <div
                            className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2 d-inline-block'
                            style={{ borderRadius: "2px 10px 10px 2px" }}
                        >
                            <small className='fw-bold text-uppercase text-uppercase'>{filter?.texto}</small>
                        </div>
                        {processDictionary[filter?.estado] && !loadedList.current[filter?.estado] &&
                            <div className="d-inline-block float-end px-3">
                                <Loader isOpen loaderAsModal={false} size="sm" />
                            </div>
                        }
                    </>}
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
