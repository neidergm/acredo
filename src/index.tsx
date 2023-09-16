import ReactDOM from 'react-dom/client';
import ErrorHandler from './components/ErrorHandler';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';
import { AXIOS_REQUEST } from './services/axiosService';
import Loader from './components/Loader';

declare global {
  interface Window {
    location: Location;
    [x: string]: any;
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
