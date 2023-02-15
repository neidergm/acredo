import { useState, useEffect } from 'react'
import { Button, Card, CardBody, CardHeader, CardText, CardTitle, UncontrolledTooltip } from 'reactstrap'
import { ChatDots, FiletypePDF, InfoCircle, Link, PlusCircleFill } from '../../../components/Icons'
import Loader from '../../../components/Loader';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON } from '../../../components/Modal';
import { I_FormFieldWithAnswer, T_FileAnswer } from '../../../interfaces/conditions.interface'
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ATTACHMENTS_ANSWER, DELETE_ANSWERS, FORM, FORM_FIELDS, SAVE_ANSWERS } from '../../../services/endPointsService';
import Form from 'react-ngm-form';
import Alert, { I_AlertObject } from '../../../components/Alert';
import { formToObjectWithFieldsAndValues, formToSubmitData, T_FetchedFormData } from '../../../utils/formUtils';
import mapField from '../../../utils/mapField';
import { getNormalDate } from '../../../utils/dateUtils';
import ObservationChat from '../../../components/ObservationChat';

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
    const [observationsIsOpen, setObservationsIsOpen] = useState<I_FormFieldWithAnswer[] | null>(null);

    const getForm = async () => {
        let _form = await AXIOS_REQUEST(FORM + idForm).then(resp => resp.data[0]);
        let _formFields = await AXIOS_REQUEST(FORM_FIELDS + _form?.campos);

        // fetchedForm: { title: _form.nomb_form, formFields: _formFields } as { [x: string]: any },

        return {
            fetchedForm: _formFields.data.map((i: any) => ({ ...i, id_fcamp: _form.id_fcamp })),
            fields: _formFields.data.map((i: any) => mapField(i)),
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
            size: "xl",
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

    const attachmentDetails = (item: I_FormFieldWithAnswer[], group: string) => {
        let _form = formToObjectWithFieldsAndValues(item);

        setModal({
            isOpen: true,
            title: `Detalles de anexo ${group}`,
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
            { id_cond: idCondition })
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
        AXIOS_REQUEST(ATTACHMENTS_ANSWER + idForm)
            .then(res => {
                setList(
                    res.data.reduce((p: typeof list, c: I_FormFieldWithAnswer) => {
                        p![c.grupo_resp] = [...(p![c.grupo_resp] || []), c]
                        return { ...p }
                    }, {})
                )
            })
    }

    const showObservations = (item: I_FormFieldWithAnswer[] | null) => {
        setObservationsIsOpen(item)
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

            <Modal backdrop="static" size="xl"
                isOpen={!!(modal?.isOpen)}
                onClosed={() => { setModal(null) }}
                toggle={() => closeModal(setModal)}
            >
                <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                <ModalBody>{modal?.children}</ModalBody>
                {modal?.footer}
            </Modal>

            <ObservationChat
                onlyRead={!canEdit}
                toggle={showObservations}
                isOpen={!!(observationsIsOpen)}
                grupo={observationsIsOpen?.[0].grupo_resp}
                id_fcamp={observationsIsOpen?.[0].id_fcamp}
                extra_data_to_send={{
                    id_cond: idCondition,
                }}
            >
                <small className='text-muted'>
                    <b className='border-start ps-2 border-3 border-primary'>Anexo </b>
                    {observationsIsOpen && `${observationsIsOpen?.[0].grupo_resp}`}
                </small>
            </ObservationChat>

            <div>
                {!list ? <Loader isOpen loaderAsModal={false} />
                    :
                    !Object.values(list).length ? <p className='text-muted'>| No hay nada para mostrar</p>
                        :
                        <div className='row align-items-stretch'>
                            {Object.keys(list).map((group, i) => {
                                const li = list[group];
                                const criterial = list[group].find(i => i.json_campo.name.toLowerCase() === "criterio");
                                return <div className='col-12 col-md-6 col-lg-4 pb-3' key={i}>
                                    <Card className="border h-100 justify-content-between" >
                                        <CardHeader
                                            onClick={() => attachmentDetails(list[group], group)}
                                            className='border-bottom-0 text-muted text-truncate'
                                            tag="small">Criterio {criterial?.respuesta}</CardHeader>
                                        <CardBody>
                                            <div>
                                                <div className='d-flex column-gap-3 flex-wrap mb-3'>
                                                    <CardTitle
                                                        tag="h6"
                                                        className='border-start border-3 py-1 px-2 flex-grow-1'
                                                        onClick={() => attachmentDetails(list[group], group)}>
                                                        ID: {group}
                                                    </CardTitle>
                                                    <CardText tag={"small"} className="text-muted">
                                                        {getNormalDate(list[group][0].marc_temp)}
                                                    </CardText>
                                                </div>
                                                <div>
                                                    {
                                                        li.map((item, i) => {
                                                            if (item.json_campo.tag === "file") {
                                                                return item.respuesta?.map((f: T_FileAnswer, ii: number) =>
                                                                    <p key={`attach-${ii}`} className="text-truncate mb-1 hover-scale-up">
                                                                        <a href={f.ruta} target="_blank" className='small link-secondary'>
                                                                            <i className='me-1'><FiletypePDF size={18} /></i> {f.nombreReal}
                                                                        </a>
                                                                    </p>
                                                                )
                                                            } else if (item.json_campo.type === "url") {
                                                                return <p key={`attach-${i}`} className="text-truncate text-secondary">
                                                                    <i><Link size={18} /></i> {item.respuesta}
                                                                </p>
                                                            } else {
                                                                return null;
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className='mt-3 d-flex gap-3'>
                                                <Button color="primary" size='sm' className='w-100 position-relative'
                                                    outline={!(list[group][0].num_obs)} onClick={() => { showObservations(list[group]) }}>
                                                    <div className='d-flex gap-2 justify-content-center align-items-center'>
                                                        <ChatDots />Observaciones
                                                        {!!(list[group][0].num_obs) &&
                                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                                {list[group][0].num_obs}
                                                                <span className="visually-hidden">unread messages</span>
                                                            </span>}
                                                    </div>
                                                </Button>
                                                <UncontrolledTooltip target={`btn-info-${i}`}>Ver detalles del anexo</UncontrolledTooltip>
                                                <Button color="primary" size='sm' id={`btn-info-${i}`} onClick={() => attachmentDetails(list[group], group)}>
                                                    <InfoCircle />
                                                </Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            }
                            )}
                        </div>
                }
            </div>
        </div>
    )
}

export default Attachments;
