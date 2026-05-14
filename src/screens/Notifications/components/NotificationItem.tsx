import classnames from "classnames";
import { BsClipboardData, BsPersonCheck, BsExclamationCircle } from "react-icons/bs";
import { type I_Notification, type T_NotificationType } from "../../../interfaces/notification.interface";
import { getDateDiff, getNormalDate } from "../../../utils/dateUtils";
import { getNotificationLabel, getNotificationSubject } from "../../../utils/notifications.utils";
import { Stack } from "react-bootstrap";

type Props = {
    notification: I_Notification;
    active: boolean;
};

const ICON_BY_TYPE: Record<T_NotificationType, { Icon: typeof BsClipboardData; bg: string; fg: string }> = {
    0: { Icon: BsClipboardData, bg: "#F0FDF9", fg: "#065F46" }, // Resumen → mint
    1: { Icon: BsPersonCheck, bg: "#DBEAFE", fg: "#1D4ED8" }, // Asignación → blue
    2: { Icon: BsExclamationCircle, bg: "#FEF9C3", fg: "#854D0E" }, // Pendiente → amber
};

const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent ?? "";
};

const formatTimestamp = (iso: string): string => {
    const diffDays = getDateDiff(iso);
    if (diffDays === 0) return `Hoy, ${getNormalDate(iso, { timeStyle: "short" })}`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return getNormalDate(iso, { dateStyle: "medium" });
};

export default function NotificationItem({ notification, active }: Props) {
    const unread = notification.est_noti === 0;
    const { Icon, bg, fg } = ICON_BY_TYPE[notification.tipo_noti];
    const preview = stripHtml(notification.desc_noti);

    return (
        <Stack
            direction="horizontal"
            className={classnames("gap-3 align-items-start p-3", {
                "border rounded-1": active,
            })}
        >
            <div
                className="p-2 rounded-circle d-inline-flex align-items-center justify-content-center position-relative"
                style={{ background: bg, color: fg }}
            >
                <Icon size={18} className="m-1" />
                {unread && <div className="position-absolute top-0 start-0 p-1 bg-danger rounded-circle" />}
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <div className="d-flex justify-content-between align-items-baseline mb-1">
                    <span className="eyebrow" style={{ color: fg }}>{getNotificationLabel(notification.tipo_noti)}</span>
                    <small className="text-secondary" style={{ fontSize: 11 }}>
                        {formatTimestamp(notification.marc_temp)}
                    </small>
                </div>
                <div
                    className={classnames("text-truncate", { "fw-semibold": unread })}
                >
                    {getNotificationSubject(notification.asun_noti) || "Sin asunto"}
                </div>
                <div
                    className="text-secondary mt-1 lh-sm small"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {preview}
                </div>
            </div>
        </Stack>
    );
}
