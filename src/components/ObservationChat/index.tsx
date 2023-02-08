import React, { useEffect, useState } from 'react'
import { Button, Input, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { OBSERVATION_BY_ATTACHMENT, SAVE_OBSERVATION } from '../../services/endPointsService';
import { Clip, Send } from '../Icons';
import Loader from '../Loader';
import style from './style.module.css';
import classnames from 'classnames';
import useAutoGrowField from '../../hooks/useAutoGrowField';
import { I_JSONObject } from '../../interfaces/generic.interface';
import { formToSubmitData } from '../../utils/formUtils';
import { I_Observation } from '../../interfaces/observations.interface';

interface I_props {
    isOpen: boolean;
    toggle: (close: null) => void;
    id_fcamp: string;
    id_camp: string;
    grupo: string;
    children?: JSX.Element | JSX.Element[];
    title?: string;
    extra_data_to_send?: I_JSONObject
}

type T_Message = {
    message: string;
    emisor: string;
    sent: boolean;
    date: string;
    time: string;
}

const ObservationChat = ({
    isOpen,
    toggle,
    id_fcamp,
    id_camp,
    grupo,
    children,
    extra_data_to_send = {},
    title = "Observaciones"
}: I_props) => {

    const [messages, setMessages] = useState<null | undefined | T_Message[]>(null);
    const { onInput, ref, reset, getHTMLValue } = useAutoGrowField({});

    const doMessageObj = (item: I_Observation): T_Message => {
        let t = new Date(item.marc_temp);
        return {
            date: t.toLocaleString([], { dateStyle: 'short' }),
            time: t.toLocaleString([], { timeStyle: 'short' }),
            emisor: item.usuario,
            message: item.observacion,
            sent: true
        }
    }

    const buildMessages = (data: I_Observation[]) => {
        setMessages(data.map(i => doMessageObj(i)))
        // setMessages([
        //     { time: "10:01", date: "2022/02/06", sent: false, emisor: "", message: "START" },
        //     { time: "10:02", date: "2022/02/06", sent: true, emisor: "", message: "This is a sent message d idweubdwe dweoiudf wiku weufiyewfuiywgifuygweiufywgqeiuygweqiuqwgequwifygwqiufygewfuy" },
        //     { time: "10:03", date: "2022/02/06", sent: true, emisor: "", message: "This is a sent message 1" },
        //     { time: "10:21", date: "2022/02/07", sent: true, emisor: "", message: "This is a sent message 4" },
        //     { time: "10:39", date: "2022/03/09", sent: false, emisor: "", message: "END" }
        // ])
    }

    const send = () => {
        if (!(ref.current)) return false;

        let val = getHTMLValue();
        setMessages(m => [
            ...(m || []),
            {
                date: `${new Date().toDateString()}`,
                emisor: "",
                message: `${val}`,
                sent: true,
                time: `${new Date().toLocaleString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`
            }
        ]
        );
        reset();

        let formData = new FormData();
        let data: any = {
            ...extra_data_to_send,
            observacion: val,
            id_fcamp,
            grupo_resp: grupo
        };

        Object.keys(data).forEach(i => {
            formData.append(`${i}`, data[i]);
        })

        AXIOS_REQUEST(SAVE_OBSERVATION, "POST", formData, true).then(resp => {

            console.log(resp)
        })

    }

    const printMessagge = (message: T_Message) => {
        return <>
            <div className={classnames(style.message, { [style.sent]: message.sent })} >
                <div>
                    <div className={style["message-text"]} >
                        <div dangerouslySetInnerHTML={{ __html: message.message }}></div>
                    </div>
                    <span className={style.time}><small>{message.time}</small></span>
                </div>
                {/* <span className={style.feedback}>Sending...</span> */}
            </div>
        </>
    }

    useEffect(() => {

        // AXIOS_REQUEST(`${OBSERVATION_BY_ATTACHMENT}${id_fcamp}/${id_camp}/${grupo}`).then(resp => {
        AXIOS_REQUEST(`${OBSERVATION_BY_ATTACHMENT}${id_fcamp}`).then(resp => {
            console.log(resp)
            buildMessages(resp.data);
        }).catch(err => {
            setMessages(undefined)
        })

        return () => { }
    }, [])


    return (
        <Offcanvas toggle={() => toggle(null)} direction="end" isOpen={isOpen} style={{ maxWidth: "500px", width: "100%" }}>
            <OffcanvasHeader toggle={() => toggle(null)}>
                {title}
            </OffcanvasHeader>
            <div className='border-bottom pb-3 mx-3'>{children}</div>
            <OffcanvasBody className='pb-0 custom-scrollbar' >
                {!(messages) ? <div className='d-flex align-items-center justify-content-center' style={{ minHeight: "100%" }}>
                    {messages === undefined ?
                        <small className='text-muted'>Ops, no pudimos consultar los datos</small>
                        : <Loader isOpen loaderAsModal={false} />
                    }
                </div>
                    :
                    (!(messages.length) ?
                        <div className='d-flex align-items-center justify-content-center' style={{ minHeight: "100%" }}>
                            <small className='text-muted'>No hay nada para mostrar</small>
                        </div>
                        :
                        <div className={classnames(style["messages-container"], 'd-flex flex-column justify-content-end')}>
                            {messages.map(m => <>
                                {/* <div className={style["message-date"]}>{"message.date"}</div> */}
                                {printMessagge(m)}
                            </>
                            )}
                        </div>
                    )
                }
            </OffcanvasBody>
            <div className='gap-1 d-flex align-items-end px-2 py-3'>
                <div >
                    <Button color='light'><Clip /></Button>
                </div>
                <div className={classnames("w-100", style["message-input-box"])}>
                    <Input placeholder='Escribir aquí...' type='textarea' rows={1} innerRef={ref} onInput={onInput} />
                </div>
                <div>
                    <Button color='light' onClick={() => send()}><Send /></Button>
                </div>
            </div>
        </Offcanvas>
    )
}

export default ObservationChat