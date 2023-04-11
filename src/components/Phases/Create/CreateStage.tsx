import React, { useState, useRef } from 'react'
import Form from 'react-ngm-form'
import { Button } from 'reactstrap';
import { T_FieldsTypes } from '../../../interfaces/generic.interface';
import { T_Action, T_Phase, T_Stage } from '../../../interfaces/phasesAndStages.interface'
import stageformfields from './../../../forms/stage.form.json';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON } from '../../Modal';
import { actionFields } from './../../../forms/action.form';
import Alert, { I_AlertObject } from '../../Alert';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { DELETE_ACTION, DELETE_STAGE, PUT_ACTION, PUT_STAGE } from '../../../services/endPointsService';
import Loader from '../../Loader';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getConditionsPhases } from '../../../store/actions/conditionsActions';
import { useParams } from 'react-router-dom';
import Action from '../Action';
import toast, { Toaster } from 'react-hot-toast';
import { jsonToFormData } from '../../../utils/formUtils';
import { getNormalDate } from '../../../utils/dateUtils';

type T_Props = {
  stage?: T_Stage,
  phase?: T_Phase,
  callback?: () => void,
}

const CreateStage = ({
  stage,
  phase,
  callback
}: T_Props) => {
  const { id_cond } = useParams();
  const stageIsRegistered = !!(stage?.id);
  const actions = stage?.actions || [];
  const [modal, setModal] = useState<T_ModalJSON | null>(null);
  const [alert, setAlert] = useState<I_AlertObject | null>(null);
  const [loader, setLoader] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const modalToEditAction = (action?: T_Action, type = "Modificar") => {
    let formID = `${type}-ACTION-FORM`;
    let fields = actionFields(id_cond!)
    setModal({
      isOpen: true,
      children: <div key={formID}>
        <Form
          formProps={{ id: formID }}
          fields={fields}
          defaultValues={action ? {
            fecha_accion: action.fecha_accion,
            nomb_accion: action.nomb_accion,
            responsible: action.usuario?.filter(i => i.rol === "B").map((u: any) => ({ cargo: u.id_cargo, user: u.id_rc }))
          } : {}}
          onSubmit={(data) => { type === "Modificar" ? onEditAction(data, action || {} as T_Action) : onCreateAction(data) }}
        />
      </div>,
      title: `${type} acción`,
      size: "lg",
      footer: <ModalFooter>
        <Button form={formID} color='primary'>Guardar{type === "Modificar" ? " cambios" : ""}</Button>
      </ModalFooter>
    })
  }

  const modalToAddNewAction = () => {
    modalToEditAction(undefined, "Crear")
  }

  const onCreateAction = (data: any) => {
    let d = jsonToFormData({
      "[0].nomb_accion": data.nomb_accion,
      "[0].fecha_accion": getNormalDate(data.fecha_accion).split("/").reverse().join("-"),
      "[0].orden": (stage?.actions?.length || 0) + 1,
      "[0].id_etapa": stage?.id,
    });

    !!(data.responsible?.length) && data.responsible.forEach((r: { user: string }, i: number) => {
      d.append(`[0].responsable[${i}].id_rc`, r.user);
      d.append(`[0].responsable[${i}].rol_cond`, "B");
      d.append(`[0].responsable[${i}].id_cond`, id_cond!);
    })

    setLoader("Creando nueva acción")

    AXIOS_REQUEST(PUT_ACTION, "POST", d, true).then(r => {
      toast.success("Se ha creado la acción correctamente", {
        position: "top-right"
      });
      closeModal(setModal);
      dispatch(getConditionsPhases(Number(id_cond)));
    }).catch(e => {
      toast.error("No se pudo crear la acción", {
        position: "top-right"
      })
    }).finally(() => setLoader(null))
  }

  const onEditAction = (data: any, action: T_Action) => {

    let d = jsonToFormData({
      "[0].id_accion": action.id_accion,
      "[0].nomb_accion": data.nomb_accion,
      "[0].fecha_accion": getNormalDate(data.fecha_accion).split("/").reverse().join("-"),
      "[0].orden": action.orden,
      "[0].id_etapa": stage?.id,
    });

    !!(data.responsible?.length) && data.responsible.forEach((r: { user: string }, i: number) => {
      d.append(`[0].responsable[${i}].id_rc`, r.user);
      d.append(`[0].responsable[${i}].rol_cond`, "B");
      d.append(`[0].responsable[${i}].id_cond`, id_cond!);
    })

    setLoader("Actualizando acción")

    AXIOS_REQUEST(PUT_ACTION, "PUT", d, true).then(r => {
      toast.success("Se actualizó la acción correctamente", {
        position: "top-right"
      })
      dispatch(getConditionsPhases(Number(id_cond)));
    }).catch(e => {
      toast.error("No se pudo actualizar la acción", {
        position: "top-right"
      })
    }).finally(() => setLoader(null))
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

  const modalToDeleteStage = (stage: T_Stage) => {
    setAlert({
      isOpen: true,
      title: "¿Está seguro?",
      type: "question",
      subtitle: <span>Se eliminará la etapa <b>{stage.name}</b> con todas las acciones relacionadas a la misma</span>,
      submitButton: {
        onClick: () => {
          onDeleteStage(stage);
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
    }).finally(() => {
      setLoader(null)
    })
  }

  const onDeleteStage = (stage: T_Stage) => {
    setLoader("Eliminando etapa")
    AXIOS_REQUEST(DELETE_STAGE + stage.id, "DELETE").then(resp => {
      toast.success('Etapa eliminada correctamente', { position: 'top-right' });
      dispatch(getConditionsPhases(Number(id_cond)));
      callback?.();
    }).catch(() => {
      toast.error('No se pudo eliminar la etapa', { position: 'top-right' });
    }).finally(() => setLoader(null))
  }

  const updateStage = ({ nomb_etapa }: any) => {

    let data = jsonToFormData({
      "[0].id_fase": phase?.id,
      "[0].id_etapa": stage?.id,
      "[0].id_cond": Number(id_cond),
      "[0].nomb_etapa": nomb_etapa
    })

    setLoader("Actualizando etapa");

    AXIOS_REQUEST(PUT_STAGE, "PUT", data, true).then(r => {
      dispatch(getConditionsPhases(Number(id_cond)));
      toast.success("Se actualizó la etapa correctamente", { position: "top-right" })
    }).catch(e => {
      toast.error("No se pudo actualizar la etapa", { position: "top-right" })
    }).finally(() => setLoader(null))
  }

  const createStage = ({ nomb_etapa }: any) => {

    let data = jsonToFormData({
      "[0].id_fase": phase?.id,
      "[0].id_cond": Number(id_cond),
      "[0].nomb_etapa": nomb_etapa
    })

    setLoader("Registrando nueva etapa");

    AXIOS_REQUEST(PUT_STAGE, "POST", data, true).then(r => {
      dispatch(getConditionsPhases(Number(id_cond)));
      toast.success("Se ha registrado la etapa correctamente", { position: "top-right" })
    }).catch(e => {
      toast.error("No se pudo registrar la etapa", { position: "top-right" })
    }).finally(() => setLoader(null))
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
          <div className='d-flex justify-content-between gap-4 flex-wrap'>
            <div className='flex-grow-1 '>
              <Form
                fields={JSON.parse(JSON.stringify(stageformfields)) as T_FieldsTypes[]}
                defaultValues={{ nomb_etapa: stage?.name }}
                onSubmit={stageIsRegistered ? updateStage : createStage}
                formProps={{ id: "STAGE-FORM" }}
              />
            </div>
            <div className='mb-3 align-self-end text-end ms-auto'>
              <Button color='primary' size="sm" className='rounded-2' form='STAGE-FORM'>
                {stageIsRegistered ? "Actualizar nombre" : "Guardar etapa"}</Button>
            </div>
          </div>
          {stageIsRegistered && <div className='mt-4 pt-2'>
            <div className='d-flex justify-content-between align-items-center'>
              <div>
                <h5 className='ps-3 border-4 py-1 border-success border-start'>Acciones</h5>
              </div>
              {stage?.status !== 1 && <div>
                <Button disabled={!(stageIsRegistered)} color='primary' size="sm" className='rounded-2' onClick={() => modalToAddNewAction()}>
                  Crear nueva acción
                </Button>
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
          </div>}
        </div>
        {stageIsRegistered && <div className='pt-4 d-flex justify-content-between pb-3 flex-wrap gap-3'>
          <Button color='danger' className='rounded-2' onClick={() => modalToDeleteStage(stage)}>Eliminar etapa</Button>
        </div>}
      </div>
    </>
  )
}

export default CreateStage;
