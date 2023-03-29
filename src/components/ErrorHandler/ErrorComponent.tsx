import React, { Component } from 'react';
import { InfoCircle } from '../Icons';
// import { ExclamationTriangle, ThreeDotsVertical } from 'react-bootstrap-icons';

type T_State = {
    hasError: boolean,
    error: any,
    tryLoad: any,
    tryNumber: number
}

class ErrorComponent extends Component<any, T_State> {
    constructor(props: any) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            tryLoad: null,
            tryNumber: 0
        };
    }

    static getDerivedStateFromError(error: any) {
        // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto
        return { hasError: true, error, tryLoad: false };
    }

    componentDidCatch(error: any, errorInfo: any) {
        let data = {
            error,
            message: error.message || "NG",
            stack: error.stack || "NG",
            errorInfo,
            path: window.location.href
        }
        this.setState({ error: JSON.stringify(data) })
    }

    tryLodAgain = () => {
        this.setState({ tryLoad: true, hasError: false, tryNumber: this.state.tryNumber + 1 })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={"d-flex align-items-center justify-content-center mt-3 mb-3 p-4 text-center h-100 " + this.props.className} style={this.props.style || {}}>
                    <div
                        onClick={() => this.setState({ tryNumber: -1, hasError: false })}
                        style={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "0",
                            right: "0",
                            padding: "2px 10px"
                        }}>x</div>
                    <div className="row">
                        <div className="col-12 text-muted">
                            <h6>
                                <InfoCircle size={25} /><br /><br />
                                <small>No se pudo cargar esta sección</small>
                            </h6>
                            <button disabled={!!(this.state.tryLoad)} className="btn btn-sm btn-outline-dark mt-2"
                                onClick={() => { !(this.state.tryLoad) && this.tryLodAgain() }}>
                                {this.state.tryLoad ? <div className="spinner-border" role="status"></div> : "Reintentar"}</button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.state.tryNumber === -1 ? null : this.props.children;
    }
}

export default ErrorComponent;
