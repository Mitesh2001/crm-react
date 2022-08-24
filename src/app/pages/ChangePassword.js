import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { useSubheader } from "../../_metronic/layout";
import { Button, Form, Card } from "react-bootstrap";
import Actions from "./Actions";

export default () => {
  const [val, setVal] = useState("");
  const [validateval, setValidateval] = useState(false)

  let history = useHistory();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Change Password");
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { addToast } = useToasts();

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      if (validateval === true) {
        Actions.changePassword(formDataObj).then((data) => {
          setLoading(false);
          if (data.status === "SUCCESS") {
            form.reset();
            addToast(data.message, {
              appearance: "success",
              autoDismiss: true,
            });
          } else {
            addToast(data.message, { appearance: "error", autoDismiss: true });
          }
        });
        setValidated(false);
      } else {
        addToast(
          "please enter strong password which includes min-length: 8, min-lowercase: 1, min-uppercase: 1, min-symbol: 1",
          { appearance: "error", autoDismiss: true, autoDismissTimeout: 7000 }
        );
      }
    } else {
      setValidated(true);
    }
    setLoading(false);
  };

  React.useEffect(() => {
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
  

  return (
    <Card>
      <Card.Body>
        <div className="row">
          <div className="col-md-6">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" id="form_feedback">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  name="new_password"
                  type="password"
                  placeholder="Enter new password"
                  required
                  onChange={(e) => setVal(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter new password
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  name="password_confirmation"
                  type="password"
                  placeholder="Confirm new password"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please confirm your new password
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                size="sm"
                variant="primary"
                className="rk-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading.." : "Submit"}
              </Button>
              &nbsp;
              <Link
                to="#"
                onClick={() => {
                  history.goBack();
                }}
                className="btn btn-danger btn-sm"
              >
                CANCEL
              </Link>
            </Form>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
