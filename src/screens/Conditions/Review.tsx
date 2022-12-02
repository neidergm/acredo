import { useState, useEffect } from 'react'
import Form from 'react-ngm-form';
import { Button } from 'reactstrap';
import Alert, { I_AlertObject } from '../../components/Alert';
import { Edit } from '../../components/Icons';
import Loader from '../../components/Loader';
import { I_FormField } from '../../interfaces/conditions.interface';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { ANSWER_BY_FORM, SAVE_ANSWERS } from '../../services/endPointsService';
import { formToSubmitData, T_FetchedFormData } from '../../utils/formUtils';

interface I_Props {
    idForm: number,
    idCondition: number
}

const ID_FORM = "formReview";

const Review = ({
    idForm, idCondition
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
            ["id_fcamp", "id_campo"],
            { id_cond: idCondition, id_form: idForm })

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

    useEffect(() => {
        AXIOS_REQUEST(ANSWER_BY_FORM + idForm)
            .then(res => {
                let data = form;
                res.data.forEach((item: I_FormField) => {
                    let field = item.json_campo;
                    data.fields.push(field);
                    data.defaultValues[field.name] = item.respuesta;
                })
                setForm({ ...data, fetchedForm: res.data });
            })
    }, [])

    return (
        <div>
            <Loader isOpen={!!(loader)} subtitle={loader || ""} />
            <Alert isOpen={!!(alertConfirm?.isOpen)}  {...alertConfirm} onClosed={() => setAlertConfirm(null)} />
            <Alert isOpen={!!(_alert?.isOpen)}  {..._alert} onClosed={() => setAlert(null)} />
            <div className='text-end'>
                <Button
                    outline={!enableEdit}
                    color={!enableEdit ? "primary" : "secondary"}
                    className="rounded-pill btn-sm px-3 mb-4"
                    onClick={() => setEnableEdit(!enableEdit)}
                >
                    <Edit /> <span className="ms-2">{!enableEdit ? 'Habilitar edición' : 'Cancelar edición'}</span>
                </Button>
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
                        <div className="col col-sm-6 col-md-4 col-lg-3 col-xl-2">
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
