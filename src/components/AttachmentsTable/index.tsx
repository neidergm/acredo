import { useEffect, useRef, useState } from 'react'
import { Badge, Button, DropdownToggle, Table } from 'reactstrap'
import { useAppSelector } from '../../hooks/useAppSelector'
import { I_FormFieldWithAnswer } from '../../interfaces/conditions.interface'
import { T_Form, T_FormPannelActions } from './../../screens/Conditions/FormPannel'
import Alert from '../Alert'
import { ChatDots, ChatDotsFill, Edit, ExclamationCircleFill, Link, Quote, ThreeDotsVertical, XCircle } from '../Icons'
import ObservationChat from '../ObservationChat'
import toast from 'react-hot-toast';
import CustomDropdown from '../CustomDropdown'
import { Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON, closeModal } from '../Modal'
import Loader from '../Loader'
import Ordering from './Ordering'
import { AXIOS_REQUEST } from '../../services/axiosService'
import { ORDERING_ANSWERS } from '../../services/endPointsService'
import { jsonToFormData } from '../../utils/formUtils'
import useLoader from '../../hooks/useLoader'
import useAlert from '../../hooks/useAlert'

type T_Props = {
    list: { [group: string]: T_Form },
    canEdit?: boolean,
    onEdit?: (form: T_Form, action: string) => void,
    orderingCallback?: () => void,
} & Pick<T_FormPannelActions, "onDelete" | "onObservationsDone">

export type T_MapedItemList = {
    item: T_Form,
    attachment: any,
    criterio: any,
    evidencias: any,
    nomb_anexo: any,
    respuesta: any,
    id: number
}

const AttachmentsTable = ({
    list,
    onDelete,
    onEdit,
    canEdit,
    onObservationsDone,
    orderingCallback
}: T_Props) => {

    const { alertData, openAlert } = useAlert()

    const [mapedList, setMapedList] = useState<Array<T_MapedItemList>>([]);
    const orderRef = useRef<typeof mapedList>([]);
    const [modal, setModal] = useState<null | T_ModalJSON>(null)
    // const { loading, closeLoader, openLoader } = useLoader()
const { closeLoader, openLoader } = useLoader();

    const [observationsIsOpen, setObservationsIsOpen] = useState<{
        item: T_Form,
        attachment: I_FormFieldWithAnswer
    } | null>(null);

    const conditionSelected = useAppSelector(state => state.conditions.selected)

    const toClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copiado", { position: "top-right" })
    }

    const deleteAttach = (item: T_Form, attach: I_FormFieldWithAnswer) => {
        onDelete!(`${item.id_fcamp}/${attach.grupo_resp}`,
            undefined,
            <>Esta acción es irreversible, se eliminará de forma permanente el anexo <b>{attach?.nomb_anexo}</b></>
        )
    }

    const showObservations = (data: typeof observationsIsOpen) => setObservationsIsOpen(data)

    const doRowByItem = (list_item: T_MapedItemList, key: string) => {

        const { item, attachment, criterio, evidencias, nomb_anexo, respuesta } = list_item;

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
                    <CustomDropdown
                        options={[
                            {
                                text: "Copiar nombre",
                                icon: <Quote />,
                                click: () => toClipboard(`Anexo ${nomb_anexo}-${item.defaultValues.anexo_nombre}`)
                            },
                            {
                                text: "Copiar link",
                                icon: <Link />,
                                click: () => toClipboard(respuesta[0].url)
                            },
                            {
                                text: <span>Observaciones
                                    <small className='ms-4'><Badge pill className='bg-opacity-50'>{item.num_obs as number || 0}</Badge></small>
                                </span>,
                                icon: !(item.num_obs) ?
                                    <ChatDots size={16} />
                                    :
                                    <span className='position-relative text-primary text-opacity-75'>
                                        <ChatDotsFill size={16} />
                                        <span className="position-absolute top-50 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                                    </span>
                                ,
                                click: () => showObservations({ item, attachment })
                            },
                        ].concat((canEdit && !!(onEdit)) ?
                            [{
                                text: "Editar anexo",
                                icon: <Edit size={16} />,
                                click: () => onEdit(item, "Modificar")
                            }] : []
                        ).concat((canEdit && !!(onDelete)) ?
                            [{
                                text: "Eliminar anexo",
                                icon: <XCircle size={16} />,
                                click: () => deleteAttach(item, attachment)
                            }] : []
                        )
                        }
                    >
                        <DropdownToggle size="sm" color='link' className='text-dark p-0 position-relative'>
                            <ThreeDotsVertical />
                        </DropdownToggle>
                    </CustomDropdown>
                </div>
                {!!(attachment) &&
                    <p>
                        <a href={respuesta[0].url} target="_blank" className="text-wrap"><small>{respuesta[0].url}</small></a>
                    </p>
                }
            </td>}
            <td>{i.ubianexo}</td>
            <td>
                <div className='mb-2'>
                    <b>Criterio:</b> <span>{criterio}</span>
                </div>
                <div>
                    <b>Evidencia:</b> <span>{evidencias}</span>
                </div>
            </td>
            {/* <td style={{ maxWidth: "300px" }}>{evidencias}</td> */}
        </tr>
        )
    }

    const changeOrder = () => {
        orderRef.current = [];
        setModal({
            isOpen: true,
            size: "lg",
            title: "Cambiar orden de los anexos",
            children: mapedList && <Ordering list={mapedList} orderRef={orderRef} />,
            footer: canEdit && <ModalFooter>
                <Button color="primary2" onClick={() => closeModal(setModal)}>Cancelar</Button>
                <Button color="primary" onClick={() => {
                    if (!orderRef.current.length) {
                        return toast.error("No hay cambios para guardar", { position: "top-right", icon: <i className='text-warning'><ExclamationCircleFill /> </i> })
                    }
                    openAlert({
                        type: "warning",
                        title: "¿Está seguro?",
                        children: "Se cambiará el orden de los anexos, tenga en cuenta que la codificación y numeración cambiará",
                        closeButton: { value: "No, cancelar" },
                        submitButton: {
                            value: "Sí, guardar",
                            onClick: () => saveNewOrder()
                        }
                    })
                }}>Guardar</Button>
            </ModalFooter>
        })
    }

    const saveNewOrder = () => {
        const o = orderRef.current;

        const d = jsonToFormData({
            orden: o.map(i => i.attachment.grupo_resp).join(","),
            id_fcamp: o[0].attachment.id_fcamp
        })

        openLoader("Modificando orden");

        AXIOS_REQUEST(ORDERING_ANSWERS, "PUT", d).then(r => {
            toast.success("Orden actualizado", { position: "top-right" })
            setMapedList([]);
            closeLoader(() => {
                orderingCallback?.();
                closeModal(setModal)
            })
        }).catch(() => {
            closeLoader()
            toast.error("No se pudo actualizar el orden", { position: "top-right" })
        })

    }

    const mapList = (l: typeof list) => {
        const _list: T_MapedItemList[] = [];

        Object.keys(l).forEach((li, idx) => {
            const item = l[`${li}`];
            const original = item.originalFieldsObject as I_FormFieldWithAnswer[];
            const attachment: any = original.find(i => !!i.nomb_anexo)!;
            const { nomb_anexo, respuesta } = attachment || {};

            if (item.defaultValues.ceanexo?.length) {
                const { criterio }: any = original.find((i: any) => !!i.criterio) || {};
                const { evidencias }: any = original.find((i: any) => !!i.evidencias) || {};

                _list.push({
                    item,
                    attachment,
                    criterio,
                    evidencias,
                    nomb_anexo,
                    respuesta,
                    id: idx + 1
                })
            }
        })

        return _list;
    }

    useEffect(() => {
        setMapedList(mapList(list))
    }, [list])

    return (<>
        <ObservationChat
            onlyRead={!canEdit}
            grupo={observationsIsOpen?.attachment.grupo_resp}
            toggle={() => showObservations(null)}
            isOpen={!!(observationsIsOpen)}
            callbackOnUnmount={(res) => { if (res) { onObservationsDone() } }}
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
        {/* <Loader {...loading} /> */}

        <Modal isOpen={modal?.isOpen} size={modal?.size}>
            <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
            <ModalBody>{modal?.children}</ModalBody>
            {modal?.footer}
        </Modal>

        <div className='position-relative'>
            <Alert {...alertData} />
            <Table bordered responsive="md" className='pb-5'>
                <thead className='small'>
                    <tr className="table-primary align-middle">
                        <th>
                            <div className='d-flex align-items-center justify-content-between'>
                                {
                                    canEdit && mapedList.length ?
                                        <div onClick={() => changeOrder()} className='cursor-pointer'>
                                            Anexo
                                            {/* <Button color='primary2' size='sm' className='ms-auto' >
                                                <ArrowDownUp size={14} /> Ordenar
                                            </Button> */}
                                        </div>
                                        :
                                        "Anexo"
                                }
                            </div>
                        </th>
                        {/* <th>Evidencia</th> */}
                        <th>Ubicación evidencia</th>
                        <th>Criterio y evidencia</th>
                    </tr>
                </thead>
                <tbody className='small'>
                    {mapedList.map((i) => !!(i) && doRowByItem(i, i.nomb_anexo))}
                </tbody>
            </Table>
        </div>
    </>)
}

export default AttachmentsTable;
