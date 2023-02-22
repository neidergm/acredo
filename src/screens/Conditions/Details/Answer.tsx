import { useState, useEffect } from 'react'
import Form from 'react-ngm-form';
import { Button } from 'reactstrap';
import Alert, { I_AlertObject } from '../../../components/Alert';
import { BoxArrowUpRight, ChatDots, Edit } from '../../../components/Icons';
import Loader from '../../../components/Loader';
import ObservationChat from '../../../components/ObservationChat';
import { I_FormFieldWithAnswer } from '../../../interfaces/conditions.interface';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ANSWER_BY_FORM, FORM, FORM_FIELDS, SAVE_ANSWERS } from '../../../services/endPointsService';
import { formToSubmitData, T_FetchedFormData } from '../../../utils/formUtils';
import mapField, { mapFieldAndDefaultValues } from '../../../utils/mapField';

interface I_Props {
    idForm: number,
    idCondition: number,
    showActionButton?: boolean,
    canEdit?: boolean
}

const ID_FORM = "conditionForm";
let formDataFetched: any = null;

const Answer = ({
    idForm,
    idCondition,
    showActionButton = true,
    canEdit
}: I_Props) => {

    // const [enableEdit, setEnableEdit] = useState(false);
    const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);
    const [_alert, setAlert] = useState<I_AlertObject | null>(null);
    const [loader, setLoader] = useState<string | null>(null);

    const [form, setForm] = useState<T_FetchedFormData>(
        { fields: [], defaultValues: {}, fetchedForm: null }
    );

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

        // data.fields = mapField(result.data, (field, item) => {
        //     // formData.est_resp === 1 && (data.defaultValues[field.name] = field.respuesta)
        //     data.defaultValues[field.name] = item.respuesta;
        //     return field;
        // });


        setForm({ ...data, fetchedForm: result.data });
    }

    const [observationsIsOpen, setObservationsIsOpen] = useState<boolean | null>(null);

    useEffect(() => {
        getForm()
    }, [])

    const showObservations = (item: boolean | null = null) => {
        setObservationsIsOpen(item)
    }

    return (
        <div>
            <div className='mb-4 d-flex flex-wrap gap-3 justify-content-md-between'>
                <Button
                    color="primary"
                    size='sm'
                    outline
                    onClick={() => { showObservations(true) }}
                    className="rounded-pill btn-sm px-3"
                >
                    <div className='d-flex gap-2 justify-content-center align-items-center'>
                        <ChatDots />Observaciones
                    </div>
                </Button>
            </div>

            <ObservationChat
                onlyRead={!canEdit}
                toggle={showObservations}
                isOpen={!!(observationsIsOpen)}
                id_fcamp={idForm}
                extra_data_to_send={{
                    id_cond: idCondition
                }}
            >
                <small className='text-muted'>
                    <b className='border-start ps-2 border-3 border-primary'>Condición </b>
                </small>
            </ObservationChat>

            <Alert isOpen={!!(alertConfirm?.isOpen)}  {...alertConfirm} onClosed={() => setAlertConfirm(null)} />
            <Alert isOpen={!!(_alert?.isOpen)}  {..._alert} onClosed={() => setAlert(null)} />

            {!(form.fields.length) ?
                <Loader isOpen loaderAsModal={false} />
                : <Form
                    formProps={{ id: ID_FORM }}
                    onSubmit={()=>{}}
                    fields={form.fields as any}
                    defaultValues={{ ...form.defaultValues }}
                >
                    <div className="row justify-content-end mt-4 pt-2">
                        <div className="col col-sm-6 col-md-4 col-lg-3 col-xl-2">
                        </div>
                    </div>
                </Form>}
        </div>
    )
}

export default Answer;
