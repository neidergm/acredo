import React, { useEffect, useState } from 'react'
import { Button, CloseButton, Input, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { OBSERVATION_BY_ATTACHMENT, SAVE_OBSERVATION } from '../../services/endPointsService';
import { Clip, ReplyFill, Send } from '../Icons';
import Loader from '../Loader';
import style from './style.module.css';
import classnames from 'classnames';
import useAutoGrowField from '../../hooks/useAutoGrowField';
import { I_JSONObject } from '../../interfaces/generic.interface';
import { jsonToFormData } from '../../utils/formUtils';
import { I_Observation } from '../../interfaces/observations.interface';
import { useAppSelector } from '../../hooks/useAppSelector';

interface I_props {
    isOpen: boolean;
    toggle: (close: null) => void;
    id_fcamp: string | number | undefined | null;
    grupo: string | undefined | null;
    children?: JSX.Element | JSX.Element[];
    title?: string;
    extra_data_to_send?: I_JSONObject
}

type T_Message = {
    id: string;
    message: string;
    user: string;
    sent: boolean;
    date: string;
    time: string;
    replyId?: string;
}

const ObservationChat = ({
    isOpen,
    toggle,
    id_fcamp,
    grupo,
    children,
    extra_data_to_send = {},
    title = "Observaciones"
}: I_props) => {

    const [messages, setMessages] = useState<null | undefined | T_Message[]>(null);
    const [messageToReply, setMessageToReply] = useState<null | T_Message>(null);
    const { onInput, ref, reset, getHTMLValue } = useAutoGrowField({});
    const userInfo = useAppSelector(state => state.user.userInfo!)

    const doMessageObj = (item: I_Observation): T_Message => {
        let t = new Date(item.marc_temp);
        return {
            id: `${item.id_obs}`,
            date: t.toLocaleString([], { dateStyle: 'short' }),
            time: t.toLocaleString([], { timeStyle: 'short' }),
            user: item.usuario,
            message: item.observacion,
            replyId: item.obs_ref,
            sent: item.dni_usua === userInfo.dni
        }
    }

    const buildMessages = (data: I_Observation[]) => {
        setMessages(data.map(i => doMessageObj(i)))
    }

    const send = () => {
        let val = getHTMLValue();
        if (!(val)) return false;

        let newMessage: T_Message = {
            id: `${messages?.length || 1}`,
            date: `${new Date().toDateString()}`,
            user: "",
            message: `${val}`,
            sent: true,
            time: `${new Date().toLocaleString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`
        }

        if (messageToReply) {
            newMessage.replyId = messageToReply.id;
        }

        setMessages(m => [...(m || []), newMessage]);
        setMessageToReply(null);

        reset();

        let fd = jsonToFormData({
            ...extra_data_to_send,
            id_ref: newMessage.replyId,
            observacion: val,
            id_fcamp,
            grupo_resp: grupo
        })

        // AXIOS_REQUEST(SAVE_OBSERVATION, "POST", fd, true).then(resp => {
        //     console.log(resp)
        // })

    }

    const replyOne = (message: typeof messageToReply) => {
        setMessageToReply(message)
    }

    const printMessagge = (message: T_Message, idx: number) => {
        return <div
            id={message.id}
            className={classnames(style.message, { [style.sent]: message.sent })}
            key={`message-${idx}`} >
            <div className={style["message-content"]}>
                {!message.sent && <MessageUser text={message.user} />}
                {message.replyId && <div className={style["message-reply"]}>
                    <MessageUser text={message.user} />
                    <MessageText text={message.replyId} />
                </div>}
                <MessageText text={message.message} />
                <span className={style.time}><small>{message.time}</small></span>
                {!message.sent &&
                    <div className={style["message-options"]} onClick={() => setMessageToReply(message)}>
                        <ReplyFill size={18} />
                    </div>}
            </div>
            {/* <span className={style.feedback}>Sending...</span> */}
        </div>
    }

    const getObservationsList = () => {
        !messages?.length && AXIOS_REQUEST(`${OBSERVATION_BY_ATTACHMENT}${id_fcamp}/${grupo}`).then(resp => {
            buildMessages(resp.data);
        }).catch(err => {
            setMessages(undefined)
        })

    }

    const scrollToBottom = (id: string) => {
        const element = document.getElementById(id);
        console.log(element)
        if (element) element.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    useEffect(() => {
        let cont = document.getElementById("main-messages-container")
        if (cont) cont.scrollTo(0, cont.scrollHeight)
    }, [messages])

    return (
        <Offcanvas
            onOpened={() => getObservationsList()}
            toggle={() => toggle(null)}
            direction="end"
            isOpen={isOpen}
            style={{ maxWidth: "500px", width: "100%" }}
        >
            <OffcanvasHeader toggle={() => toggle(null)}>
                {title}
            </OffcanvasHeader>
            <div className='border-bottom pb-3 mx-3'>{children}</div>
            <OffcanvasBody className={classnames(style["main-messages-container"], "pb-0 custom-scrollbar main-messages-container")} id="main-messages-container">
                <div className='d-flex align-items-center justify-content-end flex-column' style={{ minHeight: "100%" }}>
                    {!(messages) ?
                        (messages === undefined ?
                            <small className='text-muted'>Ops, no pudimos consultar los datos</small>
                            : <Loader isOpen loaderAsModal={false} />
                        )
                        :
                        (!(messages.length) ?
                            <small className='text-muted'>No hay nada para mostrar</small>
                            :
                            <>
                                {/* <div className={style["message-date"]}>
                                    <div>13 nov 2023</div>
                                </div> */}
                                <div className={classnames(style["messages-container"], 'd-flex flex-column w-100')}>
                                    {messages.map((m, idx) => printMessagge(m, idx))}
                                    {/* <div className={style["message-date"]}>{"message.date"}</div> */}
                                </div>
                            </>
                        )
                    }
                </div>
            </OffcanvasBody>
            {messageToReply &&
                <div className={classnames(style["message-to-reply"], "px-3 pt-3 bg-light")}>
                    <div>
                        <MessageUser text={messageToReply.user} className="text-truncate" />
                        <CloseButton onClick={() => setMessageToReply(null)} />
                        <MessageText text={messageToReply.message} />
                    </div>
                </div>
            }
            <div className='gap-1 d-flex align-items-end px-2 py-3 bg-light'>
                <div >
                    <Button color='light'><Clip /></Button>
                </div>
                <div className={classnames("w-100", style["message-input-box"])}>
                    <Input placeholder='Escribir aquí...' type='textarea' rows={1}
                        innerRef={ref} onInput={onInput}
                        className="border"
                    />
                </div>
                <div>
                    <Button color='light' onClick={() => send()}><Send /></Button>
                </div>
            </div>
        </Offcanvas>
    )
}

export default ObservationChat;

const MessageText = ({ text }: { text: string }) => {
    return (<div className={style["message-text"]} dangerouslySetInnerHTML={{ __html: text }} ></div>)
}

const MessageUser = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={classnames(style["message-user"], className)}>{text}</div>
    )
}
