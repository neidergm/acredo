import { lazy, useEffect, useState } from "react";
import style from "./login.module.css";
import lazyLoaderComponents from "../../services/lazyLoadingService";
import Alert, { I_AlertObject } from '../../components/Alert';
import { AXIOS_REQUEST } from "../../services/axiosService";
import { LOGIN } from "../../services/endPointsService";
import { I_User } from "../../interfaces/user.interface";

const GoogleLogin = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "GoogleLogin" */ './../../components/GoogleLogin')));

interface I_Props {
    callback: (data: I_User, toekn: string) => {};
    // alert?: string | null;
}

const Login = (props: I_Props) => {

    const [loader, setLoader] = useState<boolean>(false);
    const [_alert, setAlert] = useState<null | I_AlertObject>(null);

    // useEffect(() => {
    //     if (state.alert) {
    //         setTimeout(() => { setState({ alert: null }) }, 5000)
    //     }
    // }, [state.alert])


    const startLogin = (gObject: any, revokeCallback: Function) => {
        let data = { token: gObject.credential, confia: 0 }

        AXIOS_REQUEST(LOGIN, "post", data).then((res) => {
            if (!res) throw new Error();
            console.log(res)
            props.callback(res.rpt.data, res.token)

        }).catch(err => {
            revokeCallback()
            setAlert({
                isOpen: true,
                title: "Espere",
                subtitle: "Parece que no tienes permisos para acceder",
                type: "warning",
            });
            setLoader(false);
        })
    }

    /**
    * @param {json} gObject Google object response
    */
    const loginWithGoogle = (gObject: any, revokeCallback: Function) => {
        setLoader(true);
        startLogin(gObject, revokeCallback)
    }

    return (
        <div className={style['login-screen']}>
            <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} closeButton={{ value: "Ok" }} />

            <div className="position-relative">
                {/* <div className="position-absolute w-100" style={{ top: "-80px", left: 0 }}>
                        <span className="pt-2 pb-2 ps-3 pe-3 rounded mb-4 bg-danger text-white">
                            {state.alert}</span>
                    </div> */}
                <div className="mb-5">
                    <img src="https://atlas.curn.edu.co:8090/gestorrecibo/img/logo.png" height="80px" alt="CURN" />
                </div>
                <div className="mb-5">
                    <small>Acceder</small>
                    <h5>SIAC | Condiciones</h5>
                </div>
                <div className={style['login-content']}>
                    <GoogleLogin
                        successCallback={loginWithGoogle}
                        disabled={loader}
                    />
                </div>
                {loader && <>
                    <div className={style['container-loader']}>
                        <div className={style["bar-loader"]}></div>
                    </div>
                </>}
            </div>

        </div>
    )
}

export default Login;