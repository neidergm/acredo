import { useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { GOOGLE_CLIENT_ID } from '../../services/constantsService';
import './index.css';

interface I_Props {
    color?: string,
    disabled: boolean,
    successCallback: (credential: string) => void,
    failureCallback?: (error: string) => void,
}

declare global {
    interface Window { google: any; }
}

interface I_Google_response {
    clientId: string;
    client_id: string;
    credential: string;
    select_by: "user" | "btn" | string;
}

const GoogleLogin = (props: I_Props) => {
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true;
        script.onload = initializeGsi;
        document.querySelector('body')?.appendChild(script);

        return () => {
            document.querySelector('body')?.removeChild(script)
        }
    }, [])

    const initializeGsi = () => {
        try {
            window.google?.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: responseGoogle,
                cancel_on_tap_outside: true,
            });

            showOneTapPrompt();
            showGLoginBtn();

        } catch (error) {
            console.log({ error })
        }
    }

    const showOneTapPrompt = () => {
        window.google.accounts.id.prompt((_notification: any) => {
            // console.log(notification)
            // if (notification.isNotDisplayed()) {
            //     console.log(notification.getNotDisplayedReason())
            // } else if (notification.isSkippedMoment()) {
            //     console.log(notification.getSkippedReason())
            // } else if (notification.isDismissedMoment()) {
            //     console.log(notification.getDismissedReason())
            // }
        });
    }

    const showGLoginBtn = () => {
        window.google.accounts.id.renderButton(document.getElementById("NG_GLOGIN_BTN"), {
            type: "standard", //OR icon
            theme: props.color || 'filled_black', //or Outline/filled_blue
            size: 'large',
            width: window.innerWidth <= 500 ? 300 : null,
            shape: "pill", //Or rectangular
        });
    }

    const responseGoogle = (data: I_Google_response) => {
        if (!(data?.credential)) {
            props.failureCallback?.('Hubo un error, intenta nuevamente');
            showOneTapPrompt();
        } else {
            props.successCallback(data.credential);
        }
    }

    return (
        <div id="NG_GLOGIN_BTN" className={props.disabled ? "disabled" : ""}>
            <Spinner animation='border' size="sm" className="ml-3" />
        </div>
    )
}

export default GoogleLogin;
