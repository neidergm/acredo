import { LuBell } from "react-icons/lu";
import { type I_Notification } from "../../../interfaces/notification.interface";
import NotificationItem from "./NotificationItem";
import { Card, ListGroup, Stack } from "react-bootstrap";

type Props = {
    notifications: I_Notification[];
    selectedId: number | null;
    onSelect: (id: number) => void;
};

export default function NotificationsList({ notifications, selectedId, onSelect }: Props) {

    return (
        <Card className="h-100 overflow-hidden">
            <Card.Body className="p-0 overflow-auto">
                {notifications.length === 0 ? (
                    <Stack className="align-items-center justify-content-center text-secondary gap-3 h-100">
                        <LuBell size={40} />
                        <div>No hay nada para mostrar</div>
                    </Stack>
                ) : (
                    <ListGroup variant="flush">
                        {notifications.map((n) => (
                            <ListGroup.Item
                                key={n.id_noti}
                                action
                                active={selectedId === n.id_noti}
                                className="px-0 px-sm-2 px-lg-1 px-xl-2"
                                onClick={() => onSelect(n.id_noti)}
                            >
                                <NotificationItem notification={n} />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
}
