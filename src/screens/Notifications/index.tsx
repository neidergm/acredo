import { useState, useEffect, useRef } from "react"
import { Badge, CloseButton, ListGroup, ListGroupItem } from "reactstrap"
import Card from "../../components/Card"
import { SubHeader } from "../../components/SubHeader"
import { I_Notification } from "../../interfaces/notification.interface"
import classnames from "classnames";
import style from "./style.module.css";
import { getDateDiff, getNormalDate } from "../../utils/dateUtils"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { setNotificationsList } from "../../store/actions/notificationsActions"
import { AXIOS_REQUEST } from "../../services/axiosService"
import { GET_NOTIFICATIONS, MARK_AS_READ_NOTIFICATION } from "../../services/endPointsService"
import Loader from "../../components/Loader";
import { jsonToFormData } from "../../utils/formUtils"

const notitypes = {
    "0": "Resumen",
    "1": "Asignación",
    "2": "Pendiente por cumplir"
}

const Notifications = () => {

    const dispatch = useAppDispatch();
    const list = useAppSelector(s => s.notifications.list);

    const [selectedNotification, setSelectedNotification] = useState<null | I_Notification>(null);
    const unreadCount = useAppSelector(s => s.notifications.unreadCount)

    const [pannelHeight, setPannelHeight] = useState<number | undefined>();
    const pannelRef = useRef<HTMLDivElement>(null);

    const pickNotification = (item: I_Notification | null) => {
        setSelectedNotification(item);
        if (item && !item.est_noti) {
            markAsRead(item.id_noti);
        }
    }

    const markAsRead = (id_noti: number) => {
        AXIOS_REQUEST(MARK_AS_READ_NOTIFICATION, "PUT", jsonToFormData({ id_noti: id_noti })).then(r => {
            const i = list!.findIndex((i) => id_noti === i.id_noti);
            list![i].est_noti = 1;
            dispatch(setNotificationsList([...list!]))
        }).catch()
    }

    const getNotifications = () => {
        !list?.length && AXIOS_REQUEST(GET_NOTIFICATIONS).then(r => {
            dispatch(setNotificationsList(
                r.data.map((i: I_Notification) => ({
                    ...i,
                    desc_tipo_noti: notitypes[`${i.tipo_noti}`],
                    html_content: <div className={style["notification-html"]} dangerouslySetInnerHTML={{ __html: i.desc_noti }}></div>
                }))
            ))
        })
    }

    const adjustPannelSize = (el: HTMLElement | null | undefined) => {
        if (el?.clientHeight) {
            const bodyH = document.body.offsetHeight;
            const headH = el.previousElementSibling!.clientHeight;
            const footerH = el.nextElementSibling!.clientHeight

            // 3 is the GAP (3rem) between head, main and footer of body layout
            const gap = parseFloat(getComputedStyle(document.body).fontSize) * 3;

            //Calculate height of content with gap size included
            const heightWithGaps = bodyH - headH - footerH;

            // Get rest of window height without layout gap size
            const height = heightWithGaps - (gap * 2);

            if (document.body.offsetWidth <= 992) {
                setPannelHeight(undefined);
            } else {
                setPannelHeight((c) => height !== c ? height : c);
            }
        }
    }

    useEffect(() => {
        const ev = () => adjustPannelSize(pannelRef.current?.parentElement)

        adjustPannelSize(pannelRef.current?.parentElement);
        window.addEventListener("resize", ev)

        getNotifications()

        return () => {
            window.removeEventListener("resize", ev)
        }
    }, [])

    return (
        <>
            <SubHeader
                showBackButton
                text={`Notificaciones`}
                className="container-xl"
            />

            <div className="container-xl" ref={pannelRef}>
                <div className="row">
                    <div className={classnames("col d-lg-block", { "d-none": selectedNotification }, !selectedNotification ? "col-12" : "col-lg-4")}>
                        <Card className="ps-3 pe-0" style={selectedNotification ? { height: pannelHeight } : { minHeight: pannelHeight }} >
                            {unreadCount !== 0 && <div className="mb-2">
                                <h6><small>Notificaciones sin leer: <strong>{unreadCount}</strong></small></h6>
                            </div>}
                            {list === null ?
                                <div className="mt-5 pt-5">
                                    <Loader loaderAsModal={false} isOpen>
                                        <div className="small mt-2">Cargando</div>
                                    </Loader>
                                </div>
                                :
                                <div className={classnames("overflow-auto", style["noti-list"])}>
                                    <ListGroup flush className="me-3">
                                        {
                                            list?.map(item => {
                                                const active = selectedNotification?.id_noti === item.id_noti
                                                const wasToday = getDateDiff(item.marc_temp) === 0;
                                                return <ListGroupItem className={classnames(style["noti-item"], "px-1",
                                                    {
                                                        [style["noti-unread"]]: !item.est_noti,
                                                        [style["active"]]: active,
                                                    }
                                                )}
                                                    key={item.id_noti}
                                                    onClick={() => pickNotification(item)}>
                                                    <div className="d-flex gap-4 align-items-center">
                                                        <div>
                                                            <div className={style['avatar']}>
                                                                {!item.est_noti &&
                                                                    <span className="position-absolute bottom-0 start-100 translate-middle p-1 border-2 bg-danger border border-white rounded-circle"></span>
                                                                }
                                                                <span>{item.desc_tipo_noti[0]}</span>
                                                            </div>
                                                        </div>
                                                        <div className="overflow-hidden flex-grow-1">
                                                            <div className={classnames("w-100 text-secondary", style['resume'])}>
                                                                <div>
                                                                    <Badge color="secondary" className="bg-opacity-25 text-dark my-1 opacity-50">
                                                                        {item.desc_tipo_noti}
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-truncate mb-0">
                                                                    <div className="d-inline">{item.asun_noti} - </div>
                                                                    {item.html_content}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {!selectedNotification && <div className={classnames("small text-end", style["noti-date"])}>
                                                            <small className="text-secondary text-opacity-75">
                                                                {wasToday && <span className="d-block d-md-inline-block">Hoy,&nbsp;</span>}
                                                                {getNormalDate(item.marc_temp, { timeStyle: "short", ...(wasToday ? {} : { dateStyle: "medium" }) })}
                                                            </small>
                                                        </div>}
                                                    </div>
                                                </ListGroupItem>
                                            })
                                        }
                                    </ListGroup>
                                </div>}
                        </Card>
                    </div>
                    {selectedNotification && <div className={classnames("col", !selectedNotification ? "d-none" : "d-block")}>
                        <Card className="overflow-auto w-100" style={{ height: pannelHeight }}>
                            <div className="text-end mb-4">
                                <span className="float-start small text-secondary">
                                    <small className="text-secondary text-opacity-75">
                                        {getNormalDate(selectedNotification.marc_temp, { timeStyle: "short", dateStyle: "long" })}
                                    </small>
                                </span>
                                <CloseButton onClick={() => setSelectedNotification(null)} />
                            </div>

                            <div className="overflow-auto">
                                <div>
                                    <h4>{selectedNotification.asun_noti}</h4>
                                    <div>
                                        <Badge color="secondary" className="bg-opacity-25 text-dark my-1 text-opacity-50">
                                            {selectedNotification.desc_tipo_noti}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="mt-4">{selectedNotification.html_content}</div>
                            </div>
                        </Card>
                    </div>}
                </div>
            </div >
        </>
    )
}

export default Notifications