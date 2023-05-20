import Avatar from './Avatar';
import Menu from './Menu';
import logo from './../../images/logo-master-w.svg';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { Bell, QuestionCircle } from '../Icons';
import { UncontrolledTooltip } from 'reactstrap';

export const Header = ({ titulo = "Master U" }: { titulo?: string }) => {
  const navigate = useNavigate();

  const goToHome = () => navigate("/")

  return (
    <div className="header py-3">
      <div className="container-fluid container-xxxl text-white">
        <div className='d-flex justify-content-between gap-3 align-items-center'>
          <div className='fs-3 d-flex align-items-end justify-content-center gap-4 cursor-pointer flex-grow-1' onClick={goToHome}>
            <img alt='MasterU' src={logo} height={52} />
            <span className='d-block text-nowrap title text-light'>{titulo}</span>
          </div>
          <UncontrolledTooltip target={`notifyicon`}>Notificaciones</UncontrolledTooltip>
          <div className='hover-shadow-sm hover-scale-up' id="notifyicon">
            <Bell size={24} />
          </div>
          <UncontrolledTooltip target={`helpicon`}>Ayuda</UncontrolledTooltip>
          <div className='hover-shadow-sm hover-scale-up' id="helpicon">
            <a target="_blank" className='text-white' href="https://sites.google.com/curn.edu.co/masterhelp">
              <QuestionCircle size={24} />
            </a>
          </div>
          <div className='ms-3 d-flex align-items-center'>
            <Menu>
              <Avatar />
            </Menu>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header;