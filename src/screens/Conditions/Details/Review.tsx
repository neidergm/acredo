import { useState, useEffect } from 'react'
import Form from 'react-ngm-form';
import { Button } from 'reactstrap';
import Alert, { I_AlertObject } from '../../../components/Alert';
import { Edit } from '../../../components/Icons';
import Loader from '../../../components/Loader';
import { I_FormFieldWithAnswer } from '../../../interfaces/conditions.interface';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ANSWER_BY_FORM, FORM, FORM_FIELDS, SAVE_ANSWERS } from '../../../services/endPointsService';
import { formToSubmitData, T_FetchedFormData } from '../../../utils/formUtils';
import mapField, { mapFieldAndDefaultValues } from '../../../utils/mapField';

interface I_Props {
    idForm: number,
    idCondition: number,
    canEdit?: boolean
}

const ID_FORM = "formReview";

let formDataFetched: any = null;

const Review = ({
    idForm, idCondition, canEdit
}: I_Props) => {

    const [enableEdit, setEnableEdit] = useState(false);
    const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);
    const [_alert, setAlert] = useState<I_AlertObject | null>(null);
    const [loader, setLoader] = useState<string | null>(null);

    const [form, setForm] = useState<T_FetchedFormData>(
        { fields: [], defaultValues: {}, fetchedForm: null }
    );

    const confirmSubmit = (data: any) => {
        setAlertConfirm({
            isOpen: true,
            title: "¿Desea guardar los cambios?",
            type: "question",
            submitButton: { value: "Sí, guardar", onClick: () => submitAll(data) },
            closeButton: { value: "No, cancelar" }
        })
    }

    const submitAll = (data: any) => {
        setLoader("Guardando información");

        let formData = form.fetchedForm && formToSubmitData(data,
            form.fetchedForm,
            ["id_campo"],
            { id_fcamp: formDataFetched?.id_fcamp },
            { id_cond: idCondition
                // , id_form: idForm
             })

        AXIOS_REQUEST(SAVE_ANSWERS, "POST", formData, true)
            .then(res => {
                setLoader(null);
                setEnableEdit(false);
                setAlert({
                    isOpen: true,
                    title: "¡Muy bien!",
                    subtitle: "Se han registrado correctamente los datos",
                    type: "success",
                    closeButton: { value: "Ok" }
                })
            })
            .catch(err => {
                setAlert({
                    isOpen: true,
                    title: "Ops...",
                    subtitle: err.data || "Parece que hubo un error, por favor verifique la información e intentelo nuevamente",
                    type: "error",
                    closeButton: { value: "Ok" }
                })
                setLoader(null);
            })
    }

    const getForm = async () => {

        let formData = (await AXIOS_REQUEST(FORM + idForm)).data[0];
        formDataFetched = formData;
        let data = form;
        let result;
        if (formData.est_resp === 1) {
            result = await AXIOS_REQUEST(ANSWER_BY_FORM + idForm);
        } else {
            result = await AXIOS_REQUEST(FORM_FIELDS + formData.campos);
        }

        data = { ...form, ...mapFieldAndDefaultValues(result.data) }

        // data.fields = (result.data as I_FormFieldWithAnswer[]).map(item => {
        //     let field = mapField(item);
        //     data.defaultValues[field?.name] = item.respuesta;
        //     return field
        // })

        setForm({ ...data, fetchedForm: result.data });
    }

    useEffect(() => {
        getForm()
    }, [])

    return (
        <div>
            <Loader isOpen={!!(loader)} subtitle={loader || ""} />
            <Alert isOpen={!!(alertConfirm?.isOpen)}  {...alertConfirm} onClosed={() => setAlertConfirm(null)} />
            <Alert isOpen={!!(_alert?.isOpen)}  {..._alert} onClosed={() => setAlert(null)} />
            <div className='text-end'>
                {canEdit && <Button
                    outline={!enableEdit}
                    color={!enableEdit ? "primary" : "secondary"}
                    className="rounded-pill btn-sm px-3 mb-4"
                    onClick={() => setEnableEdit(!enableEdit)}
                >
                    <Edit /> <span className="ms-2">{!enableEdit ? 'Habilitar edición' : 'Cancelar edición'}</span>
                </Button>
                }
            </div>

            {!(form.fields.length) ?
                <Loader isOpen loaderAsModal={false} />
                :
                <Form
                    disabled={!enableEdit}
                    onSubmit={confirmSubmit}
                    formProps={{ id: ID_FORM }}
                    fields={form.fields as any}
                    defaultValues={{ ...form.defaultValues }}
                >
                    <div className="row justify-content-end mt-4 pt-2">
                        <div className="col col-sm-6 col-md-5 col-lg-4 col-xl-3">
                            {enableEdit && <Button color="primary" block form={ID_FORM}>Guardar</Button>}
                        </div>
                    </div>
                </Form>}
        </div>
    )
}

export default Review;


{/* <div className='row'>
<div className='col-12'>
    <Button
        outline={!enableEdit}
        color={!enableEdit ? "primary" : "secondary"}
        className="rounded-pill btn-sm px-3 mb-4"
        onClick={() => setEnableEdit(!enableEdit)}
    >
        <Edit /> <span className="ms-2">{!enableEdit ? 'Habilitar edición' : 'Cancelar edición'}</span>
    </Button>
</div>
<div className='col-md-6 col-7'>
    <Answer />
</div>
<div className='col'>
    <Form
        disabled={!enableEdit}
        onSubmit={confirmSubmit}
        formProps={{ id: ID_FORM }}
        fields={form.fields as any}
        defaultValues={{ ...form.defaultValues }}
    >
        <div className="row justify-content-end mt-4 pt-2">
            <div className="col col-sm-6 col-md-4 col-lg-3 col-xl-2">
                {enableEdit && <Button color="primary" block form={ID_FORM}>Guardar</Button>}
            </div>
        </div>
    </Form>
</div>
</div> */}
