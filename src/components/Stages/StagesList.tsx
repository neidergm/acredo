import React, { useState } from 'react'
import { CheckCircleFill } from '../Icons';
import classnames from 'classnames';
import style from './style.module.css';
import { T_Stage } from '../../interfaces/conditions.interface';
import Alert, { I_AlertObject } from '../Alert';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils';
import { Badge } from 'reactstrap';

type T_Props = {
    items: Array<T_Stage>;
    currentStage: T_Stage;
}

const StagesList = ({ items, currentStage }: T_Props) => {

    const [_alert, setAlert] = useState<null | I_AlertObject>(null);

    const showDetails = (item: T_Stage) => {
        let dateDiff = getDateDiff(new Date(), new Date(item.fech_etapa));
        setAlert({
            isOpen: true,
            title: `Etapa ${item.internalId}`,
            subtitle: <>
                <b className='text-dark'>{item.nomb_nodo}</b>
                <p className='text-start mt-4'>
                    <p className={classnames({ "text-danger": dateDiff < 0 && item.est_etapa !== 2 })}>
                        <b className='d-block'>Fecha límite: </b>
                        <span className='d-line-block'>{getNormalDate(item.fech_etapa, { dateStyle: "long" })}</span>
                        {item.est_etapa !== 2 && <Badge pill color={dateDiff < 0 ? "danger" : "primary"} className='float-end d-line-block'>
                            {dateDiff < 0 ? `Vencido hace ${dateDiff * -1} días` : `Vence ${dateDiff === 0 ? "hoy" : "en " + dateDiff + " días"}`}
                        </Badge>}
                    </p>
                    <p>
                        <b className='d-block'>Personal asignado: </b>
                        <ul>
                            {item.responsable?.split(",").map(r => <li key={r}>{r}</li>)}
                        </ul>
                    </p>
                </p>
            </>,
            closeButton: { value: "Ok, cerrar" }
        })
    }

    return (
        <>
            <Alert showCloseX isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} fullscreen={"sm"} />

            <div className={classnames(style["stages-container"], "justify-content-xl-between")}>
                {
                    items.map((it) => <div
                        className={classnames(style["stage-item"], "hover-scale-up hover-shadow-sm", { [style["active"]]: currentStage.internalId === it.internalId })}
                        key={it.internalId}
                        onClick={() => showDetails(it)}
                    >
                        {it.internalId < currentStage.internalId && <i className='text-success'><CheckCircleFill /></i>}
                        <div>{it.internalId}</div>
                    </div>)
                }
            </div>
        </>
    )
}

export default StagesList;
