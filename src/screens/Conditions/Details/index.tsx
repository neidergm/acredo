import { useEffect, useState, lazy, Suspense } from 'react'
import { useParams, useLocation } from "react-router-dom";
import { Anex, History, CheckCircleFill, ExclamationCircleFill } from "../../../components/Icons";

import {
  TabContent, TabPane, Nav,
  NavItem, NavLink, Accordion, AccordionItem, AccordionHeader, AccordionBody,
} from 'reactstrap';

import { I_Condition } from "../../../interfaces/conditions.interface";
import classnames from 'classnames';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader } from "../../../components/Modal";
import { SubHeader } from "../../../components/SubHeader";
import { CONDITION_DETAILS } from "../../../services/endPointsService";
import { AXIOS_REQUEST } from "../../../services/axiosService";
import { I_Process } from "../../../interfaces/process.interface";
import Loader from '../../../components/Loader'
import lazyLoaderComponents from "../../../services/lazyLoadingService";
import './style.css'
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setConditionDetails } from '../../../store/actions/conditionsActions';

const Answer = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Answer" */ './Answer')));
const Attachments = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Attachments" */ './Attachments')));
const Review = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Review" */ './Review')));
const Historic = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Historic" */ './Historic')));

const menuItems = [
  {
    text: "Texto de condición",
    icon: <CheckCircleFill size={17} />
  },
  {
    text: "Anexos",
    icon: <Anex />
  },
  {
    text: "Revisión",
    icon: <ExclamationCircleFill />
  },
  {
    text: "Historico",
    icon: <History />
  }
]

let loadedTabs: number[] = [0];

const ConditionsDetails = () => {

  const conditionSelected: I_Condition = useLocation().state.condition;
  const processSelected: I_Process = useLocation().state.process;
  const { id_cond } = useParams();

  const [currentActiveTab, setCurrentActiveTab] = useState(loadedTabs[0]);
  const [activeAccordion, setActiveAccordion] = useState("");

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

  useEffect(() => {
    if (!id_cond) return;
    if (!(currentDetails)) {
      AXIOS_REQUEST(CONDITION_DETAILS + id_cond)
        .then(res => {
          let data = res.data.map((i: { [x: string]: any }) => ({ label: i.json_campo.label, value: i.respuesta }));
          dispatch(setConditionDetails(id_cond, data));
        })
        .catch(err => { })
    }
  }, []);

  return (
    <>
      <Modal isOpen={!!(modalData?.isOpen)} onClosed={() => { setModalData(null) }} toggle={() => closeModal(setModalData)}>
        <ModalHeader textCenter toggle={() => closeModal(setModalData)}>{modalData?.title}</ModalHeader>
        <ModalBody>{modalData?.children}</ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={() => closeModal(setModalData)} type="button">Cerrar</Button> */}
        </ModalFooter>
      </Modal>

      <SubHeader text={conditionSelected.nomb_cond} showBackButton={true} />

      <div className="container pt-3 pb-5">
        <div className="">
          <p>
            <b>Proceso:</b>
            <span className="d-block">{processSelected.nomb_conv}</span>
          </p>
          {!!processSelected.programa && <p>
            <b>Programa:</b>
            <span className="d-block">{processSelected.programa}</span>
          </p>}
        </div>
        {!currentDetails ? <Loader isOpen loaderAsModal={false} />
          :
          !currentDetails.length ?
            <p>| No hay nada para mostrar</p>
            :
            <div className="">
              <p>
                <b>Campus:</b>
                <span className="d-block">{conditionSelected.sede.toUpperCase()}</span>
              </p>
              <p>
                <b>Estado:</b>
                <span className="d-block">PENDIENTE</span>
              </p>
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
                    </NavLink>
                  </NavItem>
                  )
                }
              </Nav>

              <TabContent activeTab={currentActiveTab} className="tab-content-item pt-4">
                <TabPane tabId={0}>
                  <Answer
                    idForm={conditionSelected.form_respuesta}
                    idCondition={conditionSelected.id_cond}
                    canEdit={conditionSelected.rol.split(",").includes("A")}
                  />
                </TabPane>
                <TabPane tabId={1}>
                  {loadedTabs.includes(1) && <Suspense fallback={<Loader loaderAsModal={false} isOpen />}>
                    <Attachments
                      idForm={conditionSelected.form_anexo}
                      idCondition={conditionSelected.id_cond}
                      canEdit={conditionSelected.rol.split(",").includes("A")}
                    />
                  </Suspense>}
                </TabPane>
                <TabPane tabId={2}>
                  <div className='row'>
                    <div className='d-none d-md-block col-md-6'>
                      {loadedTabs[loadedTabs.length - 1] === 2 &&
                        <Suspense fallback={<Loader loaderAsModal={false} isOpen />}>
                          <div className='mb-2 border-start border-4 border-warning ps-2'><b>Texto de condición</b></div>
                          <Answer
                            idForm={conditionSelected.form_respuesta}
                            showActionButton={false}
                          />
                        </Suspense>
                      }
                    </div>
                    <div className='col-md-6 col-12'>
                      {loadedTabs.includes(2) && <Suspense fallback={<Loader loaderAsModal={false} isOpen />}>
                        <Review
                          idForm={conditionSelected.form_obse}
                          idCondition={conditionSelected.id_cond}
                          canEdit={conditionSelected.rol.split(",").includes("B")}
                        />
                      </Suspense>}
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId={3}>
                  {loadedTabs[loadedTabs.length - 1] === 3 && <Suspense fallback={<Loader loaderAsModal={false} isOpen />}>
                    <Historic id_condition={conditionSelected.id_cond} />
                  </Suspense>}
                </TabPane>
              </TabContent>
            </div>
        }
      </div>
    </>
  );
};

export default ConditionsDetails;
