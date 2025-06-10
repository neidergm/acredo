import { useEffect } from 'react';
import Avatar from './Avatar';
import Menu from './Menu';
import './header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, BellFill, HouseGear, QuestionCircle } from '../Icons';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getNotificationsReport } from '../../store/slices/notificationsSlice';
import { isAdmin, isSupervisor } from '../../utils/userRolUtils';
import { APP_COLORS, APP_HELP_LINK, APP_TITLE } from '../../services/constantsService';

const logo = '/logo-header.svg';
export const Header = ({ titulo = APP_TITLE }: { titulo?: string }) => {

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
    <div className="header py-3" style={APP_COLORS?.header ? {
      background: APP_COLORS.header.background,
      "--header-item-color": APP_COLORS.header.color,
      color: APP_COLORS.header.color
    } as const as React.CSSProperties : undefined}
    >
      <div className="container-fluid container-xxxl">
        <div className='position-relative'>
          <div className='fs-3 brand d-flex justify-content-xl-center'>
            <div onClick={goToHome} className='gap-3 d-flex align-items-end cursor-pointer'>
              <img alt='MasterU' src={logo} height={52} />
              <span className='text-nowrap title d-none d-sm-block'>{titulo}</span>
            </div>
          </div>
          <div className='d-flex gap-3 gap-sm-4 justify-content-end ms-auto align-items-center navigation-items'>
            <NavLink to={is_admin ? "/" : "/proceso"} className={({ isActive }) => isActive ? `active` : ""} >
              <div className='hover-scale-up position-relative text-center'>
                <HouseGear size={24} />
                <small className='small d-block'>Inicio</small>
              </div>
            </NavLink>
            <NavLink to={"/notificaciones"} className={({ isActive }) => isActive ? `active` : ""} >
              <div className='hover-scale-up text-center'>
                <span className='position-relative'>
                  {unreadCount === 0 ? <Bell size={24} /> : <BellFill size={24} />}
                  {unreadCount !== 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    <small>{unreadCount > 99 ? "99+" : unreadCount}</small>
                  </span>}
                </span>
                <small className='small d-block'>Notificaciones</small>
              </div>
            </NavLink>
            <a target="_blank" className='hover-shadow-sm' href={APP_HELP_LINK} rel="noreferrer">
              <div className='hover-scale-up text-center'>
                <QuestionCircle size={24} />
                <small className='small d-block'>Ayuda</small>
              </div>
            </a>
            <div className='ms-lg-3 d-flex align-items-center'>
              <Menu>
                <Avatar />
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header;