import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircleFill, Edit, ExclamationCircleFill, InfoCircle, People, ThreeDotsVertical, XCircle } from "../../../components/Icons";
import { Badge, Button, CloseButton, DropdownToggle } from 'reactstrap';
import classnames from 'classnames';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON } from "../../../components/Modal";
import { SubHeader } from "../../../components/SubHeader";
import { DELETE_TASK, UPDATE_TASK } from "../../../services/endPointsService";
import { AXIOS_REQUEST } from "../../../services/axiosService";
import Loader from '../../../components/Loader'
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import Alert, { I_AlertObject } from '../../../components/Alert';
import { CurrentPhase, PhasesList } from '../../../components/Phases';
import FormPannel from './../FormPannel';
import { getDifferenceBetweenData, jsonToFormData } from '../../../utils/formUtils';
import { getProcessList } from '../../../store/actions/processActions';
import Card from '../../../components/Card';
import { getPhasesAndStagesOfCondition, getContionData, setProcessPhasesWithConditions, setSelectedConditionData } from '../../../store/actions/conditionsActions';
import { isAdmin, isLead, isOnlyView } from '../../../utils/userRolUtils';
import CustomDropdown from '../../../components/CustomDropdown';
import toast from 'react-hot-toast';
import { taskForm } from '../../../forms/task.form';
import Form from 'react-ngm-form';
import TextEditor from '../../../components/TextEditor';
import { I_JSONObject } from '../../../interfaces/generic.interface';
import confirmDeleteAlertObject from '../../../utils/confirmDeleteAlertObject';

const ConditionsDetails = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id_process, id_cond } = useParams();

  const processSelected = useAppSelector(state => state.process.selected);
  const conditionSelected = useAppSelector(state => state.conditions.selected);

  const [showAllPhases, setShowAllPhases] = useState(true);

  const phases = {
    all: useAppSelector(state => state.conditions.selectedData.phases),
    active: useAppSelector(state => state.conditions.selectedData.active)
  }

  const [_alert, setAlert] = useState<null | I_AlertObject>(null);
  const [loader, setLoader] = useState<null | string>(null);
  const [modalData, setModalData] = useState<T_ModalJSON | null>(null);

  const onlyView = isOnlyView(conditionSelected?.rol);
  const is_admin = isAdmin(useAppSelector(state => state.user.userInfo?.rol));
  const is_lead = isLead(useAppSelector(state => state.user.userInfo?.rol));
  const taskIsEnded = conditionSelected?.id_esta === 3;

  const canEditForms = !taskIsEnded && !onlyView && ((is_admin || is_lead) || !!(phases.active?.action?.finalizar));

  const showConditionDetails = () => {
    setModalData({
      isOpen: true,
      title: "Detalles",
      fullscreen: "md",
      children: <div className=''>
        <TextEditor
          data={`${conditionSelected?.detalle}`}
          disabled
          className="disabled-editor"
          config={{ toolbar: [] }}
        />
      </div>,
      size: "xl",
      footer: <ModalFooter>
        <Button color="primary2" onClick={() => closeModal(setModalData)}>Cerrar</Button>
      </ModalFooter>
    })
  }

  const deleteTask = () => {
    setAlert(
      confirmDeleteAlertObject(
        <span>Se eliminará la tarea con las etapas y acciones relacionadas a la misma</span>,
        () => {
          setLoader("Eliminando tarea")

          AXIOS_REQUEST(DELETE_TASK + conditionSelected?.id_cond, "DELETE").then(r => {
            toast.success("Se ha eliminado la tarea", { position: "top-right" });
            dispatch(setProcessPhasesWithConditions(Number(id_process), null));
            navigate(-1);
          }).catch(e => toast.error("No se pudo eliminar la tarea", { position: "top-right" }))
            .finally(() => setLoader(null))
        },
        setAlert
      ))
  }

  const editTask = () => {
    const formID = "FORM-EDIT-TASK";
    const fields = taskForm(false);

    const defaultValues = {
      nomb_cond: conditionSelected?.nomb_cond,
      cod_cond: conditionSelected?.cod_cond?.toString(),
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

            const responsablesChanged = responsable.length !== defaultValues.responsable?.length ? responsable :
              responsable?.filter((r: I_JSONObject) => !(defaultValues.responsable?.find((dr: I_JSONObject) => dr.user.toString() === r.user.toString())))

            const d = jsonToFormData({ ...dataToSend, id_cond: conditionSelected?.id_cond });

            if (!(responsablesChanged?.length)) {
              if (Object.keys(dataToSend).length === 0) {
                setLoader(null);
                return toast("No hay nada para actualizar", { position: "top-right", icon: <i className='text-warning'><ExclamationCircleFill /></i> })
              }
            } else {
              responsable.forEach((r: { user: string, role: string }, i: number) => {
                d.append(`responsable[${i}].id_rc`, r.user);
                d.append(`responsable[${i}].rol_cond`, r.role);
              });
            }
            setAlert({
              isOpen: true,
              type: "question",
              title: "¿Desea guardar los cambios realizados?",
              closeButton: { value: "no, cancelar" }, submitButton: { value: "Si, guardar", onClick: () => onSubmitEditTask(d) }
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
    setLoader("Actualizando tarea");

    AXIOS_REQUEST(UPDATE_TASK, "PUT", d).then(r => {
      toast.success("Se ha actualizado la tarea correctamente", { position: "top-right" });

      dispatch(getContionData(Number(id_cond)))
      dispatch(setProcessPhasesWithConditions(Number(id_process), null));
      closeModal(setModalData)
    }).catch(r => toast.error("No se pudo actualizar la tarea", { position: "top-right" }))
      .finally(() => setLoader(null))
  }

  useEffect(() => {
    if (!id_process || !id_cond) return navigate("/", { replace: true })

    if (!processSelected) {
      dispatch(getProcessList(Number(id_process)))
    }
    else {
      if (!(conditionSelected)) {
        dispatch(getContionData(Number(id_cond)))
      }
    }
  }, [processSelected])

  useEffect(() => {
    if (!(phases.all?.length)) {
      dispatch(getPhasesAndStagesOfCondition(Number(id_cond)))
    }
    return () => {
      dispatch(setSelectedConditionData(null))
    }
  }, []);

  return (
    <>
      <Modal
        isOpen={!!(modalData?.isOpen)}
        onClosed={() => { setModalData(null) }}
        toggle={() => closeModal(setModalData)}
        size={modalData?.size}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModalData)}>{modalData?.title}</ModalHeader>
        <ModalBody>{modalData?.children}</ModalBody>
        {modalData?.footer}
      </Modal>

      <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} />
      <Loader isOpen={!!(loader)} subtitle={loader} />
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
                <div className='mb-3'><Loader isOpen={true} loaderAsModal={false} /></div>
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
                  {!!processSelected.programa && <div>
                    <b>Programa:</b>
                    <span className="d-block">{processSelected.programa}</span>
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
                    <div className='d-flex gap-3 mt-auto ms-auto'>
                      <div>
                        {!taskIsEnded && is_admin ?
                          <CustomDropdown options={[
                            { text: "Ver detalles", icon: <InfoCircle size={16} />, click: showConditionDetails },
                            { text: "Modificar tarea", icon: <Edit size={16} />, click: editTask },
                            { text: "Eliminar tarea", icon: <XCircle size={16} />, click: deleteTask },
                          ]}>
                            <DropdownToggle size="sm" color='primary' className='pe-3'>
                              <ThreeDotsVertical size={16} /> Opciones
                            </DropdownToggle>
                          </CustomDropdown>
                          :
                          <Button size='sm' color="primary" outline onClick={() => showConditionDetails()}>
                            <span className='d-flex align-items-center pe-2'>
                              <span className='me-1'><InfoCircle size={16} /></span>Detalles
                            </span>
                          </Button>
                        }
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
                                icon: <span className='d-inline-block text-success align-top opacity-75'><CheckCircleFill size={14} /></span>,
                                text: <>
                                  {/* <span className='d-inline-block text-success pe-2 align-top opacity-75'><CheckCircleFill size={13} /></span> */}
                                  <span className='d-inline-block'>
                                    {u.responsable}
                                    <span className='d-block small fw-semibold'>{u.rol_nombre}</span>
                                  </span>
                                </>
                                , optionProps: { className: "d-block pb-2" }
                              })),
                              ...(!taskIsEnded && is_admin ? [{
                                icon: <i className='text-primary'><Edit size={14} /></i>,
                                text: <small className='text-primary'>Modificar usuarios</small>, optionProps: { className: "mt-4" }, click: editTask
                              }] : [])
                            ]

                        }>
                          <DropdownToggle size="sm" color='primary' className='pe-3'>
                            <i className='ps-1 pe-1'><People size={16} /></i>
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
                <div className='mt-4 pt-2'><Loader isOpen={true} loaderAsModal={false} /></div>
                :
                <FormPannel formId={conditionSelected.form_cond} canEdit={canEditForms}
                  codCond={conditionSelected.cod_cond}
                  // canAddForms={conditionSelected.form_cond.split(",").length <= 1 &&
                  //   conditionSelected.marc_update === conditionSelected.marc_temp}
                  canAddForms={conditionSelected.form_cond.split(",").length <= 1 &&
                    !(conditionSelected.porcentaje)}
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
                  <PhasesList isAdmin={!taskIsEnded && is_admin} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConditionsDetails;
