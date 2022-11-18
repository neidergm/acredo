import React, { useState } from "react";
import {  Link } from "react-router-dom";
import {  Flag, Box } from "../../components/Icons";
import Header from "../../components/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import './condiciones.css';
import {
  TabContent, TabPane, Nav,
  NavItem, NavLink, Row, Col
} from 'reactstrap';
import classnames from 'classnames';
import { GoBackButton } from "../../components/GoBackButton";


const Conditions = () => {

  const condiciones = [
    {
      //Barranquilla
      codigo: "100",
      condicion:
        "MECANISMOS DE SELECCIÓN Y EVALUACIÓN DE ESTUDIANTES Y PROFESORES",
      ciudad: "Barranquilla",
      estado: "no",
    },
    {
      codigo: "200",
      condicion: "ESTRUCTURA ADMINISTRATIVA Y ACADEMICA",
      ciudad: "Barranquilla",
      estado: "no",
    },
    {
      codigo: "300",
      condicion: "CULTURA DE LA AUTOEVALUACIÓN",
      ciudad: "Barranquilla",
      estado: "no",
    },
    {
      codigo: "400",
      condicion: "PROGRAMA DE EGRESADOS",
      ciudad: "Barranquilla",
      estado: "no",
    },
    {
      codigo: "500",
      condicion: "MODELO DE BIENESTAR",
      ciudad: "Barranquilla",
      estado: "no",
    },
    {
      codigo: "600",
      condicion:
        "RECURSOS SUFICIENTES PARA GARANTIZAR EL CUMPLIMIENTO DE LAS METAS",
      ciudad: "Barranquilla",
      estado: "no",
    },

    //Cartagena
    {
      codigo: "100",
      condicion:
        "MECANISMOS DE SELECCIÓN Y EVALUACIÓN DE ESTUDIANTES Y PROFESORES",
      ciudad: "Cartagena",
      estado: "no",
    },
    {
      codigo: "200",
      condicion: "ESTRUCTURA ADMINISTRATIVA Y ACADEMICA",
      ciudad: "Cartagena",
      estado: "no",
    },
    {
      codigo: "300",
      condicion: "CULTURA DE LA AUTOEVALUACIÓN",
      ciudad: "Cartagena",
      estado: "no",
    },
    {
      codigo: "400",
      condicion: "PROGRAMA DE EGRESADOS",
      ciudad: "Cartagena",
      estado: "no",
    },
    {
      codigo: "500",
      condicion: "MODELO DE BIENESTAR",
      ciudad: "Cartagena",
      estado: "no",
    },
    {
      codigo: "600",
      condicion:
        "RECURSOS SUFICIENTES PARA GARANTIZAR EL CUMPLIMIENTO DE LAS METAS",
      ciudad: "Cartagena",
      estado: "no",
    },
  ];
 

  const condicionesProgramas =[
    {
      codigo:'100',
      condicion:'CONDICIÓN DE DENOMINACIÓN', 
      estado:'no',
      programa:'Medicina',
    },
    {
      codigo:'200',  
      condicion:'CONDICIÓN DE JUSTIFICACIÓN', 
      estado:'no',
      programa:'Bacteriología',  
    },
    {
      codigo:'300',  
      condicion:'CONDICIÓN DE ASPECTOS CURRICULARES', 
      numero:'Condición 3',
      estado:'no',
      programa:'Enfermería',
    },
    {
      codigo:'400',  
      condicion:'CONDICIÓN ORGANIZACIÓN DE ACTIVIDADES ACADEMICAS Y PROCESO FORMATIVO', 
      estado:'no',
      programa:'Mecánica dental',
      
    },
    {
      codigo:'500',  
      condicion:'CONDICIÓN DE INVESTIGACIÓN, INNOVACIÓN Y/O CREACIÓN ARTÍSTICA Y CULTURAL',   
      estado:'no',
      programa:'Odontología',
    },
    {
      codigo:'600',  
      condicion:'CONDICIÓN RELACIÓN CON EL SECTOR EXTERNO', 
      estado:'no',
      programa:'Sistemas',
      },
    {
      codigo:'700',  
      condicion:'PROFESORES', 
      estado:'no',
      programa:'Derecho',
   },
    {
      codigo:'800',  
      condicion:'MEDIOS EDUCATIVOS', 
      estado:'no',
      programa:'Adminstración',
      },
    {
      codigo:'900',  
      condicion:'INFRAESTRUTURA FISICA Y TECNOLOGICA', 
      estado:'no',
      programa:'Contaduría',
    },
    
  
  ];


  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState('1');

  // Toggle active state for Tab
  const toggle = (tab: any) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  }




  return (
    <div className="condiciones-container">
      <Header/>
      <div className="container pt-5">
      <GoBackButton />




        <div className="mt-2 py-2 container-body-condiciones " id="container">
          <div className="content-1">

            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active:
                      currentActiveTab === '1'
                  })}
                  onClick={() => { toggle('1'); }}
                >
                  <div className="institucionales  d-flex flex-column p-3  button align-items-center" id="institucionales">
                    <span className="icon">
                      <Box />
                    </span>
                    <div className="title">Institucionales</div>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active:
                      currentActiveTab === '2'
                  })}
                  onClick={() => { toggle('2'); }}
                >
                  <div className="programas d-flex flex-column  p-3 align-items-center button" id="programas">
                    <span className="icon">
                      <Flag />
                    </span>
                    <div className="title">Programas</div>
                  </div>
                </NavLink>
              </NavItem>
            </Nav>
            
            <TabContent activeTab={currentActiveTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    <table className="table table-striped border mt-4">
                      <thead>
                        <tr>
                          <th className="text-center">Codigo</th>
                          <th>Nombre</th>
                          <th>Ultima modificacion</th>
                          <th>Sede</th>
                          <th>Estado</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {condiciones.map((item) => (
                          <tr>
                            <td className="text-center">{item.codigo}</td>
                            <td>{item.condicion}</td>
                            <td>00/00/0000 a las 00:00</td>
                            <td>{item.ciudad}</td>
                            <td>{item.estado !== 'no' ? 'Verificado' : 'Pendiente'}</td>
                            <td>
                              <Link to={'/condiciones/detalles/'+item.ciudad+'/'+item.codigo}>ver</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    <table className="table table-striped border mt-4">
                      <thead>
                        <tr>
                          <th className="text-center">Codigo</th>
                          <th>Nombre</th>
                          <th>Ultima modificacion</th>
                          <th>Sede</th>
                          <th>Estado</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                      {condicionesProgramas.map((item) => (
                          <tr>
                            <td className="text-center">{item.codigo}</td>
                            <td>{item.condicion}</td>
                            <td>00/00/0000 a las 00:00</td>
                            <td>{item.programa}</td>
                            <td>{item.estado !== 'no' ? 'Verificado' : 'Pendiente'}</td>
                            <td>
                              <Link to="">ver</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </TabPane>

            </TabContent>



          </div>
          <div className="content-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Conditions;
