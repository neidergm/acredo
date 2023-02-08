import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import FallbackComponen1 from './components/Loader/FallbackComponen1';
import lazyLoaderComponents from './services/lazyLoadingService';
import Header from './components/Header';
import { useAppSelector } from './hooks/useAppSelector';
import './App.css';
import { CloseButton, Toast, ToastBody } from 'reactstrap';
import { useAppDispatch } from './hooks/useAppDispatch';
import { setUnauthorized } from './store/actions/userActions';

const Login = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Login" */ './screens/Login')));
const Conditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Conditions" */ './screens/Conditions')));
const IntitutionalConditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "IntitutionalConditions" */ './screens/Conditions/Details')));
const Convocatories = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Process" */ './screens/Process')));
const ProgramsConditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "ProgramsConditions" */ './screens/Conditions/Programs')));

type T_Props = {}

const App = ({ }: T_Props) => {

  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  if (!!(user.unauthorized) || !(user.userInfo)) {
    return <Suspense fallback={<FallbackComponen1 />}>
      {user.unauthorized &&
        <div className='position-absolute w-100'>
          <Toast className='border-0 bg-danger text-white my-4 mx-auto'>
            <ToastBody className='d-flex justify-content-between'>
              <div>{user.unauthorized}</div>
              <div><CloseButton variant='white' onClick={() => { dispatch(setUnauthorized("")) }} /></div>
            </ToastBody>
          </Toast>
        </div>
      }
      <Login />
    </Suspense>
  }

  return (
    <div className="layout">
      <Header />
      <main className="main">
        {/* <FallbackComponen1 /> */}
        <Router>
          <Suspense fallback={<FallbackComponen1 />}>
            <Routes >
              <Route path='/' element={<Convocatories />} />
              <Route path='/condiciones/programa/:id_cond' element={<ProgramsConditions />} />
              <Route path='/condiciones/detalles/:id_cond' element={<IntitutionalConditions />} />
              <Route path='/condiciones/:id_Process' element={<Conditions />} />
              <Route path='*' element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </Router>
      </main>
    </div>
  );
}

export default App;
