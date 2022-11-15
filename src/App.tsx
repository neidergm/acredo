/* eslint-disable no-empty-pattern */
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import FallbackComponen1 from './components/Loader/FallbackComponen1';
import lazyLoaderComponents from './services/lazyLoadingService';

const Home = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "HomeScreen" */ './screens/Home')));
const Conditions = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "Conditions" */ './screens/Conditions')));
const ConditionsDetails = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "ConditionsDetails" */ './screens/Conditions/Details')));

type T_Props = {}

const App = ({ }: T_Props) => {

  return (
    <div className="layout">
      <main className="main">
        <Suspense fallback={<FallbackComponen1 />}>
          <div>
            <Router>
              <Routes>
                <Route path='/inicio' element={<Home />} />
                <Route path='/condiciones/detalles/:id' element={<ConditionsDetails />} />
                <Route path='/condiciones/:city' element={<Conditions />} />
                <Route path='*' element={<Navigate to="/inicio" />} />
              </Routes>
            </Router>
          </div>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
