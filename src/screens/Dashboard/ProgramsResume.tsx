import React, { useEffect, useRef } from 'react';
import Card from "../../components/Card";
import classnames from "classnames";
import Loader from '../../components/Loader';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { GET_PROGRAMS_BY_STATE } from '../../services/endPointsService';
import { type I_Program } from '../../interfaces/programs.interface';
import { Badge } from 'reactstrap';
import { BsExclamationCircleFill, BsStack } from 'react-icons/bs';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getProgramsIndicators, setProgramsList, setProgramsSelectedFilter } from '../../store/slices/dashboardSlice';

const ProgramsResume = () => {

  const dispatch = useAppDispatch();
  const indicators = useAppSelector(s => s.dashboard.programsIndicators);
  const filter = useAppSelector(s => s.dashboard.programsSelectedFilter);
  const programsDictionary = useAppSelector(s => s.dashboard.programsList);
  const loadedList = useRef<{ [filter: string]: boolean }>({})

  const markAsLoadedList = (filter: string) => loadedList.current[filter] = true

  const programsList = filter ? programsDictionary[filter?.estado] : null;
  const navigate = useNavigate();

  const chooseFilter = (_filter: typeof filter) => {
    if ((_filter?.estado !== filter?.estado)) {
       
      dispatch(setProgramsSelectedFilter(_filter!))
    }
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
            <BsStack size={15} />
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
              <Badge color='warning'>{program.procesos} procesos</Badge>
            </div>}
            {!!(program.eventos) && <div>
              <Badge color='primary'>{program.eventos} eventos</Badge>
            </div>}
          </div>
        </div>
      </div>
    </React.Fragment>
  }

  useEffect(() => {
    dispatch(getProgramsIndicators(filter))
  }, [])

  useEffect(() => {
    const getPrograms = () => {
      const f = filter?.estado || "";
      if (loadedList.current[f]) return null;

      const url = `${GET_PROGRAMS_BY_STATE}${f}`;
      AXIOS_REQUEST(url).then(resp => {
        dispatch(setProgramsList(f, resp.data));
        markAsLoadedList(f)
      })
    }

    filter && getPrograms()
  }, [filter])

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
            {filter && <>
              <div
                className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2 d-inline-block'
                style={{ borderRadius: "2px 10px 10px 2px" }}
              >
                <small className='fw-bold text-uppercase  text-uppercase'>{filter?.texto}</small>
              </div>
              {programsDictionary[filter?.estado] && !loadedList.current[filter?.estado] &&
                <div className="d-inline-block float-end px-3">
                  <Loader isOpen loaderAsModal={false} size="sm" />
                </div>
              }
            </>
            }
          </div>
          <div className="pt-4 pb-2" style={{ minHeight: "37vh", overflowY: "auto", overflowX: "hidden" }}>
            {programsList ?
              (programsList.length ?
                <div style={{ maxHeight: "80vh" }}>
                  {programsList.map((item, i) => doItem(item, i))}
                </div>
                :
                <div className='py-5 text-center text-secondary'>
                  <p className='text-warning'><BsExclamationCircleFill size={30} /></p>
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
