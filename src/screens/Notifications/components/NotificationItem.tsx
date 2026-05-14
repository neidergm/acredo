import classnames from "classnames";
import { LuCircleAlert, LuCirclePlay, LuCircleUserRound } from "react-icons/lu";
import { type I_Notification } from "../../../interfaces/notification.interface";
import { getDateDiff, getNormalDate } from "../../../utils/dateUtils";
import { getNotificationLabel, getNotificationSubject } from "../../../utils/notifications.utils";
import { Stack } from "react-bootstrap";

type Props = {
    notification: I_Notification;
    active?: boolean;
};

const ICON_BY_TYPE = {
    0: { Icon: LuCirclePlay, bg: "bg-info-subtle", fg: "text-info" },
    1: { Icon: LuCircleUserRound, bg: "bg-primary-subtle", fg: "text-primary" },
    2: { Icon: LuCircleAlert, bg: "bg-warning-subtle", fg: "text-warning" },
};

const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent ?? "";
};

const formatTimestamp = (iso: string): string => {
    const diffDays = getDateDiff(iso);
    if (diffDays === 0) return `Hoy, ${getNormalDate(iso, { timeStyle: "short" })}`;
    if (diffDays === 1) return "Ayer";
    if (diffDays > 7) return getNormalDate(iso, { dateStyle: "medium" });
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return getNormalDate(iso, { dateStyle: "medium" });
};

export default function NotificationItem({ notification }: Props) {
    const unread = notification.est_noti === 0;
    const { Icon, bg, fg } = ICON_BY_TYPE[notification.tipo_noti];
    const preview = stripHtml(notification.desc_noti);

    return (
        <Stack
            direction="horizontal"
            className={classnames("gap-3 align-items-start p-3")}
        >
            <div
                className={classnames(
                    "p-1 rounded-circle position-relative bg-secondary-subtle text-secondary",
                    { [bg]: unread },
                    { [fg]: unread }
                )}
            >
                <Icon size={20} className="m-1" />
                {unread && <div className="position-absolute top-0 start-0 p-1 bg-danger rounded-circle" />}
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <div className="mb-1 lh-1 d-flex align-items-center gap-2 justify-content-between">
                    <span className={classnames("eyebrow small", { [fg]: unread }, { "fw-semibold": unread })}>
                        <small>
                        {getNotificationLabel(notification.tipo_noti)}
                        </small>     
                    </span>

                    <span className={classnames("text-secondary small", { "fw-semibold": unread })}>
                        <small>
                        {formatTimestamp(notification.marc_temp)}
                        </small>
                    </span>
                </div>
                <div className={classnames("text-truncate", { "fw-semibold": unread })}>
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
