import ReactDOM from 'react-dom/client';
import ErrorHandler from './components/ErrorHandler/ErrorComponent';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './styles/index.scss';
import { Toaster } from 'react-hot-toast';
import { AXIOS_REQUEST } from './services/axiosService';
import Loader from './components/Loader';

// Forma del config inyectado en runtime por public/_config.js antes del bundle.
type T_NGConfig = {
  app_title: string;
  app_help_link: string;
  app_colors: {
    login: { background: string; color: string };
    header: { background: string; color: string };
  };
  formation_type: string[];
  storage_prefix: string;
  api_base_url: string;
  error_reporting_url: string;
  google_client: {
    active: boolean;
    method_name: string;
    id: string;
    show_one_tap: boolean;
  };
  maintenance_url?: string;
};

declare global {
  interface Window {
    _NGconfig: T_NGConfig;
  }
}

console.log("%cADVERTENCIA: \nEsta es una función del navegador destinada a desarrolladores. \nSi intenta hacer algo aquí para habilitar alguna función o \"piratear\" caracteristicas del sitio, podrías perder el acceso al mismo."
  , "color:red;font-size:20px;background-color: yellow;font-weight: bold;");


!!(window._NGconfig.maintenance_url) && AXIOS_REQUEST(window._NGconfig.maintenance_url, 'get', null)
  .then(resp => {
    if (!!(resp) && typeof resp === 'string') {
      window.location.href = resp;
    }
  }).catch()



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ErrorHandler>
      <Toaster />
      <Loader />
      <App />
    </ErrorHandler>
  </Provider>
  // </React.StrictMode>
);
