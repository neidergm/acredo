import React, { type Ref, useEffect, useState } from 'react'
import { Col, Input, Row } from 'reactstrap'
import { AXIOS_REQUEST } from '../../services/axiosService';
import { ATTACHMENTS_BY_PHASE } from '../../services/endPointsService';
import { type T_AttachmentsOfPhases } from '../../interfaces/phasesAndStages.interface';
import { useAppSelector } from '../../hooks/useAppSelector';
import { type I_JSONObject } from '../../interfaces/generic.interface';

type T_Props = {
    name: string;
    value?: unknown;
    innerRef?: Ref<HTMLInputElement>;
    onChange: (value: unknown) => void;
    onBlur: (value: unknown) => void;
    placeholder?: string;
    className?: string;
    [x: string]: unknown;
}

const DataListInput = ({ name, onChange, onBlur, value, ...props }: T_Props) => {
    // const selectedProcess = useAppSelector(s => s.process.selected);
    const { active } = useAppSelector(s => s.conditions.selectedData);

    const [list, setList] = useState<[string, string, string, { url: string, name: string }, number][]>([])
    const [selected, setSelected] = useState<typeof list[0] | false>()

    const onInputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value?.replace?.("Anexo ", "");

        if (e.target.value !== val) e.target.value = val

        const sel = list.find(i => `${i[0]}-${i[1]}` === val);
        setSelected(sel)

        onChange(sel && sel[4])
    }

    const onBlurHandle = () => {
        onBlur(selected && selected[4])

        if (!selected) {
            setSelected(false)
        }
    }

    useEffect(() => {
        if (!list.length) {
            AXIOS_REQUEST(ATTACHMENTS_BY_PHASE + active?.phase?.id).then(({ data }: { data: T_AttachmentsOfPhases }) => {
                let filteredByPhase: typeof list = [];
                let valuePosition = -1;

                data.forEach(phase => {
                    filteredByPhase = [
                        ...filteredByPhase,
                        ...Object.values(phase.anexos.reduce((p: I_JSONObject, c) => {
                            if (!p[c.grupo_resp]) p[c.grupo_resp] = new Array(4)
                            if (c.nomb_anexo) {
                                p[c.grupo_resp][0] = c.nomb_anexo;
                                p[c.grupo_resp][2] = c.grupo_resp;
                                p[c.grupo_resp][3] = c.respuesta[0];
                                p[c.grupo_resp][4] = c.id_resp;

                                if (value === c.id_resp) {
                                    valuePosition = Object.keys(p[c.grupo_resp]).findIndex(i => i === c.grupo_resp);
                                }

                            } else if (c.name_campo === "anexo_nombre") {
                                p[c.grupo_resp][1] = c.respuesta
                            }
                            return { ...p }
                        }, {}))
                    ]
                })
                setList(filteredByPhase)
                if (value) {
                    setSelected(filteredByPhase[valuePosition])
                }
            })
        }
    }, [])

    return (
        <Row>
            <Col>
                <Input {...props} name={name} type="text" list={`data-${name}`} onChange={onInputHandle} onBlur={onBlurHandle}
                    readOnly={!list.length}
                    placeholder={!list.length ? 'Cargando...' : props.placeholder}
                />
                <datalist id={`data-${name}`}>
                    {list.map((item, key) => <option key={key} value={`${item[0]}-${item[1]}`} />)}
                </datalist>
            </Col>
            <Col md={12} lg={6}>
                {selected ? <Input
                    className='cursor-pointer text-primary disabled mt-1 mt-lg-0'
                    readOnly
                    type="text"
                    value={`${selected[3].url}`}
                    onClick={() => window.open(selected[3].url, "_blank")}
                />
                    : (selected === false && <Input
                        disabled
                        invalid
                        value={"No se encontró anexo con el código indicado"}
                        className='text-danger disabled mt-1 mt-lg-0 bg-danger bg-opacity-10'

                    />)
                }
            </Col>
        </Row>
    )
}

export default DataListInput