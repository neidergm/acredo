/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Modal, { I_ModalContentProps } from "../components/Modal";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Home = () => {
  const [modalData, setModalData] = useState<null | I_ModalContentProps>(null);

  const successCallback = () => {
    setModalData((d) => ({ title: "hola2", ...d! }));
  };

  return (
    <div className="home-condiciones-container">
      <div>
        <div className="header p-4 border home-condiciones-header">
          <div className="container">
            <div className="title fw-bold fs-3 text-white">Condiciones</div>
          </div>
        </div>
      </div>
      <div className="container mt-4 home-content p-4">
        <div className="cards d-flex justify-content-around fs-6">
          <Link to="/condiciones/Cartagena" className="card pt-3 shadow  ">
            <p className="mb-4 fw-bold text-secondary">Cartagena</p>
            <div className="card-body pt-5 border d-flex justify-content-center align-items-center">Condiciones institucionales de calidad de la ciudad de cartagena</div>
          </Link>
          <Link to="/condiciones/Barranquilla" className="card pt-3 shadow">
          <p className="mb-4 fw-bold text-secondary">Barranquilla</p>

            <div className="card-body pt-5 border d-flex justify-content-center align-items-center">Condiciones institucionales de calidad de la ciudad de barranquilla</div>
          </Link>
          <Link to="/condiciones/Programas" className="card pt-3 shadow">
          <p className="mb-4 fw-bold text-secondary">Programas</p>

            <div className="card-body pt-5 border d-flex justify-content-center align-items-center"> Condiciones de programas</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
