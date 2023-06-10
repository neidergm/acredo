import ReactDOM from 'react-dom/client';
import ErrorHandler from './components/ErrorHandler';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';

declare global {
  interface Window {
    location: Location;
    [x: string]: any;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ErrorHandler>
      <Toaster />
      <App />
    </ErrorHandler>
  </Provider>
  // </React.StrictMode>
);
