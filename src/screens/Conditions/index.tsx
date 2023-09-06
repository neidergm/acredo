import { useEffect, useState } from "react";
import { SubHeader } from "../../components/SubHeader";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { I_Condition } from "../../interfaces/conditions.interface";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge, Button, DropdownToggle, ListGroup, ListGroupItem, Progress } from "reactstrap";
import Loader from "../../components/Loader";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectCondition, getPhasesWithConditions, setProcessPhasesWithConditions } from "../../store/actions/conditionsActions";
import CircleProgress from "../../components/CircleProgress";
import { getProcessList } from "../../store/actions/processActions";
import Card from "../../components/Card";
import classnames from 'classnames';
import { getDateDiff, getNormalDate } from "../../utils/dateUtils";
import { Clip, Edit, ExclamationCircleFill, LinkIcon, PauseFill, Plus, Printer, ThreeDotsVertical, XCircle } from "../../components/Icons";
import styles from './../Process.module.css';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON } from "../../components/Modal";
import AllAttachments from "../../components/AttachmentsTable/AllAttachments";
import { isAdmin, isSupervisor } from "../../utils/userRolUtils";
import Form from "react-ngm-form";
import { taskForm } from "../../forms/task.form";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { jsonToFormData } from "../../utils/formUtils";
import { DELETE_PHASE, SAVE_PHASE, SAVE_TASK } from "../../services/endPointsService";
import toast from 'react-hot-toast';
import { T_PhasesWithConditions } from "../../interfaces/phasesAndStages.interface";
import CustomDropdown from "../../components/CustomDropdown";
import Alert, { I_AlertObject } from "../../components/Alert";
import confirmDeleteAlertObject from "../../utils/confirmDeleteAlertObject";
import UserResume from "../../components/UserResume";
import phaseForm from "../../forms/phase.form";

let lastAccordionOpen = [""];

const Conditions = () => {
  const location = useLocation()
  const { id_process } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const userRol = useAppSelector(state => state.user.userInfo?.rol)

  const selectedProcess = useAppSelector(state => state.process.selected);
  const is_supervisor = isSupervisor(userRol);
  const is_admin = isAdmin(userRol);
  const phasesWithConditions = useAppSelector(state => state.conditions.phasesWithConditions);
  const [accordionOpen, setAccordionOpen] = useState<string[]>(lastAccordionOpen);
  const [modal, setModal] = useState<null | T_ModalJSON>(null);
  const [loading, setLoading] = useState<null | string>(null);
  const [alert, setAlert] = useState<I_AlertObject | null>(null);

  const goToConditionDetailsScreen = (condition: I_Condition) => {
    dispatch(selectCondition(condition));
    navigate(`${location.pathname}/${condition.id_cond}`);
  }

  const selectItem = (item: string) => {
    setAccordionOpen(i => {
      lastAccordionOpen = [i[0] === `${item}` ? "" : item];
      return lastAccordionOpen;
    })
  };

  const showAllAttachment = (phase: T_PhasesWithConditions) => {
    setModal({
      isOpen: true,
      size: "xl",
      title: "Anexos por fase",
      fullscreen: "lg",
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
    const formID = "FORM-CREATE-PHASE";
    const fields = structuredClone(phaseForm);
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
    const formID = "FORM-CREATE-TASK";
    const fields = taskForm(undefined, selectedProcess?.id_tcond);
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

    const d = jsonToFormData({
      "[0].nomb_fase": data.nomb_fase,
      "[0].id_conv": id_process,
      "[0].fech_ini": data.fecha_inicio,
      "[0].fech_fin": data.fecha_fin
    });

    AXIOS_REQUEST(SAVE_PHASE, "POST", d).then(r => {
      toast.success("Se ha creado la fase correctamente", { position: "top-right" });
      closeModal(setModal);
      dispatch(setProcessPhasesWithConditions(Number(id_process), null))
    }).catch(e => {
      toast.error("No se pudo crear la fase", { position: "top-right" });
    }).finally(() => setLoading(null))
  }

  const createTask = ({ responsable, ...data }: any, phase: T_PhasesWithConditions) => {
    setLoading("Creando nueva tarea");
    const d = jsonToFormData({
      ...data,
      id_conv: id_process,
      id_fase: phase.id_fase
    })

    !!(responsable?.length) && responsable.forEach((r: { user: string, role: string }, i: number) => {
      d.append(`responsable[${i}].id_rc`, r.user);
      d.append(`responsable[${i}].rol_cond`, r.role);
    })

    AXIOS_REQUEST(SAVE_TASK, "POST", d).then(r => {
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

    const d = jsonToFormData({
      "[0].nomb_fase": data.nomb_fase,
      "[0].id_fase": phase.id_fase,
      "[0].fech_ini": data.fecha_inicio,
      "[0].fech_fin": data.fecha_fin
    });

    AXIOS_REQUEST(SAVE_PHASE, "PUT", d).then(r => {
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
        if (accordionOpen[0] === "") {
          selectItem(`${lastAccordionOpen || selectedProcess.id_fase}`);
        } else {
          // const element = document.getElementById(`${accordionOpen}`)
          // !(element) ? selectItem(`${selectedProcess.id_fase}`) : element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProcess, phasesWithConditions]);

  const printReport = () => {
    window.print()
  }

  useEffect(() => {
    const beforeprint = () => {
      const p = !!(selectedProcess) && phasesWithConditions[selectedProcess.id_conv]
      if (p) setAccordionOpen(() => p.map(i => `${i.id_fase}`))
    }

    const afterprint = () => setAccordionOpen(lastAccordionOpen)

    window.addEventListener("beforeprint", beforeprint)
    window.addEventListener("afterprint", afterprint)
    return () => {
      window.removeEventListener("beforeprint", beforeprint)
      window.removeEventListener("afterprint", afterprint)
    }
  }, [phasesWithConditions])

  return (
    <>
      <SubHeader
        showBackButton
        text={`${selectedProcess?.nomb_conv || ""}`}
        className="container-xxl"
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

      <div className="container-xxl">
        <div className="mb-5">
          {!selectedProcess ? <Loader isOpen loaderAsModal={false} /> :
            <Card className="px-xl-4">
              <div className="d-flex gap-4 flex-wrap flex-lg-nowrap">
                <div className="flex-grow-1 d-flex gap-3 flex-column">
                  {selectedProcess.programa && <div className="flex-grow-1">
                    <b>Programa: </b>
                    <span className="d-block">
                      <Link className="link-dark" to={`/programa/${selectedProcess.id_prog}`}>{selectedProcess.programa}
                        <i className="link-primary ms-1"><LinkIcon /></i>
                      </Link>
                    </span>
                  </div>}
                  <div className="d-flex gap-3 flex-wrap">
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

                  <div className="mt-auto">
                    {(is_admin || is_supervisor) && <>
                      <Button size="sm" color="primary2" onClick={() => showUserResume()}>
                        Ver resumen de usuarios
                      </Button>
                      <Button size="sm" color="primary2" className="ms-2" onClick={() => printReport()}>
                        <Printer size={16} />
                      </Button>
                    </>
                    }
                  </div>
                </div>
                <div className="h-100 d-flex flex-column gap-4">
                  <div>
                    <b className="d-block">Progreso general:</b>
                    <span className="d-block mt-1" style={{ minWidth: "320px" }}>
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
                  <Accordion open={accordionOpen} {...{ toggle: selectItem }} >
                    {phasesWithConditions[selectedProcess.id_conv].map((phase) => {
                      const dateDiffInPhase = getDateDiff(new Date(phase.fech_fin));
                      return <AccordionItem
                        key={phase.id_fase}
                        className={
                          classnames("d-flex gap-2 flex-column mb-3",
                            styles["process-item"], { [styles["active"]]: accordionOpen.includes(`${phase.id_fase}`) })
                        } >
                        <AccordionHeader id={`${phase.id_fase}`} targetId={`${phase.id_fase}`} className=" d-flex mb-2 flex-wrap" tag={Card}>
                          <div className="d-flex gap-2 flex-grow-1 align-content-center">
                            <div>
                              <div className="rounded-circle">
                                <CircleProgress
                                  progress={phase.porcentaje || 0}
                                  stroke={4}
                                  radius={32}
                                  color="#06a099"
                                  content={
                                    !(phase.porcentaje) ?
                                      <div className="text-muted"><PauseFill /></div>
                                      :
                                      <b>{phase.porcentaje || 0}%</b>
                                  }
                                />
                              </div>
                            </div>
                            <div className="d-flex justify-content-center flex-column">
                              <span className="d-block mb-1 fw-semibold">{phase.nomb_fase}</span>
                              <small className="text-dark text-opacity-50">
                                <span className="d-none d-md-inline-block">Desde </span>
                                {getNormalDate(phase.fech_ini, { dateStyle: "long" })}
                                <span className="d-none d-md-inline-block px-1">hasta </span>
                                <span className="d-inline-block d-md-none px-1">a</span>
                                {getNormalDate(phase.fech_fin, { dateStyle: "long" })}
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
                            <ListGroupItem
                              tag="div"
                              className="pb-5 pb-2 bg-transparent px-0 px-xl-3 d-flex gap-2 justify-content-between border-0"
                            >
                              <div className="opacity-50 border-bottom border-2">
                                Tareas <span className="d-none d-sm-inline-block">en esta fase</span>: <b>{phase.condiciones?.length}</b>
                              </div>
                              <div className="d-flex gap-2">
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
                                    { text: "Ver todos los anexos de la fase", icon: <Clip size={16} />, click: () => showAllAttachment(phase) },
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
                                    Ver todos los anexos de la fase
                                  </Button>
                                }
                              </div>

                            </ListGroupItem>
                            {!(phase.condiciones?.length) ?
                              <ListGroupItem
                                tag="div"
                                className="pt-4 pb-4 bg-transparent px-0 px-xl-3"
                              >
                                <span className="text-warning align-text-bottom me-2">
                                  <ExclamationCircleFill /> </span>
                                <span className="text-muted">
                                  No hay tareas registradas para mostrar
                                </span>
                              </ListGroupItem>
                              :
                              phase.condiciones?.map((item) =>
                                <ListGroupItem
                                  key={item.id_cond}
                                  tag="div"
                                  className="d-flex gap-3 px-0 px-xl-1"
                                >
                                  <div
                                    className="pt-2 pb-0 hover-scale-up bg-transparent px-0 px-xl-3 flex-grow-1"
                                    onClick={() => goToConditionDetailsScreen(item)}
                                  >
                                    <div className="float-end ps-2 d-inline-flex flex-column align-items-center">
                                      <div className="d-none d-md-block">
                                        <div className="px-3 rounded-pill badge opacity-50"
                                          style={{ backgroundColor: `${item.color}` }}>
                                          {item.estado}
                                        </div>
                                      </div>
                                      <div className="ps-2">
                                        <CircleProgress
                                          progress={item.porcentaje || 0}
                                          stroke={5}
                                          radius={34}
                                          color={item.porcentaje >= 100 ? "#31ac69" : undefined}
                                          content={`${item.porcentaje || 0}%`}
                                        />
                                      </div>
                                    </div>

                                    <div className="float-md-end d-flex flex-md-column gap-2 mb-3 mb-md-0 flex-wrap">
                                      <div className="d-block d-md-none">
                                        <div className="px-3 rounded-pill badge opacity-50"
                                          style={{ backgroundColor: `${item.color}` }}>
                                          {item.estado}
                                        </div>
                                      </div>

                                      {Number(item.num_obs) > 0 && <div className="text-end">
                                        <Badge
                                          pill
                                          color="dark"
                                          className="px-3 bg-opacity-10 text-muted"
                                        >
                                          {item.num_obs} Observaciones
                                        </Badge>
                                      </div>}
                                    </div>
                                    <div>
                                      <p className="pb-1">{item.nomb_cond}</p>
                                    </div>
                                    <div className="d-flex gap-3">
                                      {/* <p className="card-text d-none small d-xl-inline-block">
                                          <small className="text-muted opacity-50" style={{ marginTop: "-50px" }}>
                                            Última actualización el {new Date(item.marc_update).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}
                                          </small>
                                        </p> */}
                                      {item.etapa_actual ?
                                        <div className="d-flex gap-3 gap-lg-4 text-dark opacity-50">
                                          <p className="mb-1 d-none d-sm-block">
                                            <small className="d-block text-secondary fw-semibold lh-1">Etapa actual:</small>
                                            <small>{item.etapa_actual.nomb_etapa}</small>
                                          </p>
                                          <p className="mb-1">
                                            <small className="d-block text-secondary fw-semibold lh-1">Acción actual:</small>
                                            <small>{item.etapa_actual.nomb_accion}</small>
                                          </p>
                                          <p className="mb-1">
                                            <small className="d-block text-secondary fw-semibold lh-1">Responsable de acción:</small>
                                            <small>{item.etapa_actual.responsables}</small>
                                          </p>
                                        </div>
                                        :
                                        <div>
                                          {
                                            item.porcentaje < 100 ? (item.porcentaje > 0 ?
                                              <p className="mb-1 text-warning">
                                                <small className="d-block lh-1 fw-semibold"><ExclamationCircleFill size={16} /> Todas las etapas y acciones se encuentran completadas</small>
                                                <small className="ps-3 ms-1">Esta tarea debe ser marcada como finalizada</small>
                                              </p>
                                              :
                                              <p className="mb-1 text-danger">
                                                <small className="d-block lh-1 fw-semibold"><ExclamationCircleFill size={16} /> La tarea se encuentra incompleta</small>
                                                <small className="ps-3 ms-1">No cuenta con etapas y acciones registradas</small>
                                              </p>
                                            )
                                              :
                                              <p className="mb-1 opacity-50">
                                                <small className="d-block text-secondary fw-semibold lh-1">Fecha de finalización:</small>
                                                <small>{new Date(item.marc_update).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}</small>
                                              </p>
                                          }
                                        </div>
                                      }
                                    </div>
                                  </div>
                                </ListGroupItem>
                              )
                            }
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
