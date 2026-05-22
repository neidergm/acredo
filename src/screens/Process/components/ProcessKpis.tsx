import { Card, Col, Row, Spinner } from "react-bootstrap";
import { useGetProcessIndicatorsQuery } from "../../../services/api/process.api";

export default function ProcessKpis() {
    const { data, isLoading, isError } = useGetProcessIndicatorsQuery();

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center py-3">
                <Spinner size="sm" />
            </div>
        );
    }

    if (isError || !data?.length) {
        // El backend a veces devuelve vacío en cuentas nuevas. No es un error
        // bloqueante; simplemente no mostramos KPIs y dejamos que el resto de
        // la pantalla siga funcionando.
        return null;
    }

    const cols = Math.max(1, Math.round(12 / data.length));

    return (
        <Row className="g-3">
            {data.map((kpi) => (
                <Col xs={6} md={cols} key={kpi.estado}>
                    <Card className="h-100">
                        <Card.Body className="py-2 px-3">
                            <div className="h3 mb-0 fw-bold">{kpi.cantidad}</div>
                            <div className="small text-secondary text-truncate">{kpi.texto || kpi.estado}</div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
