import { useEffect, useState, lazy, Suspense } from 'react'
import { useParams, useLocation } from "react-router-dom";
import { Warning, Check, Anex, History } from "../../components/Icons";

import {
  TabContent, TabPane, Nav,
  NavItem, NavLink, Accordion, AccordionItem, AccordionHeader, AccordionBody,
} from 'reactstrap';
import { I_Condition } from "../../interfaces/conditions.interface";

import classnames from 'classnames';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader } from "../../components/Modal";
import { SubHeader } from "../../components/SubHeader";
import { CONDITION_DETAILS } from "../../services/endPointsService";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { I_Convocatory } from "../../interfaces/convocatory.interface";
import Loader from '../../components/Loader'
import lazyLoaderComponents from "../../services/lazyLoadingService";
import './details.css'

const Answer = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Answer" */ './Answer')));
const Attachments = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Attachments" */ './Attachments')));
const Review = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Review" */ './Review')));
const Historic = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Historic" */ './Historic')));

const menuItems = [
  {
    text: "Texto de condición",
    icon: <Check size={17} />
  },
  {
    text: "Anexos",
    icon: <Anex />
  },
  {
    text: "Revisión",
    icon: <Warning />
  },
  {
    text: "Historico",
    icon: <History />
  }
]

let DATA: { [id_conv: string]: Array<I_Condition> } = {};
let loadedTabs: number[] = [0];

const ConditionsDetails = () => {

  const conditionSelected: I_Condition = useLocation().state.condition;
  const convocatorySelected: I_Convocatory = useLocation().state.convocatory;
  const { id_cond } = useParams();

  const [currentActiveTab, setCurrentActiveTab] = useState(loadedTabs[0]);
  const [activeAccordion, setActiveAccordion] = useState("");
  const [conditionDetails, setConditionDetails] = useState<any>(null);

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
debugger
    if (!!(DATA[id_cond])) {
      setConditionDetails(DATA[id_cond]);
    } else {
      AXIOS_REQUEST(CONDITION_DETAILS + id_cond)
        .then(res => {
          let data = res.data.map((i: { [x: string]: any }) => ({ label: i.json_campo.label, value: i.respuesta }));
          setConditionDetails(data);
          DATA[id_cond] = data;
        })
        .catch(err => { })
    }
  }, []);

  // const alertOpenOne = () => {
  //   setalertopen({
  //     isOpen: true,
  //     type: "question",
  //     title: "¿Estás seguro?",
  //     subtitle: "se perderán los cambios que has realizado",
  //     onClosed: () => { setalertopen({ isOpen: false }) },
  //     closeButton: { value: " Cancelar", color: 'danger' },
  //     submitButton: {
  //       value: 'Descartar cambios',
  //       onClick: () => setTextarea1(!textarea1)
  //     }
  //   })
  // }

  return (
    <div className="container-details">

      <Modal isOpen={!!(modalData?.isOpen)} onClosed={() => { setModalData(null) }} toggle={() => closeModal(setModalData)}>
        <ModalHeader textCenter toggle={() => closeModal(setModalData)}>{modalData?.title}</ModalHeader>
        <ModalBody>{modalData?.children}</ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={() => closeModal(setModalData)} type="button">Cerrar</Button> */}
        </ModalFooter>
      </Modal>

      <div className="contenedor-filter">
        <SubHeader text={conditionSelected.nomb_cond} showBackButton={true} />

        <div className="container-md py-1 pb-4">
          <div className="">
            <p>
              <b>Convocatoria:</b>
              <span className="d-block">{convocatorySelected.nomb_conv}</span>
            </p>
          </div>
          {!conditionDetails ? <Loader isOpen loaderAsModal={false} />
            :
            !conditionDetails.length ?
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
                      conditionDetails?.map((c: any, i: number) =>
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
                    <Answer idForm={conditionSelected.form_respuesta} idCondition={conditionSelected.id_cond} />
                  </TabPane>
                  <TabPane tabId={1}>
                    {loadedTabs.includes(1) && <Suspense fallback={<Loader loaderAsModal={false} isOpen />}>
                      <Attachments idForm={conditionSelected.form_anexo} idCondition={conditionSelected.id_cond} />
                    </Suspense>}
                  </TabPane>
                  <TabPane tabId={2}>
                    <div className='row'>
                      <div className='col-md-6 col-7'>
                        {loadedTabs[loadedTabs.length - 1] === 2 &&
                          <Suspense fallback={<Loader loaderAsModal={false} isOpen />}>
                            <div className='mb-2 border-start border-4 border-warning ps-2'><b>Texto de condición</b></div>
                            <Answer idForm={conditionSelected.form_respuesta} showActionButton={false} />
                          </Suspense>
                        }
                      </div>
                      <div className='col'>
                        {loadedTabs.includes(2) && <Suspense fallback={<Loader loaderAsModal={false} isOpen />}>
                          <Review idForm={conditionSelected.form_obse} idCondition={conditionSelected.id_cond} />
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
      </div>
    </div >
  );
};

export default ConditionsDetails;
