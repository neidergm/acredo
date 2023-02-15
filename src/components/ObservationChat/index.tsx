import React, { useEffect, useState } from 'react'
import { Button, CloseButton, Input, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { OBSERVATION_BY_ATTACHMENT, SAVE_OBSERVATION } from '../../services/endPointsService';
import { Check, Clip, ReplyFill, Send } from '../Icons';
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
    onlyRead?: boolean;
    toggle: (close: null) => void;
    id_fcamp: string | number | undefined | null;
    grupo?: string | undefined | null;
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
    datetime: number;
    reply?: {
        id: string,
        user: string,
        message: string
    };
}

const ObservationChat = ({
    isOpen,
    toggle,
    id_fcamp,
    grupo,
    children,
    onlyRead,
    extra_data_to_send = {},
    title = "Observaciones"
}: I_props) => {

    const [messages, setMessages] = useState<null | undefined | { [date: string]: T_Message[] }>(null);
    const [messageToReply, setMessageToReply] = useState<null | T_Message>(null);
    const { onInput, ref, reset, getHTMLValue } = useAutoGrowField({ maxHeight: 500 });
    const userInfo = useAppSelector(state => state.user.userInfo!)

    const selectMessageToReply = (message: typeof messageToReply) => {
        setMessageToReply(message);
        reset("He completado esta observación");
    }

    const doMessageObj = (item: I_Observation): T_Message => {
        let t = new Date(item.marc_temp);
        return {
            id: `${item.id_obs}`,
            date: t.toLocaleString([], { dateStyle: 'long' }),
            time: t.toLocaleString([], { timeStyle: 'short' }),
            datetime: t.getTime(),
            user: item.usuario,
            message: item.observacion,
            reply: item.id_ref ? {
                id: item.id_ref!,
                message: item.obs_ref!,
                user: item.usua_ref!
            } : undefined,
            sent: item.dni_usua === userInfo.dni
        }
    }

    const getMessageID = (id: string, datetime: number | string = "msg") => `${datetime}_${id}`;

    const buildMessages = (list: I_Observation[]) => {
        let msgs = list.reduce((p, c) => {
            let msg = doMessageObj(c);
            let obj = p[msg.date] || [];

            return {
                ...p,
                [msg.date]: [...obj, msg]
            }
        }, {} as I_JSONObject);

        setMessages(msgs);
    }

    const send = () => {
        let val = getHTMLValue();
        if (!(val)) return false;
        let now = new Date();
        let newMessage: T_Message = {
            id: `${now.getTime()}`,
            date: now.toLocaleString([], { dateStyle: 'long' }),
            time: now.toLocaleString([], { timeStyle: 'short' }),
            datetime: now.getTime(),
            user: "",
            message: `${val}`,
            sent: true,
        }

        if (messageToReply) {
            newMessage.reply = messageToReply;
        }

        setMessages(m => {
            if (!m?.[newMessage.date]) {
                (m || {})[newMessage.date] = [newMessage]
            } else {
                (m?.[newMessage.date] || []).push(newMessage)
            }

            return { ...m }
        });

        setMessageToReply(null);
        reset();

        let data: I_JSONObject = {
            ...extra_data_to_send,
            observacion: val,
            id_fcamp,
            grupo_resp: grupo
        };

        if (!!(newMessage.reply)) data.id_ref = newMessage.reply.id;

        let fd = jsonToFormData(data)

        AXIOS_REQUEST(SAVE_OBSERVATION, "POST", fd, true).then(resp => {
            console.log(resp)
        })

    }

    const printMessagge = (message: T_Message, idx: number) => {
        return <div
            id={getMessageID(message.id)}
            className={classnames(style.message, { [style.sent]: message.sent })}
            key={`message-${idx}`} >
            <div className={style["message-content"]}>
                {!message.sent && <MessageUser text={message.user} />}
                {!!(message.reply) && <div className={style["message-reply"]}
                    onClick={() => scrollTo(getMessageID(message.reply!.id))}>
                    <MessageUser text={message.reply.user} />
                    <MessageText text={message.reply.message} />
                </div>}
                <MessageText text={message.message} />
                <span className={style.time}><small>{message.time}</small></span>
                {!onlyRead && !message.sent && <>
                    <div className={style["message-options"]}>
                        <div onClick={() => selectMessageToReply(message)}>
                            <ReplyFill size={18} />
                        </div>
                        {/* <div>
                            <Check size={18} />
                        </div> */}
                    </div>
                </>
                }
            </div>
            {/* <span className={style.feedback}>Sending...</span> */}
        </div>
    }

    const getObservationsList = () => {
        let url = `${OBSERVATION_BY_ATTACHMENT}${id_fcamp}`;
        if (grupo) {
            url += `/${grupo}`;
        }
        (!messages || !Object.keys(messages)?.length)
            && AXIOS_REQUEST(`${url}`).then(resp => {
                buildMessages(resp.data);
            }).catch(err => {
                setMessages(undefined)
            })

    }

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    useEffect(() => {
        if (messages) {
            let cont = document.getElementById("main-messages-container")
            if (cont) cont.scrollTo(0, cont.scrollHeight)
        }
    }, [messages])

    return (
        <Offcanvas
            onOpened={() => getObservationsList()}
            onClosed={() => setMessages(null)}
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
                <div style={{ minHeight: "100%" }}
                    className={classnames('d-flex flex-column align-items-center',
                        !(Object.keys(messages || {}).length) ? "justify-content-center" : "justify-content-end"
                    )}
                >
                    {!(messages) ?
                        (messages === undefined ?
                            <small className='text-muted'>Ops, no pudimos consultar los datos</small>
                            : <Loader isOpen loaderAsModal={false} />
                        )
                        :
                        (!(Object.keys(messages).length) ?
                            <small className='text-muted'>No hay nada para mostrar</small>
                            :
                            Object.keys(messages).map(key =>
                                <React.Fragment key={key}>
                                    <div className={style["message-date"]}>
                                        <div>{key}</div>
                                    </div>
                                    <div className={classnames(style["messages-container"], 'd-flex flex-column w-100')}>
                                        {messages[key].map((m, idx) => printMessagge(m, idx))}
                                    </div>
                                </React.Fragment>
                            )
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
            {!onlyRead && <div className='gap-1 d-flex align-items-end px-2 py-3 bg-light'>
                <div >
                    {/* <Button color='light'><Clip /></Button> */}
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
            </div>}
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
