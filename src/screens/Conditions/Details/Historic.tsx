import { useEffect, useState } from 'react';
import { Clock, Calendar2Event } from '../../../components/Icons'
import { I_HistoryItem } from '../../../interfaces/conditions.interface'
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { HISTORIC_BY_CONDITION } from '../../../services/endPointsService';
import classnames from 'classnames';
import Loader from '../../../components/Loader';
import { closeModal, Modal, ModalBody, ModalHeader, T_ModalJSON } from '../../../components/Modal';
import Form from 'react-ngm-form';
import { formToObjectWithFieldsAndValues } from '../../../utils/formUtils';

interface I_Props {
    id_condition: number;
}

const Historic = (
    {
        id_condition
    }: I_Props
) => {

    const [historic, setHistoric] = useState<{ [x: string]: I_HistoryItem[] } | null>(null);
    const [modal, setModal] = useState<T_ModalJSON | null>(null);

    const showHistoricDetails = (items: I_HistoryItem[]) => {
        let _form = formToObjectWithFieldsAndValues(items);
        const firstItem = items[0];
        setModal({
            isOpen: true,
            title: "Detalles histórico",
            children: <>
                <div>
                    <p>
                        <b>Acción: </b>
                        <span className='text-uppercase'>{firstItem.tipo}</span>
                    </p>
                    <p>
                        <b>Usuario: </b>
                        <span>{firstItem.usuario}</span>
                    </p>
                    <p>
                        <b>Fecha: </b>
                        <span>{new Date(firstItem.marc_temp).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}</span>
                    </p>
                </div>
                <hr />
                {_form && <Form
                    disabled
                    defaultValues={_form.defaultValues}
                    fields={_form.fields as any}
                    onSubmit={() => { }}
                />}
            </>,
        })
    }

    useEffect(() => {
        AXIOS_REQUEST(HISTORIC_BY_CONDITION + id_condition)
            .then(res => {
                setHistoric(
                    res.data.reduce((p: typeof historic, c: I_HistoryItem) => {
                        p![c.grupo_resp] = [...(p![c.grupo_resp] || []), c]
                        return { ...p }
                    }, {})
                )
            })
    }, []);

    return (
        <div className='mt-2'>
            <Modal isOpen={!!(modal?.isOpen)} onClosed={() => { setModal(null) }} toggle={() => closeModal(setModal)} size="lg">
                <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                <ModalBody>
                    {modal?.children}
                </ModalBody>
            </Modal>

            {!historic ? <Loader isOpen loaderAsModal={false} />
                :
                !Object.values(historic).length ? <p className='text-muted'>| No hay nada para mostrar</p>
                    :
                    Object.values(historic).map((li, i) => {
                        const item = li[0];
                        let marc_temp = new Date(item.marc_temp);
                        return <div key={i}
                            className="card border-0 bg-light hover-scale-up hover-shadow-sm mb-4"
                            onClick={() => showHistoricDetails(li)}
                        >
                            <div className="card-body">
                                <div className='d-flex gap-4 align-content-stretch'>
                                    <div className="flex-shrink-0">
                                        <div style={{ minWidth: "120px" }} className="h-100 d-flex flex-column justify-content-center text-muted">
                                            <div className='mb-2'>
                                                <Calendar2Event size={20} />
                                                <small className="ms-2 ">
                                                    {marc_temp.toLocaleString([], { dateStyle: "medium" })}
                                                </small>
                                            </div>
                                            <div>
                                                <Clock size={20} />
                                                <small className="ms-2 ">
                                                    {marc_temp.toLocaleString([], { minute: "2-digit", hour: "2-digit" })}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vr flex-shrink-0"></div>
                                    <div className='flex-grow-1 text-truncate '>
                                        <div className='mb-2'>
                                            <span className={
                                                classnames('px-3 badge text-white rounded-pill text-uppercase', {
                                                    'bg-success': item.tipo === "revisión",
                                                    'bg-warning': item.tipo === "texto",
                                                    'bg-primary': item.tipo === "anexo"
                                                })
                                            }>
                                                {item.tipo}
                                            </span>
                                        </div>
                                        {/* {
                                            (item.json_campo.tag !== "file" && item.json_campo.type !== "url") ?
                                                <div className='text-truncate'>
                                                    <b className="me-1 text-muted small" >{item.json_campo?.label}: </b>
                                                    <div className='text-truncate' dangerouslySetInnerHTML={{ __html: typeof item.respuesta === "string" ? item.respuesta : "" }}></div>
                                                </div> : null
                                        } */}
                                        <div className='float-md-end text-muted'>
                                            <small className="me-1" >Realizado por </small>
                                            <small>{item.usuario}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    }
                    )
            }
        </div >
    )
}

export default Historic;
