import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";

export default React.memo(function() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Add Country");
  const { addToast } = useToasts();
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
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
    return <Redirect to="/master/countries" />;
  } else {
    return (
      <Card className="rkcrm-card mb-5">
        <Card.Body className="p-3">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    size="sm"
                    type="text"
                    placeholder="Enter country name."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter country name
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Sort Name</Form.Label>
                  <Form.Control
                    name="sortname"
                    size="sm"
                    type="text"
                    placeholder="Enter sort name."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter sort name
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Button
                  size="sm"
                  variant="primary"
                  className="rk-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading.." : "SAVE"}
                </Button>
                &nbsp;
                <Link to="/master/countries" className="btn btn-danger btn-sm">
                  CANCEL
                </Link>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  }
});
