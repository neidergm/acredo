import ReactDOM from 'react-dom/client';
import ErrorHandler from './components/ErrorHandler';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

declare global {
  interface Window {
    location: Location;
    [x:string]: any;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <ErrorHandler>
      <App />
    </ErrorHandler>
  // </React.StrictMode>
);
