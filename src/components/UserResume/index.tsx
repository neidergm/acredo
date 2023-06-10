import React, { useState } from 'react'
import { T_PhasesWithConditions } from '../../interfaces/phasesAndStages.interface'
import { Alert, Input, Table } from 'reactstrap'
import classnames from 'classnames'
import { I_Condition } from '../../interfaces/conditions.interface'

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
                    let cond = condiciones?.map(cond => {
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
            {(!!(filter) ? list : _list)
                .map((phase) => {
                    return <div className="pb-5" key={phase.id_fase}>
                        <Table responsive className="align-middle">
                            <thead>
                                <tr className="bg-secondary text-white">
                                    <th colSpan={4} className="text-center">{phase.nomb_fase}</th>
                                </tr>
                                <tr className="bg-secondary bg-opacity-25 border">
                                    <th className="fw-semibold w-25">Tarea</th>
                                    <th className="fw-semibold w-25">Usuario</th>
                                    <th className="fw-semibold">Rol</th>
                                    <th className="fw-semibold">Acción (Etapa)</th>
                                </tr>
                            </thead>
                            <tbody className="border">
                                {phase.condiciones?.map(cond =>
                                    cond.resumen_usuario?.length ?
                                        cond.resumen_usuario.map((u, i) => {
                                            return <tr
                                                key={i}
                                                className={classnames("small", i + 1 === cond.resumen_usuario.length ? "border-bottom" : "border-light")}
                                            >
                                                {i === 0 &&
                                                    <td className="fw-semibold bg-light cursor-pointer border-bottom"
                                                        onClick={() => goToConditionDetailsScreen?.(cond)}
                                                        rowSpan={cond.resumen_usuario.length}>{cond.nomb_cond}
                                                    </td>
                                                }
                                                <td className="">{u.nomb_resp}</td>
                                                <td className="">{u.nomb_rol}</td>
                                                <td className="">{u.accion}</td>
                                            </tr>
                                        }) : <tr className="small" >
                                            <td className="fw-semibold bg-light cursor-pointer border-bottom"
                                                onClick={() => goToConditionDetailsScreen?.(cond)}>{cond.nomb_cond}
                                            </td>
                                            <td className="text-danger">No hay usuarios asociados</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                })
            }
        </div>
    )
}

export default UserResume