/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../_metronic/layout"
import Login from "./Login";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-6.scss";
import config from '../../../Configs/app';

export function AuthPage() {
  return (
    <>
      <div className="d-flex flex-column flex-root bg-white">
        {/*begin::Login*/}
        <div
          className="login login-6 login-signin-on login-signin-on d-flex flex-column-fluid"
          id="kt_login"
        >
          {/*begin::Aside*/}
          <div
            className="d-flex flex-column flex-lg-row flex-row-fluid text-center"
          >
            {/*begin: Aside Container*/}
            <div className="d-flex flex-center" style={{ background: 'url(' + toAbsoluteUrl('/media/bg/login_shape.png') + ')', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
              <img src={toAbsoluteUrl('/media/bg/login_img.png')} className="img img-fluid w-75" alt={config.appName} />
            </div>
            {/*end: Aside Container*/}

            <div className="login-divider">
              <div></div>
            </div>

            {/*begin::Content*/}
            <div className="flex-row-fluid d-flex flex-column position-relative p-7 overflow-hidden flex-center">
              {/* begin::Content body */}
              <div className="d-flex w-100 flex-center position-relative overflow-hidden">
                <div className="login-wrapper">
                  <Switch>
                    <ContentRoute path="/auth/login" component={Login} />
                    <ContentRoute path="/auth/registration" component={Registration} />
                    <ContentRoute
                      path="/auth/forgot-password"
                      component={ForgotPassword}
                    />
                    <ContentRoute
                      path="/reset-password/:user_token"
                      component={ResetPassword}
                    />
                    <ContentRoute
                      path="/reset-password"
                      component={ResetPassword}
                    />
                    <Redirect from="/auth" exact={true} to="/auth/login" />
                    <Redirect to="/auth/login" />
                  </Switch>
                </div>
              </div>
              {/*end::Content body*/}
            </div>
            {/*end::Content*/}
          </div>
        </div>
        {/*end::Login*/}
      </div>
    </>
  );
}
