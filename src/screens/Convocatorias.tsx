
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";

const convocatorias = [
  {
    nombre: "Convocatoria 1",
    fecha: "00/00/00",
    tipo: "1",
    estado: "true",
  },
  {
    nombre: "Convocatoria 2",
    fecha: "00/00/00",
    tipo: "1",
    estado: "true",
  },
  {
    nombre: "Convocatoria 3",
    fecha: "00/00/00",
    tipo: "1",
    estado: "true",
  },
  {
    nombre: "Convocatoria 4",
    fecha: "00/00/00",
    tipo: "1",
    estado: "true",
  },
  {
    nombre: "Convocatoria 5",
    fecha: "00/00/00",
    tipo: "1",
    estado: "true",
  },
  {
    nombre: "Convocatoria 6",
    fecha: "00/00/00",
    tipo: "1",
    estado: "true",
  },
];

const Convocatorias = () => {
  return (
    <div className="container-convocatorias">
      <Header/>

      <div className="body-convocatorias container pt-4">
        {convocatorias.map((convocatoria) => (
          <Link to="/condiciones">
            <div className=" py-3 conv-card card px-5  my-2 d-flex flex-row justify-content-between">
              <div className="nombre d-flex flex-column">

                <b>
                  <span>Nombre:</span>
                </b>
                <span>{convocatoria.nombre}</span>
              </div>
              <div className="nombre d-flex flex-column">
                <b>
                  <span>Fecha:</span>
                </b>
                <span>{convocatoria.fecha}</span>
              </div>
              <div className="nombre d-flex flex-column">
                <b>
                  <span>Tipo:</span>
                </b>
                <span>{convocatoria.tipo}</span>
              </div>
              <div className="nombre d-flex flex-column">
                <b>
                  <span>Estado:</span>
                </b>
                <span>{convocatoria.estado}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Convocatorias;
