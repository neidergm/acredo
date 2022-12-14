import { useState } from 'react';
import localStorageService from '../../services/localStorageService';
import Alert, { I_AlertObject } from '../Alert';
import './header.css'

export const Header = ({ titulo = "CONDICIONES DE CALIDAD" }: { titulo?: string }) => {

  const [_alert, setAlert] = useState<null | I_AlertObject>(null);

  const logout = () => {

    setAlert({
      isOpen: true,
      title: "¿Desea cerrar la sesión?",
      type: "question",
      submitButton: {
        value: "Sí, cerrar",
        onClick: () => {
          localStorageService.deleteItems(["user", "token"]);
          window.location.reload();
        }
      },
      closeButton: { value: "No, cancelar" }
    })
  }

  return (
    <div className="header p-4  condiciones-header">
      <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} />

      <div className="title  fs-3 text-white">
        <div className="container">
          <div className='d-flex justify-content-between'>
            {titulo}
            <button onClick={logout} className='btn rounded-pill btn-light btn-sm px-4 fw-bold'>Salir</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header;