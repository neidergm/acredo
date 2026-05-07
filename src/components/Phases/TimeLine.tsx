import { type T_Stage } from '../../interfaces/phasesAndStages.interface'
import styles from './timeline.module.css';
import classnames from 'classnames';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils';
import { Badge } from 'reactstrap';
import { BsCheckCircleFill, BsFlagFill } from 'react-icons/bs';

const TimeLine = ({ list, taskEnded }: { list: T_Stage[], canEdit: boolean, taskEnded?: boolean }) => {
    return (
        <div>
            {list.map(stage => <div>
                {/* <div className='d-flex justify-content-between px-4 py-3 my-3 position-relative bg-primary bg-opacity-10 rounded-3'> */}
                <div className='d-flex justify-content-between py-2 mb-3 mt-2 position-relative border-bottom'>
                    <div className={styles["stage-name"]}>
                        <i className='me-2 opacity-25'><BsFlagFill /></i>
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
                                <div className={classnames("bg-success bg-opacity-10 fw-semibold text-info text-opacity-75", styles["event-date"])}>
                                    <small>{getNormalDate(action.fecha_accion, { dateStyle: "full" })}</small>
                                </div>
                                <span className='opacity-75 d-none d-md-block'>
                                    {action.est_accion === 0 ?
                                        (taskEnded && <Badge className='float-end' pill>No se realizó</Badge>)
                                        : (action.est_accion !== 2 &&
                                            <Badge pill color={dateDiff < 0 ? "danger" : "primary"} className='float-end d-line-block'>
                                                {dateDiff < 0 ? `Vencido hace ${dateDiff * -1} días` : `Vence ${dateDiff === 0 ? "hoy" : "en " + dateDiff + " días"}`}
                                            </Badge>)}
                                </span>
                            </div>
                            <div className={classnames('d-xl-flex gap-2 justify-content-between align-items-center rounded-4', styles["hover-light"])}>
                                <div className='bg-light px-3 py-2 rounded-4 mt-1 d-inline-block'>
                                    <p className='fw-semibold'>{action.nomb_accion}</p>
                                    <div className='text-secondary small'>
                                        <ul className='ps-4'>
                                            {action.usuarios?.map((u, i) => <li key={i} title={u.nomb_cargo}>
                                                {u.responsable} <small className='opacity-50'> | {u.rol_nombre}</small></li>) || <li>Sin responsables</li>}
                                        </ul>
                                    </div>
                                </div>

                                {action.est_accion === 2 && <>
                                    <div className='flex-grow-1'><hr /></div>
                                    <div className={classnames('small text-secondary opacity-75 mt-2 position-lg-absolute end-0 top-50 align-middle', styles["marc-temp"])}>
                                        <div className='d-flex align-items-center gap-2'>
                                            <div className='text-success'><BsCheckCircleFill size={16} /></div>
                                            <div>
                                                <small>Realizada el {getNormalDate(action.marc_update, { dateStyle: "long", timeStyle: "short" })}</small>
                                                {action.usua_finalizar && <small className='d-block'>Por el usuario {action.usua_finalizar}</small>}
                                            </div>
                                        </div>
                                    </div>
                                </>}
                            </div>
                        </div>
                    })}
                </div>
            </div>
            )}
        </div >
    )
}

export default TimeLine