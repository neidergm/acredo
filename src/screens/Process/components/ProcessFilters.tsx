import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { type I_ProcessType } from "../../../interfaces/process.interface";
import { LuSearch } from "react-icons/lu";
import { useSearchParams } from "react-router";
import { useDebouncedCallback } from "use-debounce";

export type T_Scope = "" | "Terminados";

type Props = {
    types: I_ProcessType[];
    totalCount: number;
};

const SEARCH_DEBOUNCE_MS = 500;

export default function ProcessFilters({
    types,
    totalCount,
}: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const isActive = (id: number | null) => {
        return searchParams.get("type") === (id !== null ? id.toString() : null);
    };

    const debouncedSearch = useDebouncedCallback((value) => {
        if (value) searchParams.set("search", value);
        else searchParams.delete("search");

        setSearchParams(searchParams);
    }, SEARCH_DEBOUNCE_MS);


    const onChangeScope = (e: React.ChangeEvent<HTMLSelectElement>) => {

        if (e.target.value === "") searchParams.delete("status");
        else searchParams.set("status", e.target.value);

        setSearchParams(searchParams);
    }

    const onChangeType = (id: number | null) => {

        if (id === null) searchParams.delete("type");
        else searchParams.set("type", id.toString());

        setSearchParams(searchParams);
    }

    return (
        <Row className="g-3">
            <Col md={5} lg={6} xl={4} className="col">
                <Form.Group>
                    <Form.Label className="mb-1" htmlFor="search-control">Buscar: </Form.Label>
                    <div className="position-relative">
                        <LuSearch size={16} className="position-absolute top-50 start-0 ms-3 translate-middle-y" />
                        <Form.Control
                            className="ps-8"
                            type="search"
                            id="search-control"
                            placeholder="Nombre, programa, SNIES o sede..."
                            defaultValue={searchParams.get("search") || ""}
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />
                    </div>
                </Form.Group>
            </Col>
            <Col xs={"auto"}>
                <Form.Group>
                    <Form.Label className="mb-1" htmlFor="status-select">Estado: </Form.Label>
                    <Form.Select
                        id="status-select"
                        value={searchParams.get("status") || ""}
                        onChange={onChangeScope}
                    >
                        <option value="">Abierto</option>
                        <option value="Terminados">Finalizado</option>
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col xs={12} md={"auto"} className="ms-auto">
                <Form.Group>
                    <Form.Label className="mb-1">Tipo: </Form.Label>
                    <Stack direction="horizontal" gap={2} className="align-items-center overflow-auto text-nowrap">
                        <Button
                            variant={isActive(null) ? "dark text-primary-surface" : "outline-secondary"}
                            size="sm"
                            className="rounded-pill"
                            onClick={() => onChangeType(null)}
                        >
                            Todos {isActive(null) && `(${totalCount})`}
                        </Button>
                        {types.map((t) => (
                            <Button
                                key={t.id_tcond}
                                variant={isActive(t.id_tcond) ? "dark text-primary-surface" : "outline-secondary"}
                                size="sm"
                                className="rounded-pill"
                                onClick={() => onChangeType(t.id_tcond)}
                            >
                                {t.nomb_tcond} {isActive(t.id_tcond) && `(${totalCount})`}
                            </Button>
                        ))}
                    </Stack>
                </Form.Group>
            </Col>
        </Row>
    );
}
