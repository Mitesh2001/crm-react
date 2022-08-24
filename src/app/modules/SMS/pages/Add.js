import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";
import { Link, Redirect } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import {
  validatePhoneOnPress,
  disableUpDownArrow,
} from "../../../helpers/Helper";
import { render } from "react-dom";
// import { RichText } from 'prismic-reactjs'
import { useSubheader } from "../../../../_metronic/layout";

function Add() {
  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Add SMS Template");

  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  //const [companyLogo, setCompanyLogo] = React.useState(null);
  //const [picture, setPicture] = React.useState(null);

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      //formDataObj.company_logo = companyLogo;
      //formDataObj.picture = picture;
      Actions.add(formDataObj).then((response) => {
        setLoading(false);
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
        if (response.status === "SUCCESS") {
          setRedirect(true);
        }
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };
  if (redirect) {
    return <Redirect to="/sms" />;
  } else {
    return (
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>
                    SMS Template Name<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="name"
                    size="sm"
                    type="text"
                    autoComplete="off"
                    placeholder="Enter SMS Template Name"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please SMS Template Name
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>
                    SMS Content<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="content"
                    size="sm"
                    as="textarea"
                    autoComplete="off"
                    placeholder="Write SMS Here"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Write SMS
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 text-center">
                <Button
                  variant="primary"
                  className="rk-btn"
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading.." : "SAVE"}
                </Button>
                &nbsp;&nbsp;
                <Link to="/sms" className="btn btn-danger btn-sm">
                  CANCEL
                </Link>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default React.memo(Add);
