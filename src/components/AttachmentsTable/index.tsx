import React, { useState } from 'react'
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from 'reactstrap'
import { useAppSelector } from '../../hooks/useAppSelector'
import { I_FormFieldWithAnswer } from '../../interfaces/conditions.interface'
import { T_Form, T_FormPannelActions } from './../../screens/Conditions/FormPannel'
import Alert, { I_AlertObject } from '../Alert'
import { ChatDots, ChatDotsFill, Edit, Link, Quote, ThreeDotsVertical, XCircle } from '../Icons'
import ObservationChat from '../ObservationChat'
import toast, { Toaster } from 'react-hot-toast';

type T_Props = {
    list: { [group: string]: T_Form },
    canEdit?: boolean,
    onEdit?: (form: T_Form, action: string) => void,
} & Pick<T_FormPannelActions, "onDelete">

const AttachmentsTable = ({
    list,
    onDelete,
    onEdit,
    canEdit
}: T_Props) => {
    const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);
    const [observationsIsOpen, setObservationsIsOpen] = useState<{
        item: T_Form,
        attachment: I_FormFieldWithAnswer
    } | null>(null);

    const conditionSelected = useAppSelector(state => state.conditions.selected)

    const toClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copiado", { position: "top-right" })
    }

    const deleteAttach = (key: string, item: T_Form, attach: I_FormFieldWithAnswer) => {
        onDelete!(`${item.id_fcamp}/${key}`,
            undefined,
            <>Esta acción es irreversible, se eliminará de forma permanente el anexo <b>{attach?.nomb_anexo}</b></>
        )
    }

    const showObservations = (data: typeof observationsIsOpen) => {
        setObservationsIsOpen(data)
    }

    const doRowByItem = (item: T_Form, key: string) => {
        let original = item.originalFieldsObject as I_FormFieldWithAnswer[];
        let attachment = original.find(i => !!i.nomb_anexo)!;
        let { nomb_anexo, respuesta } = attachment || {};
        if (!item.defaultValues.ceanexo?.length) return null

        return item.defaultValues.ceanexo.map((i: any, idx: number) => <tr key={`row-${key}-${idx}`}>
            {idx === 0 && <td
                rowSpan={item.defaultValues.ceanexo.length || 1}
                className="text-nowrap"
                style={{ maxWidth: "300px" }}
            >
                <div className='d-flex gap-1 mb-2 mt-1 align-items-start'>
                    {!!(attachment) && <>
                        <div className='flex-grow-1 fw-semibold'>
                            <p className='mb-0 text-wrap'>
                                {nomb_anexo}-{item.defaultValues.anexo_nombre}
                            </p>
                        </div>
                        {!!(item.num_obs) && <div className="cursor-pointer ms-1 badge rounded-pill bg-danger" onClick={() => showObservations({ item, attachment })}>
                            <small>{item.num_obs as number}</small>
                        </div>}
                    </>}

                    <UncontrolledDropdown >
                        <DropdownToggle size="sm" color='link' className='text-dark p-0 position-relative'>
                            <ThreeDotsVertical />
                        </DropdownToggle>
                        <DropdownMenu className='border shadow-3 rounded-3 mt-1 py-3'>
                            <DropdownItem onClick={() => toClipboard(`Anexo ${nomb_anexo}`)}>
                                <div className='d-flex gap-3 text-secondary align-items-center'>
                                    <Quote /><span>Copiar nombre</span>
                                </div>
                            </DropdownItem>
                            <DropdownItem onClick={() => toClipboard(respuesta[0].url)}>
                                <div className='d-flex gap-3 text-secondary align-items-center'>
                                    <Link /> <span>Copiar link</span>
                                </div>
                            </DropdownItem>
                            <DropdownItem onClick={() => { showObservations({ item, attachment }) }}>
                                <div className='d-flex gap-3 text-secondary align-items-center'>
                                    {!!(item.num_obs) ?
                                        <span className='position-relative text-primary text-opacity-75'>
                                            <ChatDotsFill size={16} />
                                            <span className="position-absolute top-50 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                                        </span>
                                        :
                                        <ChatDots size={16} />
                                    }
                                    <span>Observaciones
                                        <small className='ms-4'><Badge pill className='bg-opacity-50'>{item.num_obs as number || 0}</Badge></small>
                                    </span>
                                </div>
                            </DropdownItem>
                            {canEdit && <>
                                {!!(onEdit) && <DropdownItem onClick={() => { onEdit(item, "Modificar") }}>
                                    <div className='d-flex gap-3 text-secondary align-items-center'>
                                        <Edit size={16} /><span>Editar anexo</span>
                                    </div>
                                </DropdownItem>}
                                {!!(onDelete) && <DropdownItem onClick={() => { deleteAttach(key, item, attachment) }}>
                                    <div className='d-flex gap-3 text-secondary align-items-center'>
                                        <XCircle size={16} /><span>Eliminar anexo</span>
                                    </div>
                                </DropdownItem>}
                            </>}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                {!!(attachment) &&
                    <p>
                        <a href={respuesta[0].url} target="_blank" className="text-wrap"><small>{respuesta[0].url}</small></a>
                    </p>
                }
            </td>}
            <td>{i.criterio}</td>
            <td style={{ maxWidth: "300px" }}>{i.evidencias}</td>
            <td>{i.ubianexo}</td>
        </tr >
        )
    }

    return (<>
        <Toaster />
        <ObservationChat
            onlyRead={!canEdit}
            grupo={observationsIsOpen?.attachment.grupo_resp}
            toggle={() => showObservations(null)}
            isOpen={!!(observationsIsOpen)}
            id_fcamp={observationsIsOpen?.attachment.id_fcamp}
            extra_data_to_send={{
                id_cond: conditionSelected?.id_cond,
            }}
        >
            <small className='text-muted'>
                <b className='border-start ps-2 border-3 border-primary'>Anexo </b>
                {observationsIsOpen && `${observationsIsOpen.attachment.nomb_anexo}`}
            </small>
        </ObservationChat>
        <div>
            <Alert isOpen={!!(alertConfirm?.isOpen)}{...alertConfirm} onClosed={() => { setAlertConfirm(null) }} />
            <Table bordered responsive>
                <thead className='small'>
                    <tr className="table-primary">
                        <th>Anexo</th>
                        <th>Criterio</th>
                        <th>Evidencia</th>
                        <th>Ubicación evidencia</th>
                    </tr>
                </thead>
                <tbody className='small'>
                    {
                        Object.keys(list).map(i => doRowByItem(list[i], i))
                    }
                </tbody>
            </Table>
        </div>
    </>)
}

export default AttachmentsTable;
