import { useEffect, useState } from "react";
import { SubHeader } from "../../components/SubHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { I_Condition } from "../../interfaces/conditions.interface";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge, Button, ListGroup, ListGroupItem, Progress } from "reactstrap";
import Loader from "../../components/Loader";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { selectCondition, getPhasesWithConditions } from "../../store/actions/conditionsActions";
import CircleProgress from "../../components/CircleProgress";
import { getProcessList } from "../../store/actions/processActions";
import Card from "../../components/Card";
import classnames from 'classnames';
import { getNormalDate } from "../../utils/dateUtils";
import { ExclamationCircleFill, ThreeDotsVertical } from "../../components/Icons";
import styles from './../Process.module.css';
import { closeModal, Modal, ModalBody, ModalHeader, T_ModalJSON } from "../../components/Modal";
import AllAttachments from "../../components/AttachmentsTable/AllAttachments";
import { isAdmin } from "../../utils/userRolUtils";

const Conditions = () => {
  const location = useLocation()
  const { id_process } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedProcess = useAppSelector(state => state.process.selected);
  const is_admin = isAdmin(useAppSelector(state => state.user.userInfo?.rol));
  const phasesWithConditions = useAppSelector(state => state.conditions.phasesWithConditions);
  const [accordionOpen, setAccordionOpen] = useState(``);
  const [modal, setModal] = useState<null | T_ModalJSON>(null);

  const goToConditionDetailsScreen = (condition: I_Condition) => {
    dispatch(selectCondition(condition));
    navigate(`${location.pathname}/${condition.id_cond}`);
  }

  const selectItem = (item: string) => setAccordionOpen(i => i === item ? "" : item);

  const showAllAttachment = () => {
    setModal({
      isOpen: true,
      size: "xl",
      title: "Anexos del proceso",
      children: <>
        <AllAttachments />
      </>,
    })
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
      }
      selectItem(`${selectedProcess.id_fase}`)
    }
  }, [selectedProcess])

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
      >
        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
        <ModalBody>{modal?.children}</ModalBody>
        {modal?.footer}
      </Modal>

      <div className="container pb-5">
        <div className="mb-5">
          {!selectedProcess ? <Loader isOpen loaderAsModal={false} /> :
            <Card className="py-4">
              <div className="d-flex gap-4 flex-wrap flex-lg-nowrap">
                <div className="flex-grow-1 d-flex gap-4 flex-column">
                  {selectedProcess.programa && <div className="flex-grow-1">
                    <b>Programa:</b>
                    <span className="d-block">{selectedProcess.programa}</span>
                  </div>}
                  <div>
                    <b>Tipo:</b>
                    <span className="d-block">{selectedProcess.tipo_cond}</span>
                  </div>
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
                </div>
              </div>
            </Card>
          }
        </div>

        <div>
          {!selectedProcess || !phasesWithConditions[selectedProcess.id_conv] ? <Loader isOpen loaderAsModal={false} />
            :
            !phasesWithConditions[selectedProcess.id_conv].length ?
              <p>| No hay condiciones registradas en el proceso</p>
              :
              <>
                <SubHeader
                  text={`Fases del proceso`}
                  className="p-0 align-items-center gap-3"
                >
                  <div className="">
                    <Button outline color="secondary" size="sm" className="rounded-pill" onClick={() => showAllAttachment()}>
                      Mostrar todos los anexos
                    </Button>
                  </div>
                </SubHeader>
                <Accordion open={`${accordionOpen}`} {...{ toggle: selectItem }}>
                  {phasesWithConditions[selectedProcess.id_conv].map((phase) => {
                    return <AccordionItem
                      key={phase.id_fase}
                      className={
                        classnames("d-flex gap-2 flex-column mb-3",
                          styles["process-item"], { [styles["active"]]: accordionOpen === `${phase.id_fase}` })
                      } >
                      <AccordionHeader targetId={`${phase.id_fase}`} className="p-0 d-flex mb-2" tag={Card}>
                        <div>
                          <div className="rounded-circle">
                            <CircleProgress
                              progress={phase.porcentaje || 0}
                              stroke={4}
                              radius={32}
                              color="#31ac6a"
                              content={
                                selectedProcess.id_fase === phase.id_fase ?
                                  <b>{phase.porcentaje || 0}%</b>
                                  :
                                  <ThreeDotsVertical />
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <span className="d-block mb-1 fw-semibold">{phase.nomb_fase}</span>
                          <small className="text-dark text-opacity-50">
                            Desde {getNormalDate(phase.fech_ini, { dateStyle: "long" })} hasta {getNormalDate(phase.fech_fin, { dateStyle: "long" })}
                          </small>
                        </div>
                      </AccordionHeader>
                      <AccordionBody accordionId={`${phase.id_fase}`} tag={Card}>
                        <ListGroup flush tag="div">
                          {!!(phase.condiciones?.length) ? phase.condiciones?.map((item) => (
                            <ListGroupItem
                              onClick={() => goToConditionDetailsScreen(item)}
                              key={item.id_cond}
                              tag="div"
                              className="pt-3 pb-3 hover-scale-up bg-transparent px-0 px-xl-3"
                            >
                              <div className="float-end ps-md-4">
                                <CircleProgress
                                  progress={item.porcentaje || 0}
                                  stroke={4}
                                  radius={32}
                                  color={item.porcentaje >= 100 ? "#0d6efd" : undefined}
                                  content={`${item.porcentaje || 0}%`}
                                />
                              </div>

                              <div className="float-md-end d-flex flex-md-column gap-2 mb-3 mb-md-0 flex-wrap">
                                <div className="text-end">
                                  <Badge
                                    pill
                                    color="info"
                                    className="px-3"
                                  >
                                    {item.estado}
                                  </Badge>
                                </div>
                                {Number(item.num_obs) > 0 && <div className="text-end">
                                  <Badge
                                    pill
                                    color="warning"
                                    className="px-3"
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
                            </ListGroupItem>
                          )) : <div className="py-4">
                            <span className="text-warning me-2">
                              <ExclamationCircleFill /> </span>
                            <span className="text-secondary">
                              No hay nada para mostrar
                            </span>
                          </div>}
                        </ListGroup>
                      </AccordionBody>
                    </AccordionItem>
                  })
                  }
                </Accordion>
              </>
          }
        </div>
        {is_admin && <div className='text-end mt-2'>
          <Button onClick={() => { }} size='sm' color='primary' className='rounded-2 opacity-75 ms-auto'>Crear nueva fase</Button>
        </div>}
      </div>
    </>
  );
};

export default Conditions;
