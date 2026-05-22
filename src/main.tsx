import ReactDOM from 'react-dom/client';
import ErrorHandler from './components/ErrorHandler/ErrorComponent';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './styles/index.scss';
import { Toaster } from 'react-hot-toast';
import { axiosInstance } from './services/axiosService';
import Loader from './components/Loader';
import { StrictMode } from 'react';

if (window._NGconfig.maintenance_url) {
  axiosInstance(window._NGconfig.maintenance_url)
    .then(resp => {
      if (!!(resp) && typeof resp === 'string') {
        window.location.href = resp;
      }
    }).catch()
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ErrorHandler>
        <Toaster />
        <Loader />
        <App />
      </ErrorHandler>
    </Provider>
  </StrictMode>
);
