import { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import { Clip, PlusCircleFill } from '../../../components/Icons'
import Loader from '../../../components/Loader';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON } from '../../../components/Modal';
import { I_AttachmentsConditions, I_FormFieldWithAnswer } from '../../../interfaces/conditions.interface'
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ALL_ANSWERS_BY_FORM, ANSWER_BY_FORM, DELETE_ANSWERS, FORM, FORM_FIELDS, SAVE_ANSWERS } from '../../../services/endPointsService';
import Form from 'react-ngm-form';
import Alert, { I_AlertObject } from '../../../components/Alert';
import { formToObjectWithFieldsAndValues, formToSubmitData, T_FetchedFormData } from '../../../utils/formUtils';

interface I_Props {
    idCondition: number;
    idForm: number;
    canEdit?: boolean;
}
const FORM_ID = "addAttachmentForm";
let FETCHEDFORM: any;

const Attachments = ({
    idForm,
    idCondition,
    canEdit
}: I_Props) => {

    const [myForm, setMyForm] = useState<T_FetchedFormData>(
        { fields: [], defaultValues: {}, fetchedForm: null }
    );
    const [list, setList] = useState<{ [x: string]: I_FormFieldWithAnswer[] } | null>(null);
    const [modal, setModal] = useState<T_ModalJSON | null>(null);
    const [loader, setLoader] = useState<string | null>(null);
    const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);
    const [_alert, setAlert] = useState<I_AlertObject | null>(null);

    const getForm = async () => {
        let _form = await AXIOS_REQUEST(FORM + idForm).then(resp => resp.data[0]);
        let _formFields = await AXIOS_REQUEST(FORM_FIELDS + _form?.campos);

        // fetchedForm: { title: _form.nomb_form, formFields: _formFields } as { [x: string]: any },

        return {
            fetchedForm: _formFields.data.map((i: any) => ({ ...i, id_fcamp: _form.id_fcamp })),
            fields: _formFields.data.map((i: any) => i.json_campo),
            defaultValues: {}
        };
    }

    const removeAttachment = (group: string, fcamp: number) => {
        setLoader("Eliminando anexo");

        AXIOS_REQUEST(DELETE_ANSWERS + `${fcamp}/${group}`, "DELETE")
            .then(res => {
                setLoader(null);
                closeModal(setModal);
                setAlert({
                    isOpen: true,
                    title: "¡Muy bien!",
                    subtitle: "Se ha eliminado correctamente el anexo",
                    type: "success",
                    closeButton: { value: "Ok" }
                })
                getAttachments();
            })
            .catch(err => {
                setLoader(null);
                setAlert({
                    isOpen: true,
                    title: "Ops...",
                    subtitle: err.data || "Parece que hubo un error, por favor intentelo nuevamente",
                    type: "error",
                    closeButton: { value: "Ok" }
                })
            })
    }

    const showAttachementForm = async () => {
        let f: any = null;

        if (!myForm.fetchedForm) {
            setLoader("Espere")
            f = await getForm();
            setMyForm(f)
            setLoader(null)
        } else {
            f = myForm;
        }

        setModal({
            isOpen: true,
            title: "Agregar anexo",
            children: <>
                <Form
                    defaultValues={{}}
                    fields={f.fields as any}
                    onSubmit={confirmSubmitAttachment}
                    formProps={{ id: FORM_ID }}
                />
            </>,
            footer: <ModalFooter>
                <Button color="primary" onClick={() => closeModal(setModal)}>Cancelar</Button>
                <Button color="primary" form={FORM_ID}>Guardar</Button>
            </ModalFooter>
        })
    }

    const attachmentDetails = (item: I_FormFieldWithAnswer[]) => {
        let _form = formToObjectWithFieldsAndValues(item);

        setModal({
            isOpen: true,
            title: "Detalles de anexo",
            children: <>
                <Form
                    disabled
                    defaultValues={_form.defaultValues}
                    fields={_form.fields}
                    onSubmit={() => { }}
                />
            </>,
            footer: <ModalFooter>
                <Button color="primary" onClick={() => closeModal(setModal)}>Cerrar</Button>
                <Button color="danger" onClick={() => confirmDeleteAttachment(item[0].grupo_resp, item[0].id_fcamp)}>Eliminar</Button>
            </ModalFooter>
        })
    }

    const confirmSubmitAttachment = (data: any) => {
        setAlertConfirm({
            isOpen: true,
            title: "¿Desea guardar los cambios?",
            type: "question",
            submitButton: { value: "Sí, guardar", onClick: () => submitAll(data) },
            closeButton: { value: "No, cancelar" }
        })
    }

    const confirmDeleteAttachment = (group: string, fcamp: number) => {
        setAlertConfirm({
            isOpen: true,
            title: "¿Está seguro?",
            subtitle: "Se eliminará este anexo",
            type: "question",
            submitButton: { value: "Sí, eliminar", onClick: () => removeAttachment(group, fcamp) },
            closeButton: { value: "No, cancelar" }
        })
    }

    const submitAll = (data: any) => {
        setLoader("Registrando datos");

        let formData = FETCHEDFORM.fetchedForm && formToSubmitData(data,
            FETCHEDFORM.fetchedForm,
            ["id_fcamp", "id_campo"],
            undefined,
            { id_cond: idCondition, id_form: idForm })
        AXIOS_REQUEST(SAVE_ANSWERS, "POST", formData, true)
            .then(res => {
                setLoader(null);
                closeModal(setModal);
                getAttachments();
                setAlert({
                    isOpen: true,
                    title: "¡Muy bien!",
                    subtitle: "Se han registrado correctamente los datos",
                    type: "success",
                    closeButton: { value: "Ok" }
                })
            }).catch(err => {
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

    const getAttachments = () => {
        AXIOS_REQUEST(ALL_ANSWERS_BY_FORM + idForm)
            .then(res => {
                setList(
                    res.data.reduce((p: typeof list, c: I_FormFieldWithAnswer) => {
                        p![c.grupo_resp] = [...(p![c.grupo_resp] || []), c]
                        return { ...p }
                    }, {})
                )
            })
    }

    useEffect(() => {
        getAttachments();
    }, [])
    useEffect(() => {
        FETCHEDFORM = myForm;
    }, [myForm])

    return (
        <div>
            {canEdit && !!list && <Button
                outline
                color={"primary"}
                className="rounded-pill btn-sm px-3 mb-4 d-flex align-items-center"
                onClick={() => { showAttachementForm() }}
            >
                <PlusCircleFill size={17} />
                <span className="ms-2">Añadir anexo</span>
            </Button>}

            <Loader isOpen={!!(loader)} subtitle={loader || ""} />
            <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} />
            <Alert isOpen={!!(alertConfirm?.isOpen)}{...alertConfirm} onClosed={() => { setAlertConfirm(null) }} />

            <Modal backdrop="static" size="lg"
                isOpen={!!(modal?.isOpen)}
                onClosed={() => { setModal(null) }}
                toggle={() => closeModal(setModal)}
            >
                <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                <ModalBody>{modal?.children}</ModalBody>
                {modal?.footer}
            </Modal>

            <div>
                {!list ? <Loader isOpen loaderAsModal={false} />
                    :
                    !Object.values(list).length ? <p className='text-muted'>| No hay nada para mostrar</p>
                        :
                        Object.values(list).map((li, i) =>
                            <div key={i} className="card mb-4 p-3 border-0 bg-light hover-scale-up hover-shadow-sm"
                                onClick={() => attachmentDetails(li)}
                            >
                                <div className='d-flex flex-row gap-4 position-relative'>
                                    <div>
                                        <div className='bg-white text-secondary rounded-pill p-2 d-flex position-relative'>
                                            {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning border border-2 border-light">3</span> */}
                                            <Clip size={22} />
                                        </div>
                                    </div>
                                    <div className='text-truncate'>
                                        {
                                            li.map((item, i) => {
                                                return (item.json_campo.tag !== "file" && item.json_campo.type !== "url") ?
                                                    <div key={`it-${i}`} className='text-truncate'>
                                                        <b className="me-1 text-muted small" >{item.json_campo?.label}: </b>
                                                        <small>{typeof item.respuesta === "string" && item.respuesta}</small>
                                                    </div> : null
                                            })
                                        }
                                    </div>
                                    {/* <div className="row align-self-start text-truncate">
                                        <b className="col-12" >{item.nombre}</b>
                                        <p className="  m-0 col-12 text-truncate">{item.descripcion}</p>
                                    </div> */}
                                    {/* <div className='position-absolute hover-scale-up hover-shadow-sm top-100 start-100'
                                        onClick={() => confirmDeleteAttachment(li[0].grupo_resp, li[0].id_fcamp)}>
                                        <i className="text-danger">
                                            <XCircleFill size={25} />
                                        </i>
                                    </div> */}
                                </div>
                            </div>
                        )
                }
            </div>
        </div>
    )
}

export default Attachments;
