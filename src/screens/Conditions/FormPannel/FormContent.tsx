import { useState } from 'react'
import Form from 'react-ngm-form'
import { Button } from 'reactstrap'
import { type T_Form, type T_FormPannelActions } from '.'
import AttachmentsTable from '../../../components/AttachmentsTable'
import { BsPencilSquare, BsPlusCircleFill, BsXCircle } from 'react-icons/bs';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, type T_ModalJSON } from '../../../components/Modal'
import { isAGoogleDocField } from '../../../utils/mapField'

type T_Props = {
    canEdit: boolean,
    formItem: T_Form,
} & Pick<T_FormPannelActions, "onDelete" | "onSubmit" | "onObservationsDone">

const FormContent = ({ canEdit, formItem, onSubmit, onDelete, onObservationsDone }: T_Props) => {
    const [modal, setModal] = useState<T_ModalJSON | null>(null);

    const openFormAsModal = (form: T_Form, action = "Agregar") => {
        const FORM_ID = `FORM-MODAL-${form.id_fcamp}`;
        if (action === "Agregar") {
            form.est_resp = 0;
        }
        setModal({
            isOpen: true,
            size: "xl",
            title: action,
            children: <Form
                disabled={!canEdit}
                key={form.id_fcamp}
                fields={form.fields}
                defaultValues={form.defaultValues}
                onSubmit={data => submit(data, form)}
                formProps={{ id: FORM_ID }}
            />,
            footer: canEdit && <ModalFooter>
                <Button color="primary2" onClick={() => closeModal(setModal)}>Cancelar</Button>
                <Button color="primary" form={FORM_ID}>Guardar</Button>
            </ModalFooter>
        })
    }

    const submit = (data: Record<string, unknown>, form = formItem) => {
        onSubmit(
            data,
            form,
            () => {
                setModal(null)
            }
        )
    }

    return (
        <>
            {formItem.tipo_form === 1 ?
                <>
                    <Modal backdrop="static" size={modal?.size || "xl"}
                        isOpen={!!(modal?.isOpen)}
                        onClosed={() => { setModal(null) }}
                        toggle={() => closeModal(setModal)}
                    >
                        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
                        <ModalBody>{modal?.children}</ModalBody>
                        {modal?.footer}
                    </Modal>
                    <Button
                        disabled={!canEdit}
                        outline
                        color={"primary"}
                        className="rounded-pill btn-sm px-3 mb-4 d-flex align-items-center"
                        onClick={() => { if (canEdit) openFormAsModal(formItem) }}
                    >
                        <BsPlusCircleFill size={17} />
                        <span className="ms-2">Agregar</span>
                    </Button>
                </>
                :
                <Form
                    disabled={!canEdit}
                    key={formItem.id_fcamp}
                    fields={formItem.fields}
                    defaultValues={formItem.defaultValues}
                    onSubmit={data => submit(data)}
                >
                    {!(isAGoogleDocField(formItem.fields[0].type)) &&
                        canEdit ?
                        <div className='text-center mt-5'>
                            <button type='submit' className='btn btn-success px-5'>
                                <div className='px-5'>Guardar</div>
                            </button>
                        </div>
                        :
                        <></>
                    }
                </Form>
            }
            {
                !!(Object.keys(formItem.multiplesValues || {}).length) && (
                    !(formItem.isAttachmentsTable) ? <>
                        <p className='ws-bold'>Respuestas registradas:</p>
                        {
                            Object.keys(formItem.multiplesValues!).map(r => {
                                const respItem = formItem.multiplesValues![r];
                                return <div className="bg-light p-3 mb-5 rounded-3 position-relative" key={r}>
                                    {canEdit && <div className='position-absolute end-0 top-0'>
                                        <Button onClick={() => openFormAsModal(respItem, "Modificar")}
                                            color='' title="Modificar" className='p-1 text-warning me-1' size='sm'>
                                            <BsPencilSquare size={16} />
                                        </Button>
                                        <Button onClick={() => {
                                            onDelete!(`${respItem.id_fcamp}/${r}`,
                                                undefined,
                                                <>Esta acción es irreversible, se eliminará de forma permanente este bloque de respuestas</>
                                            )
                                        }}
                                            color='' title="Eliminar" className='p-1 text-danger' size='sm'>
                                            <BsXCircle size={16} />
                                        </Button>
                                    </div>}
                                    <Form
                                        key={`form_${r}`}
                                        disabled={true}
                                        fields={respItem.fields}
                                        defaultValues={respItem.defaultValues}
                                        onSubmit={() => { console.log() }}
                                    />
                                </div>
                            })
                        }
                    </> : <>
                        <AttachmentsTable
                            list={formItem.multiplesValues!}
                            onEdit={openFormAsModal}
                            orderingCallback={
                                () => onSubmit(null, null as never, undefined, true)
                            }
                            onDelete={onDelete}
                            canEdit={canEdit}
                            onObservationsDone={onObservationsDone}
                        />
                    </>
                )
            }
        </>
    )
}

export default FormContent;