import { lazy, useState } from "react";
import style from "./login.module.css";
import lazyLoaderComponents from "../../services/lazyLoadingService";
import { I_User } from "../../interfaces/user.interface";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { login } from "../../store/actions/userActions";

const GoogleLogin = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "GoogleLogin" */ './../../components/GoogleLogin')));

interface I_Props {
    callback: (data: I_User, toekn: string) => {};
}

const Login = (props: I_Props) => {

    const [loader, setLoader] = useState<boolean>(false);
    // const [_alert, setAlert] = useState<null | I_AlertObject>(null);

    const dispatch = useAppDispatch();

    /**
    * @param {json} gObject Google object response
    */
    const loginWithGoogle = async (credential: string) => {
        setLoader(true);

        let resp = await dispatch(login(credential))

        if(!resp){
            setLoader(false);
        }
    }

    return (
        <div className={style['login-screen']}>

            <div className="position-relative">
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