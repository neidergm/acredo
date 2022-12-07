import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import FallbackComponen1 from './components/Loader/FallbackComponen1';
import lazyLoaderComponents from './services/lazyLoadingService';
import Header from './components/Header';
import './App.css';

const Conditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Conditions" */ './screens/Conditions')));
const IntitutionlConditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "ConditionsIntitutional" */ './screens/Conditions/Details')));
const Convocatories = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Convocatories" */ './screens/Convocatories')));
const ProgramsConditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "ConditionsIntitutional" */ './screens/Conditions/Programs')));

type T_Props = {}

const App = ({ }: T_Props) => {
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
