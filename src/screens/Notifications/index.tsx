import { useState, useEffect, useRef } from "react"
import { Badge, Button, CloseButton, ListGroup, ListGroupItem } from "reactstrap"
import Card from "../../components/Card"
import { SubHeader } from "../../components/SubHeader"
import { I_Notification } from "../../interfaces/notification.interface"
import classnames from "classnames";
import style from "./style.module.css";
import { getDateDiff, getNormalDate } from "../../utils/dateUtils"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { setNotificationsList } from "../../store/slices/notificationsSlice"
import { AXIOS_REQUEST } from "../../services/axiosService"
import { GET_NOTIFICATIONS, MARK_AS_READ_NOTIFICATION } from "../../services/endPointsService"
import Loader from "../../components/Loader";
import { jsonToFormData } from "../../utils/formUtils"
import { ArrowDownUp, Bell } from "../../components/Icons"

const notitypes = {
    "0": "Resumen",
    "1": "Asignación",
    "2": "Pendiente por cumplir"
}

const Notifications = () => {

    const dispatch = useAppDispatch();
    const list = useAppSelector(s => s.notifications.list);

    const [selectedNotification, setSelectedNotification] = useState<null | I_Notification>(null);
    const [onlyUnread, setOnlyUnread] = useState(false);
    const unreadCount = useAppSelector(s => s.notifications.unreadCount)

    const [pannelHeight, setPannelHeight] = useState<number | undefined>();
    const pannelRef = useRef<HTMLDivElement>(null);

    const pickNotification = (item: I_Notification | null) => {
        setSelectedNotification(item);
        if (item && !item.est_noti) {
            markAsRead(item.id_noti);
        }
    }

    const printNotiContent = (content: string) => <div className={style["notification-html"]} dangerouslySetInnerHTML={{ __html: content }}></div>

    const markAsRead = (id_noti: number) => {
        AXIOS_REQUEST(MARK_AS_READ_NOTIFICATION, "PUT", jsonToFormData({ id_noti: id_noti })).then(r => {
            // const _list = list!;
            // const i = _list.findIndex((i) => id_noti === i.id_noti);
            // _list[i].est_noti = 1;
            // dispatch(setNotificationsList([..._list]))
            const _list = [...list!];
            const i = _list.findIndex((i) => id_noti === i.id_noti);
            _list[i] = { ..._list[i], est_noti: 1 };
            dispatch(setNotificationsList(_list))
        }).catch()
    }

    const getNotifications = () => {
        !list?.length && AXIOS_REQUEST(GET_NOTIFICATIONS).then(r => {
            dispatch(setNotificationsList(
                r.data.map((i: I_Notification) => ({
                    ...i,
                    desc_tipo_noti: notitypes[`${i.tipo_noti}`],
                    // html_content: <div className={style["notification-html"]} dangerouslySetInnerHTML={{ __html: i.desc_noti }}></div>
                }) as const)
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

    const printList = () => {
        let _list: typeof list = [];
        let unreadList: typeof list = [];
        if (onlyUnread) {
            unreadList = list?.filter(i => {
                if (i.est_noti === 1) {
                    _list?.push(i);
                    return false;
                }
                return true
            }) || [];

            _list = unreadList.concat(_list)
        } else {
            _list = list;
        }

        const printed = _list?.map(item => {
            const active = selectedNotification?.id_noti === item.id_noti
            const wasToday = getDateDiff(item.marc_temp) === 0;
            const content = printNotiContent(item.desc_noti);
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

                                {!selectedNotification && <div className={classnames("small text-end float-end", style["noti-date"])}>
                                    <small className="text-secondary text-opacity-75">
                                        {wasToday && <span className="d-block d-md-inline-block">Hoy,&nbsp;</span>}
                                        {getNormalDate(item.marc_temp, { ...(wasToday ? {} : { dateStyle: "medium" }) })}
                                    </small>
                                </div>}
                            </div>
                            <div className="text-truncate mb-0">
                                <div className="d-inline">{item.asun_noti}</div>
                            </div>
                            <div className="text-truncate text-secondary fw-normal mb-0 mt-2 small">
                                {content}
                            </div>
                        </div>
                    </div>
                </div>
            </ListGroupItem>
        })

        if (onlyUnread) {
            printed?.splice(unreadCount, 0, <div className="my-4 ps-2 border-4 border-start border-secondary py-2" key={"unread-count"}>
                <h6 className="text-secondary mb-0">
                    <small>Notificaciones leídas: <strong>{list?.length || 0 - unreadCount}</strong></small>
                </h6>
            </div>)
        }

        return printed;
    }

    const toggleOrder = () => setOnlyUnread(s => !s)

    useEffect(() => {
        const ev = () => adjustPannelSize(pannelRef.current?.parentElement)

        adjustPannelSize(pannelRef.current?.parentElement);
        window.addEventListener("resize", ev)

        getNotifications()

        return () => {
            window.removeEventListener("resize", ev)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <SubHeader
                showBackButton
                text={`Notificaciones`}
                className="container-fluid container-xxxl"
            />

            <div className="container-fluid container-xxxl" ref={pannelRef}>
                <div className="row">
                    <div className={classnames("col d-lg-block", { "d-none": selectedNotification }, !selectedNotification ? "col-12" : "col-lg-4")}>
                        <Card className={classnames("ps-0 ps-sm-3 pe-0", style["noti-main-container"])} style={selectedNotification ? { height: pannelHeight } : { minHeight: pannelHeight }} >
                            {unreadCount !== 0 && <div className="mb-2">
                                <h6 className="position-relative me-3">
                                    <small>Notificaciones sin leer: <strong>{unreadCount}</strong></small>
                                    {list?.length && <Button outline color="primary" size="sm" active={onlyUnread} disabled={!unreadCount}
                                        className="ms-1 position-absolute end-0 border-0 d-inline-flex p-1 rounded-1"
                                        onClick={() => toggleOrder()}>
                                        <ArrowDownUp size={15} />
                                    </Button>}
                                </h6>
                            </div>}
                            {list === null ?
                                <div className="mt-5 pt-5">
                                    <Loader loaderAsModal={false} isOpen>
                                        <div className="small mt-2">Cargando</div>
                                    </Loader>
                                </div>
                                :
                                (list.length === 0 ?
                                    <div className="w-100 d-flex flex-column justify-content-center align-items-center text-secondary text-opacity-50 gap-4" style={{ minHeight: "inherit" }}>
                                        <h4><Bell size={40} /></h4>
                                        <h4 className="">No hay nada para mostrar</h4>
                                    </div>
                                    :
                                    <div className={classnames("overflow-auto", style["noti-list"])}>
                                        <ListGroup flush className="me-sm-3">
                                            {
                                                printList()
                                            }
                                        </ListGroup>
                                    </div>
                                )
                            }
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
                                    <h5>{selectedNotification.asun_noti}</h5>
                                    <div>
                                        <Badge color="secondary" className="bg-opacity-25 text-dark my-1 text-opacity-50">
                                            {selectedNotification.desc_tipo_noti}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3">{printNotiContent(selectedNotification.desc_noti)}</div>
                            </div>
                        </Card>
                    </div>}
                </div>
            </div >
        </>
    )
}

export default Notifications