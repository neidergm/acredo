import { useState, useEffect } from 'react'
import Loader from '../../../components/Loader';
import { I_Form, I_FormField, I_FormFieldWithAnswer } from '../../../interfaces/conditions.interface';
import { I_JSONObject, T_FieldsTypes } from '../../../interfaces/generic.interface';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ANSWER_BY_FORM, DELETE_ANSWER, FORM, FORM_FIELDS, SAVE_ANSWERS } from '../../../services/endPointsService';
import { mapFieldAndDefaultValues } from '../../../utils/mapField';
import Alert, { I_AlertObject } from '../../../components/Alert';
import AsList from './AsList';
import AsTabs from './AsTabs';
import { useParams } from 'react-router-dom';
import { formToSubmitData, getDifferenceBetweenData } from '../../../utils/formUtils';
import { closeModal } from '../../../components/Modal';
import toast from 'react-hot-toast';
import { ExclamationCircleFill, Link } from '../../../components/Icons';
import { Button } from 'reactstrap';
import FormsTemplatesAssociaton from '../../../components/FormsTemplatesAssociation';

export type T_Form = {
    fields: Array<T_FieldsTypes>;
    defaultValues: I_JSONObject;
    originalFieldsObject: Array<I_FormField | I_FormFieldWithAnswer>;
    multiplesValues?: { [group: string]: T_Form } | null;
    isAttachmentsTable?: boolean;
} & I_Form;

export type T_FormPannelActions = {
    onPickOne: (f: T_Form, onlyGetAnswer?: boolean) => Promise<T_Form>;
    onSubmit: (data: any, formItem: T_Form, callback?: () => void, onlyRefreshForm?: boolean) => void;
    onDelete?: (item: string, title?: string, subtitle?: any, callback?: () => void) => void;
    onObservationsDone: () => void;
}

type T_Props = {
    formId: string,
    canEdit?: boolean,
    codCond?: number,
    canAddForms?: boolean,
}

const FormPannel = ({
    formId,
    canEdit = false,
    canAddForms,
    codCond
}: T_Props) => {
    const { id_cond } = useParams();

    const [formList, setFormList] = useState<T_Form[] | null>(null);
    const [loader, setLoader] = useState<string | null>(null);
    const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);
    const [togglePannel, setTogglePannel] = useState(false);

    const confirmSubmit = (data: any, formItem: T_Form, callback?: () => void) => {
        setAlertConfirm({
            isOpen: true,
            title: "¿Desea guardar los cambios?",
            type: "question",
            submitButton: { value: "Sí, guardar", onClick: () => submitAll(data, formItem, callback) },
            closeButton: { value: "No, cancelar" }
        })
    }

    const confirmDelete = (item: string, title = "¿Está seguro?", subtitle: any = "", callback?: () => void) => {
        setAlertConfirm({
            isOpen: true,
            title,
            subtitle,
            type: "question",
            submitButton: { value: "Sí, eliminar", onClick: () => deleteItem(item, callback) },
            closeButton: { value: "No, cancelar" },
        })
    }

    const deleteItem = (item: string, callback?: () => void) => {
        setLoader("Eliminando")

        return AXIOS_REQUEST(DELETE_ANSWER + item, "DELETE").then(resp => {
            toast.success('Se ha eliminado correctamente', { position: "top-right" })
            callback?.();
        }).catch(err => {
            toast.error('No se pudo eliminar', { position: "top-right" })
        }).finally(() => {
            setLoader(null)
        })
    }

    const submitAll = (data: any, formItem: T_Form, callback?: () => void) => {
        const method = formItem.est_resp === 1 ? "PUT" : "POST";
        data = getDifferenceBetweenData(formItem.defaultValues, data);
        setLoader("Guardando datos");
        const keysOnField = ["id_campo"];
        if (method === "PUT") {
            keysOnField.push("id_resp", "grupo_resp");
        }
        const formData = formToSubmitData(data,
            formItem!.originalFieldsObject,
            keysOnField,
            { "id_fcamp": formItem.id_fcamp },
            { id_cond }
        );

        return AXIOS_REQUEST(SAVE_ANSWERS, method, formData)
            .then(res => {
                method === "POST" && formItem.est_resp === 0 && setFormList(e => {
                    const current = e!.findIndex(i => i.id_fcamp === formItem.id_fcamp);
                    if (current) e![current] = { ...e![current], est_resp: 1 }
                    return [...e!]
                });

                callback?.()
                toast.success("Se registraron los datos correctamente", { position: "top-right" })
                return true;
            })
            .catch(err => {
                toast.error("No se pudo registrar la información", { position: "top-right" });
                return false;
            }).finally(() => {
                setLoader(null);
            })
    }

    const pickFormItem = async (item: T_Form, onlyGetAnswer = false) => {

        let answers: null | Array<I_FormFieldWithAnswer> = null;
        let fields: null | Array<I_FormField | I_FormFieldWithAnswer> = item.originalFieldsObject;
        let multiplesAnswers: { [x: string]: Array<I_FormFieldWithAnswer> } = {};

        const multiplesValues: { [x: string]: T_Form } = {};
        let isAttachmentsTable = false;
        if (item.est_resp === 1 || onlyGetAnswer) answers = await getFormWithAnswers(item.id_fcamp);

        if (!(onlyGetAnswer)) {
            fields = await getFormFields(item.campos);
        } else {
            if (!(fields)) {
                fields = answers || [];
            }
        }

        if (answers) {
            if (item.tipo_form !== 0) {

                multiplesAnswers = answers.reduce((p, c) => {
                    if (c.nomb_anexo) isAttachmentsTable = true;
                    p[c.grupo_resp] = [...(p[c.grupo_resp] || []), c];
                    return { ...p }
                }, multiplesAnswers);

                for (const key in multiplesAnswers) {
                    let num_obs = item.num_obs;
                    if (num_obs && typeof num_obs === "object") {
                        num_obs = num_obs.find(i => i.grupo_resp === key)?.num_obs || null
                    }
                    multiplesValues[key] = {
                        ...item,
                        ...mapFieldAndDefaultValues(multiplesAnswers[key], multiplesAnswers[key]),
                        num_obs,
                        est_resp: 1,
                        originalFieldsObject: multiplesAnswers[key]
                    }
                }
                //  if (codCond) {
                //     fields.unshift({
                //         json_campo: {
                //             name: "ng_get_information",
                //             label: "HOLA",
                //             tag: "input",
                //             type: 'text',
                //             validations: {},
                //         },
                //         id_campo: 0,
                //         marc_temp: '',
                //         marc_update: '',
                //         nomb_campo: ''
                //     })
                // }
                // item.est_resp = 0;
                answers = null;

            } else {

                fields = fields.map(f => ({ ...(answers?.find(i => i.id_campo === f.id_campo) || {}), ...f }))
            }
        }

        const fieldAndValues = mapFieldAndDefaultValues(fields, answers)

        const d: T_Form = {
            ...item,
            ...fieldAndValues,
            isAttachmentsTable,
            multiplesValues,
            originalFieldsObject: fields
        }
        return await d;
    }

    const toggleEditFormsPannel = () => setTogglePannel(t => !t);

    const getFormWithAnswers = (id_fcamp: string | number): Promise<I_FormFieldWithAnswer[]> =>
        AXIOS_REQUEST(`${ANSWER_BY_FORM}${id_fcamp}`).then(res => res.data)

    const getFormFields = (fields: string | number): Promise<I_FormField[]> =>
        AXIOS_REQUEST(`${FORM_FIELDS}${fields}`).then(res => res.data)

    const getForms = () => {
        !(formId) ? setFormList([]) : AXIOS_REQUEST(FORM + formId)
            .then(res => {
                setFormList(res.data)
            }).catch(err => {
                setFormList([])
            })
    }

    useEffect(() => {
        getForms()
    }, [formId])

    let content: JSX.Element;

    if (!formList) {
        return <div className='mt-5'>
            <Loader isOpen loaderAsModal={false} />
        </div>
    } else if (formList.length === 0) {
        content = <div className="w-100 h-100 d-flex justify-content-center align-items-center flex-column py-5">
            <i className="text-warning mb-2"><ExclamationCircleFill size={35} /></i>
            <span className="d-block mb-5"> No hay formularios asociados para mostrar</span>
            {!!(canAddForms) && <Button size="sm" color="primary" onClick={toggleEditFormsPannel}>
                <i className='me-1'><Link /></i>
                <span>Utilizar plantillas de formularios</span>
            </Button>}
        </div>
    } else if (formList.length < 4) {
        content = <AsTabs
            canEdit={canEdit}
            formList={formList}
            id_cond={id_cond!}
            onObservationsDone={getForms}
            onPickOne={pickFormItem}
            onSubmit={confirmSubmit}
            onDelete={confirmDelete}
        >
            {!!(canAddForms) && <Button size="sm" color="primary2" onClick={toggleEditFormsPannel}>
                <i className='me-1'><Link /></i>
                <span>Agregar plantillas de formularios</span>
            </Button>}
        </AsTabs>
    } else if (formList.length >= 4) {
        content = <AsList
            canEdit={canEdit}
            formList={formList}
            id_cond={id_cond!}
            onObservationsDone={getForms}
            onPickOne={pickFormItem}
            onSubmit={confirmSubmit}
            onDelete={confirmDelete}
        >
            {!!(canAddForms) && <div className='text-end'>
                <Button size="sm" color="primary2" onClick={toggleEditFormsPannel}>
                    <i className='me-1'><Link /></i>
                    <span>Agregar plantillas de formularios</span>
                </Button>
            </div>
            }
        </AsList>
    } else {
        return null
    }

    return <>
        <Loader isOpen={!!loader} subtitle={loader!} />
        <Alert isOpen={!!(alertConfirm?.isOpen)}{...alertConfirm} onClosed={() => { closeModal(setAlertConfirm) }} />
        {!!(canAddForms) && <FormsTemplatesAssociaton open={togglePannel} toggle={toggleEditFormsPannel} taskId={id_cond!} />}
        {content}
    </>
}

export default FormPannel