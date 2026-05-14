import { useEffect } from "react";
import { LuArrowLeft, LuMailOpen } from "react-icons/lu";
import { Badge, Button, Card, CloseButton, Stack } from "react-bootstrap";
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
        <Card className="h-100 overflow-hidden">
            <Card.Body className="overflow-auto">
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
                            <small className="text-secondary ms-auto 2small">
                                {getNormalDate(notification.marc_temp, { dateStyle: "long", timeStyle: "short" })}
                            </small>
                        </Stack>

                        <div>
                            <Badge bg="info">
                                {getNotificationLabel(notification.tipo_noti)}
                            </Badge>
                            <h3>
                                {getNotificationSubject(notification.asun_noti)}
                            </h3>
                        </div>
                        <div
                            className="flex-grow-1 overflow-auto mt-7"
                            dangerouslySetInnerHTML={{ __html: notification.desc_noti }}
                        />
                    </>
                }
            </Card.Body>
        </Card>
    );
}
