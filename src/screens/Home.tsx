/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import Modal, { I_ModalContentProps } from "../components/Modal";
import {
    BrowserRouter as Router, Route, Link  } from "react-router-dom";

const Home = () => {
    const [modalData, setModalData] = useState<null | I_ModalContentProps>(null);

    const successCallback = () => {
        setModalData((d) => ({ title: "hola2", ...d! }))

    }

    return (
        <div>
            Esta página va a contener las agrupaciones de las condiciones
            <ul>
                <li><Link to="/condiciones/Cartagena">Cartagena</Link></li>
                <li><Link to="/condiciones/Barranquilla">Barranquilla</Link></li>
                <li><Link to="/condiciones/Programas">Programas</Link></li>
                </ul>

        </div>
    )
}

export default Home;
