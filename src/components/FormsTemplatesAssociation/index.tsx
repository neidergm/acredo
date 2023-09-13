import { useEffect, useState, useRef } from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge, Button, ListGroup, ListGroupItem, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { ASOCIATE_FORM_TO_TASK, GET_TEMPLATES, GET_TEMPLATES_CATEGORIES } from '../../services/endPointsService';
import { T_Template, T_TemplateCategories } from '../../interfaces/conditions.interface';
import { jsonToFormData } from '../../utils/formUtils';
import { toast } from 'react-hot-toast';
import { ExclamationCircleFill } from '../Icons';
import Alert, { I_AlertObject } from '../Alert';
import Loader from '../Loader';
import { closeModal } from '../Modal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getContionData } from '../../store/actions/conditionsActions';
import styles from './styles.module.css';
import useLoader from '../../hooks/useLoader';

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
    const [templatesList, setTemplatesList] = useState<{ [cat: string]: T_Template[] }>({});
    const [categoriesList, setCategoriesList] = useState<T_TemplateCategories[] | null>(null);
    const { loading, openLoader, closeLoader } = useLoader();
    const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);

    const [selectedList, setSelectedList] = useState<{ [temp: string]: { category: number, position: number, data: T_Template } }>({});
    const [acccordionOpen, setAcccordionOpen] = useState<string[]>([]);

    const dispatch = useAppDispatch();

    const formRef = useRef<HTMLFormElement>(null);

    const FORMID = "FORMS-TEMPLATES"

    const toggleAccordion = (id: string) => {
        setAcccordionOpen(ac => {
            const nac = ac.filter(i => id !== i);
            return nac.length === ac.length ? [...ac, id] : nac;
        });

        if (!(templatesList?.[id])) {
            getFormsTemplates(id);
        }
    }

    const getFormsTemplates = (cat: string) => {
        AXIOS_REQUEST(`${GET_TEMPLATES}form/${cat}`).then((r) => setTemplatesList(tl => ({ ...tl, [cat]: r.data })))
            .catch(() => setTemplatesList(tl => ({ ...tl, [cat]: [] })))
    }

    const getFormsTemplatesCategories = () => {
        AXIOS_REQUEST(GET_TEMPLATES_CATEGORIES).then((r) => setCategoriesList(r.data))
    }

    const saveChanges = (e: any) => {
        e.preventDefault();

        const selectedItems = Object.values(selectedList).sort((a, b) => a.position - b.position);

        if (!(selectedItems.length)) {
            return toast.error("Debe seleccionar al menos 1", { position: "top-right", icon: <i className='text-warning'><ExclamationCircleFill /> </i> })
        }

        const idsTemplates: number[] = [];

        setAlertConfirm({
            isOpen: true,
            title: "¿Desea realizar los cambios?",
            type: "question",
            size: "lg",
            subtitle: <>
                <span className='mb-4 pb-2 d-block'>Esta acción es irreversible, no se podrán quitar o modificar más adelante las plantillas seleccionadas</span>

                <span className='text-start text-dark d-block' >
                    <span>Se asociarán las siguientes plantillas a la tarea en el orden indicado:</span>
                    {selectedItems.map((t) => {
                        idsTemplates.push(t.data.id_plantilla);
                        return <span className='mb-1 d-block' key={t.position}>
                            <span className='me-2 fw-bold'>{t.position}.</span>
                            <span>{t.data.nomb_plantilla}</span>
                        </span>
                    })}
                </span>
            </>,
            submitButton: {
                value: "Ok, asociar", onClick: () => doAssotiation(idsTemplates)
            },
            closeButton: { value: "Cancelar" }
        })
    }

    const doAssotiation = (idsTemplates: number[]) => {
        const data = jsonToFormData({ form_cond: idsTemplates.join(","), id_cond: taskId });
        openLoader("Asociando plantillas", () => closeModal(setAlertConfirm));
        AXIOS_REQUEST(ASOCIATE_FORM_TO_TASK, "PUT", data).then(async (resp) => {
            openLoader("Espere")
            toast.success("Formularios asociados correctamente", { position: "top-right" });
            return (dispatch(getContionData(Number(taskId!))) as any).then(() => {
                setSelectedList({})
                setAcccordionOpen([])
                closeLoader(toggle)
            })
        }).catch(() => {
            closeLoader()
            toast.error("No se pudo asociar, intente nuevamente", { position: "top-right" });
        })
    }

    const onSelectItem = (template: T_Template, category: number, isSelected: boolean) => {
        const id = template.id_plantilla;
        setSelectedList(l => {
            if (isSelected) {
                for (const key in l) {
                    if (l[key].position > l[id].position) { l[key].position-- }
                }
                delete l[id];
            } else {
                l[id] = { category, position: Object.keys(l).length + 1, data: template };
            }
            return { ...l };
        })
    }

    const printFormsList = (list: T_Template[], category: T_TemplateCategories) => {
        return !(list) ?
            <Loader isOpen loaderAsModal={false}><p className='small'>Consultado plantillas</p></Loader>
            :
            <div>
                <form id={FORMID} onSubmit={saveChanges} ref={formRef}>
                    <ListGroup flush>
                        {
                            list.map((item, idx) => {
                                const selectedData = selectedList[item.id_plantilla];
                                const selected = !!(selectedData);
                                return <ListGroupItem className='cursor-pointer px-0 px-lg-2' action key={idx}>
                                    <div className='d-flex flex-column flex-md-row gap-2 pt-1'>
                                        <div className='d-flex flex-md-column align-items-end gap-2'>
                                            <input
                                                onChange={() => onSelectItem(item, category.id_pcate, selected)}
                                                checked={selected}
                                                style={{ padding: "10px" }}
                                                className="form-check-input m-0"
                                                type="checkbox"
                                                value={item.id_plantilla}
                                                name={`itemForm[${idx}]`}
                                                id={`item-${item.id_plantilla}`}
                                            />
                                            {selected && <div>
                                                <Badge color='primary' className='opacity-25 rounded-1'>{selectedData.position}</Badge>
                                            </div>}
                                        </div>
                                        <label className="form-check-label stretched-link" htmlFor={`item-${item.id_plantilla}`}>
                                            <span>{item.nomb_plantilla}</span>
                                            <p className='text-muted mt-2'>
                                                <b className='small d-block fw-semibold'>Descripción:</b>
                                                <small>{item.desc_plantilla || "Sin descripción"}</small>
                                            </p>
                                        </label>
                                    </div>
                                </ListGroupItem>
                            })
                        }
                    </ListGroup>
                </form>
            </div>
    }

    useEffect(() => {
        getFormsTemplatesCategories()
    }, [])

    return (<>
        <Alert isOpen={!!(alertConfirm?.isOpen)}{...alertConfirm} onClosed={() => { closeModal(setAlertConfirm) }} />
        <Loader {...loading} />
        <Offcanvas isOpen={open} style={{ minWidth: "70%" }} fade unmountOnClose>
            <OffcanvasHeader toggle={() => toggle()}>
                <span className='ps-3 border-start border-success border-4 py-1'>Plantillas de formularios</span>
            </OffcanvasHeader>
            <OffcanvasBody>

                <p className='border-start border-3 border-success ps-3 py-1 mb-4'>Seleccione 1 o más plantillas de formularios que desee asociar a esta tarea, tenga en cuenta que el orden en que seleccione las plantillas será el orden en que se visualizarán</p>
                {!(categoriesList) ?
                    <Loader isOpen loaderAsModal={false}><p className='small'>Consultado categorías</p></Loader>
                    :
                    <div className={styles["categories-container"]}>
                        <Accordion flush open={acccordionOpen} {...{ toggle: toggleAccordion }}>
                            {categoriesList.map((cat) => {
                                const selectedNumber = Object.values(selectedList).filter(i => i.category === cat.id_pcate).length;
                                return <AccordionItem key={`cat-${cat.id_pcate}`} className={styles["category-item"]}>
                                    <AccordionHeader targetId={`${cat.id_pcate}`}>
                                        <span className='flex-grow-1'>{cat.nomb_pcate}</span>
                                        <div className='vr py-4'></div>
                                        <div className='ps-2 pe-2 small opacity-50' style={{ width: "125px" }}>
                                            <p className='mb-1'>
                                                <span className='fw-semibold'>{cat.cantidad}</span> <small className='fw-normal'> disponibles</small>
                                            </p>
                                            <p className='mb-0'>
                                                <span className='fw-semibold'>{selectedNumber}</span> <small className='fw-normal'>Seleccionados</small>
                                            </p>
                                        </div>
                                    </AccordionHeader>
                                    <AccordionBody accordionId={`${cat.id_pcate}`} >
                                        {printFormsList(templatesList[cat.id_pcate], cat)}
                                    </AccordionBody>
                                </AccordionItem>
                            }
                            )}
                        </Accordion>
                    </div>
                }
            </OffcanvasBody>
            <div className='pb-3 pt-4 px-3'>
                <div className='d-flex justify-content-between'>
                    <div>
                        <Button color='primary2' className='ms-auto' onClick={() => toggle()}>Cerrar</Button>
                    </div>
                    {!!(Object.keys(selectedList).length) &&
                        <div>
                            <Button color='primary' className='ms-auto' form={FORMID}>Continuar</Button>
                        </div>
                    }
                </div>
            </div>
        </Offcanvas >
    </>)
}

export default FormsTemplatesAssociaton;
