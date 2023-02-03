import Avatar from './Avatar';
import './header.css';
import Menu from './Menu';

// export const Header = ({ titulo = "SEGUIMIENTO A CONDICIONES DE CALIDAD" }: { titulo?: string }) => {
export const Header = ({ titulo = "SEGUIMIENTO Y CONTROL DE PROCESOS" }: { titulo?: string }) => {

  return (
    <div className="header py-4">

      <div className="container text-white">
        <div className='d-flex justify-content-between'>
          <div className='fs-3'>{titulo}</div>
          <div className='ms-3 d-flex align-items-center'>
            <Menu>
              <Avatar />
            </Menu>
            {/* <button onClick={confirmLogout} className='btn rounded-pill btn-light btn-sm px-4 py-2 fw-bold'>Salir</button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header;