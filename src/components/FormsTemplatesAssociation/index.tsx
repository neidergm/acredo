import React, { useEffect, useState, useRef } from 'react'
import { Badge, Button, ListGroup, ListGroupItem, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { ASOCIATE_FORM_TO_TASK, GET_TEMPLATES } from '../../services/endPointsService';
import { T_Template } from '../../interfaces/conditions.interface';
import { jsonToFormData } from '../../utils/formUtils';
import { Toaster, toast } from 'react-hot-toast';
import { ExclamationCircleFill } from '../Icons';
import Alert, { I_AlertObject } from '../Alert';
import Loader from '../Loader';
import { closeModal } from '../Modal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getContionData, selectCondition, setProcessPhasesWithConditions } from '../../store/actions/conditionsActions';
import { useAppSelector } from '../../hooks/useAppSelector';

type T_Props = {
    open: boolean;
    toggle: () => void;
    taskId: number | string;
}

const FormsTemplatesAssociaton = ({
    toggle,
    open,
    taskId
}: T_Props) => {
    const [templatesList, setTemplatesList] = useState<T_Template[] | null>(null);
    const [selectedList, setSelectedList] = useState<number[]>([]);
    const [loader, setLoader] = useState<string | null>(null);
    const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);
    const dispatch = useAppDispatch();
    const process = useAppSelector(s => s.process.selected);

    const formRef = useRef<HTMLFormElement>(null);

    const FORMID = "FORMS-TEMPLATES"

    const getFormsTemplates = () => {
        AXIOS_REQUEST(GET_TEMPLATES + "form").then((r) => setTemplatesList(r.data))
    }

    const saveChanges = (e: any) => {
        e.preventDefault();

        if (!(selectedList.length)) {
            return toast.error("Debe seleccionar al menos 1", { position: "top-right", icon: <i className='text-warning'><ExclamationCircleFill /> </i> })
        }

        let temp = selectedList.map(i => templatesList?.find(e => e.id_plantilla === i))

        setAlertConfirm({
            isOpen: true,
            title: "¿Desea realizar los cambios?",
            type: "question",
            size: "lg",
            subtitle: <>
                <p className='mb-4 pb-2'>Esta acción es irreversible, no se podrán quitar o modificar más adelante las plantillas seleccionadas</p>

                <div className='text-start text-dark'>
                    <p>Se asociarán las siguientes plantillas a la tarea en el orden indicado:</p>
                    {temp.map((t, idx) => <p className='mb-1' key={t?.id_plantilla}>
                        <span className='me-2 fw-bold'>{idx + 1}.</span>
                        <span>{t?.nomb_plantilla}</span>
                    </p>)}
                </div>
            </>,
            submitButton: {
                value: "Ok, asociar", onClick: () => {
                    setLoader("Asociando plantillas");
                    let data = jsonToFormData({ form_cond: selectedList.join(","), id_cond: taskId })

                    AXIOS_REQUEST(ASOCIATE_FORM_TO_TASK, "PUT", data, true)
                        .then((resp) => {
                            toggle();
                            toast.success("Formularios asociados correctamente", { position: "top-right" });
                            dispatch(selectCondition(null))
                            dispatch(getContionData(Number(taskId!)))
                            dispatch(setProcessPhasesWithConditions(process!.id_conv, null))
                        }).catch(() => {
                            toast.error("No se pudo asociar", { position: "top-right" });
                        }).finally(() => setLoader(null))
                }
            },
            closeButton: { value: "Cancelar" }
        })
    }
    const onSelectItem = (id: number, isSelected: boolean) => {
        setSelectedList(l => isSelected ? l.filter(i => i !== id) : [...l, id])
    }

    useEffect(() => {
        getFormsTemplates()
    }, [])
    return (<>
        <Offcanvas isOpen={open} style={{ minWidth: "65%" }}>
            <OffcanvasHeader toggle={() => toggle()}>
                <span className='ps-3 border-start border-success border-4 py-1'>Plantillas de formularios</span>
            </OffcanvasHeader>
            <OffcanvasBody>
                <p className='border-start border-3 border-success ps-3 py-1 mb-4'>Seleccione 1 o más plantillas de formularios que desee asociar a esta tarea, tenga en cuenta que el orden en que seleccione las plantillas será el orden en que se visualizarán</p>
                {!(templatesList) ?
                    <Loader isOpen loaderAsModal={false}><p className='small'>Consultado plantillas</p></Loader>
                    :
                    <div>
                        <form id={FORMID} onSubmit={saveChanges} ref={formRef}>
                            <ListGroup flush>
                                {
                                    templatesList?.map((item, idx) => {
                                        let selectedIdx = selectedList.indexOf(item.id_plantilla);
                                        let selected = selectedIdx >= 0;
                                        return <ListGroupItem className='cursor-pointer px-0 px-lg-2' action key={idx}>
                                            <div>
                                                <input
                                                    onChange={() => onSelectItem(item.id_plantilla, selected)}
                                                    checked={selected}
                                                    className="form-check-input me-1"
                                                    type="checkbox"
                                                    value={item.id_plantilla}
                                                    name={`itemForm[${idx}]`}
                                                    id={`item-${item.id_plantilla}`}
                                                />
                                                <label className="ps-2 form-check-label stretched-link" htmlFor={`item-${item.id_plantilla}`}>
                                                    <span>{item.nomb_plantilla}</span>
                                                    <p className='text-muted mt-2'>
                                                        <b className='small d-block fw-semibold'>Descripción:</b>
                                                        <small>{item.desc_plantilla || "Sin descripción"}</small>
                                                    </p>
                                                </label>
                                                {selected && <div className='float-end'>
                                                    <Badge color='success' className='opacity-25'>{selectedIdx + 1}</Badge>
                                                </div>}
                                            </div>
                                        </ListGroupItem>
                                    })
                                }
                            </ListGroup>
                        </form>
                    </div>}
            </OffcanvasBody>
            {!!(templatesList?.length) &&
                <div className='pb-3 pt-4 px-3'>
                    <div className='d-flex justify-content-between'>
                        <div>
                            <Button color='primary2' className='ms-auto' onClick={() => toggle()}>Cerrar</Button>
                        </div>
                        <div>
                            <Button color='primary' className='ms-auto' form={FORMID}>Continuar</Button>
                        </div>
                    </div>
                </div>}
        </Offcanvas>
        <Alert isOpen={!!(alertConfirm?.isOpen)}{...alertConfirm} onClosed={() => { closeModal(setAlertConfirm) }} />
        <Loader isOpen={!!loader} subtitle={loader!} />
        <Toaster />
    </>)
}

export default FormsTemplatesAssociaton