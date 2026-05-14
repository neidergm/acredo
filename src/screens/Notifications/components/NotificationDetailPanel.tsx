import { useEffect } from "react";
import { LuArrowLeft, LuMailOpen } from "react-icons/lu";
import { Button, Card, CloseButton, Stack } from "react-bootstrap";
import { type I_Notification } from "../../../interfaces/notification.interface";
import { getNormalDate } from "../../../utils/dateUtils";
import { useMarkAsReadMutation } from "../../../services/api/notifications.api";
import { getNotificationLabel, getNotificationSubject } from "../../../utils/notifications.utils";

type Props = {
    notification: I_Notification | null;
    onClose: () => void;
};

export default function NotificationDetailPanel({ notification, onClose }: Props) {
    const [markAsRead] = useMarkAsReadMutation();

    useEffect(() => {
        if (notification && notification.est_noti === 0) {
            markAsRead({ id_noti: notification.id_noti });
        }
    }, [notification, markAsRead]);

    return (
        <Card className="h-100">
            <Card.Body>
                {
                    !notification ? (
                        <div className="d-flex flex-column align-items-center justify-content-center text-secondary h-100 py-5 gap-3">
                            <LuMailOpen size={40} />
                            <div>Selecciona una notificación para verla</div>
                        </div>
                    ) : <>
                        <Stack direction="horizontal" className="justify-content-between align-items-center mb-4">
                            <Button
                                variant="link"
                                size="sm"
                                className="text-decoration-none p-0 link-secondary d-none d-lg-inline"
                                onClick={onClose}
                            >
                                <LuArrowLeft size={18} /> Cerrar
                            </Button>
                            <CloseButton
                                onClick={onClose}
                                className="d-lg-none"
                            />
                            <small className="text-secondary ms-auto">
                                {getNormalDate(notification.marc_temp, { dateStyle: "long", timeStyle: "short" })}
                            </small>
                        </Stack>

                        <div>
                            <span className="eyebrow">{getNotificationLabel(notification.tipo_noti)}</span>
                            <h2 className="mt-1" style={{ fontSize: "28px" }}>
                                {getNotificationSubject(notification.asun_noti)}
                            </h2>
                        </div>
                        <div
                            className="flex-grow-1 overflow-auto mt-4"
                            style={{ fontSize: 15, color: "#1E3A5F", lineHeight: 1.6 }}
                            dangerouslySetInnerHTML={{ __html: notification.desc_noti }}
                        />
                    </>
                }
            </Card.Body>
        </Card>
    );
}
