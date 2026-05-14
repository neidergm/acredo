import { useMemo, useState } from "react";
import classnames from "classnames";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { useGetNotificationsQuery } from "../../services/api/notifications.api";
import NotificationsFilters, { type T_FilterScope } from "./components/NotificationsFilters";
import NotificationsList from "./components/NotificationsList";
import NotificationDetailPanel from "./components/NotificationDetailPanel";
import Heading from "../../components/Heading";

export default function Notifications() {
    const { data: list, isLoading, isError, refetch } = useGetNotificationsQuery();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [scope, setScope] = useState<T_FilterScope>("all");

    const all = useMemo(() => list ?? [], [list]);
    const unreadCount = useMemo(() => all.filter((n) => n.est_noti === 0).length, [all]);

    const filtered = useMemo(() => {
        if (scope === "all") return all;
        if (scope === "unread") return all.filter((n) => n.est_noti === 0);
        return all.filter((n) => n.tipo_noti === scope);
    }, [all, scope]);

    const selected = useMemo(
        () => (selectedId ? all.find((n) => n.id_noti === selectedId) ?? null : null),
        [all, selectedId]
    );

    return (
        <>
            <div className="container-fluid container-xxxl">

                <Heading>Tu actividad reciente</Heading>

                <NotificationsFilters
                    scope={scope}
                    onChange={setScope}
                    totalCount={all.length}
                    unreadCount={unreadCount}
                />

                {isLoading && (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner variant="primary" />
                    </div>
                )}

                {isError && (
                    <Alert variant="danger" className="d-flex align-items-center justify-content-between">
                        <span>No se pudieron cargar las notificaciones.</span>
                        <Button className="btn btn-sm btn-outline-danger" onClick={() => refetch()}>
                            Reintentar
                        </Button>
                    </Alert>
                )}

                {!isLoading && !isError && (
                    <Row
                        className="g-3 mt-1"
                        style={{ minHeight: "60dvh" }}
                    >
                        <Col
                            {...(selected ? { lg: 5, xl: 4 } : { lg: 7, xl: 8 })}
                            className={classnames("transition-all-linear", { "d-none d-lg-block": selected })}
                        >
                            <NotificationsList
                                notifications={filtered}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                            />
                        </Col>
                        <Col
                            className={classnames("transition-all-linear", { "d-none d-lg-block": !selected })}
                        >
                            <NotificationDetailPanel
                                notification={selected}
                                onClose={() => setSelectedId(null)}
                            />
                        </Col>
                    </Row>
                )}
            </div>
        </>
    );
}
