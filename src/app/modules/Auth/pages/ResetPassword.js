import React, { useEffect } from "react";
import { Link,useHistory,Redirect,useParams } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import { useSubheader } from "../../../../_metronic/layout";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { Button, Form, Card } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import config from '../../../Configs/app';
import Actions from './../Actions';


function ForgotPassword(props) {
  

  let history=useHistory();
  const { user_token } = useParams();
  const [token,setToken]=React.useState(user_token);
  const [redirect, setRedirect] = React.useState(false);

  const suhbeader = useSubheader();
  suhbeader.setTitle("Reset Password");
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [val, setVal] = React.useState("");
  const [validateval, setValidateval] = React.useState(false)

  const { addToast } = useToasts();

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      if(validateval){
      Actions.resetPassword({...formDataObj,token:user_token}).then((data) => {
        setLoading(false);
        if (data.status === 'SUCCESS') {
          form.reset();
          addToast(data.message, { appearance: 'success', autoDismiss: true });
          setRedirect(true);
        } else {
          addToast(data.message, { appearance: 'error', autoDismiss: true });
        }
      });
      setValidated(false);
    }else{
      addToast('please enter strong password which includes min-length: 8, min-lowercase: 1, min-uppercase: 1, min-symbol: 1', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 7000 });

    }
    } else {
      setValidated(true);
    }
    setLoading(false);
  }
useEffect(() => {
  if (
    val.match(/[a-z]/g) &&
    val.match(/[A-Z]/g) &&
    val.match(/[0-9]/g) &&
    val.match(/[^a-zA-Z\d]/g) &&
    val.length >= 8
  ){
    setValidateval(true);
    if (document.getElementById("strong_pass")) {
      document.getElementById("strong_pass").remove();
    }

  }
  else {
    setValidateval(false);
    if (!document.getElementById("strong_pass")) {
      let tag = document.createElement("p");
      tag.setAttribute("id", "strong_pass");
      let text = document.createTextNode(
        "At least 8 characters in length and should include at least 1 upper case letter, 1 number, and 1 special character."
      );
      tag.appendChild(text);
      let element = document.querySelector("#form_feedback");
      element.appendChild(tag);
      document.getElementById("strong_pass").style.color = "red";
    }
  }
  if (!val && document.getElementById("strong_pass")) {
    document.getElementById("strong_pass").remove();
  }
}, [val])


 

  if (redirect) {
    return <Redirect to="/employees" />;
  } else {
    return (
        <div className="login-form login-forgot" style={{ display: "block" }}>
          <div className="text-center mb-10">
            <img src={toAbsoluteUrl('/media/logos/rk_logo.png')} className="img img-fluid w-50" alt={config.appName} />
          </div>
          <div className="text-center mb-10">
            <h3 className="font-size-h1">Reset Password</h3>
            </div>

          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="formBasicEmail" id = 'form_feedback'>
              <Form.Control className="form-control form-control-solid h-auto py-5 px-6 " name="password" type="password" placeholder="Enter new password" required  onChange={(e) => setVal(e.target.value)}/>
              <Form.Control.Feedback type="invalid">
                Please enter new password
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Control className="form-control form-control-solid h-auto py-5 px-6 " name="password_confirmation" type="password" placeholder="Confirm new password" required />
              <Form.Control.Feedback type="invalid">
                Please confirm your new password
              </Form.Control.Feedback>
            </Form.Group>
            <div className="form-group d-flex flex-wrap flex-center">
          <button
            id="kt_login_forgot_submit"
            type="submit"
            className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4 rk-btn text-uppercase"
            disabled={loading}
          >
            Submit
          </button>
          <Link to="/auth">
            <button
              type="button"
              id="kt_login_forgot_cancel"
              className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4 text-uppercase"
            >
              Cancel
            </button>
          </Link>
          </div>
          </Form>
        </div>
      );
  }
};
export default injectIntl(connect(null, auth.actions)(ForgotPassword));
