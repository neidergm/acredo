/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useParams, Link, Routes, Route, useNavigate } from "react-router-dom";
import { IName } from "../../components/Icons";

const Conditions = () => {
  const navigate = useNavigate();
  const { city } = useParams();

  //lista
  function listas() {
    var condiciones = [
      {
        codigo: "100",
        condicion:
          "MECANISMOS DE SELECCIÓN Y EVALUACIÓN DE ESTUDIANTES Y PROFESORES",
      },
      {
        codigo: "200",
        condicion: "ESTRUCTURA ADMINISTRATIVA Y ACADEMICA",
      },
      {
        codigo: "300",
        condicion: "CULTURA DE LA AUTOEVALUACIÓN",
      },
      {
        codigo: "400",
        condicion: "PROGRAMA DE EGRESADOS",
      },
      {
        codigo: "500",
        condicion: "MODELO DE BIENESTAR",
      },
      {
        codigo: "600",
        condicion:
          "RECURSOS SUFICIENTES PARA GARANTIZAR EL CUMPLIMIENTO DE LAS METAS",
      },
    ];
    const lista = condiciones.map((item) => (
      <li>
        <Link to={`/condiciones/detalles/${item.codigo}`}>
          {item.condicion}
        </Link>
      </li>
    ));
    return <ul>{lista}</ul>;
  }

  return (
    <div className="condiciones-container">
      <div className="header p-4 border condiciones-header">
        <div className="title  fs-3 text-white">
          <div className="container">Condiciones {city}</div>
        </div>
      </div>

      <div className="container">
        <button
          className="btn back btn-secondary  mt-2 rounded"
          onClick={() => navigate(-1)}
        >
          <IName size={20} /> Atras
        </button>

        <div className="condiciones-list mt-4 bg-white p-4 shadow">
          {listas()}
        </div>
      </div>
    </div>
  );
};

export default Conditions;
