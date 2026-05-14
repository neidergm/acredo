import Avatar from './Avatar';
import Menu from './Menu';
import { NavLink, useNavigate } from 'react-router';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useGetNotificationsReportQuery } from '../../services/api/notifications.api';
import { isAdmin, isSupervisor } from '../../utils/userRolUtils';
import { APP_HELP_LINK } from '../../services/constantsService';
import { LuBell, LuCircleHelp, LuHouse } from 'react-icons/lu';
import { Stack } from 'react-bootstrap';

const logo = '/images/logos/logo-header.svg';
const logo_wordmark = '/images/logos/logo-header-wordmark-dark.png';

const activeClassName = "text-primary";

export const Header = () => {

  const user = useAppSelector(s => s.user.userInfo);
  const { data: unreadCount = 0 } = useGetNotificationsReportQuery(undefined, {
    skip: !user,
  });

  const is_admin = isAdmin(user?.rol) || isSupervisor(user?.rol)
  const navigate = useNavigate();

  const goToHome = () => navigate("/");


  // !TODO: en vez de hardcodear "Notificaciones" acá, el Header podría recibir el nombre de la sección a través de contexto o props. De esta forma, el Header sería un componente más reusable y no tan acoplado a esta sección específica. Por ahora lo dejo así para no complicar demasiado el PR, pero es una mejora a considerar para el futuro.
  const currentPathName = "Notificaciones";

  return (
    <div className="py-1 bg-dark">
      <div className="container-fluid container-xxxl d-flex align-items-center gap-3 py-1">
        <a onClick={goToHome} role="button">
          <picture>
            <source srcSet={logo_wordmark} media="(min-width: 576px)" />
            <img alt='LogoHeader' src={logo} height={52} />
          </picture>
        </a>

        <div className="vr bg-light align-self-center" style={{height: "30px"}} />

        <span className="small text-secondary">{currentPathName}</span>

        <Stack direction='horizontal' className='ms-auto text-center small gap-5'>
          <NavLink to={is_admin ? "/" : "/proceso"} className={({ isActive }) => isActive ? activeClassName : ''}>
            <LuHouse size={20} />
            <span className='d-block small mt-1 lh-1'>Inicio</span>
          </NavLink>
          <NavLink to="/notificaciones" className={({ isActive }) => isActive ? activeClassName : ''}>
            <span className="position-relative">
              <LuBell size={20} />
              {unreadCount !== 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge py-0 px-1 rounded-pill bg-danger" >
                  <span className='lh-base '>
                  {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                </span>
              )}
            </span>
            <span className='d-block small mt-1 lh-1'>Notificaciones</span>
          </NavLink>
          <a target="_blank" rel="noreferrer" href={APP_HELP_LINK}>
            <LuCircleHelp size={20} />
            <span className='d-block small mt-1 lh-1'>Ayuda</span>
          </a>
         
          <Menu>
            <Avatar />
          </Menu>
        </Stack>
      </div>
    </div>
  )
}

export default Header;
