/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useParams, Link, Routes, Route, useNavigate } from "react-router-dom";
import { IName, Flag, Box } from "../../components/Icons";

const Conditions = () => {
  const navigate = useNavigate();

  const condiciones = [
    {
      //Barranquilla
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

    //Cartagena
    {
      codigo: "100",
      condicion:
        "MECANISMOS DE SELECCIÓN Y EVALUACIÓN DE ESTUDIANTES Y PROFESORES",
      numero: "Condición 1",
      informacion:
        "Ingrese la información en la que desarrolla de manera integral y particular lo solicitado por la normativa vigente, de acuerdo con lo señalado en el artículo 2.5.3.2.3.1.2 del Decreto 1075 de 2015, modificado por el Decreto 1330 de 2019 y los artículos 6 al 18 de la Resolución 15224 del 2022.",
      ciudad: "cartagena",
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
      ciudad: "cartagena",
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
      ciudad: "cartagena",
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
      ciudad: "cartagena",
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
      ciudad: "cartagena",
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
      ciudad: "cartagena",
      estado: "no",
      respuesta: "",
      fecha: new Date("2022-03-04T00:00:00"),
      control: true,
    },
  ];
  const programas = [
    "Medicina",
    "Bacteriología",
    "Enfermería",
    "Mecánica dental",
    "Odontología",
    "Sistemas",
    "Derecho",
    "Administración",
    "Contaduría",
  ];
  document.getElementById('institucionales')?.addEventListener('click',()=>{
    console.log('click')
    document.getElementById('container')?.classList.remove('active');
    document.getElementById('programas')?.classList.remove('btn-active')
    document.getElementById('institucionales')?.classList.add('btn-active')
    document.querySelector('.item')?.classList.remove('move-item');

  })

  
  document.getElementById('programas')?.addEventListener('click',()=>{
    document.getElementById('container')?.classList.add('active');
    document.getElementById('institucionales')?.classList.remove('btn-active')
    document.getElementById('programas')?.classList.add('btn-active')
    document.querySelector('.item')?.classList.add('move-item');
  })


  return(
    <div className="condiciones-container">
      <div className="header p-4 border condiciones-header">
        <div className="title  fs-3 text-white">
          <div className="container">CONDICIONES</div>
        </div>
      </div>

      <div className="container">
        <button
          className="btn back btn-secondary  mt-2 rounded"
          onClick={() => navigate(-1)}
        >
          <IName size={20} /> Atras
        </button>

        <div className="nav container-nav position-relative mt-2 d-flex">
          <div className="institucionales btn-active  d-flex flex-column p-3  button align-items-center" id="institucionales">
            <span className="icon">
              <Box />
            </span>
            <div className="title">Institucionales</div>
          </div>
          <div className="programas d-flex flex-column p-3 align-items-center button" id="programas">
            <span className="icon">
              <Flag />
            </span>
            <div className="title">Programas</div>
          </div>
          <div className="item"></div>
        </div>

        <div className="mt-2 py-5 container-body-condiciones "  id="container">
          <div className="content-1">
            <table className="table table-striped border">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nombre</th>
                  <th>Ultima modificacion</th>
                  <th>Sede/Programa</th>
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
                    <td>{item.estado}</td>
                    <td>
                      <Link to="">ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="content-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Conditions;
