/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, Link, Routes, Route, useNavigate } from "react-router-dom";
import { IName, Warning, Check, History, Anex, Edit, Clip, Eye, Plus, Exit, Daate, Clock } from "../../components/Icons";

import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  TabContent, TabPane, Nav,
  NavItem, NavLink, Row, Col, Button,
} from 'reactstrap';
import classnames from 'classnames';
import Modal, { I_ModalContentProps } from "../../components/Modal";
import { GoBackButton } from "../../components/GoBackButton";


const ConditionsDetails = () => {



  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState('1');

  const [modalData, setModalData] = useState<null | I_ModalContentProps>(null);

  // Toggle active state for Tab
  const toggleTab = (tab: any) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  }
  const navigate = useNavigate();
  const { dependency } = useParams();
  const { id } = useParams();

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
            <div className="header p-4  condiciones-header">
              <div className="title fs-3 text-white">
                <div className="container">
                  {condiciones.condicion.toLowerCase()}
                </div>
              </div>
            </div>
            <div className="container py-5">
              <GoBackButton />

              <div className=" body-details mt-4 bg-white py-4 px-5 shadow">
                <div className="px-5 pt-3">
                  <div className="d-flex justify-content-between">
                    <div className="subtitle ps-4">Nombre</div>
                    <span className="badge rounded-pill text-bg-danger d-flex align-items-center justify-content-center "><Warning size={10} /> <span className="ms-1">Pendiente</span></span>
                  </div>
                  <p className="px-2 mt-2">{condiciones.condicion}</p>
                  <br />
                  <div className="subtitle ps-4">Descripcion</div>
                  <p className="info-condicion px-2 mb-4 mt-2">{condiciones.informacion}</p>
                  <span className="ps-2">Ciudad:</span> <b className="">{condiciones.ciudad}</b>






                  <Nav tabs className="group-subtitle p-1 ps-1 mt-4">
                    <div className="line"></div>
                    <NavItem>
                      <NavLink
                        className={"sub-item text-center p-2  px-4 d-flex align-items-center " + classnames({
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
                        className={"sub-item text-center p-2  px-4 d-flex align-items-center " + classnames({
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
                        className={"sub-item text-center p-2  px-4 d-flex align-items-center " + classnames({
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
                        className={"sub-item text-center p-2  px-4 d-flex align-items-center " + classnames({
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
                          <button className="subtitle p-2 mt-4 pointer d-flex justify-content-center align-items-center"><Edit /> Habilitar edicion</button>
                          <div className="edit">
                            <textarea className="p-3 mt-3">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.
                              Animi perferendis possimus molestiae doloremque eius alias magnam libero tenetur tempore commodi. Exercitationem voluptatem porro maxime quisquam animi alias cupiditate amet, architecto accusamus nesciunt quas consequatur veritatis magni impedit optio? Reiciendis possimus non recusandae sequi porro voluptatibus, incidunt libero facilis, praesentium dolore repellat ratione quam beatae itaque obcaecati, totam dignissimos. Sequi ipsam saepe exercitationem eligendi repudiandae vitae cumque, asperiores porro culpa, accusantium in voluptatibus! Provident impedit rem repellat accusamus laboriosam reprehenderit corrupti cumque ipsam eum,
                              ad inventore maxime facere sunt, officiis veritatis quaerat.
                            </textarea>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="12">
                          <button className="subtitle p-2 my-4 pointer d-flex justify-content-center align-items-center"><Edit /> Añadir nuevo Anexo</button>
                          {anexos.map(anexo =>
                            <div className="anexo d-flex align-items-center mt-3">
                              <div className="icon-container d-flex alig-items-center justify-content-center">
                                <div className="icon p-2 d-flex align-items-center justify-content-center">
                                  <Clip size={22} />
                                </div>
                              </div>
                              <div className="anexo-body p-0 py-1 d-flex flex-column  ">
                                <b>{anexo.nombre}</b>
                                <p >{anexo.descripcion}</p>
                              </div>
                              <div className="anexo-options d-flex ">
                                <div className="icon-option"><Link to={anexo.link}><Eye size={22} /></Link></div>
                                <div className="icon-option"><Exit size={20} /></div>
                              </div>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3">
                      <Row>
                        <Col sm="12">
                          <button className="subtitle p-2 mt-4 pointer d-flex justify-content-center align-items-center"><Edit /> Habilitar edicion</button>
                          <div className="edit">
                            <textarea className="p-3 mt-3">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aut amet ullam explicabo qui pariatur quae aperiam.
                              Animi perferendis possimus molestiae doloremque eius alias magnam libero tenetur tempore commodi. Exercitationem voluptatem porro maxime quisquam animi alias cupiditate amet, architecto accusamus nesciunt quas consequatur veritatis magni impedit optio? Reiciendis possimus non recusandae sequi porro voluptatibus, incidunt libero facilis, praesentium dolore repellat ratione quam beatae itaque obcaecati, totam dignissimos. Sequi ipsam saepe exercitationem eligendi repudiandae vitae cumque, asperiores porro culpa, accusantium in voluptatibus! Provident impedit rem repellat accusamus laboriosam reprehenderit corrupti cumque ipsam eum,
                              ad inventore maxime facere sunt, officiis veritatis quaerat.
                            </textarea>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="4">
                      <Row>
                        <Col sm="12">
                          {historial.map(anexo =>
                            <div className="historial py-1  d-flex align-items-center mt-3" >
                              <div className="icon-container d-flex alig-items-center justify-content-center">
                                <div className="icon p-2 d-flex flex-column justify-content-center">
                                  <div className="item-icon d-flex align-items-center"><Daate size={20} />00.00-0000</div>
                                  <div className="item-icon d-flex align-items-center"><Clock size={20} />00:00</div>
                                </div>

                              </div>
                              <div className="anexo-body historial-body p-0 py-1 d-flex flex-column  " onClick={() => {
                                setModalData({
                                  title: ' ',
                                  children: (
                                    <div>
                                      <p className="m-0">Accion:</p>
                                      <b>{anexo.tipo}</b>
                                      <p className="mt-3 m-0">Fecha:</p>
                                      <b>00-00-0000</b>
                                      <p className="mt-3 m-0">Usuario:</p>
                                      <b>Name User</b>
                                      <hr />
                                      <p>{anexo.descripcion}</p>

                                    </div>
                                  ),
                                  onClosed: () => setModalData(null)
                                })
                              }}>

                                <span><span className={anexo.tipo === 'CONDICION' ? 'badge text-white rounded-pill  text-bg-success' : anexo.tipo === 'REVISIÓN' ? 'badge text-white rounded-pill  text-bg-warning' : anexo.tipo === 'ANEXO' ? 'badge text-white rounded-pill  text-bg-info' : ''}>{anexo.tipo}</span></span>
                                <span>{anexo.descripcion}</span>
                              </div>

                            </div>



                          )}

                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>

                </div>
                <Modal
                  isOpen={!!(modalData)}
                  form={{
                    fields: [{
                      label: 'Text',
                      name: 'textInput',
                      tag: 'input',
                      type: 'text',
                      validations: {
                        maxLength: 10,
                        minLength: 3,
                        required: true
                      }
                    }],
                    defaultValues:{},
                    onSubmit: (data, toggle)=>{
                      console.log({data})
                      
                    }
                  }}
                  {...modalData as I_ModalContentProps}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ConditionsDetails;
