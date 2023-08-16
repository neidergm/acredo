import { useEffect } from 'react';
import Avatar from './Avatar';
import Menu from './Menu';
import logo from './../../images/logo-master-w.svg';
import './header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, BellFill, HouseGear, QuestionCircle } from '../Icons';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getNotificationsReport } from '../../store/actions/notificationsActions';
import { isAdmin, isSupervisor } from '../../utils/userRolUtils';

export const Header = ({ titulo = "Master U" }: { titulo?: string }) => {

  const unreadCount = useAppSelector(s => s.notifications.unreadCount);
  const user = useAppSelector(s => s.user.userInfo);

  const is_admin = isAdmin(user?.rol) || isSupervisor(user?.rol)
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const goToHome = () => navigate("/");

  useEffect(() => {
    dispatch(getNotificationsReport())
  }, [])

  return (
    <div className="header py-3">
      <div className="container-fluid container-xxxl text-white">
        <div className='d-flex justify-content-between gap-4 align-items-center'>
          <div className='fs-3 d-flex flex-grow-1'>
            <div onClick={goToHome} className='gap-4 d-flex align-items-end justify-content-md-center cursor-pointer mx-md-auto'>
              <img alt='MasterU' src={logo} height={52} />
              <span className='text-nowrap title text-light d-none d-sm-block'>{titulo}</span>
            </div>
          </div>
          <NavLink to={is_admin ? "/" : "/proceso"} className={({ isActive }) => isActive ? `active` : ""} >
            <div className='hover-scale-up position-relative text-center text-white'>
              <HouseGear size={24} />
              <small className='small d-block'>Inicio</small>
            </div>
          </NavLink>
          <NavLink to={"/notificaciones"} className={({ isActive }) => isActive ? `active` : ""} >
            <div className='hover-scale-up position-relative text-center text-white'>
              {unreadCount === 0 ? <Bell size={24} /> : <BellFill size={24} />}
              {unreadCount !== 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                <small>{unreadCount > 99 ? "99+" : unreadCount}</small>
              </span>}
              <small className='small d-block'>Notificaciones</small>
            </div>
          </NavLink>
          <a target="_blank" className='hover-shadow-sm text-white' href="https://sites.google.com/curn.edu.co/masterhelp">
            <div className='hover-scale-up text-center'>
              <QuestionCircle size={24} />
              <small className='small d-block'>Ayuda</small>
            </div>
          </a>
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