import { Component } from 'react';
import { Spinner } from 'reactstrap';
import { GOOGLE_CLIENT_ID } from '../../services/constantsService';
import './index.css';

interface I_Props {
    color: string,
    successCallback: Function,
    disabled: boolean,
}

interface I_State {
    type: string,
    loading: JSX.Element,
}

declare global {
    interface Window { google: any; }
}

class GoogleLogin extends Component<I_Props, I_State> {

    constructor(props: I_Props) {
        super(props);

        this.state = {
            type: 'curnvirtual',
            loading: <>Cargando<Spinner animation='border' size="sm" className="ml-3" /></>
        }
    }

    componentDidMount() {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true;
        script.onload = this.initializeGsi;
        document.querySelector('body')!.appendChild(script);
    }

    initializeGsi = () => {
        try {
            window.google?.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: this.responseGoogle,
                cancel_on_tap_outside: true,
            });

            this.showOneTapPrompt()
            this.showGLoginBtn()
        } catch (error) {
            console.log({ error })
        }
    }

    showOneTapPrompt = () => {
        // //Show One tap
        window.google.accounts.id.prompt((notification: any) => {
            // console.log(notification)
            if (notification.isNotDisplayed()) {
                console.log(notification.getNotDisplayedReason())
            } else if (notification.isSkippedMoment()) {
                console.log(notification.getSkippedReason())
            } else if (notification.isDismissedMoment()) {
                console.log(notification.getDismissedReason())
            }
        });
    }

    showGLoginBtn = () => {
        //Show button login
        window.google.accounts.id.renderButton(document.getElementById("NG_GLOGIN_BTN"), {
            type: "standard", //OR icon
            theme: this.props.color || 'filled_black', //or Outline/filled_blue
            size: 'large',
            width: window.innerWidth <= 500 ? 300 : null,
            shape: "pill", //Or rectangular
        });
    }

    onSuccess = (data: any) => {
        this.props.successCallback(data, (userId = data.clientId) => window.google.accounts.id.revoke(userId, (done: any) => { }));
    }

    onFailure = (data: any) => {
        // console.log(data)
    }

    responseGoogle = (data: any) => {
        if (!!(data?.credential)) {
            this.onSuccess(data)
        } else {
            this.onFailure('Hubo un error, intenta nuevamente')
            this.showOneTapPrompt()
        }
    }

    render() {
        return <div id="NG_GLOGIN_BTN" className={this.props.disabled ? "disabled" : ""}><Spinner animation='border' /> </div>
    }
}

export default GoogleLogin;
