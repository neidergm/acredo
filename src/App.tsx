import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import FallbackComponen1 from './components/Loader/FallbackComponen1';
import lazyLoaderComponents from './services/lazyLoadingService';
import Header from './components/Header';
import './App.css';

const Conditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Conditions" */ './screens/Conditions')));
const ConditionsDetails = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "ConditionsDetails" */ './screens/Conditions/Details')));
const Convocatorias = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Convocatories" */ './screens/Convocatories')));

type T_Props = {}

const App = ({ }: T_Props) => {
  return (
    <div className="layout">
      <Header />
      <main className="main">
        <Suspense fallback={<FallbackComponen1 />}>
          <Router>
            <Routes >
              <Route path='/' element={<Convocatorias />} />
              <Route path='/condiciones/:dependency' element={<Conditions />} />
              <Route path='/condiciones/detalles/:id_cond' element={<ConditionsDetails />} />
              <Route path='*' element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
