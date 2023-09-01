import { useState } from 'react'
import { T_PhasesWithConditions } from '../../interfaces/phasesAndStages.interface'
import { AccordionBody, AccordionHeader, Alert, Input, Table, UncontrolledAccordion } from 'reactstrap'
import classnames from 'classnames'
import { I_Condition } from '../../interfaces/conditions.interface'
import { isLead } from '../../utils/userRolUtils'
import style from './style.module.css';

type T_Props = {
    list: T_PhasesWithConditions[],
    goToConditionDetailsScreen?: (cond: I_Condition) => void
}

const UserResume = ({ list: _list, goToConditionDetailsScreen }: T_Props) => {
    const [filter, setFilter] = useState("");
    const [list, setList] = useState<typeof _list>([]);

    const filterItems = (val: string) => {
        setFilter(val)

        if (val === "") setList([])
        else
            setList(
                _list.reduce((p, { condiciones, ...ph }) => {
                    const cond = condiciones?.map(cond => {
                        return {
                            ...cond,
                            resumen_usuario: cond.resumen_usuario?.filter((i) => new RegExp(`${val}`, "gi").test(`${i.nomb_resp} | ${i.nomb_rol} | ${i.accion}`))
                        }
                    }).filter(i => !!(i.resumen_usuario?.length)) || null
                    return !(cond?.length) ? p : [...p, { ...ph, condiciones: cond }];
                }, [] as typeof list)
            )
    }

    if (!(_list?.length)) {
        return <Alert color='primary'>
            No nada para mostrar con el filtro "<i className='fw-semibold'>{filter}</i>"
        </Alert>
    }

    return (
        <div>
            <div className='text-end mb-3 row justify-content-end'>
                <div className='col-md-6 col-lg-5 col-xl-4'>
                    <Input placeholder='Filtrar usuario, rol o acción (etapa)' className='ms-auto'
                        type='search'
                        onChange={(e) => filterItems(e.target.value)} />
                </div>
            </div>
            {
                !!(filter) && !(list?.length) && <Alert color='primary'>
                    No nada para mostrar con el filtro "<i className='fw-semibold'>{filter}</i>"
                </Alert>
            }
            {(!(filter) ? _list : list)
                .map((phase) => {
                    return <UncontrolledAccordion stayOpen defaultOpen={_list.length === 1 ? `${_list[0].id_fase}` : undefined} className={style["item-list"]}>
                        <AccordionHeader targetId={`${phase.id_fase}`} key={phase.id_fase}>
                            <b className='opacity-50 me-2'>FASE: </b>  <b>{phase.nomb_fase}</b>
                        </AccordionHeader>
                        <AccordionBody accordionId={`${phase.id_fase}`} className='p-0' >
                            <Table responsive className="align-middle p-0" >
                                <thead>
                                    <tr className="bg-secondary bg-opacity-25 border">
                                        <th className="fw-semibold w-25">Tarea</th>
                                        <th className="fw-semibold w-25">Responsable</th>
                                        <th className="fw-semibold">Acción (Etapa)</th>
                                    </tr>
                                </thead>
                                <tbody className="border">
                                    {phase.condiciones?.map(cond =>
                                        cond.resumen_usuario?.length ?
                                            cond.resumen_usuario?.map((u, i) => {
                                                return <tr
                                                    key={`${phase.id_fase}-${i}`}
                                                    className={classnames("small", i + 1 === cond.resumen_usuario.length ? "border-bottom" : "border-light")}
                                                >
                                                    {i === 0 &&
                                                        <td className="fw-semibold bg-light cursor-pointer border-bottom"
                                                            onClick={() => goToConditionDetailsScreen?.(cond)}
                                                            rowSpan={cond.resumen_usuario.length}>
                                                            <p>{cond.nomb_cond}</p>
                                                            <div className='fw-normal'>
                                                                <b className='fw-normal bg-primary text-white opacity-75 rounded px-2'>Líderes</b>
                                                                <ol className='list-group text-muted list-group-numbered opacity-75'>
                                                                    {cond.usuarios?.map(u => isLead(u.rol) ?
                                                                        <li key={u.id_rc} className='list-group-item p-0 bg-transparent border-0'>{u.responsable}</li>
                                                                        : null)
                                                                    }
                                                                </ol>
                                                            </div>
                                                        </td>
                                                    }
                                                    <td className="">{u.nomb_resp}</td>
                                                    <td className="">{u.accion}</td>
                                                </tr>
                                            })
                                            : <tr className="small" key={`${phase.id_fase}-${cond.cod_cond}`}>
                                                <td className="fw-semibold bg-light cursor-pointer border-bottom"
                                                    onClick={() => goToConditionDetailsScreen?.(cond)}>{cond.nomb_cond}
                                                </td>
                                                <td className="text-danger">No hay usuarios asociados</td>
                                                <td></td>
                                            </tr>
                                    )}
                                </tbody>
                            </Table>
                        </AccordionBody>
                        {/* </div> */}
                    </UncontrolledAccordion>
                })
            }
        </div >
    )
}

export default UserResume