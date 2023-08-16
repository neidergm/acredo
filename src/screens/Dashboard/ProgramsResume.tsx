import React, { useState, useEffect } from 'react';
import Card from "../../components/Card";
import classnames from "classnames";
import Loader from '../../components/Loader';
import { I_ProgramsIndicators } from '../../interfaces/dashboard.interface';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { GET_PROGRAMS_BY_STATE, GET_PROGRAMS_INDICATORS } from '../../services/endPointsService';
import { I_Program } from '../../interfaces/programs.interface';
import { Badge } from 'reactstrap';
import { ExclamationCircleFill, JournalBoomark, Stack } from '../../components/Icons';
import { useNavigate } from 'react-router-dom';

const ProgramsResume = () => {

  const [indicators, setIndicators] = useState<I_ProgramsIndicators[] | null>(null);
  const [filter, setFilter] = useState<I_ProgramsIndicators | null>(null);
  const [programsList, setProgramsList] = useState<I_Program[] | null>(null)

  const navigate = useNavigate();

  const chooseFilter = (_filter: typeof filter) => {
    if (_filter?.estado !== filter?.estado) {
      setProgramsList(null)
      setFilter(_filter)
      getPrograms(_filter)
    }
  }

  const getIndicators = () => {
    AXIOS_REQUEST(GET_PROGRAMS_INDICATORS).then(resp => {
      setIndicators(resp.data)
      chooseFilter(resp.data[0])
    })
  }

  const getPrograms = (_filter: typeof filter) => {
    // const url = (indicators && _filter?.estado !== indicators?.[0].estado) ? `${GET_PROGRAMS_BY_STATE}${_filter?.estado}` : GET_PROGRAMS_LIST
    const url = `${GET_PROGRAMS_BY_STATE}${_filter?.estado}`
    AXIOS_REQUEST(url).then(resp => {
      setProgramsList(resp.data)
    })
  }

  const pickItem = (program: I_Program) => {
    navigate(`programa/${program.id_prog}`)
  }

  const doItem = (program: I_Program, idx: number) => {
    return <React.Fragment key={`${program.id_prog}-${idx}`}>
      {idx !== 0 && <div className='mx-3 opacity-50'><hr className='border-secondary' /></div>}
      <div className="mx-3 cursor hover-scale-up" onClick={() => pickItem(program)}>
        <div className='mb-2'>
          <i className='me-2 text-primary opacity-50'>
            <Stack size={15} />
          </i>
          <small>{program.nomb_prog} <span className='opacity-50 fw-semibold small'>({program.cod_prog})</span></small>
        </div>
        <div className="gap-3 d-flex flex-column flex-md-row">
          <div className="flex-grow-1">
            <div className='d-flex text-secondary text-opacity-75 gap-3 small'>
              <div>
                <b className="small d-block">Estado: </b>
                <small>{program.estado}</small>
              </div>
              <div>
                <b className="small d-block">SNIES: </b>
                <small>{program.cod_snies || "00000"}</small>
              </div>
              {!!(program.nivel_prog) && <div>
                <b className="small d-block">Nivel: </b>
                <small>{program.nivel_prog}</small>
              </div>
              }
              {!!(program.ciud_prog) && <div>
                <b className="small d-block">Sede: </b>
                <small>{program.nomb_ciud} | {program.nomb_depa}</small>
              </div>}
            </div>
          </div>
          <div>
            {!!(program.procesos) && <div>
              <Badge color='warning'>{program.procesos.length} procesos</Badge>
            </div>}
            {!!(program.eventos) && <div>
              <Badge color='primary'>{program.eventos.length} eventos</Badge>
            </div>}
          </div>
        </div>
      </div>
    </React.Fragment>
  }

  useEffect(() => {
    getIndicators()
  }, [])

  return (
    <>
      <div className="pb-2 ps-2">
        <span className="text-secondary fw-semibold opacity-50">
          <span className="">
            RESUMEN DE PROGRAMAS
          </span>
        </span>
      </div>
      <div>
        <Card className="px-4 position-relative">
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
          <div className='ps-3'>
            {filter && <div
              className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2 d-inline-block'
              style={{ borderRadius: "2px 10px 10px 2px" }}
            >
              <small className='fw-bold text-uppercase  text-uppercase'>{filter?.texto}</small>
            </div>}
          </div>
          <div className="pt-4 pb-2" style={{ minHeight: "37vh", overflowY: "auto", overflowX: "hidden" }}>
            {programsList ?
              (programsList.length ?
                <div style={{ maxHeight: "80vh" }}>
                  {programsList.map((item, i) => doItem(item, i))}
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
        </Card>
      </div>
    </>
  )
}

export default ProgramsResume