import { T_Action } from '../../interfaces/phasesAndStages.interface';
import Card from '../Card';
import classnames from 'classnames';
import { Button } from 'reactstrap';
import { Edit, XCircle } from '../Icons';
import { getNormalDate } from '../../utils/dateUtils';

type T_Props = {
    data: T_Action;
    idx: number;
    onDelete: () => void;
    onEdit: () => void;
}

const Action = ({
    data,
    idx,
    onDelete,
    onEdit,
}: T_Props) => {
    return (<Card className='bg-light shadow-none mb-3' key={idx}>
        <div className='d-flex gap-2 justify-content-between'>
            <div className='flex-grow-1 d-flex gap-1'>
                <div>
                    <div className={
                        classnames(
                            'd-flex rounded-pill align-items-center pe-4 gap-2 bg-opacity-25',
                            data.est_accion === 2 ? "bg-success text-success" : "bg-secondary text-secondary"
                        )
                    }>
                        <div
                            className={
                                classnames('rounded-circle text-white position-relative d-inline-block',
                                    data.est_accion === 2 ? "bg-success" : " bg-dark bg-opacity-75"
                                )
                            }
                            style={{ padding: "14px" }}
                        >
                            <b className='fw-semibold position-absolute top-50 start-50 translate-middle'>{idx}</b>
                        </div>
                        <div>
                            <small className='fw-semibold ps-1'>
                                {data.est_accion === 2 ? "Realizado" : (data.est_accion === 1 ? "Notificado" : "Sin realizar")}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Button
                    size="sm"
                    disabled={data.est_accion === 2}
                    color='light'
                    className={
                        classnames('rounded-circle p-1 d-inline-flex align-items-center', { "opacity-25": data.est_accion === 2 })
                    }
                    onClick={onEdit}
                >
                    <Edit />
                </Button>
            </div>
            <div>
                <Button
                    size="sm"
                    color='light'
                    className={
                        classnames('text-danger rounded-circle p-1 d-inline-flex align-items-center', { "opacity-25": data.est_accion === 2 })
                    }
                    disabled={data.est_accion === 2}
                    onClick={onDelete}
                >
                    <XCircle />
                </Button>
            </div>
        </div>
        <div className='d-flex gap-3 mt-3'>
            <div className='d-flex gap-4 flex-wrap'>
                <div>
                    <small className='fw-semibold'>Nombre:</small>
                    <span className='d-block small'>{data.nomb_accion}</span>
                </div>
                <div>
                    <small className='fw-semibold'>Fecha límite:</small>
                    <span className='d-block small'>{getNormalDate(data.fecha_accion, { dateStyle: "long" })}</span>
                </div>
                <div>
                    <small className='fw-semibold'>Rol responsable:</small>
                    <span className='d-block small'>{data.rol_accion}</span>
                </div>
            </div>
        </div>
        <div className='mt-3'>
            <p className='mb-2'>
                <small className='fw-semibold'>Usuarios responsables:</small>
            </p>
            <ul className='ps-3 ms-1 mb-0'>
                {data.usuario?.split(",").map((user, i) => <li className='small' key={i}>{user}</li>) ||
                    <li className='small text-danger fw-semibold'>SIN RESPONSABLES ASIGNADOS</li>
                }
            </ul>
        </div>
    </Card>
    )
}

export default Action
