import React, { useState } from 'react'
import { Button } from 'reactstrap';
import { I_Condition, T_Stage } from '../../interfaces/conditions.interface';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils';
import Alert, { I_AlertObject } from '../Alert';
import CircleProgress from '../CircleProgress';

type T_Props = {
    condition: I_Condition,
    currentStage: T_Stage,
    callback: () => void
}

const Stages = ({ condition, currentStage, callback }: T_Props) => {
    const [_alert, setAlert] = useState<null | I_AlertObject>(null);

    const completeStage = () => {
        setAlert({
            isOpen: true,
            title: "¿Está seguro?",
            subtitle: "Esta acción es irrevertible, la etapa quedará marcada como finalizada",
            type: "question",
            submitButton: {
                value: "Sí, finalizar",
                onClick: () => {
                    callback();
                }
            },
            closeButton: { value: "No, cancelar" }
        })
    }

    return (
        <>
            <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} />
            <div className='d-flex'>
                <div className='pe-3'>
                    <CircleProgress
                        progress={condition.etapa_por || 0}
                        color={getDateDiff(new Date(), new Date(currentStage.fech_etapa)) < 0 ? "#dc3545" : '#198754'}
                        stroke={4}
                        radius={30}
                        content={<b>{currentStage.internalId}</b>}
                    />
                </div>
                <div className='flex-grow-1'>
                    <p className="mb-1">{currentStage.nomb_nodo}</p>
                    <p className="mb-1">
                        Límite: {getNormalDate(currentStage.fech_etapa, { dateStyle: "long" })}
                        {
                            getDateDiff(new Date(), new Date(currentStage.fech_etapa)) < 0 &&
                            <b className='d-block text-danger'>Fecha límite vencida</b>
                        }
                    </p>
                </div>
            </div>
            {
                condition.rol.split(",").includes(currentStage.resp_etapa) && <div>
                    <Button color='primary' size="sm"
                        className='mt-2 float-xl-start w-100'
                        onClick={() => completeStage()}
                    >
                        Marcar etapa como finalizada
                    </Button>
                </div>
            }
        </>)
}

export default Stages;
