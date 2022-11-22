import { useState } from 'react';
import Alert from '../components/Alert';
import Loader from '../components/Loader';

const Home = () => {
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


        </div>
    )
}

export default Home;
