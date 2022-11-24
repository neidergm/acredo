/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { IName, Warning, Check, History, Anex, Edit, Clip, Eye, Plus, Exit, Daate, Clock } from "../../components/Icons";

import React, { ElementRef, TextareaHTMLAttributes, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  TabContent, TabPane, Nav,
  NavItem, NavLink, Row, Col, Button,
} from 'reactstrap';
import classnames from 'classnames';
// import Modal, { I_ModalContentProps } from "../../components/Modal";
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader } from "../../components/Modal";
import Alert from "../../components/Alert";
import Header from "../../components/header";
import './details.css'
import { SubHeader } from "../../components/SubHeader";
import { text } from "node:stream/consumers";
import { I_Condition } from "../../interfaces/conditions.interface";
import { CONDITION_DETAILS } from "../../services/endPointsService";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { I_Convocatory } from "../../interfaces/convocatory.interface";
import Loader from '../../components/Loader'
import { I_Resp } from "../../interfaces/respuestas.interface";

let DATA: { [id_conv: string]: Array<I_Condition> } = {};


const ConditionsDetails = () => {



  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState('1');
  const [modalData, setModalData] = useState<any>(null);
  const condiciones: I_Condition = useLocation().state.condition;
  const conv: I_Convocatory = useLocation().state.convocatory;
  const [respuestas, setRespuestas] = useState<Array<I_Resp> | null>(null);
  const { id } = useParams();
  const [textarea1, setTextarea1] = useState(false)
  const [textarea2, setTextarea2] = useState(false)
  const [alertopen, setalertopen] = useState<any>({ isOpen: false })


  // Toggle active state for Tab
  const toggleTab = (tab: any) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  }

  const anexos = [
    {
      id: '1',
      nombre: ' Lorem ipsum dolor sit amet consectetur adipisicing ',
      descripcion: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    },
    {
      id: '2',
      nombre: ' Lorem ipsum dolor sit amet consectetur adipisicing ',
      descripcion: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    },
    {
      id: '3',
      nombre: ' Lorem ipsum dolor sit amet consectetur adipisicing ',
      descripcion: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    },
    {
      id: '4',
      nombre: ' Lorem ipsum dolor sit amet consectetur adipisicing ',
      descripcion: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    },
    {
      id: '5',
      nombre: ' Lorem ipsum dolor sit amet consectetur adipisicing ',
      descripcion: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    }
  ]
  const historial = [
    {
      id: '1',
      tipo: 'ANEXO',
      descripcion: ' Lorem Anexo elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    },
    {
      id: '2',
      tipo: 'CONDICION',
      descripcion: ' Lorem Anexo elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    },
    {
      id: '3',
      tipo: 'REVISIÓN',
      descripcion: ' Lorem Anexo elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    },
    {
      id: '4',
      tipo: 'REVISIÓN',
      descripcion: ' Lorem Anexo elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    },
    {
      id: '5',
      tipo: 'CONDICION',
      descripcion: ' Lorem Anexo elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.',
      link: 'www.xyz.xyz'
    }
  ]

  useEffect(() => {


    AXIOS_REQUEST(CONDITION_DETAILS + id)
      .then(res => {
        setRespuestas(res.data)
      })
      .catch(err => err)

  }, [id])

  const alertOpenTwo = ()=>{
    setalertopen({
      isOpen:true, 
      type:"question",
      title:"¿Estás seguro?",
      subtitle:"se perderán los cambios que has realizado" ,
      onClosed:() => {setalertopen({isOpen:false}) } ,
      closeButton:{value: " Cancelar", color:'danger'}, 
      submitButton:{value : 'Descartar cambios', 
      onClick:()=>setTextarea2(!textarea2)}
    })
  }
  const alertOpenOne = ()=>{
    setalertopen({
      isOpen:true, 
      type:"question",
      title:"¿Estás seguro?",
      subtitle:"se perderán los cambios que has realizado" ,
      onClosed:() => {setalertopen({isOpen:false}) } ,
      closeButton:{value: " Cancelar", color:'danger'}, 
      submitButton:{value : 'Descartar cambios', 
      onClick:()=>setTextarea1(!textarea1)}
    })
  }

  return (

    <div className="container-details">
      <Alert {...alertopen} />

      <Modal isOpen={!!(modalData?.isOpen)} onClosed={() => { setModalData(null) }} toggle={() => closeModal(setModalData)}>
        <ModalHeader textCenter toggle={() => closeModal(setModalData)}>{modalData?.title}</ModalHeader>
        <ModalBody>{modalData?.children}</ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={() => closeModal(setModalData)} type="button">Cerrar</Button> */}
        </ModalFooter>
      </Modal>
      <div className="contenedor-filter">
        <Header />
        <SubHeader text={condiciones.nomb_cond} showBackButton={true} />

        <div className="container-md py-1 pb-4">
          {!respuestas ? <Loader isOpen loaderAsModal={false} />
            :
            !respuestas.length ?
              <p>| No hay condiciones registradas en la convocatoria</p>
              :
              <div className="card mb-4 py- p-4 bg-white border-0 shadow shadow-small ">

                <div className="card-body px-5-md pt-3">
                  <div className="d-flex justify-content-between">
                    <div className="subtitle rounded-pill fw-bold py-1 px-4">Nombre</div>
                    <span className="badge rounded-pill text-bg-danger py-0 d-flex align-items-center justify-content-center "><Warning size={10} /> <span className="ms-1">Pendiente</span></span>
                  </div>
                  <p className="px-2 mt-2">{condiciones.nomb_cond}</p>
                  <br />
                  <div className="d-flex justify-content-between"><div className="subtitle rounded-pill fw-bold py-1 px-4">Descripcion</div></div>
                  {/* <p className="info-condicion px-2 mb-4 mt-2">{condiciones.informacion}</p> */}
                  <span className="ps-2"><b>Ciudad :</b></span> {condiciones.sede.toUpperCase()}

                  <Nav tabs className="group-subtitle rounded-4 p-1  mt-4  justify-content-md-start d-md-flex d-block">

                    <NavItem>
                      <NavLink
                        className={"sub-item border-0 fw-bold text-center p-2 m-0  px-4 d-flex align-items-center " + classnames({
                          active:
                            currentActiveTab === '1'
                        })}
                        onClick={() => { toggleTab('1'); }}
                      >
                        <Check size={17} /> Texto de condicion
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={"sub-item border-0 fw-bold text-center p-2  m-0 px-4 d-flex align-items-center " + classnames({
                          active:
                            currentActiveTab === '2'
                        })}
                        onClick={() => { toggleTab('2'); }}
                      >
                        <Anex /> Anexo
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={"sub-item border-0 fw-bold text-center p-2  m-0 px-4 d-flex align-items-center " + classnames({
                          active:
                            currentActiveTab === '3'
                        })}
                        onClick={() => { toggleTab('3'); }}
                      >
                        <Warning /> Revisión
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        className={"sub-item border-0 fw-bold text-center p-2  m-0 px-4 d-flex align-items-center " + classnames({
                          active:
                            currentActiveTab === '4'
                        })}
                        onClick={() => { toggleTab('4'); }}
                      >
                        <History /> Historial
                      </NavLink>
                    </NavItem>

                  </Nav>
                  <TabContent activeTab={currentActiveTab} className="tab-content-item">
                    <TabPane tabId="1">
                      <Row>
                        <Col sm="12">
                        <button className={`subtitle rounded-pill fw-bold fw- p-2 mt-4 px-4 pointer d-flex justify-content-center align-items-center btn-edit ${textarea1 ? 'text-white bg-danger' : ''}`} onClick={(e) => {
                            if (!textarea1) {
                              setTextarea1(!textarea1)
                            } else {
                              alertOpenOne()
                            }
                          }}><Edit /> {!textarea1 ? 'Habilitar edición' : 'Cancelar edición'}</button>
                          <div className="edit">
                            <textarea autoFocus className={" p-3 mt-3 w-100  p-3 mt-3 w-100"} readOnly={!textarea1}>
                              lorem  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam Animi perferendis possimus molestiae doloremque eius alias magnam libero tenetur tempore commodi. Exercitationem voluptatem porro maxime quisquam animi alias cupiditate amet, architecto accusamus nesciunt quas consequatur veritatis magni impedit optio? Reiciendis possimus non recusandae sequi porro voluptatibus, incidunt libero facilis, praesentium dolore repellat ratione quam beatae itaque obcaecati, totam dignissimos. Sequi ipsam saepe exercitationem eligendi repudiandae vitae cumque, asperiores porro culpa, accusantium in voluptatibus! Provident impedit rem repellat accusamus laboriosam reprehenderit corrupti cumque ipsam eum,ad inventore maxime facere sunt, officiis veritatis quaerat
                            </textarea>
                          </div>
                          <div className="d-flex justify-content-end" >
                            {textarea1 ? <button className="btn btn-primary w-25" onClick={()=>{setTextarea1(false)}}>Guardar</button> : ''}
                          </div>

                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="12">
                          <button className="subtitle rounded-pill fw-bold p-2 px-4 my-4 pointer d-flex justify-content-center align-items-center"><Edit /> Añadir nuevo Anexo</button>
                          {anexos.map((anexo, i) =>
                            <div key={i} className="card mx-1 mx-md-3 mb-4 p-3 px-2 px-md-5 border-0 bg-light hover-scale-up hover-shadow-sm d-flex flex-row justify-content-between" >
                              <div >
                                <div className="icon p-2 d-flex align-items-center justify-content-center">
                                  <Clip size={22} />
                                </div>
                              </div>
                              <div className="ms-1 ms-md-3  row align-self-start text-truncate">
                                <b className="col-12" >{anexo.nombre}</b>
                                <p className="  m-0 col-12 text-truncate">{anexo.descripcion}</p>
                              </div>
                              <div className="d-flex ms-4 ms-md-3 justify-content-center align-items-center ">
                                <div className="icon-option"><Link to={anexo.link}><Eye size={27} /></Link></div>
                                <div className="icon-option ms-2"><Exit size={22} /></div>
                              </div>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3">
                      <Row>
                        <Col sm="12">
                          <button className={`subtitle rounded-pill fw-bold fw- p-2 mt-4 px-4 pointer d-flex justify-content-center align-items-center btn-edit ${textarea2 ? 'text-white bg-danger' : ''}`} onClick={(e) => {
                            if (!textarea2) {
                              setTextarea2(!textarea2)
                            } else {
                              alertOpenTwo()
                            }
                          }}><Edit /> {!textarea2 ? 'Habilitar edición' : 'Cancelar edición'}</button>
                          <div className="edit">
                            <textarea autoFocus className={" p-3 mt-3 w-100  p-3 mt-3 w-100"} readOnly={!textarea2}>
                              lorem  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam Animi perferendis possimus molestiae doloremque eius alias magnam libero tenetur tempore commodi. Exercitationem voluptatem porro maxime quisquam animi alias cupiditate amet, architecto accusamus nesciunt quas consequatur veritatis magni impedit optio? Reiciendis possimus non recusandae sequi porro voluptatibus, incidunt libero facilis, praesentium dolore repellat ratione quam beatae itaque obcaecati, totam dignissimos. Sequi ipsam saepe exercitationem eligendi repudiandae vitae cumque, asperiores porro culpa, accusantium in voluptatibus! Provident impedit rem repellat accusamus laboriosam reprehenderit corrupti cumque ipsam eum,ad inventore maxime facere sunt, officiis veritatis quaerat
                            </textarea>
                          </div>
                          <div className="d-flex justify-content-end" >
                            {textarea2 ? <button className="btn btn-primary w-25" onClick={()=>{setTextarea2(false)}}>Guardar</button> : ''}
                          </div>

                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="4">
                      <Row>
                        <Col sm="12">
                          {historial.map((anexo, i) =>
                            <div key={i} className="card mx-1 mx-md-3 mb-4 border-0 bg-light hover-scale-up hover-shadow-sm d-flex flex-row mt-4 py-3 px-1 px-md-3" >
                              <div className="d-flex alig-items-center justify-content-center">
                                <div className="icon p-2 d-flex flex-column justify-content-center w-100">
                                  <div className="item-icon  fw-bold text-truncate gap-3"><Daate size={20} /> 00.00-0000</div>
                                  <div className="item-icon  fw-bold mt-2 text-truncate gap-3"><Clock size={20} /> 00:00</div>
                                </div>

                              </div>
                              <div className="  p-0  ms-2 px-2 d-flex justify-content-center flex-column text-truncate" onClick={() => {
                                setModalData({
                                  isOpen: true,
                                  title: anexo.tipo,
                                  children: (
                                    <div>
                                      <p className="mt-3 m-0">Fecha:</p>
                                      <b>00-00-0000</b>
                                      <p className="mt-3 m-0">Usuario:</p>
                                      <b>Name User</b>
                                      <hr />
                                      <p>{anexo.descripcion}</p>

                                    </div>
                                  ),
                                })
                              }}>

                                <span><span className={anexo.tipo === 'CONDICION' ? 'badge text-white rounded-pill  text-bg-success' : anexo.tipo === 'REVISIÓN' ? 'badge text-white rounded-pill  text-bg-warning' : anexo.tipo === 'ANEXO' ? 'badge text-white rounded-pill  text-bg-info' : ''}>{anexo.tipo}</span></span>
                                <span className=" text-truncate w-100 m-0">{anexo.descripcion}</span>
                              </div>

                            </div>
                          )}

                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>

                </div>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ConditionsDetails;
