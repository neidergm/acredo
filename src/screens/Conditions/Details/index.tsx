import { useEffect, useState, lazy, Suspense, useLayoutEffect } from 'react'
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Anex, History, CheckCircleFill, ExclamationCircleFill, BellFill } from "../../../components/Icons";

import {
  TabContent, TabPane, Nav,
  NavItem, NavLink, Accordion, AccordionItem, AccordionHeader, AccordionBody, Button,
} from 'reactstrap';

import { I_Condition, T_Stages } from "../../../interfaces/conditions.interface";
import classnames from 'classnames';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader } from "../../../components/Modal";
import { SubHeader } from "../../../components/SubHeader";
import { CONDITION_DETAILS, PUT_STAGE, STAGES } from "../../../services/endPointsService";
import { AXIOS_REQUEST } from "../../../services/axiosService";
import { I_Process } from "../../../interfaces/process.interface";
import Loader from '../../../components/Loader'
import lazyLoaderComponents from "../../../services/lazyLoadingService";
import './style.css'
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setConditionDetails, setConditions } from '../../../store/actions/conditionsActions';
import Stages from '../../../components/Stages';
import CircleProgress from '../../../components/CircleProgress';
import { getDateDiff, getNormalDate } from '../../../utils/dateUtils';
import Alert, { I_AlertObject } from '../../../components/Alert';
import { I_JSONObject } from '../../../interfaces/generic.interface';
import { jsonToFormData } from '../../../utils/formUtils';

const Answer = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Answer" */ './Answer')));
const Attachments = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Attachments" */ './Attachments')));
const Historic = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Historic" */ './Historic')));

const menuItems = [
  {
    text: "Texto de condición",
    icon: <CheckCircleFill size={17} />,
    notificationsNumberKey: "obs_cond"
  },
  {
    text: "Anexos",
    icon: <Anex />,
    notificationsNumberKey: "obs_anex"
  },
  {
    text: "Historico",
    icon: <History />
  }
]

let loadedTabs: number[] = [0];
let currentStage = 0;

const ConditionsDetails = () => {

  const conditionSelected: I_Condition = useLocation().state?.condition;
  const processSelected: I_Process = useLocation().state?.process;
  const { id_cond } = useParams();
  const navigate = useNavigate();

  const [currentActiveTab, setCurrentActiveTab] = useState(loadedTabs[0]);
  const [activeAccordion, setActiveAccordion] = useState("");
  const [stages, setStages] = useState<T_Stages | null>(null);
  const [_alert, setAlert] = useState<null | I_AlertObject>(null);
  const [loader, setLoader] = useState<null | string>(null);

  const conditionDetails = useAppSelector(state => state.conditions.details);
  const dispatch = useAppDispatch();

  const currentDetails = id_cond ? conditionDetails[id_cond] : null;

  const [modalData, setModalData] = useState<any>(null);

  const toggleTab = (tab: number) => {
    // if (!loadedTabs.includes(tab)) loadedTabs.push(tab)
    loadedTabs = [...new Set(loadedTabs) as any, tab];
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  }

  const toggleAccordion = (id: string) => {
    activeAccordion === id ? setActiveAccordion("") : setActiveAccordion(id)
  }

  const getConditionsStages = () => {
    return AXIOS_REQUEST(STAGES + id_cond).then(resp => {
      currentStage = (resp.data as T_Stages).findIndex(i => i.est_etapa === 1 || i.est_etapa === 0);
      setStages(resp.data);
      return true;
    })
  }

  const markStageAsCompleted = () => {
    setLoader("Espere");

    AXIOS_REQUEST(PUT_STAGE, "PUT", jsonToFormData({
      id_cond, id_nodo: stages![currentStage].id_nodo, est_etapa: 2
    })).then(() => {
      setLoader(null);
      setStages(null);
      dispatch(setConditionDetails(id_cond!, null));
      dispatch(setConditions(`${processSelected!.id_conv}`, null));
    }).catch(() => {
      setLoader(null);
      setAlert({
        type: "error",
        title: "Ops...",
        subtitle: "No se pudo marcar la etapa como finalizada, por favor intente nuevamente",
        isOpen: true,
        closeButton: { value: "Ok" }
      })
    })
  }

  const completeStage = () => {
    setAlert({
      isOpen: true,
      title: "¿Está seguro?",
      subtitle: "Esta acción es irrevertible, la etapa quedará marcada como finalizada",
      type: "question",
      submitButton: {
        value: "Sí, finalizar",
        onClick: () => {
          setTimeout(() => {
            markStageAsCompleted();
          }, 100)
        }
      },
      closeButton: { value: "No, cancelar" }
    })
  }

  useEffect(() => {
    if (!conditionSelected || !processSelected) { navigate("/", { replace: true }) }
    if (!id_cond) return;

    getConditionsStages().then(() => {
      if (!(currentDetails)) {
        AXIOS_REQUEST(CONDITION_DETAILS + id_cond)
          .then(res => {
            let data = res.data.map((i: I_JSONObject) => ({
              label: i.json_campo.label, value: i.respuesta, obs_cond: i.obs_cond, obs_anex: i.obs_anex
            }));
            dispatch(setConditionDetails(id_cond, data));
          })
          .catch(err => { })
      }
    });
  }, [conditionDetails]);

  if (!conditionSelected || !processSelected) {
    return null
  }

  return (
    <>
      <Modal isOpen={!!(modalData?.isOpen)} onClosed={() => { setModalData(null) }} toggle={() => closeModal(setModalData)}>
        <ModalHeader textCenter toggle={() => closeModal(setModalData)}>{modalData?.title}</ModalHeader>
        <ModalBody>{modalData?.children}</ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={() => closeModal(setModalData)} type="button">Cerrar</Button> */}
        </ModalFooter>
      </Modal>

      <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} />
      <Loader isOpen={!!(loader)} subtitle={loader} />
      <SubHeader text={conditionSelected.nomb_cond} showBackButton={true} />

      <div className="container pt-3 pb-5">

        <div className="row">
          <div className='col-xl-8'>
            <p>
              <b>Proceso:</b>
              <span className="d-block">{processSelected.nomb_conv}</span>
            </p>
            {!!processSelected.programa && <p>
              <b>Programa:</b>
              <span className="d-block">{processSelected.programa}</span>
            </p>}
            {!!currentDetails && <>
              <p>
                <b>Sede:</b>
                <span className="d-block">{conditionSelected.sede.toUpperCase()}</span>
              </p>
              <p>
                <b>Estado:</b>
                <span className="d-block">PENDIENTE</span>
              </p>
            </>}
          </div>
          <div className='col'>
            {!(stages) ? <Loader isOpen loaderAsModal={false} />
              :
              (!(stages.length) ?
                <p>
                  <b>Etapas:</b>
                  <span className="d-block"><i className='text-warning'><ExclamationCircleFill /></i> No hay etapas registradas</span>
                </p>
                :
                <div className='row flex-row-reverse'>
                  <div className='col-12 col-md-6 col-xl-12'>
                    <div className='mb-3'>
                      <p className='mb-2'><b>Etapas:</b></p>
                      <Stages
                        items={stages}
                        current={currentStage}
                      />
                    </div>
                  </div>
                  <div className='col'>
                    <div className='mb-3'>
                      <p className='mb-2'><b>Etapa actual:</b></p>
                      <div className='d-flex'>
                        <div className='pe-3'>
                          <CircleProgress
                            progress={conditionSelected.etapa_por || 0}
                            color={getDateDiff(new Date(), new Date(stages[currentStage].fech_etapa)) ? "#dc3545" : '#198754'}
                            stroke={4}
                            radius={30}
                            content={<b>{currentStage + 1}</b>}
                          />
                        </div>
                        <div className='flex-grow-1'>
                          <p className="mb-1">{stages[currentStage].nomb_nodo}</p>
                          <p className="mb-1">
                            Límite: {getNormalDate(stages[currentStage].fech_etapa, { dateStyle: "long" })}
                            {
                              getDateDiff(new Date(), new Date(stages[currentStage].fech_etapa)) < 0 &&
                              <b className='d-block text-danger'>Fecha límite vencida</b>
                            }
                          </p>
                        </div>
                      </div>
                      {conditionSelected.rol.split(",").includes(stages[currentStage].resp_etapa) && <div>
                        <Button color='primary' size="sm"
                          className='mt-2 float-xl-start w-100'
                          onClick={() => completeStage()}
                        >
                          Marcar etapa como finalizada
                        </Button>
                      </div>}
                    </div>
                  </div>
                </div>)
            }
          </div>
        </div>

        {!currentDetails || !stages ? <Loader isOpen loaderAsModal={false} />
          :
          !currentDetails.length ?
            <p>| No hay nada para mostrar</p>
            :
            <div className="">
              <div className="pb-3">
                <b>Detalles:</b>
                <Accordion className="mt-2" open={activeAccordion} {...{ toggle: toggleAccordion }}>
                  {
                    currentDetails.map((c: any, i: number) =>
                      <AccordionItem className="accordion-item" key={`ac-${i}`}>
                        <AccordionHeader targetId={`${i}`}><b className="me-1">-</b> <small>{c.label}</small></AccordionHeader>
                        <AccordionBody accordionId={`${i}`}>
                          <div className="mb-3" dangerouslySetInnerHTML={{ __html: c.value }}></div>
                        </AccordionBody>
                      </AccordionItem>
                    )
                  }
                </Accordion>
              </div>
              <Nav tabs className="group-subtitle p-1 mt-4 mb-2 border-0 justify-content-md-start d-md-flex d-block align-items-center">
                {
                  menuItems.map((item, i) => <NavItem key={`mi-${i}`}>
                    <NavLink onClick={() => { toggleTab(i); }}
                      className={"sub-item text-muted px-4 d-flex align-items-center " + classnames({
                        "active fw-bold px-md-5": currentActiveTab === i
                      })}
                    >
                      {item.icon} {item.text}
                      <span className='position-relative ps-2'>
                        {!!(item.notificationsNumberKey) && !!((currentDetails[0] as any)?.[item.notificationsNumberKey]) &&
                          <span className="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger">
                            {(currentDetails[0] as any)?.[item.notificationsNumberKey]}
                          </span>}
                      </span>
                    </NavLink>
                  </NavItem>
                  )
                }
              </Nav>
              <Suspense fallback={<div className='mt-5'><Loader isOpen loaderAsModal={false} /></div>}>
                <TabContent activeTab={currentActiveTab} className="tab-content-item pt-4">
                  <TabPane tabId={0}>
                    <Answer
                      idForm={conditionSelected.form_respuesta}
                      idCondition={conditionSelected.id_cond}
                      canEdit={
                        conditionSelected.rol.split(",").includes(stages[currentStage]?.resp_etapa || null)}
                    />
                  </TabPane>
                  <TabPane tabId={1}>
                    {loadedTabs.includes(1) && <Suspense fallback={<Loader loaderAsModal={false} isOpen />}>
                      <Attachments
                        idForm={conditionSelected.form_anexo}
                        idCondition={conditionSelected.id_cond}
                        canEdit={conditionSelected.rol.split(",").includes(stages[currentStage]?.resp_etapa || null)}
                      />
                    </Suspense>}
                  </TabPane>
                  <TabPane tabId={2}>
                    {loadedTabs[loadedTabs.length - 1] === 2 && <Suspense fallback={<Loader loaderAsModal={false} isOpen />}>
                      <Historic id_condition={conditionSelected.id_cond} />
                    </Suspense>}
                  </TabPane>
                </TabContent>
              </Suspense>

            </div>
        }
      </div>
    </>
  );
};

export default ConditionsDetails;
