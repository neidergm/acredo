import React, { useState } from 'react'
import Form from 'react-ngm-form'
import { Button } from 'reactstrap';
import { I_JSONObject, T_FieldsTypes } from '../../../interfaces/generic.interface';
import { T_Action, T_Stage } from '../../../interfaces/phasesAndStages.interface'
import stageformfields from './../../../forms/stage.form.json';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON } from '../../Modal';
import { actionFields } from './../../../forms/action.form';
import Alert, { I_AlertObject } from '../../Alert';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { DELETE_ACTION } from '../../../services/endPointsService';
import Loader from '../../Loader';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getConditionsPhases } from '../../../store/actions/conditionsActions';
import { useParams } from 'react-router-dom';
import Action from '../Action';
import toast, { Toaster } from 'react-hot-toast';

type T_Props = {
  stage?: T_Stage
}

const CreateStage = ({
  stage
}: T_Props) => {
  const { id_cond } = useParams();

  const actions = stage?.actions || [];
  const [modal, setModal] = useState<T_ModalJSON | null>(null);
  const [alert, setAlert] = useState<I_AlertObject | null>(null);
  const [loader, setLoader] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const modalToEditAction = (action: T_Action | I_JSONObject, type = "Modificar") => {
    setModal({
      isOpen: true,
      children: <div>
        <Form
          formProps={{ id: "EDIT-ACTION-FORM" }}
          fields={actionFields}
          defaultValues={{
            fecha_accion: action.fecha_accion,
            nomb_accion: action.nomb_accion,
            rol_accion: action.rol_accion
          }}
          onSubmit={onEditAction}
        />
      </div>,
      title: `${type} acción`,
      size: "lg",
      footer: <ModalFooter>
        <Button form="EDIT-ACTION-FORM" color='primary'>Guardar{type === "Modificar" ? " cambios" : ""}</Button>
      </ModalFooter>
    })
  }

  const modalToAddNewAction = () => {
    modalToEditAction({}, "Crear")
  }

  const onEditAction = (data: any) => {

  }

  const modalToDeleteAction = (action: T_Action) => {
    setAlert({
      isOpen: true,
      title: "¿Está seguro?",
      type: "question",
      subtitle: <span>Se eliminará la acción <b>{action.nomb_accion}</b></span>,
      submitButton: {
        onClick: () => {
          onDeleteAction(action);
          closeModal(setAlert)
        }, value: "Sí, eliminar"
      },
      closeButton: { value: "No, cancelar" }
    })
  }

  const onDeleteAction = (action: T_Action) => {
    setLoader("Eliminando")
    AXIOS_REQUEST(DELETE_ACTION + action.id_accion, "DELETE").then(resp => {
      toast.success('Acción eliminada correctamente', { position: 'top-right' });
      dispatch(
        getConditionsPhases(Number(id_cond))
      )
    }).catch(() => {
      toast.error('No se pudo eliminar la acción', { position: 'top-right' });
    }
    ).finally(() => {
      setLoader(null)
    })
  }

  return (
    <>
      <Toaster />
      <Modal backdrop="static" size={modal?.size}
        isOpen={!!(modal?.isOpen)}
        onClosed={() => { setModal(null) }}
        toggle={() => closeModal(setModal)}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
        <ModalBody>{modal?.children}</ModalBody>
        {modal?.footer}
      </Modal>
      <Alert isOpen={!!(alert?.isOpen)}{...alert} onClosed={() => { setAlert(null) }} />
      <Loader isOpen={!!(loader)} subtitle={loader} />
      <div className='d-flex flex-column w-100 h-100'>
        <div className='flex-grow-1'>
          <div>
            <Form
              fields={stageformfields as T_FieldsTypes[]}
              defaultValues={{ nomb_etapa: stage?.name }}
              onSubmit={() => {

              }}
            />
          </div>
          <div className='mt-4 pt-2'>
            <div className='d-flex justify-content-between align-items-center'>
              <div>
                <h5 className='ps-3 border-4 py-1 border-success border-start'>Acciones</h5>
              </div>
              {stage?.status !== 1 && <div>
                <Button color='primary' size="sm" className='rounded-2' onClick={() => modalToAddNewAction()}>Crear nueva acción</Button>
              </div>}
            </div>
            <div className='mt-3'>
              <p className='small'>
                <b>NOTA: </b>No se pueden modificar ni eliminar las acciones que ya se han realizado
              </p>
              {
                !(actions) ? <Loader isOpen={!!(loader)} loaderAsModal={false} />
                  :
                  !(actions.length) ?
                    <p className='mt-5'>No hay acciones registradas</p>
                    :
                    <div className='mt-4 pt-2'>
                      {actions.map((act, idx) => <Action
                        key={idx}
                        data={act}
                        idx={idx + 1}
                        onDelete={() => modalToDeleteAction(act)}
                        onEdit={() => modalToEditAction(act)}
                      />)}
                    </div>
              }
            </div>
          </div>
        </div>
        <div className='pt-3 d-flex justify-content-between pb-3 flex-wrap gap-3'>
          <Button color='danger' className='rounded-2'>Eliminar etapa</Button>
          <Button color='primary' className='rounded-2'>Guardar cambios</Button>
        </div>
      </div>
    </>
  )
}

export default CreateStage;
