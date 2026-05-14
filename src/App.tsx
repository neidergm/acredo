import { lazy, Suspense, type ReactElement } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import FallbackComponent from './components/Loader/FallbackComponent';
import Header from './components/Header';
import { useAppSelector } from './hooks/useAppSelector';
import { CloseButton, Toast } from 'react-bootstrap';
import { useAppDispatch } from './hooks/useAppDispatch';
import { setUnauthorized } from './store/slices/userSlice';
import Footer from './components/Footer';
import { isAdmin, isSupervisor } from './utils/userRolUtils';

import '@fontsource-variable/dm-sans';
import '@fontsource-variable/inter';

const Login = lazy(() => import('./screens/Login'));
const Conditions = lazy(() => import('./screens/Conditions'));
const InstitutionalConditions = lazy(() => import('./screens/Conditions/Details'));
const Process = lazy(() => import('./screens/Process'));
const PhasesAttachments = lazy(() => import('./screens/PhasesAttachments'));
const Notifications = lazy(() => import('./screens/Notifications'));
const Dashboard = lazy(() => import('./screens/Dashboard'));
const UsersManagement = lazy(() => import('./screens/UsersManagement'));
const Programs = lazy(() => import('./screens/Programs'));
const ProgramDetails = lazy(() => import('./screens/Programs/Details'));
const Theme = lazy(() => import('./screens/Theme'));

const RequireAdmin = ({ children }: { children: ReactElement }) => {
  const rol = useAppSelector(state => state.user.userInfo?.rol);
  return isAdmin(rol) || isSupervisor(rol) ? children : <Navigate to="/proceso" replace />;
};

const App = () => {

  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  if (!!(user.unauthorized) || !(user.userInfo)) {
    return <Suspense fallback={<FallbackComponent />}>
      {user.unauthorized &&
        <div className='position-absolute w-100' style={{ zIndex: 1 }}>
          <Toast className='border-0 bg-danger text-white my-4 mx-auto'>
            <Toast.Body className='d-flex justify-content-between'>
              <div>{user.unauthorized}</div>
              <div><CloseButton variant='white' onClick={() => { dispatch(setUnauthorized()) }} /></div>
            </Toast.Body>
          </Toast>
        </div>
      }
      <Login />
    </Suspense>
  }

  return (
    <div className="layout">
      <Router>
        <header className='header'><Header /></header>
        <main className="main">
          <Suspense fallback={<FallbackComponent />}>
            <Routes>
              <Route index element={<RequireAdmin><Dashboard /></RequireAdmin>} />
              <Route path='/proceso'>
                <Route index element={<Process />} />
                <Route path='fases/anexos/:id_phase' element={<PhasesAttachments />} />
                <Route path=':id_process/:id_cond' element={<InstitutionalConditions />} />
                <Route path=':id_process' element={<Conditions />} />
              </Route>
              <Route path='/notificaciones' element={<Notifications />} />
              <Route path='/theming' element={<Theme />} />
              <Route path='/usuarios' element={<RequireAdmin><UsersManagement /></RequireAdmin>} />
              <Route path='/programa'>
                <Route index element={<RequireAdmin><Programs /></RequireAdmin>} />
                <Route path=':id_program' element={<ProgramDetails />} />
              </Route>
              <Route path='*' element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
        <footer className='border-top'><Footer className='text-muted small' /></footer>
      </Router>
    </div>
  );
}

export default App;
