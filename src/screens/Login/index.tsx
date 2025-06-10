import { lazy, useState } from "react";
import style from "./login.module.css";
import lazyLoaderComponents from "../../services/lazyLoadingService";
import { I_User } from "../../interfaces/user.interface";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { login } from "../../store/slices/userSlice";
import classnames from 'classnames';
import Footer from "../../components/Footer";
import { APP_COLORS, APP_TITLE } from "../../services/constantsService";

const GoogleLogin = lazy(lazyLoaderComponents(() => import(/* webpackChunkName: "GoogleLogin" */ './../../components/GoogleLogin')));

interface I_Props {
    callback: (data: I_User, toekn: string) => void;
}

const logo = 'logo-login.svg';
const logoPartnert = 'logo-partner.png';

const Login = (props: I_Props) => {

    const appname = APP_TITLE;
    const [loader, setLoader] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    /**
    * @param {json} gObject Google object response
    */
    const loginWithGoogle = async (credential: string) => {
        setLoader(true);

        const resp = await dispatch(login(credential))
        if (!resp.payload) {
            setLoader(false);
        }
    }

    return (
        <>
            <div
                className={style['login-screen']}
                style={APP_COLORS?.login ? {
                    "--login-backgroung-color": APP_COLORS.login.background,
                    "--login-color": APP_COLORS.login.color,
                } as React.CSSProperties : undefined}
            >
                <div>
                    <div className={classnames("card border-0", style["container"])}>
                        <div className={classnames("card-body", style["left"])}>
                            <div className={style["logo"]}>
                                <img src={logoPartnert} alt="partner" />
                            </div>
                            <div className={style["title"]}>
                                <b>Bienvenido</b>
                            </div>
                            <div className={style['google-button']}>
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
                        <div className={classnames("card-body text-center", style["right"])}>
                            <div className={style["logo"]}>
                                <img src={logo} alt="login" />
                            </div>
                            <div className={style["title"]}>
                                <h1>{appname}</h1>
                            </div>
                        </div>
                        {/* <div className={classnames("small px-3 pb-4 text-center", style["footer"])} >
                            <span>{footerText}</span>
                        </div> */}
                    </div>
                </div>
                <footer className={classnames("small px-3", style["footer"])} >
                    <Footer />
                </footer>
            </div >
        </>
    )
}

export default Login;