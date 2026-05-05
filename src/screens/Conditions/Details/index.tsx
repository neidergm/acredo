 
import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from "react-router";
import { BsCheckCircleFill, BsPaperclip, BsPencilSquare, BsExclamationCircleFill, BsInfoCircle, BsLink, BsPeople, BsThreeDotsVertical, BsXCircle } from 'react-icons/bs';
import { Badge, Button, CloseButton, DropdownToggle, Table } from 'reactstrap';
import classnames from 'classnames';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, type T_ModalJSON } from "../../../components/Modal";
import { SubHeader } from "../../../components/SubHeader";
import { DELETE_TASK, UPDATE_TASK } from "../../../services/endPointsService";
import { AXIOS_REQUEST } from "../../../services/axiosService";
import Loader from '../../../components/Loader'
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import Alert from '../../../components/Alert';
import { CurrentPhase, PhasesList } from '../../../components/Phases';
import FormPannel from './../FormPannel';
import { getDifferenceBetweenData, jsonToFormData } from '../../../utils/formUtils';
import { getProcessList } from '../../../store/slices/processSlice';
import Card from '../../../components/Card';
import { getPhasesAndStagesOfCondition, getContionData, setSelectedConditionData } from '../../../store/slices/taskSlice';
import { isAdmin, isLead, isOnlyView, isSupervisor } from '../../../utils/userRolUtils';
import CustomDropdown from '../../../components/CustomDropdown';
import toast from 'react-hot-toast';
import { taskForm } from '../../../forms/task.form';
import Form from 'react-ngm-form';
import TextEditor from '../../../components/TextEditor';
import { type I_JSONObject } from '../../../interfaces/generic.interface';
import confirmDeleteAlertObject from '../../../utils/confirmDeleteAlertObject';
import AllAttachments from '../../../components/AttachmentsTable/AllAttachments';
import useLoader from '../../../hooks/useLoader';
import objectsAreEquals from '../../../utils/compareObjects';
import useAlert from '../../../hooks/useAlert';

const ConditionsDetails = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id_process, id_cond } = useParams();
  const [searchParams] = useSearchParams()
  const { closeLoader, openLoader } = useLoader();

  const processSelected = useAppSelector(state => state.process.selected);
  const conditionSelected = useAppSelector(state => state.conditions.selected);
  const [showAllPhases, setShowAllPhases] = useState(true);
  const phases = {
    all: useAppSelector(state => state.conditions.selectedData.phases),
    active: useAppSelector(state => state.conditions.selectedData.active)
  }

  const { alertData, openAlert, closeAlert } = useAlert()

  const [modalData, setModalData] = useState<T_ModalJSON | null>(null);

  const userRol = useAppSelector(state => state.user.userInfo?.rol)

  const taskIsEnded = conditionSelected?.id_esta === 3;

  const [is_admin, canEditForms] = useMemo(() => {
    const is_admin = isAdmin(userRol);
    const onlyView = isOnlyView(conditionSelected?.rol);
    const is_supervisor = isSupervisor(userRol);
    const is_lead = isLead(conditionSelected?.rol);

    return [is_admin, !taskIsEnded && !is_supervisor && !onlyView && ((is_admin || is_lead) || !!(phases.active?.action?.finalizar))]
  }, [conditionSelected?.rol, userRol, taskIsEnded, phases.active?.action?.finalizar]);

  const showConditionDetails = () => {
    setModalData({
      isOpen: true,
      title: "Detalles",
      fullscreen: "md",
      children: <div className=''>
        {conditionSelected?.detalle ? <TextEditor
          data={`${conditionSelected?.detalle}`}
          disabled
          className="disabled-editor"
          config={{ toolbar: [] }}
        />
          : <p className='text-secondary opacity-75'>Sin detalles</p>
        }
      </div>,
      size: "xl",
      footer: <ModalFooter>
        <Button color="primary2" onClick={() => closeModal(setModalData)}>Cerrar</Button>
      </ModalFooter>
    })
  }

  const showUserResume = () => {
    setModalData({
      isOpen: true,
      fullscreen: "lg",
      title: "Usuarios responsables",
      size: "xl",
      footer: <ModalFooter className='justify-content-between'>
        <Button color='primary2' onClick={() => closeModal(setModalData)}>Cerrar</Button>
      </ModalFooter>,
      children: <>
        <Table responsive striped borderless>
          <thead>
            <tr><th></th><th>Acción (Etapa)</th><th>Responsable</th></tr>
          </thead>
          <tbody>
            {conditionSelected?.resumen_usuario.map((u, idx) => <tr key={idx}><th>{idx + 1}</th><td>{u.accion}</td><td>{u.nomb_resp}</td></tr>)}
          </tbody>
        </Table>
      </>
    })
  }

  const showGeneralAttachmentsTable = () => {
    processSelected && setModalData({
      isOpen: true,
      size: "xl",
      fullscreen: "lg",
      title: "Anexos de la fase",
      children: <>
        <AllAttachments phaseId={conditionSelected!.fase} />
      </>,
      footer: <ModalFooter>
        <Button color='primary2' onClick={() => closeModal(setModalData)}>Cerrar</Button>
        <Link to={`/proceso/fases/anexos/${conditionSelected?.fase}`} target="_blank"
          className="btn btn-primary">Abrir en nueva pestaña</Link>
      </ModalFooter>
    })
  }

  const deleteTask = () => {
    openAlert(
      confirmDeleteAlertObject(
        <span>Se eliminará la tarea con las etapas y acciones relacionadas a la misma</span>,
        {
          onClick: () => closeAlert(() => {
            openLoader("Eliminando tarea")

            AXIOS_REQUEST(DELETE_TASK + conditionSelected?.id_cond, "DELETE").then(_r => {
              toast.success("Se ha eliminado la tarea", { position: "top-right" });
              navigate(-1);
            }).catch(_e => toast.error("No se pudo eliminar la tarea", { position: "top-right" }))
              .finally(() => closeLoader())
          })
        }
      ))
  }

  const editTask = () => {
    const formID = "FORM-EDIT-TASK";
    const fields = taskForm(false, processSelected?.id_tcond);
    const defaultValues = {
      nomb_cond: conditionSelected?.nomb_cond,
      cod_cond: (conditionSelected?.cod_cond)?.toString(),
      detalle: conditionSelected?.detalle,
      responsable: conditionSelected?.usuarios?.map(u => ({ cargo: u.id_cargo, user: u.id_rc, role: u.rol }))
    }

    setModalData({
      isOpen: true,
      children: <div key={formID}>
        <Form
          formProps={{ id: formID }}
          fields={fields}
          defaultValues={structuredClone(defaultValues)}
          onSubmit={(data) => {
            const diffData = getDifferenceBetweenData(defaultValues, data);
            const { responsable, ...dataToSend } = diffData;

            // const responsablesChanged = responsable.length !== defaultValues.responsable?.length ? responsable :
            //   responsable?.filter((r: I_JSONObject) => !(defaultValues.responsable?.find(
            //     (dr: I_JSONObject) => dr.user.toString() === r.user.toString)
            //   ))
            const responsablesChanged = responsable.length !== defaultValues.responsable?.length ? responsable :
              responsable?.filter((r: I_JSONObject, i: number) => !objectsAreEquals(defaultValues.responsable?.[i] || {}, r, false))

            const d = jsonToFormData({ ...dataToSend, id_cond: conditionSelected?.id_cond });

            if (!(responsablesChanged?.length)) {
              if (Object.keys(dataToSend).length === 0) {
                return toast("No hay nada para actualizar", { position: "top-right", icon: <i className='text-warning'><BsExclamationCircleFill /></i> })
              }
            } else {
              responsable.forEach((r: { user: string, role: string }, i: number) => {
                d.append(`responsable[${i}].id_rc`, r.user);
                d.append(`responsable[${i}].rol_cond`, r.role);
              });
            }
            openAlert({
              type: "question",
              title: "¿Desea guardar los cambios realizados?",
              closeButton: { value: "No, cancelar" }, submitButton: {
                value: "Si, guardar", onClick: () => onSubmitEditTask(d)
              }
            })
          }
          }
        />
      </div>,
      title: `Editar tarea`,
      size: "xl",
      footer: <ModalFooter className='justify-content-between'>
        <Button color='primary2' onClick={() => closeModal(setModalData)}>Cancelar</Button>
        <Button form={formID} color='primary'>Guardar</Button>
      </ModalFooter>
    })
  }

  const onSubmitEditTask = (d: FormData) => {
    openLoader("Actualizando tarea");

    AXIOS_REQUEST(UPDATE_TASK, "PUT", d).then(async () => {
      toast.success("Se ha actualizado la tarea correctamente", { position: "top-right" });

      await dispatch(getContionData(Number(id_cond)))
      await dispatch(getPhasesAndStagesOfCondition(Number(id_cond)))
      // dispatch(setProcessPhasesWithConditions(Number(id_process), null));

      closeLoader()
      closeModal(setModalData)
    }).catch(_r => {
      closeLoader()
      toast.error("No se pudo actualizar la tarea", { position: "top-right" })
    })
  }

  useEffect(() => {
    if (!id_process || !id_cond) {
      navigate("/", { replace: true })
      return
    }
    if (!processSelected) {
      dispatch(getProcessList({ id_process: Number(id_process), status: searchParams.get("status") || "" }))
    }
    else {
      if (!(conditionSelected)) {
        dispatch(getContionData(Number(id_cond)))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processSelected])

  useEffect(() => {
    if (!(phases.all?.length)) {
      dispatch(getPhasesAndStagesOfCondition(Number(id_cond)))
    }
    return () => {
      dispatch(setSelectedConditionData(null))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal
        isOpen={!!(modalData?.isOpen)}
        // onClosed={() => { setModalData(null) }}
        toggle={() => closeModal(setModalData)}
        size={modalData?.size}
        fullscreen={modalData?.fullscreen}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModalData)}>{modalData?.title}</ModalHeader>
        <ModalBody>{modalData?.children}</ModalBody>
        {modalData?.footer}
      </Modal>

      <Alert {...alertData} />
      <SubHeader
        text={conditionSelected?.nomb_cond ?
          <div className='d-flex gap-3 flex-wrap align-items-center'>
            {conditionSelected.nomb_cond}
          </div>
          : ""
        }
        className='container-xxxl'
        showBackButton={true}
      />

      <div className="container-fluid container-xxxl">
        <div className='row'>
          <div className='col-lg-8 mb-4'>
            <Card className='h-100'>
              <div className='d-flex justify-content-between mb-4 align-items-center'>
                <div
                  className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2'
                  style={{ borderRadius: "2px 10px 10px 2px" }}
                >
                  <small className='fw-bold text-uppercase '>Información</small>
                </div>
              </div>
              {(!processSelected) ?
                <div className='py-5'><Loader isOpen loaderAsModal={false} /></div>
                :
                <div className='d-flex flex-column gap-3 h-100'>
                  <div>
                    <b>Proceso:</b>
                    <span className="d-block">
                      {processSelected.nomb_conv}
                      <Badge color='light' className='ms-3 text-muted'>
                        {processSelected.sede}
                      </Badge>
                    </span>
                  </div>
                  {!!conditionSelected?.condicion && <div>
                    <b>Condición:</b>
                    <span className="d-block">{conditionSelected.condicion}</span>
                  </div>}
                  {!!processSelected.programa && <div title="Ver detalles del programa">
                    <b>Programa:</b>
                    <span className="d-block">
                      <Link className="link-dark" to={`/programa/${processSelected.id_prog}`}>{processSelected.programa}
                        <i className="link-primary ms-1"><BsLink /></i>
                      </Link>
                    </span>
                  </div>}
                  <div className='d-flex gap-3 flex-wrap justify-content-between flex-grow-1'>
                    <div className='d-flex gap-3 flex-wrap'>
                      <div>
                        <b>Tipo:</b>
                        <span className="d-block">{processSelected.tipo_cond}</span>
                      </div>
                      {!!(conditionSelected?.rol_nombre) && <div>
                        <b>Rol:</b>
                        <span className="d-block">Usted tiene el rol de {conditionSelected?.rol_nombre}</span>
                      </div>}
                    </div>
                    <div className='d-flex gap-2 mt-auto ms-auto'>
                      <div>
                        <CustomDropdown options={[
                          { text: "Ver detalles", icon: <BsInfoCircle size={16} />, click: showConditionDetails },
                          { text: "Ver todos los anexos de la fase", icon: <BsPaperclip size={16} />, click: showGeneralAttachmentsTable },
                          ...((!taskIsEnded && is_admin) ? [
                            { text: "Modificar tarea", icon: <BsPencilSquare size={16} />, click: editTask },
                            { text: "Eliminar tarea", icon: <BsXCircle size={16} />, click: deleteTask }
                          ] : [])
                        ]}>
                          <DropdownToggle size="sm" color='primary' className='pe-3'>
                            <BsThreeDotsVertical size={16} /> Opciones
                          </DropdownToggle>
                        </CustomDropdown>
                      </div>
                      <div>
                        <CustomDropdown options={
                          !(conditionSelected?.usuarios?.length) ?
                            [
                              {
                                text: <b className='text-danger'>Sin usuarios asociados</b>, optionProps: { disabled: true, className: "fw-bold" }
                              }, {
                                text: "Asociar usuarios", optionProps: { className: "mt-3" }, click: editTask
                              }
                            ]
                            :
                            [
                              { text: "Asociados a la tarea actual", optionProps: { header: true, className: "mb-2" } },
                              ...conditionSelected.usuarios.map(u => ({
                                icon: <span className='d-inline-block text-success align-top opacity-75'><BsCheckCircleFill size={14} /></span>,
                                text: <>
                                  {/* <span className='d-inline-block text-success pe-2 align-top opacity-75'><BsCheckCircleFill size={13} /></span> */}
                                  <span className='d-inline-block'>
                                    {u.responsable}
                                    <span className='d-block small fw-semibold'>{u.rol_nombre}</span>
                                  </span>
                                </>,
                                optionProps: { className: "d-block pb-2", disabled: true }
                              })),
                              {
                                icon: <i className='text-primary'><BsPeople size={14} /></i>,
                                text: <small className='text-primary'>Ver responsables de las acciones</small>, optionProps: { className: "mt-4" }, click: showUserResume
                              },
                              ...(!taskIsEnded && is_admin ? [{
                                icon: <i className='text-primary'><BsPencilSquare size={14} /></i>,
                                text: <small className='text-primary'>Modificar usuarios</small>, click: editTask
                              }] : [])
                            ]

                        }>
                          <DropdownToggle size="sm" color='primary' className='pe-3'>
                            <i className='ps-1 pe-1'><BsPeople size={16} /></i>
                            <span className='ps-1 pe-1'>Usuarios</span>
                          </DropdownToggle>
                        </CustomDropdown>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </Card>
          </div>
          <div className='col-lg-4 mb-4 col-md'>
            <Card className='h-100'>
              <div className='d-flex justify-content-between mb-4 align-items-center'>
                <div className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2'
                  style={{ borderRadius: "2px 10px 10px 2px" }}>
                  <small className='fw-bold text-uppercase '>Estado actual</small>
                </div>
              </div>
              <CurrentPhase
                processId={Number(id_process)}
                task={conditionSelected!}
                togglePhases={showAllPhases ? undefined : () => setShowAllPhases(true)}
                taskProgress={conditionSelected?.porcentaje || 0}
              />
            </Card>
          </div>
          <div className={classnames('mb-4 order-3 order-lg-2', showAllPhases ? "col-lg-8" : "col-lg-12")}>
            <Card className='h-100'>
              {(!conditionSelected) ?
                <div className='py-5 mt-5'><Loader isOpen loaderAsModal={false} /></div>
                :
                <FormPannel formId={conditionSelected.form_cond} canEdit={canEditForms}
                  codCond={conditionSelected.cod_cond}
                  // canAddForms={conditionSelected.form_cond.split(",").length <= 1 &&
                  //   conditionSelected.marc_update === conditionSelected.marc_temp}
                  canAddForms={is_admin && !(conditionSelected.porcentaje)}
                // canAddForms={conditionSelected.form_cond.split(",").length <= 1 &&
                //   !(conditionSelected.porcentaje)}
                />
              }
            </Card>
          </div>
          <div className={classnames('col-md-6 mb-4 order-2 order-lg-3', showAllPhases ? "col-lg-4" : "d-none")}>
            <div>
              <Card>
                <div className='d-flex justify-content-between mb-4 align-items-center'>
                  <div className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10 mb-2'
                    style={{ borderRadius: "2px 10px 10px 2px" }}>
                    <small className='fw-bold text-uppercase '>Etapas de la tarea</small>
                  </div>
                  <CloseButton onClick={() => setShowAllPhases(false)} />
                </div>
                <div>
                  {(!conditionSelected) ?
                    <div className='py-5'><Loader isOpen loaderAsModal={false} /></div>
                    :
                    <PhasesList isAdmin={!taskIsEnded && is_admin} taskEnded={taskIsEnded} />
                  }
                </div>
              </Card>
            </div>
          </div>
        </div >
      </div >
    </>
  );
};

export default ConditionsDetails;
