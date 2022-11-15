/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, Link, Routes, Route, useNavigate } from "react-router-dom";
import { IName } from "../../components/Icons";

const ConditionsDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const condiciones = [
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
  ];

  return (
    <div className="container-details">
      {condiciones
        .filter((condicion) => condicion.codigo === id)
        .map((condiciones) => (
          <div className="contenedor-filter">
            <div className="header p-4 border condiciones-header">
              <div className="title fs-3 text-white">
                <div className="container">
                  {condiciones.condicion.toLowerCase()}
                </div>
              </div>
            </div>
            <div className="container">
              <button
                className="btn back btn-secondary mt-2 rounded"
                onClick={() => navigate(-1)}
              >
                <IName size={20} /> Atras
              </button>

              <div className="condiciones-list mt-4 bg-white p-4 shadow">
                <b>{condiciones.condicion}</b> <br />
                <p className="info-condicion">{condiciones.informacion}</p>
                <p className="info-condicion">
                  Ciudad: <b className="">{condiciones.ciudad}</b>
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ConditionsDetails;
