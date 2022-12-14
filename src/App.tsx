import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import FallbackComponen1 from './components/Loader/FallbackComponen1';
import lazyLoaderComponents from './services/lazyLoadingService';
import Header from './components/Header';
import './App.css';
import { I_User } from './interfaces/user.interface';
import localStorageService from './services/localStorageService';

const Login = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Login" */ './screens/Login')));
const Conditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Conditions" */ './screens/Conditions')));
const IntitutionlConditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "ConditionsIntitutional" */ './screens/Conditions/Details')));
const Convocatories = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Convocatories" */ './screens/Convocatories')));
const ProgramsConditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "ConditionsIntitutional" */ './screens/Conditions/Programs')));

type T_Props = {}

const App = ({ }: T_Props) => {

  const [user, setUser] = useState<"null" | I_User>()

  useEffect(() => {
    setUser(localStorageService.getItem("user"));
  }, [])

  const login = (user: I_User, token: string) => {
    localStorageService.setItem("user", user);
    localStorageService.setItem("token", token);

    window.location.reload();
  }

  if (user === undefined) {
    return null;
  }

  if (user === "null") {
    return <Suspense fallback={<FallbackComponen1 />}>
      <Login callback={login} />
    </Suspense>
  }

  return (
    <div className="layout">
      <Header />
      <main className="main">
        <Suspense fallback={<FallbackComponen1 />}>
          <Router>
            <Routes >
              <Route path='/' element={<Convocatories />} />
              <Route path='/condiciones/programa/:id_cond' element={<ProgramsConditions />} />
              <Route path='/condiciones/detalles/:id_cond' element={<IntitutionlConditions />} />
              <Route path='/condiciones/:id_convocatory' element={<Conditions />} />
              <Route path='*' element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
