/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import { useParams, Link, Routes, Route, useNavigate } from "react-router-dom";
import { GoBackButton } from "../components/GoBackButton";
import { SubHeader } from "../components/SubHeader";

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
      <div className="header p-4 ">
        <div className="title fs-3 text-white">
          <div className="container">CONVOCATORIAS</div>
        </div>
      </div>
      <SubHeader text="Convocatorias" showBackButton/>
      <div className="body-convocatorias container pt-4">
        {/* se mapea el contenido y se generan las cards */}
        {convocatorias.map((convocatoria) => (
          <Link to="/condiciones">
            <div className=" p-2 conv-card px-5 my-2 d-flex flex-row justify-content-between">
              <div className="nombre d-flex flex-column">

                {/* Nombre*/}
                <b>
                  <span>Nombre:</span>
                </b>
                <span>{convocatoria.nombre}</span>
              </div>
              <div className="nombre d-flex flex-column">
                {/* Fecha*/}
                <b>
                  <span>Fecha:</span>
                </b>
                <span>{convocatoria.fecha}</span>
              </div>
              <div className="nombre d-flex flex-column">
                {/* Tipo*/}
                <b>
                  <span>Tipo:</span>
                </b>
                <span>{convocatoria.tipo}</span>
              </div>
              <div className="nombre d-flex flex-column">
                {/* Estado*/}
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
