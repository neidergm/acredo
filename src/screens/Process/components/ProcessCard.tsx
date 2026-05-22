import { Badge, Button, Card, Stack } from "react-bootstrap";
import { LuCheck, LuEllipsisVertical, LuSquarePen, LuTrash2, LuMapPin, LuCircleDot, LuMoveRight } from "react-icons/lu";
import CustomDropdown from "../../../components/CustomDropdown";
import { type I_Process } from "../../../interfaces/process.interface";
import { getNormalDate } from "../../../utils/dateUtils";
import { getProcessTypePalette } from "../utils/processTypeColors";
import ProcessProgressRing from "./ProcessProgressRing";

import styles from "../process.module.scss";

type Props = {
    process: I_Process;
    canManage: boolean;
    onOpen: (process: I_Process) => void;
    onEdit: (process: I_Process) => void;
    onDelete: (process: I_Process) => void;
};

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

export default function ProcessCard({ process, canManage, onOpen, onEdit, onDelete }: Props) {
    const palette = getProcessTypePalette(process.id_tcond);
    const done = (process.porcentaje ?? 0) >= 100;
    const title = process.programa ?? process.nomb_conv;

    return (
        <Card className={`position-relative h-100 overflow-hidden ${styles["card-clickable"]}`} onClick={() => onOpen(process)}>

            <Card.Header className="border-0 pt-4 pb-0">
                {/* <div className={styles["type-strip"]} style={{ background: palette.c }} /> */}
                <Stack gap={2} direction="horizontal" onClick={stopPropagation}>
                    <Stack direction="horizontal" gap={1} className="text-secondary flex-grow-1">
                        <Badge
                            pill
                            className="text-uppercase bg-opacity-25 border-1 d-inline-flex align-items-center gap-1"
                            style={{
                                background: palette.bg,
                                color: palette.tx,
                                borderColor: palette.br,
                                borderStyle: "solid",
                            }}
                        >
                            <LuCircleDot /> {process.tipo_cond}
                        </Badge>
                        <Badge pill bg="light" text="secondary" className="border border-1 bg-opacity-50">
                            <LuMapPin /> {process.sede}
                        </Badge>
                    </Stack>
                    {canManage && (
                        <CustomDropdown
                            options={[
                                { text: "Modificar proceso", icon: <LuSquarePen size={16} />, click: () => onEdit(process) },
                                { text: "Eliminar proceso", icon: <LuTrash2 size={16} />, click: () => onDelete(process) },
                            ]}
                        >
                            <Button variant="outline-light" className="text-body px-2">
                                <LuEllipsisVertical size={18} />
                            </Button>
                        </CustomDropdown>
                    )}
                </Stack>
            </Card.Header>

            {/* <Card.Body className="d-flex gap-4">
                <div className="d-flex justify-content-center">
                    <ProcessProgressRing value={process.porcentaje ?? 0} />
                </div>
                <div title={title ?? undefined} className="align-self-center">
                    <div className="fw-semibold small">
                        {title || process.nomb_conv}
                    </div>
                    <div className={styles["snies"]}>{process.cod_snies ? `SNIES ${process.cod_snies}` : ""}</div>
                </div>
            </Card.Body> */}
            <Card.Body className="d-flex flex-column gap-2">
                <div title={title ?? undefined}>
                    <div className="fw-semibold text-truncate">
                        {title || process.nomb_conv}
                    </div>
                    <div className={`${styles["snies"]} text-secondary text-opacity-50`}>
                        {process.cod_snies ? `SNIES ${process.cod_snies}` : ""}
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <ProcessProgressRing value={process.porcentaje ?? 0} />
                </div>
            </Card.Body>

            <Card.Footer className="small">
                <div className={done ? "text-success" : "text-secondary"}>
                    {done ? (
                        <><LuCheck /> Proceso completado</>
                    ) : (
                        <><LuMoveRight size={14} /> {process.fase_actual ?? "Sin fase actual"}</>
                    )}
                </div>
                <div className="text-secondary opacity-50 mt-1 small">Creado el {getNormalDate(process.marc_temp)}</div>
            </Card.Footer>
        </Card>
    );
}
