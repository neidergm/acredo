import { lazy, useState } from "react";
import style from "./login.module.css";
import lazyLoaderComponents from "../../services/lazyLoadingService";
import Alert, { I_AlertObject } from '../../components/Alert';
import { I_User } from "../../interfaces/user.interface";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { login } from "../../store/actions/userActions";

const GoogleLogin = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "GoogleLogin" */ './../../components/GoogleLogin')));

interface I_Props {
    callback: (data: I_User, toekn: string) => {};
    // alert?: string | null;
}

const Login = (props: I_Props) => {

    const [loader, setLoader] = useState<boolean>(false);
    const [_alert, setAlert] = useState<null | I_AlertObject>(null);

    const dispatch = useAppDispatch();

    /**
    * @param {json} gObject Google object response
    */
    const loginWithGoogle = (credential: string) => {
        setLoader(true);

        dispatch(login(credential) as any)
            .then((resp: any) => {
                if (!(resp)) {
                    setAlert({
                        isOpen: true,
                        title: "Espere",
                        subtitle: "Parece que no tienes permisos para acceder",
                        type: "warning",
                    });
                    setLoader(false);
                }
            })

        // startLogin(gObject, revokeCallback)
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
                    <h5>Condiciones de calidad</h5>
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