import { useEffect, useRef, useState } from 'react'
import { AXIOS_REQUEST } from '../../services/axiosService'
import { ATTACHMENTS_BY_PHASE } from '../../services/endPointsService'
import { type T_AttachmentInPhase, type T_AttachmentsOfPhases } from '../../interfaces/phasesAndStages.interface'
import { AccordionBody, AccordionHeader, AccordionItem, Badge, Button, DropdownToggle, Input, Table, UncontrolledAccordion } from 'reactstrap'
import CustomDropdown from '../CustomDropdown'
import { toast } from 'react-hot-toast'
import { Calendar2Event, CloudArrowDownFill, ExclamationCircleFill, LinkIcon, People, Quote, ThreeDotsVertical } from '../Icons'
import { type I_JSONObject } from '../../interfaces/generic.interface'
import Loader from '../Loader'
import classnames from 'classnames'
import { getNormalDate } from '../../utils/dateUtils'
import type { XLSX_Range } from '../../utils/xslxUtils'

const generateExcelBookData = (list: T_AttachmentMetaData[]) => {
    const extraCells = ["Ubicación", "Criterios", "Evidencias"];
    const extraCells_keyName = ["ubianexo", "nomb_criterio", "nomb_evidencia"];

    const header = ["Nombre", "Url", "Última modificación", "Usuario", ...extraCells, "¿Es referenciado?"];

    const criterialCell = extraCells.map(i => header.indexOf(i));

    const body: string[][] = [];
    const merges: XLSX_Range[] = [];

    list.forEach((item) => {
        const r = body.length + 1;
        item.ceanexo?.forEach((ane: I_JSONObject) => {
            body.push(
                [
                    item._attName_completed, item.anexo[0].url, item._lastUpdate, item._user,
                    ...(extraCells_keyName.map(i => ane[i])),
                    item._isReference ? "SI" : "NO"
                ]
            );
        })

        if (item.ceanexo.length > 1) {
            for (let c = 0; c < header.length; c++) {
                if (criterialCell.includes(c)) continue;
                merges.push({ s: { r, c }, e: { r: r + item.ceanexo.length - 1, c } })
            }
        }
    });

    return { data: [header, ...body], merges }
}

type T_AttachmentMetaData = {
    _nomb_anexo: string,
    _attName_completed: string,
    _deletedReference: boolean,
    _isReference: boolean,
    _user: string,
    _lastUpdate: string,
    [x: string]: any
}

type T_Attachments = ({
    attachments: { [group: string]: T_AttachmentMetaData }
} & T_AttachmentsOfPhases[0]
)[]


let timeout: ReturnType<typeof setTimeout>;

const AllAttachments = ({
    phaseId
}: { phaseId: string | number }) => {
    const fetchedData = useRef<T_Attachments | null>(null)

    const [groups, setGroups] = useState<T_Attachments | null>(null);

    const [filter, setFilter] = useState("");

    const toClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copiado", { position: "top-right" })
    }

    const mapAttachmentData = (attachs: T_AttachmentInPhase[]): T_AttachmentMetaData => {
        let _nomb_anexo = "";
        let _deletedReference = false;

        const data: I_JSONObject = attachs?.reduce((p, c) => {
            if (c.nomb_anexo) _nomb_anexo = c.nomb_anexo;
            if (c.est_anexo === 0) _deletedReference = true;
            return { ...p, [c.name_campo]: c.respuesta }
        }, {}) || {}

        const _isReference = data.tipo_anexo === "reference"

        let _attName_completed = `${_nomb_anexo}-${data.anexo_nombre}`;

        if (_isReference) {
            data.anexo = data.anexo_ref;
            _attName_completed = _nomb_anexo;
        }

        return {
            _nomb_anexo, _attName_completed, _deletedReference, _isReference, _user: attachs[0].usuario, _lastUpdate: attachs[0].marc_temp, ...data
        }
    }

    const doRowByItem = (attachs: T_AttachmentMetaData) => {

        const { _attName_completed, _deletedReference, _isReference, _nomb_anexo, _user, _lastUpdate, ...data } = attachs;

        try {
            return data.ceanexo?.filter((_a: any) => new RegExp(`${filter}`, "gi").test(`${_nomb_anexo}-${data.anexo_nombre}`))
                .map((i: any, idx: number) => {
                    return <tr key={`row-${_nomb_anexo}-${idx}`} className={classnames({ "table-danger": _deletedReference })}>
                        {idx === 0 && <td
                            rowSpan={data.ceanexo?.length || 1}
                            style={{ maxWidth: "300px" }}
                        >
                            <div className="d-flex flex-column justify-content-between h-100">
                                <div className='text-nowrap'>
                                    <div className='d-flex gap-1 mb-2 mt-1 align-items-start'>
                                        {!!(data.anexo) && <>
                                            <div className='flex-grow-1 fw-semibold'>
                                                <p className='mb-0 text-wrap'>{_attName_completed}</p>
                                            </div>
                                        </>}
                                        <CustomDropdown
                                            options={[
                                                {
                                                    text: "Copiar nombre",
                                                    icon: <Quote />,
                                                    click: () => toClipboard(`Anexo ${_attName_completed}`)
                                                },
                                                {
                                                    text: "Copiar link",
                                                    icon: <LinkIcon />,
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
                                {_isReference && <div>
                                    <Badge className='gap-1 d-inline-flex align-items-center'>
                                        <LinkIcon />
                                        <span>ANEXO REFERENCIADO</span>
                                    </Badge>
                                </div>}
                                {_deletedReference && <p className='text-danger fw-semibold'>
                                    <ExclamationCircleFill size={18} /> Este anexo ha sido eliminado
                                </p>}
                                <div className='text-muted'>
                                    <div>
                                        <small><Calendar2Event size={13} /> Última modificación {getNormalDate(_lastUpdate, { dateStyle: 'long' })}</small>
                                    </div>
                                    <div>
                                        <small><People size={13} /> {_user}</small>
                                    </div>
                                </div>
                            </div>
                        </td>}
                        <td>{i.ubianexo}</td>
                        <td>
                            <div className='mb-2'>
                                <b>Criterio:</b> <span>{i.nomb_criterio}</span>
                            </div>
                            <div>
                                <b>Evidencia:</b> <span>{i.nomb_evidencia}</span>
                            </div>
                        </td>
                        {/* <td style={{ maxWidth: "300px" }}>{i.evidencias}</td> */}
                    </tr>
                })
        } catch (error) {
            return <tr className='bg-danger bg-opacity-25'>
                <td
                    className="text-nowrap"
                    style={{ maxWidth: "300px" }}
                >
                    {_nomb_anexo}
                </td>
                <td><b className='text-danger'>ERROR</b></td>
                <td style={{ maxWidth: "300px" }}>Debe eliminar este registro</td>
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

    const downloadAllInExcelDoc = async () => {
        const tid = toast.loading("Generando archivo...");
        try {
            const { XLSX, generateSheetInBook } = await import('../../utils/xslxUtils');
            const workbook = XLSX.utils.book_new();
            groups!.forEach((g) => {
                const { data, merges } = generateExcelBookData(Object.values(g.attachments))
                const sheetname = g.nomb_cond.substring(0, 30).replaceAll("/", "_");
                generateSheetInBook(workbook, data, sheetname)['!merges'] = merges;
            })
            XLSX.writeFile(workbook, `Todos los anexos.xlsx`)
        } finally {
            toast.dismiss(tid);
        }
    }

    const downloadExcelDoc = async (_data: T_AttachmentMetaData[], name: string) => {
        const tid = toast.loading("Generando archivo...");
        try {
            const { XLSX, generateSheetInBook } = await import('../../utils/xslxUtils');
            const workbook = XLSX.utils.book_new();
            const { data, merges } = generateExcelBookData(_data)
            // eslint-disable-next-line no-useless-escape
            const docName = `ANEXOS ${name}`.substring(0, 250).replaceAll(/[\/\?<>\\:\*\|"]/g, "_");
            generateSheetInBook(workbook, data, "Anexos")['!merges'] = merges;
            XLSX.writeFile(workbook, `ANEXOS ${docName}.xlsx`)
        } catch (error) {
            downloadExcelDoc(_data, "ANEXOS DEL PROCESO")
        } finally {
            toast.dismiss(tid);
        }
    }

    useEffect(() => {
        AXIOS_REQUEST(ATTACHMENTS_BY_PHASE + phaseId).then(({ data }: { data: T_AttachmentsOfPhases }) => {
            const g = data.map((item) => {
                const anexos_by_group_resp = item.anexos?.reduce<{ [group: string]: T_AttachmentInPhase[] }>((p: any, c) => {
                    p[c.grupo_resp] = [...(p[c.grupo_resp] || []), c]
                    return p;
                }, {}) || {}

                return {
                    ...item,
                    anexos_by_group_resp,
                    attachments: Object.entries(anexos_by_group_resp)
                        .reduce((p, [k, d]) => ({ ...p, [k]: mapAttachmentData(d) }), {})
                };
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
                <div className='col'>
                    <Button color='primary2' onClick={() => { downloadAllInExcelDoc() }}>
                        <i className='me-2'><CloudArrowDownFill /></i>Descargar todo
                    </Button>
                </div>
                <div className='col-md-6 col-lg-5 col-xl-4'>
                    <Input placeholder='Filtrar por nombre de anexo' className='ms-auto'
                        type='search'
                        onChange={(e) => filterItems(e.target.value)} />
                </div>
            </div>
            <div className='attach'>
                <UncontrolledAccordion stayOpen flush defaultOpen={groups.length ? [] : ["0"]} toggle={() => { }}>
                    {groups?.map((item, tid) =>
                        <AccordionItem key={tid}>
                            <div className='d-flex align-items-center justify-content-between'>
                                <AccordionHeader targetId={`${tid}`}
                                    className="flex-grow-1 border"
                                    tag="div"
                                >
                                    <span className='flex'>
                                        <span className="text-black fw-semibold">{item.nomb_cond}</span>
                                    </span>
                                    <span className='flex-grow-1 text-end px-2'>
                                        <Badge color='primary' className='bg-opacity-50'>
                                            {Object.values(item.anexos_by_group_resp || {}).length}
                                        </Badge>
                                        <span title="Descargar Excel" className='btn btn-link link-secondary ms-1 btn-sm' onClick={() => { downloadExcelDoc(Object.values(item.attachments), item.nomb_cond) }}>
                                            <i><CloudArrowDownFill /></i>
                                        </span>
                                    </span>
                                </AccordionHeader>
                            </div>
                            <AccordionBody accordionId={`${tid}`} className='bg-light accordion-body-px-0 accordion-body-py-0'>
                                {item.anexos.length ?
                                    <Table bordered responsive key={`TABLE-${tid}`} className='h-100' id={`TABLE-${tid}`}>
                                        <thead className='small'>
                                            <tr className="table-primary">
                                                <th>Anexo</th>
                                                <th>Ubicación evidencia</th>
                                                <th>Criterios y evidencias</th>
                                                {/* <th>Evidencia</th> */}
                                            </tr>
                                        </thead>
                                        <tbody className='small'>
                                            {Object.values(item.attachments).map((i) => doRowByItem(i))}
                                            {/* {Object.values(item.anexos_by_group_resp!).map((i, idx) => doRowByItem(i))} */}
                                        </tbody>
                                    </Table>
                                    : <p className='p-3 fw-bold text-warning'><ExclamationCircleFill /> Sin anexos</p>}
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