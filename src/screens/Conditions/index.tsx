import { useEffect, useState } from "react";
import { SubHeader } from "../../components/SubHeader";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { I_Condition } from "../../interfaces/conditions.interface";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge, Button, DropdownToggle, ListGroup, ListGroupItem, Progress, Table } from "reactstrap";
import Loader from "../../components/Loader";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectCondition, getPhasesWithConditions, setProcessPhasesWithConditions } from "../../store/actions/conditionsActions";
import CircleProgress from "../../components/CircleProgress";
import { getProcessList } from "../../store/actions/processActions";
import Card from "../../components/Card";
import classnames from 'classnames';
import { getDateDiff, getNormalDate } from "../../utils/dateUtils";
import { Clip, Edit, ExclamationCircleFill, PauseFill, Plus, ThreeDotsVertical, XCircle } from "../../components/Icons";
import styles from './../Process.module.css';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON } from "../../components/Modal";
import AllAttachments from "../../components/AttachmentsTable/AllAttachments";
import { isAdmin } from "../../utils/userRolUtils";
import Form from "react-ngm-form";
import phaseForm from "./../../forms/phase.form.json";
import { taskForm } from "../../forms/task.form";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { jsonToFormData } from "../../utils/formUtils";
import { DELETE_PHASE, SAVE_PHASE, SAVE_TASK } from "../../services/endPointsService";
import toast, { Toaster } from 'react-hot-toast';
import { XCircleFill } from "../../components/Icons";
import { T_PhasesWithConditions } from "../../interfaces/phasesAndStages.interface";
import CustomDropdown from "../../components/CustomDropdown";
import Alert, { I_AlertObject } from "../../components/Alert";
import confirmDeleteAlertObject from "../../utils/confirmDeleteAlertObject";
import UserResume from "../../components/UserResume";

let lastAccordionOpen = ``;

const Conditions = () => {
  const location = useLocation()
  const { id_process } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedProcess = useAppSelector(state => state.process.selected);
  const is_admin = isAdmin(useAppSelector(state => state.user.userInfo?.rol));
  const phasesWithConditions = useAppSelector(state => state.conditions.phasesWithConditions);
  const [accordionOpen, setAccordionOpen] = useState(lastAccordionOpen);
  const [modal, setModal] = useState<null | T_ModalJSON>(null);
  const [loading, setLoading] = useState<null | string>(null);
  const [alert, setAlert] = useState<I_AlertObject | null>(null);

  const goToConditionDetailsScreen = (condition: I_Condition) => {
    dispatch(selectCondition(condition));
    navigate(`${location.pathname}/${condition.id_cond}`);
  }

  const selectItem = (item: string) => {
    setAccordionOpen(i => {
      lastAccordionOpen = i === item ? "" : item;
      return lastAccordionOpen;
    })
  };

  const showAllAttachment = (phase: T_PhasesWithConditions) => {
    setModal({
      isOpen: true,
      size: "xl",
      title: "Anexos por fase",
      children: <>
        <AllAttachments phaseId={phase.id_fase} />
      </>,
      footer: <ModalFooter>
        <Button color='primary2' onClick={() => closeModal(setModal)}>Cerrar</Button>
        <Link to={`/proceso/fases/anexos/${phase.id_fase}`} target="_blank"
          className="btn btn-primary">Abrir en nueva pestaña</Link>
      </ModalFooter>
    })
  }

  const modalToCreatePhase = (phase?: T_PhasesWithConditions, type = "Crear") => {
    let formID = "FORM-CREATE-PHASE";
    let fields = JSON.parse(JSON.stringify(phaseForm));
    setModal({
      isOpen: true,
      children: <div key={formID}>
        <Form
          formProps={{ id: formID }}
          fields={fields}
          defaultValues={{
            nomb_fase: phase?.nomb_fase,
            fecha_inicio: phase?.fech_ini.split("T")[0],
            fecha_fin: phase?.fech_fin.split("T")[0],
          }}
          onSubmit={type === "Crear" ? createPhase : (data) => editPhase(data, phase!)}
        />
      </div>,
      title: `${type} fase`,
      size: "md",
      footer: <ModalFooter className='justify-content-between'>
        <Button color='primary2' onClick={() => closeModal(setModal)}>Cancelar</Button>
        <Button form={formID} color='primary'>Guardar {type !== "Crear" && "cambios"}</Button>
      </ModalFooter>
    })
  }

  const modalToEditPhase = (phase: T_PhasesWithConditions) => {
    modalToCreatePhase(phase, "Modificar")
  }

  const modalToCreateTask = (phase: T_PhasesWithConditions) => {
    let formID = "FORM-CREATE-TASK";
    let fields = taskForm();
    setModal({
      isOpen: true,
      children: <div key={formID}>
        <p className="mb-4 border-success border-5 ps-3 py-1 border-start">
          <b className="small d-block">Fase:</b>
          <span className="mb-0">{phase.nomb_fase}</span>
        </p>
        <Form
          formProps={{ id: formID }}
          fields={fields}
          defaultValues={{}}
          onSubmit={(data) => createTask(data, phase)}
        />
      </div>,
      title: `Crear nueva tarea`,
      size: "xl",
      footer: <ModalFooter className='justify-content-between'>
        <Button color='primary2' onClick={() => closeModal(setModal)}>Cancelar</Button>
        <Button form={formID} color='primary'>Guardar</Button>
      </ModalFooter>
    })
  }

  const createPhase = (data: any) => {
    setLoading("Creando fase");

    let d = jsonToFormData({
      "[0].nomb_fase": data.nomb_fase,
      "[0].id_conv": id_process,
      "[0].fech_ini": getNormalDate(data.fecha_inicio).split("/").reverse().join("-"),
      "[0].fech_fin": getNormalDate(data.fecha_fin).split("/").reverse().join("-"),
    });

    AXIOS_REQUEST(SAVE_PHASE, "POST", d, true).then(r => {
      toast.success("Se ha creado la fase correctamente", { position: "top-right" });
      closeModal(setModal);
      dispatch(setProcessPhasesWithConditions(Number(id_process), null))
    }).catch(e => {
      toast.error("No se pudo crear la fase", { position: "top-right" });
    }).finally(() => setLoading(null))
  }

  const createTask = ({ responsable, ...data }: any, phase: T_PhasesWithConditions) => {
    setLoading("Creando nueva tarea");
    let d = jsonToFormData({
      ...data,
      id_conv: id_process,
      id_fase: phase.id_fase
    })

    !!(responsable?.length) && responsable.forEach((r: { user: string, role: string }, i: number) => {
      d.append(`responsable[${i}].id_rc`, r.user);
      d.append(`responsable[${i}].rol_cond`, r.role);
    })

    AXIOS_REQUEST(SAVE_TASK, "POST", d, true).then(r => {
      toast.success("Se ha creado la tarea correctamente", { position: "top-right" });
      dispatch(setProcessPhasesWithConditions(Number(id_process), null));
      closeModal(setModal)
    }).catch(r => toast.error("No se pudo crear la tarea", { position: "top-right" }))
      .finally(() => setLoading(null))
  }

  const deletePhase = (phase: T_PhasesWithConditions) => {
    setAlert(
      !(phase.porcentaje) ?
        confirmDeleteAlertObject(
          <span>Se eliminará la fase <b>{phase.nomb_fase}</b> con todas las tareas y avances en el proceso</span>,
          () => {
            closeModal(setAlert)
            setLoading("Eliminando fase")
            AXIOS_REQUEST(DELETE_PHASE + phase.id_fase, "DELETE")
              .then(r => {
                toast.success("Se eliminó la fase correctamente", { position: "top-right" });
                dispatch(setProcessPhasesWithConditions(Number(id_process), null))
              }).catch(r => toast.error("No se pudo eliminar la fase", { position: "top-right" }))
              .finally(() => setLoading(null))

          },
          setAlert
        ) :
        {
          isOpen: true,
          title: "Espere",
          type: "warning",
          subtitle: <span>No se puede eliminar la fase <b>{phase.nomb_fase}</b> debido a que cuenta con tareas en curso o completadas</span>,
          closeButton: { value: "Ok, cerrar" }
        }
    )
  }

  const showUserResume = () => {
    setModal({
      isOpen: true,
      fullscreen: "lg",
      title: "Resumen de usuarios",
      size: "xl",
      footer: <ModalFooter className='justify-content-between'>
        <Button color='primary2' onClick={() => closeModal(setModal)}>Cerrar</Button>
      </ModalFooter>,
      children: <>
        <p className="mb-5">Este es el listado de los usuarios que se encuentran asociados a tareas y/o acciones, agrupados por fases y tareas</p>
        <UserResume
          list={phasesWithConditions[selectedProcess!.id_conv]}
          goToConditionDetailsScreen={goToConditionDetailsScreen}
        />
      </>
    })
  }

  const editPhase = (data: any, phase: T_PhasesWithConditions) => {
    setLoading("Modificando fase");

    let d = jsonToFormData({
      "[0].nomb_fase": data.nomb_fase,
      "[0].id_fase": phase.id_fase,
      "[0].fech_ini": getNormalDate(data.fecha_inicio).split("/").reverse().join("-"),
      "[0].fech_fin": getNormalDate(data.fecha_fin).split("/").reverse().join("-"),
    });

    AXIOS_REQUEST(SAVE_PHASE, "PUT", d, true).then(r => {
      toast.success("Se ha modificado la fase correctamente", { position: "top-right" });
      closeModal(setModal);
      dispatch(setProcessPhasesWithConditions(Number(id_process), null))
    }).catch(e => {
      toast.error("No se pudo modificar la fase", {
        position: "top-right"
      })
    }).finally(() => setLoading(null))
  }

  useEffect(() => {
    if (!id_process) {
      return navigate("/")
    }
    if (!selectedProcess) {
      dispatch(getProcessList(Number(id_process)))
    } else {
      if (!(phasesWithConditions[id_process])) {
        dispatch(getPhasesWithConditions(Number(id_process)))
      } else {
        if (accordionOpen === "") {
          selectItem(`${lastAccordionOpen || selectedProcess.id_fase}`);
        } else {
          let element = document.getElementById(`${accordionOpen}`)
          !!(element) ? element.scrollIntoView() : selectItem(`${selectedProcess.id_fase}`);;
        }
      }
    }
  }, [selectedProcess, phasesWithConditions]);

  return (
    <>
      <SubHeader
        showBackButton
        text={`${selectedProcess?.nomb_conv || ""}`}
        className="container"
      />

      <Modal backdrop="static" size={modal?.size}
        isOpen={!!(modal?.isOpen)}
        onClosed={() => { setModal(null) }}
        toggle={() => closeModal(setModal)}
        fullscreen={modal?.fullscreen}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
        <ModalBody>{modal?.children}</ModalBody>
        {modal?.footer}
      </Modal>
      <Alert isOpen={!!(alert?.isOpen)}{...alert} onClosed={() => { setAlert(null) }} />
      <Loader isOpen={!!(loading)} subtitle={loading} />
      <Toaster />

      <div className="container pb-5">
        <div className="mb-5">
          {!selectedProcess ? <Loader isOpen loaderAsModal={false} /> :
            <Card className="pt-4 pb-3">
              <div className="d-flex gap-4 flex-wrap flex-lg-nowrap">
                <div className="flex-grow-1 d-flex gap-4 flex-column">
                  {selectedProcess.programa && <div className="flex-grow-1">
                    <b>Programa:</b>
                    <span className="d-block">{selectedProcess.programa}</span>
                  </div>}
                  <div className="d-flex gap-4 flex-wrap">
                    <div>
                      <b>Tipo:</b>
                      <span className="d-block">{selectedProcess.tipo_cond}</span>
                    </div>
                    <div>
                      <b>Sede:</b>
                      <span className="d-block">{selectedProcess.sede}</span>
                    </div>
                  </div>
                  {selectedProcess.coment_conv && <div className="flex-grow-1">
                    <b>Comentarios:</b>
                    <span className="d-block">{selectedProcess.coment_conv}</span>
                  </div>}
                </div>
                <div className="h-100 d-flex flex-column gap-4">
                  <div>
                    <b className="d-block">Progreso general:</b>
                    <span className="d-block mt-1" style={{ width: "320px" }}>
                      <Progress
                        color={selectedProcess.porcentaje < 100 ? "warning" : "success"}
                        value={selectedProcess.porcentaje}
                        className="rounded-1 bg-warning bg-opacity-25"
                      >
                        {selectedProcess.porcentaje}%
                      </Progress>
                    </span>
                  </div>
                  <div>
                    <b className="d-block">Fase actual:</b>
                    <span>{selectedProcess.fase_actual}</span>
                  </div>
                  {/* <div>
                    <b className="d-block">Resumen de usuarios:</b>
                    <span>3 usuarios asociados</span>
                  </div> */}
                </div>
              </div>
              <div className="text-end">
                <span className="btn btn-link small p-0" style={{ marginBottom: "-10px" }} onClick={() => showUserResume()}>
                  <small>Ver resumen de usuarios</small>
                </span>
              </div>
            </Card>
          }
        </div>

        <div>
          {!selectedProcess || !phasesWithConditions[selectedProcess.id_conv] ? <Loader isOpen loaderAsModal={false} />
            : <>
              <SubHeader
                text={`Fases del proceso`}
                className="p-0 align-items-center gap-3"
              >
                {is_admin && <div className='text-end'>
                  <Button onClick={() => modalToCreatePhase()} size='sm' color='primary' className='ms-auto'>
                    <i><Plus /></i>
                    Crear nueva fase
                  </Button>
                </div>}
              </SubHeader>
              {
                !phasesWithConditions[selectedProcess.id_conv].length ?
                  <p className="text-muted">No hay fases y tareas registradas en el proceso</p>
                  :
                  <Accordion open={`${accordionOpen}`} {...{ toggle: selectItem }}>
                    {phasesWithConditions[selectedProcess.id_conv].map((phase) => {
                      let dateDiffInPhase = getDateDiff(new Date(phase.fech_fin));
                      return <AccordionItem
                        key={phase.id_fase}
                        id={`${phase.id_fase}`}
                        className={
                          classnames("d-flex gap-2 flex-column mb-3",
                            styles["process-item"], { [styles["active"]]: accordionOpen === `${phase.id_fase}` })
                        } >
                        <AccordionHeader targetId={`${phase.id_fase}`} className="p-0 d-flex mb-2 flex-wrap" tag={Card}>
                          <div className="d-flex gap-2 flex-grow-1 align-content-center">
                            <div>
                              <div className="rounded-circle">
                                <CircleProgress
                                  progress={phase.porcentaje || 0}
                                  stroke={4}
                                  radius={32}
                                  color="#06a099"
                                  content={
                                    !!(phase.porcentaje) ?
                                      <b>{phase.porcentaje || 0}%</b>
                                      :
                                      <div className="text-muted"><PauseFill /></div>
                                  }
                                />
                              </div>
                            </div>
                            <div className="d-flex justify-content-center flex-column">
                              <span className="d-block mb-1 fw-semibold">{phase.nomb_fase}</span>
                              <small className="text-dark text-opacity-50">
                                Desde {getNormalDate(phase.fech_ini, { dateStyle: "long" })} hasta {getNormalDate(phase.fech_fin, { dateStyle: "long" })}
                              </small>
                            </div>
                          </div>
                          {phase.porcentaje < 100 && <div>
                            {dateDiffInPhase < 0 && <Badge color="secondary" className="bg-opacity-25 opacity-75 text-danger me-2">
                              Venció hace {dateDiffInPhase * -1} días
                            </Badge>}
                          </div>}
                        </AccordionHeader>
                        <AccordionBody accordionId={`${phase.id_fase}`} tag={Card}>
                          <ListGroup flush tag="div">
                            {!!(phase.condiciones?.length) ? phase.condiciones?.map((item) =>
                              <ListGroupItem
                                key={item.id_cond}
                                tag="div"
                                className="d-flex gap-3"
                              >
                                <div
                                  className="pt-3 pb-3 hover-scale-up bg-transparent px-0 px-xl-3 flex-grow-1"
                                  onClick={() => goToConditionDetailsScreen(item)}
                                >
                                  <div className="float-end ps-md-4">
                                    <CircleProgress
                                      progress={item.porcentaje || 0}
                                      stroke={5}
                                      radius={34}
                                      color={item.porcentaje >= 100 ? "#31ac69" : undefined}
                                      content={`${item.porcentaje || 0}%`}
                                    />
                                  </div>

                                  <div className="float-md-end d-flex flex-md-column gap-2 mb-3 mb-md-0 flex-wrap">
                                    <div className="text-end">
                                      <div className="px-3 rounded-pill badge opacity-75"
                                        style={{ backgroundColor: `${item.color}` }}>
                                        {item.estado}
                                      </div>
                                    </div>
                                    {Number(item.num_obs) > 0 && <div className="text-end">
                                      <Badge
                                        pill
                                        color="light"
                                        className="px-3 text-muted"
                                      >
                                        {item.num_obs} Observaciones
                                      </Badge>
                                    </div>}
                                  </div>

                                  <div className="d-flex gap-3">
                                    <div className="flex-grow-1">
                                      <p className="mb-1">{item.nomb_cond}</p>
                                    </div>
                                  </div>

                                  <p className="card-text mt-2 mt-md-2 d-inline-block">
                                    <small className="text-muted">
                                      - Última actualización el {new Date(item.marc_update).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}
                                    </small>
                                  </p>
                                </div>
                              </ListGroupItem>
                            ) : <ListGroupItem
                              tag="div"
                              className="pt-4 pb-4 bg-transparent px-0 px-xl-3"
                            >
                              <span className="text-warning align-text-bottom me-2">
                                <ExclamationCircleFill /> </span>
                              <span className="text-muted">
                                No hay tareas registradas para mostrar
                              </span>
                            </ListGroupItem>}

                            <ListGroupItem
                              tag="div"
                              className="pt-5 pb-2 bg-transparent px-0 px-xl-3 d-flex gap-2 justify-content-end"
                            >
                              {is_admin ? <>
                                <Button
                                  size='sm'
                                  color='primary'
                                  onClick={() => modalToCreateTask(phase)}
                                >
                                  <i><Plus /></i>
                                  Crear nueva tarea
                                </Button>

                                <CustomDropdown options={[
                                  { text: "Mostrar todos los anexos", icon: <Clip size={16} />, click: () => showAllAttachment(phase) },
                                  { text: "Modificar fase", icon: <Edit size={16} />, click: () => modalToEditPhase(phase) },
                                  { text: "Eliminar fase", icon: <XCircle size={16} />, click: () => deletePhase(phase) },
                                ]}>
                                  <DropdownToggle size="sm" color='primary'>
                                    <ThreeDotsVertical />
                                  </DropdownToggle>
                                </CustomDropdown>
                              </>
                                :
                                <Button
                                  size='sm'
                                  color='primary'
                                  onClick={() => showAllAttachment(phase)}
                                >
                                  <i><Clip /></i>
                                  Mostrar todos los anexos
                                </Button>
                              }
                            </ListGroupItem>
                          </ListGroup>
                        </AccordionBody>
                      </AccordionItem>
                    })
                    }
                  </Accordion>
              }
            </>
          }
        </div>
      </div>
    </>
  );
};

export default Conditions;
