import { useState, useRef, useEffect } from 'react'
import Form from 'react-ngm-form'
import { Button } from 'reactstrap';
import { type T_FieldsTypes } from '../../../interfaces/generic.interface';
import { type T_Action, type T_Phase, type T_Stage } from '../../../interfaces/phasesAndStages.interface'
import stageformfields from './../../../forms/stage.form.json';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, type T_ModalJSON } from '../../Modal';
import { actionFields } from './../../../forms/action.form';
import Alert from '../../Alert';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { DELETE_ACTION, DELETE_STAGE, PUT_ACTION, PUT_STAGE } from '../../../services/endPointsService';
import Loader from '../../Loader';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getContionData, getPhasesAndStagesOfCondition, setProcessPhasesWithConditions } from '../../../store/slices/taskSlice';
import { useParams } from 'react-router';
import Action from '../Action';
import toast from 'react-hot-toast';
import { jsonToFormData } from '../../../utils/formUtils';
import { selectProcess } from '../../../store/slices/processSlice';
import confirmDeleteAlertObject from '../../../utils/confirmDeleteAlertObject';
import { BsExclamationCircleFill, BsUiChecks } from 'react-icons/bs';
import StageChooser from './StageChooser';
import { isLead } from '../../../utils/userRolUtils';
import useLoader from '../../../hooks/useLoader';
import useAlert from '../../../hooks/useAlert';

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
  const { id_process } = useParams();
  const stageIsRegistered = !!(stage?.id);
  const actions = stage?.actions || [];
  const [modal, setModal] = useState<T_ModalJSON | null>(null);

  const { alertData, openAlert, closeAlert } = useAlert();

  const { closeLoader, openLoader } = useLoader()

  const updateDataOnUnmount = useRef(false)

  const dispatch = useAppDispatch();

  const modalToEditAction = (action?: T_Action, type = "Modificar") => {
    const formID = `${type}-ACTION-FORM`;
    const fields = actionFields(id_cond!, action?.id_accion || '0')
    setModal({
      isOpen: true,
      children: <div key={formID}>
        <Form
          formProps={{ id: formID }}
          fields={fields}
          defaultValues={action ? {
            fecha_accion: action.fecha_accion,
            nomb_accion: action.nomb_accion,
            responsible: action.usuarios?.filter(i => i.rol === "B").map(u => ({ cargo: u.id_cargo, user: u.id_rc }))
          } : {}}
          onSubmit={(data) => {
            if (type === "Modificar")
              onEditAction(data, action || {} as T_Action)
            else
              onCreateAction(data)
          }}
        />
      </div>,
      title: `${type} acción`,
      size: "lg",
      footer: <ModalFooter>
        <Button color='primary2' onClick={() => closeModal(setModal)}>Cancelar</Button>
        <Button form={formID} color='primary'>Guardar{type === "Modificar" ? " cambios" : ""}</Button>
      </ModalFooter>
    })
  }

  const modalToAddNewAction = () => {
    modalToEditAction(undefined, "Crear")
  }

  const onCreateAction = (data: any | T_Action[], multiple = false) => {
    let d = new FormData();

    if (multiple && typeof data === "object" && !!(data?.length)) {
      data.forEach((action: T_Action, idx: number) => {
        const pref = `[${idx}].`

        d.append(`${pref}nomb_accion`, action.nomb_accion);
        d.append(`${pref}fecha_accion`, action.fecha_accion);
        d.append(`${pref}id_etapa`, `${stage?.id}`);
        let i = 0;
        action.usuarios!.forEach(r => {
          if (!isLead(r.rol)) {
            d.append(`${pref}responsable[${i}].id_rc`, `${r.id_rc}`);
            d.append(`${pref}responsable[${i}].rol_cond`, r.rol);
            d.append(`${pref}responsable[${i}].id_cond`, id_cond!);
            i++;
          }
        })
      });

    } else {
      d = jsonToFormData({
        "[0].nomb_accion": data.nomb_accion,
        "[0].fecha_accion": data.fecha_accion,
        "[0].id_etapa": stage?.id,
      });

      if (Array.isArray(data.responsiblelength))
        data.responsible.forEach((r: { user: string }, i: number) => {
          d.append(`[0].responsable[${i}].id_rc`, r.user);
          d.append(`[0].responsable[${i}].rol_cond`, "B");
          d.append(`[0].responsable[${i}].id_cond`, id_cond!);
        })
    }

    openLoader("Creando nueva acción")

    AXIOS_REQUEST(PUT_ACTION, "POST", d).then(() => {
      toast.success("Se ha creado la acción correctamente", {
        position: "top-right"
      });
      updateDataOnUnmount.current = true;
      closeLoader(() => {
        closeModal(setModal);
      })
      dispatch(getPhasesAndStagesOfCondition(Number(id_cond)));
    }).catch(() => {
      closeLoader()
      toast.error("No se pudo crear la acción", {
        position: "top-right"
      })
    })
  }

  const onEditAction = (data: any, action: T_Action) => {

    const d = jsonToFormData({
      "[0].id_accion": action.id_accion,
      "[0].nomb_accion": data.nomb_accion,
      "[0].fecha_accion": data.fecha_accion,
      "[0].id_etapa": stage?.id,
    });

    if (data.responsible?.length) {
      data.responsible.forEach((r: { user: string }, i: number) => {
        d.append(`[0].responsable[${i}].id_rc`, r.user);
        d.append(`[0].responsable[${i}].rol_cond`, "B");
        d.append(`[0].responsable[${i}].id_cond`, id_cond!);
      })
    }

    openLoader("Actualizando acción")

    AXIOS_REQUEST(PUT_ACTION, "PUT", d).then(() => {
      toast.success("Se actualizó la acción correctamente", {
        position: "top-right"
      })
      updateDataOnUnmount.current = true;
      dispatch(getPhasesAndStagesOfCondition(Number(id_cond)));
      closeLoader(() => {
        closeModal(setModal);
      })
    }).catch(() => {
      closeLoader()
      toast.error("No se pudo actualizar la acción", {
        position: "top-right"
      })
    })
  }

  const modalToDeleteAction = (action: T_Action) => {
    openAlert(
      confirmDeleteAlertObject(
        <span>Se eliminará la acción <b>{action.nomb_accion}</b></span>,
        {
          onClick: () => closeAlert(() => onDeleteAction(action))
        }
      )
    )
  }

  const modalToDeleteStage = (stage: T_Stage) => {
    if (phase?.stages?.length === 1) {
      return openAlert({
        title: "Espere",
        type: "warning",
        children: <span>No se puede eliminar debido a que la tarea quedaría sin etapas</span>,
        closeButton: { value: "Ok" }
      })
    } else if (stage.actions_completed! > 0) {
      return openAlert({
        title: "Espere",
        type: "warning",
        children: <span>No se puede eliminar debido a que la etapa cuenta con acciones realizadas</span>,
        closeButton: { value: "Ok" }
      })
    }
    openAlert(
      confirmDeleteAlertObject(
        <span>Se eliminará la etapa <b>{stage.name}</b> con todas las acciones relacionadas a la misma</span>,
        {
          onClick: () => closeAlert(() => onDeleteStage(stage))
        }
      ))
  }

  const onDeleteAction = (action: T_Action) => {
    openLoader("Eliminando")
    AXIOS_REQUEST(DELETE_ACTION + action.id_accion, "DELETE").then(() => {
      toast.success('Acción eliminada correctamente', { position: 'top-right' });
      updateDataOnUnmount.current = true;
      dispatch(getPhasesAndStagesOfCondition(Number(id_cond)))
    }).catch(() => {
      toast.error('No se pudo eliminar la acción', { position: 'top-right' });
    }).finally(() => {
      closeLoader()
    })
  }

  const onDeleteStage = (stage: T_Stage) => {
    openLoader("Eliminando etapa")
    AXIOS_REQUEST(DELETE_STAGE + stage.id, "DELETE").then(() => {
      updateDataOnUnmount.current = true;
      toast.success('Etapa eliminada correctamente', { position: 'top-right' });
      dispatch(getPhasesAndStagesOfCondition(Number(id_cond)));
      closeLoader(() => {
        callback?.();
      })
    }).catch(() => {
      closeLoader()
      toast.error('No se pudo eliminar la etapa', { position: 'top-right' });
    })
  }

  const updateStage = ({ nomb_etapa }: any) => {

    if (nomb_etapa === stage?.name) return toast.error("Nada para actualizar", { position: "top-right", icon: <i className='text-warning'><BsExclamationCircleFill /> </i> })

    const data = jsonToFormData({
      "[0].id_fase": phase?.id,
      "[0].id_etapa": stage?.id,
      "[0].id_cond": Number(id_cond),
      "[0].nomb_etapa": nomb_etapa
    })

    openLoader("Actualizando etapa");

    AXIOS_REQUEST(PUT_STAGE, "PUT", data).then(() => {
      updateDataOnUnmount.current = true;
      dispatch(getPhasesAndStagesOfCondition(Number(id_cond)));
      toast.success("Se actualizó la etapa correctamente", { position: "top-right" });
    }).catch(() => {
      toast.error("No se pudo actualizar la etapa", { position: "top-right" })
    }).finally(() => closeLoader())
  }

  const createStage = ({ nomb_etapa }: any) => {

    const data = jsonToFormData({
      "[0].id_fase": phase?.id,
      "[0].id_cond": Number(id_cond),
      "[0].nomb_etapa": nomb_etapa
    })

    openLoader("Registrando nueva etapa");

    AXIOS_REQUEST(PUT_STAGE, "POST", data).then(() => {
      toast.success("Se ha registrado la etapa correctamente", { position: "top-right" });
      updateDataOnUnmount.current = true;
      dispatch(getPhasesAndStagesOfCondition(Number(id_cond)));
      // dispatch(getPhasesAndStagesOfCondition(Number(id_cond)));
    }).catch(() => {
      toast.error("No se pudo registrar la etapa", { position: "top-right" })
    }).finally(() => closeLoader())
  }

  const copyActionsFromPhase = () => {
    setModal({
      isOpen: true,
      title: "Copiar acciones de etapa",
      size: "lg",
      fullscreen: "md",
      children: <>
        <p>Seleccione la etapa desde la cual quiere tomar las acciones como copia para la etapa <i>"{stage?.name}"</i></p>
        <br />
        <StageChooser phase={phase!} stage={stage!} formId="COPY_FORM" submit={(data) => {
          if (data.length === 0) {
            return toast.error("Debe seleccionar las acciones a copiar", { position: "top-right" })
          }
          openAlert({
            type: "question",
            title: "¿Está seguro?",
            children: `Se copiarán ${data.length} acciones en esta etapa. Tenga en cuenta que la copia incluye fechas y responsables`,
            submitButton: {
              value: "Ok, continuar", onClick: () => onCreateAction(data, true)
            },
            closeButton: { value: "No, cancelar" }
          })
        }} />
      </>,
      footer: <ModalFooter>
        <Button color="primary2" type='button' onClick={() => closeModal(setModal)}>Cerrar</Button>
        <Button color="primary" form='COPY_FORM'>Ok, copiar</Button>
      </ModalFooter>
    })
  }

  useEffect(() => {
    return () => {
      if (updateDataOnUnmount.current) {
        dispatch(selectProcess(null));
        dispatch(getContionData(Number(id_cond)));
        // dispatch(getPhasesAndStagesOfCondition(Number(id_cond)));
        dispatch(setProcessPhasesWithConditions(Number(id_process), null))
        // dispatch(setSelectedConditionData(null));
      }
    }
  }, [])

  return (
    <>
      <Modal backdrop="static" size={modal?.size} fullscreen={modal?.fullscreen}
        isOpen={!!(modal?.isOpen)}
        onClosed={() => { setModal(null) }}
        toggle={() => closeModal(setModal)}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
        <ModalBody>{modal?.children}</ModalBody>
        {modal?.footer}
      </Modal>
      <Alert {...alertData} />
      {/* <Loader {...loading} /> */}
      <div className='d-flex flex-column w-100 h-100'>
        <div className='flex-grow-1'>
          <div className='d-flex justify-content-between gap-4 flex-wrap'>
            <div className='flex-grow-1 '>
              <Form
                // fields={JSON.parse(JSON.stringify(stageformfields)) as T_FieldsTypes[]}
                fields={structuredClone(stageformfields) as T_FieldsTypes[]}
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
                !(actions) ? <Loader isOpen loaderAsModal={false} />
                  :
                  !(actions.length) ? <div className='text-secondary pt-5 text-center'>
                    <p className='mt-5'>No hay acciones registradas</p>
                    <div className='mt-3'>
                      <Button disabled={(phase?.stages?.length || 0) <= 1} color="primary2" size='sm' onClick={() => copyActionsFromPhase()}><BsUiChecks /> Copiar acciones desde etapa</Button>
                    </div>
                  </div>
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
