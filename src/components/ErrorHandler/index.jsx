import { Component } from 'react';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { ERROR_REPORTING_URL } from '../../services/constantsService';
import localStorageService, { sessionStorageService } from '../../services/localStorageService';

let timerValue = 1;

export const sendReport = (_data, successCallback, errorCallback, progressCallback) => {
    if (!(/^http[s]?:\/\/localhost.*$/.test(window.location.href))) {
        _data.device = navigator.userAgent;

        let data = {
            app: window.document.title,
            msgerror: JSON.stringify(_data),
            user: localStorageService.getItem(`user`) || localStorageService.getItem(`token`) || "WITHOUT USER INFO"
        }

        let lr = sessionStorageService.getItem(`NG_lastReported`);
        let send = false;
        if (!lr) {
            send = true;
        } else {
            lr = new Date(Number(lr));
            let today = new Date();
            if (today.getMinutes() - lr.getMinutes() > 3 || lr.getDate() !== today.getDate()) {
                send = true;
            }
        }
        if (send) {
            return AXIOS_REQUEST(null, "post", data, ERROR_REPORTING_URL, progressCallback).then(() => {
                sessionStorageService.setItem(`NG_lastReported`, new Date().getTime())
                return successCallback?.()
            }).catch(err => {
                return errorCallback?.()
            })
        } else {
            return successCallback?.();
        }
    }
}

class ErrorHandler extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, timer: null, loading: null };
    }

    static getDerivedStateFromError(error) {
        // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto
        return { hasError: true };
    }

    reloadChildren = () => { window.location.reload() }

    componentDidCatch(error, errorInfo) {
        // Registrar el error en un servicio de reporte de errores
        // logErrorToMyService(error, errorInfo);

        console.log("========ERROR========");
        console.log({ error, errorInfo });
        console.log("=====================");
        if ((error?.message && /Loading [A-Z\s]*chunk [\d]+ failed/ig.test(error.message))
            || (error?.stack && /Loading [A-Z]*chunk [\d]+ failed/ig.test(error.stack))) {
            console.log("chunk failed");
            window.location.reload(true);
        } else {
            this.setState({ error, loading: 1 });

            let data = {
                error,
                stack: error.stack || "NG",
                errorInfo,
                path: window.location.href
            }

            sendReport(data, this.reloadWithTimer, this.reloadWithTimer, (progress) => {
                this.setState({ loading: Math.round((progress.loaded * 100) / progress.total) })
            })
        }
    }

    reloadWithTimer = () => {
        this.setState({ timer: timerValue, loading: null })
        let interval = setInterval(() => {
            if (this.state.timer > 0) {
                this.setState({ timer: this.state.timer - 1 })
            } else {
                clearInterval(interval)
                if (this.state.error?.message && /Loading chunk [\d]+ failed/ig.test(this.state.error.message)) {
                    window.location.reload(true);
                } else {
                    this.setState({ hasError: false, error: null, timer: null, loading: null });
                    // timerValue = (timerValue * 2 < 60) ? timerValue * 2 : 60;
                    timerValue = timerValue * 3
                    if(timerValue > 10){
                        window.location.href = window.location.origin
                    }
                }
            }
        }, 1000)
    }

    render() {
        if (this.state.hasError) {
            if (!(window.navigator?.onLine)) {
                return (<div style={{ height: "100vh" }} className="d-flex align-items-center justify-content-center">
                    <div className="col-12 mt-4 text-center" style={{ color: "black !important" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-wifi-off" viewBox="0 0 16 16">
                            <path d="M10.706 3.294A12.546 12.546 0 0 0 8 3 12.44 12.44 0 0 0 .663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c.63 0 1.249.05 1.852.148l.854-.854zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.448 8.448 0 0 1 3.51-1.27L8 6zm2.596 1.404l.785-.785c.63.24 1.228.545 1.785.907a.482.482 0 0 1 .063.745.525.525 0 0 1-.652.065 8.462 8.462 0 0 0-1.98-.932zM8 10l.934-.933a6.454 6.454 0 0 1 2.012.637c.285.145.326.524.1.75l-.015.015a.532.532 0 0 1-.611.09A5.478 5.478 0 0 0 8 10zm4.905-4.905l.747-.747c.59.3 1.153.645 1.685 1.03a.485.485 0 0 1 .048.737.518.518 0 0 1-.668.05 11.496 11.496 0 0 0-1.812-1.07zM9.02 11.78c.238.14.236.464.04.66l-.706.706a.5.5 0 0 1-.708 0l-.707-.707c-.195-.195-.197-.518.04-.66A1.99 1.99 0 0 1 8 11.5c.373 0 .722.102 1.02.28zm4.355-9.905a.53.53 0 1 1 .75.75l-10.75 10.75a.53.53 0 0 1-.75-.75l10.75-10.75z" />
                        </svg>
                        <br /><br /><br />
                        <h3 >Conexión inestable</h3>
                        <small>Verifica que estés conectado a una red</small>
                        <br /><br />
                        <br /><br />
                        <button className="btn btn-warning text-white" onClick={() => { this.reloadChildren() }}>Reintentar</button>
                    </div>
                </div>)
            }
            return (
                <div className="container">
                    <br />
                    <br />
                    <br />
                    <div className="jumbotron">
                        <h1 className="display-4 mb-5"><br />:(</h1>
                        <p className="lead">Ops, Parece que hubo un error en la aplicación</p>
                        <hr className="my-4" />

                        {this.state.loading !== null ? <>
                            <p><b>Reportando error</b></p>
                            <div className="progress bg-white mb-4">
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={this.state.loading} aria-valuemin="0" aria-valuemax="100" style={{ width: `${this.state.loading}%` }}>{this.state.loading}%</div>
                            </div>
                        </>
                            :
                            <>
                                <p>Recargaremos automaticamente en <big><b>{this.state.timer}</b></big></p>
                                <a className="btn btn-primary btn-sm text-white" role="button" onClick={() => window.location.reload(true)}>Recargar ahora</a>
                            </>
                        }
                    </div>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorHandler;
