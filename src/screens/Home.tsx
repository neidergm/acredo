import { useState } from 'react';
import Modal, { I_ModalContentProps } from "../components/Modal";

const Home = () => {
    const [modalData, setModalData] = useState<null | I_ModalContentProps>(null);

    const successCallback = () => {
        setModalData((d) => ({ title: "hola2", ...d! }))

    }

    return (
        <div>
            Esta página va a contener las agrupaciones de las condiciones
            <ul>
                <li>Cartagena</li>
                <li>Barranquilla</li>
                <li>Programas</li>
            </ul>

        </div>
    )
}

export default Home;
