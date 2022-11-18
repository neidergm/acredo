import { useState } from 'react';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import Modal, { I_ModalContentProps } from "../components/Modal";

const Home = () => {
    const [modalData, setModalData] = useState<null | I_ModalContentProps>(null);
    const [loader, setLoader] = useState<undefined | string>(undefined);

    const successAction = (toggle: Function) => {
        setLoader("Cargando");
        setTimeout(() => { setLoader(undefined); toggle(); }, 2000)
    }

    return (
        <div>
            Esta página va a contener las agrupaciones de las condiciones
            <ul>
                <li>Cartagena</li>
                <li>Barranquilla</li>
                <li>Programas</li>
            </ul>

            <button onClick={() => setModalData({
                title: "hola",
                closeButton: {},
                submitButton: {
                    color: "success",
                    onClick: (t) => { t() }
                },
                children: "lorem",
            })}>Open Modal</button>


            <Modal
                onClosed={() => setModalData(null)}
                isOpen={!!(modalData)}
                {...modalData as I_ModalContentProps}
            />
            <Loader isOpen={!!(loader)}
                title={"Title"}
                subtitle={loader}
            />

        </div>
    )
}

export default Home;
