import type { T_NotificationType } from "../../../interfaces/notification.interface";
import { getNotificationLabel } from "../../../utils/notifications.utils";
import { Button } from "react-bootstrap";

export type T_FilterScope = "all" | "unread" | T_NotificationType;

type Props = {
    scope: T_FilterScope;
    onChange: (next: T_FilterScope) => void;
    totalCount: number;
    unreadCount: number;
};

const TYPE_VALUES: T_NotificationType[] = [0, 1, 2];

export default function NotificationsFilters({ scope, onChange, totalCount, unreadCount }: Props) {
    const isActive = (s: T_FilterScope) => scope === s;

    return (
        <div className="d-flex gap-2 align-items-center overflow-auto text-nowrap">
            <Button
                variant={isActive("all") ? "dark text-primary-surface" : "outline-secondary"}
                size="sm"
                className="rounded-pill"
                onClick={() => onChange("all")}
            >
                Todas ({totalCount})
            </Button>
            <Button
                variant={isActive("unread") ? "dark text-primary-surface" : "outline-secondary"}
                size="sm"
                className="rounded-pill"
                onClick={() => onChange("unread")}
                // disabled={unreadCount === 0}
            >
                No leídas ({unreadCount})
            </Button>
            {TYPE_VALUES.map((t) => (
                <Button
                    key={t}
                    variant={isActive(t) ? "dark text-primary-surface" : "outline-secondary"}
                    size="sm"
                    className="rounded-pill"
                    onClick={() => onChange(t)}
                >
                    {getNotificationLabel(t)}
                </Button>
            ))}
        </div>
    );
}
