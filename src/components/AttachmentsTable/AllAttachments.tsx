import { useEffect, useRef, useState } from 'react'
import { AXIOS_REQUEST } from '../../services/axiosService'
import { ATTACHMENTS_BY_PHASE } from '../../services/endPointsService'
import { T_AttachmentInPhase, T_AttachmentsOfPhases } from '../../interfaces/phasesAndStages.interface'
import { AccordionBody, AccordionHeader, AccordionItem, DropdownToggle, Input, Table, UncontrolledAccordion } from 'reactstrap'
import CustomDropdown from '../CustomDropdown'
import { toast } from 'react-hot-toast'
import { Calendar2Event, ExclamationCircleFill, Link, People, Quote, ThreeDotsVertical } from '../Icons'
import { I_JSONObject } from '../../interfaces/generic.interface'
import Loader from '../Loader'
import { getNormalDate } from '../../utils/dateUtils'

let timeout: any;

const AllAttachments = ({
    phaseId
}: { phaseId: string | number }) => {
    const fetchedData = useRef<T_AttachmentsOfPhases | null>(null)

    const [groups, setGroups] = useState<T_AttachmentsOfPhases | null>(null);

    const [filter, setFilter] = useState("");
    // const [list, setList] = useState<typeof _list>([]);

    const toClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copiado", { position: "top-right" })
    }

    const doRowByItem = (attachs: T_AttachmentInPhase[]) => {

        let nomb_anexo = "";

        const data: I_JSONObject = attachs.reduce((p, c) => {
            if (c.nomb_anexo) nomb_anexo = c.nomb_anexo;
            return { ...p, [c.name_campo]: c.respuesta }
        }, {})

        try {
            return data.ceanexo?.filter((a: any) => new RegExp(`${filter}`, "gi").test(`${nomb_anexo}-${data.anexo_nombre}`))
                .map((i: any, idx: number) => <tr key={`row-${nomb_anexo}-${idx}`}>
                    {idx === 0 && <td
                        rowSpan={data.ceanexo?.length || 1}
                        // className="text-nowrap"
                        style={{ maxWidth: "300px" }}
                    >
                        <div className="d-flex flex-column justify-content-between h-100">
                            <div className='text-nowrap'>
                                <div className='d-flex gap-1 mb-2 mt-1 align-items-start'>
                                    {!!(data.anexo) && <>
                                        <div className='flex-grow-1 fw-semibold'>
                                            <p className='mb-0 text-wrap'>
                                                {nomb_anexo}-{data.anexo_nombre}
                                            </p>
                                        </div>
                                    </>}
                                    <CustomDropdown
                                        options={[
                                            {
                                                text: "Copiar nombre",
                                                icon: <Quote />,
                                                click: () => toClipboard(`Anexo ${nomb_anexo}-${data.anexo_nombre}`)
                                            },
                                            {
                                                text: "Copiar link",
                                                icon: <Link />,
                                                click: () => toClipboard(data.anexo[0].url)
                                            }
                                        ]
                                        }
                                    >
                                        <DropdownToggle size="sm" color='link' className='text-dark p-0 position-relative'>
                                            <ThreeDotsVertical />
                                        </DropdownToggle>
                                    </CustomDropdown>
                                </div>
                                {!!(data.anexo) &&
                                    <p>
                                        <a href={data.anexo[0].url} target="_blank" className="text-wrap"><small>{data.anexo[0].url}</small></a>
                                    </p>
                                }
                            </div>
                            <div className='text-muted'>
                                <div>
                                    <small><Calendar2Event size={13} /> Última modificación {getNormalDate(attachs[0].marc_update, { dateStyle: 'long' })}</small>
                                </div>
                                <div>
                                    <small><People size={13} /> {attachs[0].usuario}</small>
                                </div>
                            </div>
                        </div>
                    </td>}
                    <td>{i.ubianexo}</td>
                    <td>
                        <div className='mb-2'>
                            <b>Criterio:</b> <span>{i.criterio}</span>
                        </div>
                        <div>
                            <b>Evidencia:</b> <span>{i.evidencias}</span>
                        </div>
                    </td>
                    {/* <td style={{ maxWidth: "300px" }}>{i.evidencias}</td> */}
                </tr>)
        } catch (error) {
            return <tr className='bg-danger bg-opacity-25'>
                <td
                    className="text-nowrap"
                    style={{ maxWidth: "300px" }}
                >
                    {nomb_anexo}
                </td>
                <td><b className='text-danger'>ERROR</b></td>
                <td style={{ maxWidth: "300px" }}>Debe eliminar este registro</td>
                <td></td>
            </tr>
        }
    }

    const filterItems = (val: string) => {
        if (timeout) {
            clearInterval(timeout)
        }

        timeout = setTimeout(() => {
            setFilter(val)
        }, 500)
    }

    useEffect(() => {
        AXIOS_REQUEST(ATTACHMENTS_BY_PHASE + phaseId).then(({ data }: { data: T_AttachmentsOfPhases }) => {
            const g = data.map((item) => {
                const anexos_by_group_resp = item.anexos.reduce((p: any, c) => {
                    p[c.grupo_resp] = [...(p[c.grupo_resp] || []), c]
                    return p;
                }, {})

                return { ...item, anexos_by_group_resp };
            })

            fetchedData.current = g;
            setGroups(g);
        }).catch(() => {
            setGroups([]);
        })
    }, [])

    if (!groups) {
        return <div>
            <Loader isOpen loaderAsModal={false} />
            <p className='my-4 text-center'>Consultando anexos</p>
        </div>
    } else if (groups.length === 0) {
        return <div className='text-muted my-5 text-center'>
            <div className='opacity-50 mb-2'><ExclamationCircleFill size={30} /></div>
            Sin anexos para mostrar
        </div>
    }

    return (
        <>
            <div className='text-end mb-3 row justify-content-end'>
                <div className='col-md-6 col-lg-5 col-xl-4'>
                    <Input placeholder='Filtrar por nombre de anexo' className='ms-auto'
                        type='search'
                        onChange={(e) => filterItems(e.target.value)} />
                </div>
            </div>
            <div className='attach'>
                <UncontrolledAccordion stayOpen flush defaultOpen={["0"]}>
                    {groups?.map((item, tid) =>
                        <AccordionItem key={tid}>
                            <div className='d-flex align-items-center justify-content-between'>
                                <AccordionHeader targetId={`${tid}`}
                                    className="flex-grow-1 border"
                                    tag="div"
                                >
                                    <span>
                                        <span className="text-black fw-semibold">{item.nomb_cond}</span>
                                    </span>
                                </AccordionHeader>
                            </div>
                            <AccordionBody accordionId={`${tid}`} className='bg-light  accordion-body-px-0 accordion-body-py-0'>
                                {item.anexos.length ?
                                    <Table bordered responsive key={`TABLE-${tid}`} className='h-100'>
                                        <thead className='small'>
                                            <tr className="table-primary">
                                                <th>Anexo</th>
                                                <th>Ubicación evidencia</th>
                                                <th>Criterios y evidencias</th>
                                                {/* <th>Evidencia</th> */}
                                            </tr>
                                        </thead>
                                        <tbody className='small'>
                                            {Object.values(item.anexos_by_group_resp || {}).map((i, idx) => doRowByItem(i))}
                                        </tbody>
                                    </Table>
                                    : <p>Sin anexos</p>}
                            </AccordionBody>
                        </AccordionItem>
                    )
                    }
                </UncontrolledAccordion>
            </div>
        </>
    )
}

export default AllAttachments