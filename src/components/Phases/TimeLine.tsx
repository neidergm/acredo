import React from 'react'
import { T_Stage } from '../../interfaces/phasesAndStages.interface'
import styles from './timeline.module.css';
import classnames from 'classnames';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils';
import { Badge, Button } from 'reactstrap';
import { Edit, Flag } from '../Icons';

const TimeLine = ({ list, canEdit, taskEnded }: { list: T_Stage[], canEdit: boolean, taskEnded?: boolean }) => {
    return (
        <div>
            {list.map(stage => <div>
                {/* <div className='d-flex justify-content-between px-4 py-3 my-3 position-relative bg-primary bg-opacity-10 rounded-3'> */}
                <div className='d-flex justify-content-between py-2 mb-3 mt-2 position-relative border-bottom'>
                    <div className={styles["stage-name"]}>
                        <i className='me-2 opacity-25'><Flag /></i>
                        <span className='text-secondary fw-bold opacity-50'>{stage.name}</span>
                    </div>
                    {/* {canEdit && <div className=''>
                        <div>
                            <Button size='sm' color='link' className='py-0 px-1' >
                                <Edit size={18} />
                            </Button>
                        </div>
                    </div>} */}
                </div>
                <div className='py-2'>
                    {stage.actions?.map(action => {
                        const dateDiff = getDateDiff(new Date(action.fecha_accion));

                        return <div key={stage.id} className={classnames(styles["event-item"])}>
                            <div className='d-flex align-items-center'>
                                <div className={classnames("bg-success bg-opacity-10 fw-semibold text-success text-opacity-75", styles["event-date"])}>
                                    <small>{getNormalDate(action.fecha_accion, { dateStyle: "full" })}</small>
                                </div>
                                <span className='opacity-75 d-none d-md-block'>
                                    {action.est_accion === 0 ?
                                        (taskEnded && <Badge className='float-end' pill>No se realizó</Badge>)
                                        : (action.est_accion === 2 ?
                                            <Badge pill color='success' className='float-end d-line-block'>Realizada</Badge> :
                                            <Badge pill color={dateDiff < 0 ? "danger" : "primary"} className='float-end d-line-block'>
                                                {dateDiff < 0 ? `Vencido hace ${dateDiff * -1} días` : `Vence ${dateDiff === 0 ? "hoy" : "en " + dateDiff + " días"}`}
                                            </Badge>)}
                                </span>
                            </div>

                            <div className='bg-light px-3 py-2 rounded-4 mt-1 d-inline-block'>
                                <p className='fw-semibold'>{action.nomb_accion}</p>
                                {/* {action.est_accion === 2 && <p>
                                        <b className='d-block'>Fecha de realización: </b>
                                        <span>
                                            {getNormalDate(action.marc_update, { dateStyle: "full", timeStyle: "short" })}
                                        </span>
                                    </p>} */}
                                <div className='text-secondary small'>
                                    {/* <b className='d-block small'>Responsables: </b> */}
                                    <ul className='ps-4'>
                                        {action.usuarios?.map((u, i) => <li key={i} title={u.nomb_cargo}>
                                            {u.responsable} <small className='opacity-50'> | {u.rol_nombre}</small></li>) || <li>Sin responsables</li>}
                                    </ul>
                                </div>
                            </div>
                            {/* {event.reco_evento && <div className='position-relative' title='Recordatorios'>
                            <CustomDropdown
                                options={
                                    [
                                        { text: `${event.reco_evento.length} Recordatorios`, optionProps: { header: true } },
                                        ...(event.reco_evento.map?.((e) => ({ text: `${e.num_dia} días antes del evento`, optionProps: { disabled: true } })) || [])
                                    ]
                                }                                >
                                <DropdownToggle size="sm" color='link' className='text-dark p-0 position-relative'>
                                    <span className="position-absolute top-0 start-100 translate-middle rounded-pill badge bg-warning bg-opacity-25">
                                        <span className='text-warning fw-bold'>{event.reco_evento.length}</span>
                                    </span>
                                    <i className='text-secondary'><History /></i>
                                </DropdownToggle>
                            </CustomDropdown>
                        </div>} */}

                        </div>
                    })}
                </div>
            </div>
            )}
        </div >
    )
}

export default TimeLine