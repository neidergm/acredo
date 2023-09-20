import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import FallbackComponen1 from './components/Loader/FallbackComponen1';
import lazyLoaderComponents from './services/lazyLoadingService';
import Header from './components/Header';
import { useAppSelector } from './hooks/useAppSelector';
import { CloseButton, Toast, ToastBody } from 'reactstrap';
import { useAppDispatch } from './hooks/useAppDispatch';
import { setUnauthorized } from './store/slices/userSlice';
import Footer from './components/Footer';
import './App.css';
import './custom-colors.css';
import { isAdmin, isSupervisor } from './utils/userRolUtils';

const Login = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Login" */ './screens/Login')));
const Conditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Conditions" */ './screens/Conditions')));
const IntitutionalConditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "IntitutionalConditions" */ './screens/Conditions/Details')));
const Process = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Process" */ './screens/Process')));
const PhasesAttachments = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "PhasesAttachments" */ './screens/PhasesAttachments')));
const Notifications = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Notifications" */ './screens/Notifications')));
const Dashboard = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Dashboard" */ './screens/Dashboard')));
const UsersManagement = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "UsersManagement" */ './screens/UsersManagement')));
const Programs = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Programs" */ './screens/Programs')));
const ProgramDetails = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "ProgramDetails" */ './screens/Programs/Details')));

const screenAvalaible = (Comp: JSX.Element, userIsAdmin: boolean) => {
  if (userIsAdmin) {
    return Comp
  }
  return <Navigate to="/proceso" />
}

const App = () => {

  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const is_admin = isAdmin(user.userInfo?.rol) || isSupervisor(user.userInfo?.rol)

  if (!!(user.unauthorized) || !(user.userInfo)) {
    return <Suspense fallback={<FallbackComponen1 />}>
      {user.unauthorized &&
        <div className='position-absolute w-100' style={{ zIndex: 1 }}>
          <Toast className='border-0 bg-danger text-white my-4 mx-auto'>
            <ToastBody className='d-flex justify-content-between'>
              <div>{user.unauthorized}</div>
              <div><CloseButton variant='white' onClick={() => { dispatch(setUnauthorized()) }} /></div>
            </ToastBody>
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
          <Suspense fallback={<FallbackComponen1 />}>
            <Routes >
              <Route path='/' element={screenAvalaible(<Dashboard />, is_admin)} />
              <Route path='/proceso' element={<Process />} />
              <Route path='/proceso/:id_process/:id_cond' element={<IntitutionalConditions />} />
              <Route path='/proceso/:id_process' element={<Conditions />} />
              <Route path='/proceso/fases/anexos/:id_phase' element={<PhasesAttachments />} />
              <Route path='/notificaciones' element={<Notifications />} />
              <Route path='/usuarios' element={screenAvalaible(<UsersManagement />, is_admin)} />
              <Route path='/programa/:id_program' element={<ProgramDetails />} />
              <Route path='/programa' element={screenAvalaible(<Programs />, is_admin)} />
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
