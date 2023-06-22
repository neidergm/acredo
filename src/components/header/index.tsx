import { useEffect } from 'react';
import Avatar from './Avatar';
import Menu from './Menu';
import logo from './../../images/logo-master-w.svg';
import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, BellFill, QuestionCircle } from '../Icons';
import { UncontrolledTooltip } from 'reactstrap';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getNotificationsReport } from '../../store/actions/notificationsActions';

export const Header = ({ titulo = "Master U" }: { titulo?: string }) => {

  const unreadCount = useAppSelector(s => s.notifications.unreadCount);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const goToHome = () => navigate("/");

  useEffect(() => {
    dispatch(getNotificationsReport())
  }, [])


  return (
    <div className="header py-3">
      <div className="container-fluid container-xxxl text-white">
        <div className='d-flex justify-content-between gap-3 align-items-center'>
          <div className='fs-3 d-flex align-items-end justify-content-center gap-4 cursor-pointer flex-grow-1' onClick={goToHome}>
            <img alt='MasterU' src={logo} height={52} />
            <span className='d-block text-nowrap title text-light'>{titulo}</span>
          </div>
          <UncontrolledTooltip target={`notifyicon`}>Notificaciones</UncontrolledTooltip>
          <div className='hover-shadow-sm hover-scale-up position-relative' id="notifyicon" >
            <Link to={"/notificaciones"} className='text-white'>
              {unreadCount === 0 ? <Bell size={24} /> : <BellFill size={24} />}
              {unreadCount !== 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                <small>{unreadCount > 99 ? "99+" : unreadCount}</small>
              </span>}
            </Link>
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