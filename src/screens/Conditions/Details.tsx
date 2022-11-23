/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, Link, Routes, Route, useNavigate } from "react-router-dom";
import { IName, Warning, Check, History, Anex, Edit, Clip, Eye, Plus, Exit, Daate, Clock } from "../../components/Icons";

import React, { ElementRef, TextareaHTMLAttributes, useState } from 'react'
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


const ConditionsDetails = () => {



  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState('1');
  const [modalData, setModalData] = useState<any>(null);

  const [textarea1, setTextArea1] = useState(true);
  const [openAlert1, setOpenAlert1] = useState(false);
  const [saveAlert1, setSaveAlert1] = useState(false);


  const [textarea2, setTextArea2] = useState(true);
  const [openAlert2, setOpenAlert2] = useState(false);
  const [saveAlert2, setSaveAlert2] = useState(false);



  // Toggle active state for Tab
  const toggleTab = (tab: any) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  }
  const { dependency } = useParams();
  const { id } = useParams();
  var programas = [
    {
      codigo: '100',
      condicion: 'CONDICIÓN DE DENOMINACIÓN',
      estado: 'no',
      programa: 'Medicina',
      informacion: 'Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en los artículos 2.5.3.2.3.2.2 y 2.5.3.2.3.2.12 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 53 y 55 de la Resolución 21795 de 2020',

    },
    {
      codigo: '200',
      condicion: 'CONDICIÓN DE JUSTIFICACIÓN',
      estado: 'no',
      programa: 'Bacteriología',
    },
    {
      codigo: '300',
      condicion: 'CONDICIÓN DE ASPECTOS CURRICULARES',
      numero: 'Condición 3',
      estado: 'no',
      programa: 'Enfermería',
    },
    {
      codigo: '400',
      condicion: 'CONDICIÓN ORGANIZACIÓN DE ACTIVIDADES ACADEMICAS Y PROCESO FORMATIVO',
      estado: 'no',
      programa: 'Mecánica dental',

    },
    {
      codigo: '500',
      condicion: 'CONDICIÓN DE INVESTIGACIÓN, INNOVACIÓN Y/O CREACIÓN ARTÍSTICA Y CULTURAL',
      estado: 'no',
      programa: 'Odontología',
    },
    {
      codigo: '600',
      condicion: 'CONDICIÓN RELACIÓN CON EL SECTOR EXTERNO',
      estado: 'no',
      programa: 'Sistemas',
    },
    {
      codigo: '700',
      condicion: 'PROFESORES',
      estado: 'no',
      programa: 'Derecho',
    },
    {
      codigo: '800',
      condicion: 'MEDIOS EDUCATIVOS',
      estado: 'no',
      programa: 'Adminstración',
    },
    {
      codigo: '900',
      condicion: 'INFRAESTRUTURA FISICA Y TECNOLOGICA',
      estado: 'no',
      programa: 'Contaduría',
    },

  ]
  var condiciones: any = [];
  if (dependency === 'Barranquilla') {
    condiciones = [
      {
        codigo: "100",
        condicion:
          "MECANISMOS DE SELECCIÓN Y EVALUACIÓN DE ESTUDIANTES Y PROFESORES",
        numero: "Condición 1",
        informacion:
          "Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.2 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 6 al 18 de la Resolución 15224 del 2022.",
        ciudad: "barranquilla",
        estado: "no",
        respuesta: "",
        fecha: new Date("2022-03-04T00:00:00"),
        control: true,
      },
      {
        codigo: "200",
        condicion: "ESTRUCTURA ADMINISTRATIVA Y ACADEMICA",
        numero: "Condición 2",
        informacion:
          "Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.3 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 19 al 29 de la Resolución 15224 del 2022.",
        ciudad: "barranquilla",
        estado: "no",
        respuesta: "",
        fecha: new Date("2022-03-04T00:00:00"),
        control: true,
      },
      {
        codigo: "300",
        condicion: "CULTURA DE LA AUTOEVALUACIÓN",
        numero: "Condición 3",
        informacion:
          "Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.4 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 30 al 32 de la Resolución 15224 del 2022.",
        ciudad: "barranquilla",
        estado: "no",
        respuesta: "",
        fecha: new Date("2022-03-04T00:00:00"),
        control: true,
      },
      {
        codigo: "400",
        condicion: "PROGRAMA DE EGRESADOS",
        numero: "Condición 4",
        informacion:
          "Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.5 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 33 al 36 de la Resolución 15224 del 2020.",
        ciudad: "barranquilla",
        estado: "no",
        respuesta: "",
        fecha: new Date("2022-03-04T00:00:00"),
        control: true,
      },
      {
        codigo: "500",
        condicion: "MODELO DE BIENESTAR",
        numero: "Condición 5",
        informacion:
          "Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.6 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 37 al 39 de la Resolución 15224 del 2020.",
        ciudad: "barranquilla",
        estado: "no",
        respuesta: "",
        fecha: new Date("2022-03-04T00:00:00"),
        control: true,
      },
      {
        codigo: "600",
        condicion:
          "RECURSOS SUFICIENTES PARA GARANTIZAR EL CUMPLIMIENTO DE LAS METAS",
        numero: "Condición 6",
        informacion:
          "Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el Artículo 2.5.3.2.3.1.7 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 40 al 47 de la Resolución 15224 del 2020.",
        ciudad: "barranquilla",
        estado: "no",
        respuesta: "",
        fecha: new Date("2022-03-04T00:00:00"),
        control: true,
      },
    ]
  } else if (dependency === 'Cartagena') {
    condiciones = [
      {
        codigo: '100',
        condicion: 'MECANISMOS DE SELECCIÓN Y EVALUACIÓN DE ESTUDIANTES Y PROFESORES',
        numero: 'Condición 1',
        informacion: 'Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.2 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 6 al 18 de la Resolución 15224 del 2022.',
        ciudad: 'Cartagena',
        estado: 'no',
        respuesta: '',
        fecha: new Date('2022-03-04T00:00:00'),
        control: true,
      },
      {
        codigo: '200',
        condicion: 'ESTRUCTURA ADMINISTRATIVA Y ACADEMICA',
        numero: 'Condición 2',
        informacion: 'Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.3 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 19 al 29 de la Resolución 15224 del 2022.',
        ciudad: 'Cartagena',
        estado: 'no',
        respuesta: '',
        fecha: new Date('2022-03-04T00:00:00'),
        control: true,
      },
      {
        codigo: '300',
        condicion: 'CULTURA DE LA AUTOEVALUACIÓN',
        numero: 'Condición 3',
        informacion: 'Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.4 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 30 al 32 de la Resolución 15224 del 2022.',
        ciudad: 'Cartagena',
        estado: 'no',
        respuesta: '',
        fecha: new Date('2022-03-04T00:00:00'),
        control: true,
      },
      {
        codigo: '400',
        condicion: 'PROGRAMA DE EGRESADOS',
        numero: 'Condición 4',
        informacion: 'Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.5 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 33 al 36 de la Resolución 15224 del 2020.',
        ciudad: 'Cartagena',
        estado: 'no',
        respuesta: '',
        fecha: new Date('2022-03-04T00:00:00'),
        control: true,
      },
      {
        codigo: '500',
        condicion: 'MODELO DE BIENESTAR',
        numero: 'Condición 5',
        informacion: 'Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.6 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 37 al 39 de la Resolución 15224 del 2020.',
        ciudad: 'Cartagena',
        estado: 'no',
        respuesta: '',
        fecha: new Date('2022-03-04T00:00:00'),
        control: true,
      },
      {
        codigo: '600',
        condicion: 'RECURSOS SUFICIENTES PARA GARANTIZAR EL CUMPLIMIENTO DE LAS METAS',
        numero: 'Condición 6',
        informacion: 'Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el Artículo 2.5.3.2.3.1.7 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 40 al 47 de la Resolución 15224 del 2020.',
        ciudad: 'Cartagena',
        estado: 'no',
        respuesta: '',
        fecha: new Date('2022-03-04T00:00:00'),
        control: true,
      }
    ]
  } else {
    condiciones = programas.filter((d) => d.programa === dependency)
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

 
  return (

    <div className="container-details">
      <Alert isOpen={openAlert1} type="question"  title={"¿Estás seguro?"}  subtitle="se perderán los cambios que has realizado" onClosed={() => {setOpenAlert1(false) }} closeButton={{value: " Cancelar", color:'danger'}} submitButton={{value : 'Descartar cambios', onClick:()=>{setTextArea1(!textarea1)}}} />
      <Alert isOpen={saveAlert1} type="success"   title={"¡ Guardado !"}    subtitle="Los cambios se han guardado correctamente" onClosed={() => {setSaveAlert1(false) }} closeButton={{value:'cerrar'}} />

      <Alert isOpen={openAlert2} type="question"  title={"¿Estás seguro?"}  subtitle="se perderán los cambios que has realizado" onClosed={() => {setOpenAlert2(false) }} closeButton={{value: " Cancelar", color:'danger'}} submitButton={{value : 'Descartar cambios', onClick:()=>{setTextArea2(!textarea2)}}} />
      <Alert isOpen={saveAlert2} type="success"   title={"¡ Guardado !"}    subtitle="Los cambios se han guardado correctamente" onClosed={() => {setSaveAlert2(false) }} closeButton={{value:'cerrar'}} />

      <Modal isOpen={!!(modalData?.isOpen)} onClosed={() => { setModalData(null) }} toggle={() => closeModal(setModalData)}>
        <ModalHeader textCenter toggle={() => closeModal(setModalData)}>{modalData?.title}</ModalHeader>
        <ModalBody>{modalData?.children}</ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={() => closeModal(setModalData)} type="button">Cerrar</Button> */}
        </ModalFooter>
      </Modal>
      {/* <button onClick={()=>setModalData({
        title: "Hola",
        children: "Hola",
        closeButton: {value: "CERRAR", color: "danger", onClick: ()=>{
          console.log("Cancel")
        }},
        submitButton: {value: "OK",
         onClick: ()=>{
          setModalData(null)
          console.log("Some")
        }},
        onClosed: ()=> setModalData(null)
      })}>OpenModal</button>

      <Modal 
        isOpen={!!(modalData)}
        {...modalData as I_ModalContentProps}
      /> */}



      {condiciones
        .filter((condicion: any) => condicion.codigo === id)
        .map((condiciones: any) => (
          <div className="contenedor-filter">
            <Header />
            <SubHeader text={condiciones.condicion} showBackButton={true} />


            <div className="container-md py-1 pb-4">
              <div className="card mb-4 py- p-4  border-0 bg-white shadow">
                <div className="card-body px-5-md pt-3">
                  <div className="d-flex justify-content-between">
                    <div className="subtitle rounded-pill fw-bold py-1 px-4">Nombre</div>
                    <span className="badge rounded-pill text-bg-danger py-0 d-flex align-items-center justify-content-center "><Warning size={10} /> <span className="ms-1">Pendiente</span></span>
                  </div>
                  <p className="px-2 mt-2">{condiciones.condicion}</p>
                  <br />
                  <div className="d-flex justify-content-between"><div className="subtitle rounded-pill fw-bold py-1 px-4">Descripcion</div></div>
                  <p className="info-condicion px-2 mb-4 mt-2">{condiciones.informacion}</p>
                  <span className="ps-2">Ciudad / Programa:</span> <b className="">{condiciones.ciudad ? condiciones.ciudad : condiciones.programa}</b>






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
                          <button className={`subtitle rounded-pill fw-bold fw- p-2 mt-4 px-4 pointer d-flex justify-content-center align-items-center btn-edit ${!textarea1 ? 'bg-danger text-white' : ''}`} onClick={(e) => {
                            textarea1 ? setTextArea1(!textarea1) : setOpenAlert1(true)
                          }}><Edit /> {textarea1 ? 'Habilitar edición' : 'Cancelar edición'}</button>
                          <div className="edit">
                            <textarea className={textarea1 ? " p-3 mt-3 w-100  p-3 mt-3 w-100" : 'bg-white border-secondary p-3 mt-3 w-100  p-3 mt-3 w-100'} readOnly={textarea1}>
                              lorem  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam Animi perferendis possimus molestiae doloremque eius alias magnam libero tenetur tempore commodi. Exercitationem voluptatem porro maxime quisquam animi alias cupiditate amet, architecto accusamus nesciunt quas consequatur veritatis magni impedit optio? Reiciendis possimus non recusandae sequi porro voluptatibus, incidunt libero facilis, praesentium dolore repellat ratione quam beatae itaque obcaecati, totam dignissimos. Sequi ipsam saepe exercitationem eligendi repudiandae vitae cumque, asperiores porro culpa, accusantium in voluptatibus! Provident impedit rem repellat accusamus laboriosam reprehenderit corrupti cumque ipsam eum,ad inventore maxime facere sunt, officiis veritatis quaerat
                            </textarea>
                          </div>
                          <div className="col-12 d-flex justify-content-end">
                           {!textarea1 ?  <button className="btn btn-primary w-25" onClick={()=>{
                            setTextArea1(!textarea1);
                            setSaveAlert1(true);
                           }}>Guardar</button> : ''}
                          </div>

                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="12">
                          <button className="subtitle rounded-pill fw-bold p-2 px-4 my-4 pointer d-flex justify-content-center align-items-center"><Edit /> Añadir nuevo Anexo</button>
                          {anexos.map(anexo =>
                            <div className="card mx-1 mx-md-3 mb-4 p-3 px-2 px-md-5 border-0 bg-light hover-scale-up hover-shadow-sm d-flex flex-row justify-content-between" >
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
                        <button className={`subtitle rounded-pill fw-bold fw- p-2 mt-4 px-4 pointer d-flex justify-content-center align-items-center btn-edit ${!textarea2 ? 'bg-danger text-white' : ''}`} onClick={(e) => {
                            textarea2 ? setTextArea2(!textarea2) : setOpenAlert2(true)
                          }}><Edit /> {textarea2 ? 'Habilitar edición' : 'Cancelar edición'}</button>
                          <div className="edit">
                            <textarea className={textarea2 ? " p-3 mt-3 w-100  p-3 mt-3 w-100" : 'bg-white border-secondary p-3 mt-3 w-100  p-3 mt-3 w-100'} readOnly={textarea2}>
                              lorem  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam Animi perferendis possimus molestiae doloremque eius alias magnam libero tenetur tempore commodi. Exercitationem voluptatem porro maxime quisquam animi alias cupiditate amet, architecto accusamus nesciunt quas consequatur veritatis magni impedit optio? Reiciendis possimus non recusandae sequi porro voluptatibus, incidunt libero facilis, praesentium dolore repellat ratione quam beatae itaque obcaecati, totam dignissimos. Sequi ipsam saepe exercitationem eligendi repudiandae vitae cumque, asperiores porro culpa, accusantium in voluptatibus! Provident impedit rem repellat accusamus laboriosam reprehenderit corrupti cumque ipsam eum,ad inventore maxime facere sunt, officiis veritatis quaerat
                            </textarea>
                          </div>
                          <div className="col-12 d-flex justify-content-end">
                           {!textarea2 ?  <button className="btn btn-primary w-25" onClick={()=>{
                            setTextArea2(!textarea2);
                            setSaveAlert2(true);
                           }}>Guardar</button> : ''}
                          </div>
                           
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="4">
                      <Row>
                        <Col sm="12">
                          {historial.map(anexo =>
                            <div className="card mx-1 mx-md-3 mb-4 border-0 bg-light hover-scale-up hover-shadow-sm d-flex flex-row mt-4 py-3 px-1 px-md-3" >
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
            </div>
          </div>
        ))}
    </div>
  );
};

export default ConditionsDetails;
