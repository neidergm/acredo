import React, { useState } from 'react'
import { Button } from 'reactstrap';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils';
import CircleProgress from '../CircleProgress';
import classnames from 'classnames';
import Alert, { I_AlertObject } from '../Alert';
import { useAppSelector } from '../../hooks/useAppSelector';
import Loader from '../Loader';
import { ExclamationCircleFill } from '../Icons';

type T_Props = {
    conditionProgress: number,
    callback?: () => void,
    togglePhases?: () => void,
};

const CurrentPhase = ({
    conditionProgress,
    togglePhases,
    callback
}: T_Props) => {
    const [_alert, setAlert] = useState<null | I_AlertObject>(null);

    const active = useAppSelector(state => state.conditions.selectedData.active)
    const { action, phase, stage } = active || {};

    const dateDiff = getDateDiff(new Date(), new Date(action?.fecha_accion || ""));
    const expiredDate = dateDiff < 0;

    const markStageAsCompleted = () => {
        setAlert({
            isOpen: true,
            title: "¿Está seguro?",
            subtitle: "Esta acción es irrevertible, la acción quedará marcada como finalizada",
            type: "question",
            submitButton: {
                value: "Sí, finalizar",
                onClick: () => {
                    callback!();
                }
            },
            closeButton: { value: "No, cancelar" }
        })
    }

    if (!(active)) {
        return <div className='mb-3'><Loader isOpen={true} loaderAsModal={false} /></div>
    } else if (!phase) {
        return <div className='w-100 h-100 d-flex justify-content-center align-items-center flex-column'>
            <i className='text-warning mb-2'><ExclamationCircleFill size={35} /></i>
            <span className="d-block"> No hay nada para mostar</span>
        </div>
    }

    return (<>
        <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} />
        <div className='d-flex flex-column justify-content-between h-100'>

            <div className='d-flex w-100'>
                <div className='pe-2 my-auto'>
                    <CircleProgress
                        progress={conditionProgress}
                        color={expiredDate ? "#dc3545" : '#198754'}
                        stroke={6}
                        radius={50}
                        content={<b>{conditionProgress}%</b>}
                    />
                </div>
                <div className='flex-grow-1 small'>
                    <p className="mb-1"><b className='fw-semibold'>Acción:</b> {action?.nomb_accion}</p>
                    <p className="mb-1"><b className='fw-semibold'>Etapa:</b> {stage?.name}</p>
                    <p className="mb-1"><b className='fw-semibold'>Fase:</b> {phase?.name}</p>
                    <p className='mb-0'>
                        <span>
                            <b className='fw-semibold'>Fecha límite: </b>
                        </span>
                        <span className={classnames({ "text-danger fw-semibold": expiredDate })}>
                            {getNormalDate(action?.fecha_accion || "", { dateStyle: "long" })}
                            {expiredDate && <b className='fw-semibold'> | {dateDiff < 0 ? `Hace ${dateDiff * -1} días` : dateDiff === 0 ? "Hoy" : "Dentro de " + dateDiff + " días"}
                            </b>
                            }
                        </span>
                    </p>
                </div>
            </div>
            <div className='mt-4 d-flex justify-content-between '>
                {!!(togglePhases) &&
                    <Button onClick={togglePhases} size='sm' color='link' className='rounded-2 '>Mostrar fases y etapas</Button>
                }
                {!!(callback) &&
                    <Button onClick={markStageAsCompleted} size='sm' color='primary' className='rounded-2 opacity-75 ms-auto'>Marcar acción como finalizada</Button>
                }
            </div>
        </div>
    </>)
}

export default CurrentPhase;
