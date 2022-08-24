import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";

function Add() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Add State");
  const { addToast } = useToasts();
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  const [countries, setCountries] = React.useState([]);

  const getCountries = React.useCallback(() => {
    Actions.countries().then((data) => {
      if (data.status === "SUCCESS") {
        setCountries(data.data.countries);
      }
    });
  }, []);

  React.useEffect(getCountries, []);

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
    return <Redirect to="/master/states" />;
  } else {
    return (
      <Card className="rkcrm-card mb-5">
        <Card.Body className="p-3">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    size="sm"
                    name="country_id"
                    as="select"
                    autoComplete="off"
                    placeholder="Select country"
                  >
                    <option value="0">Select country</option>
                    {countries.map((i) => (
                      <option value={i.country_id} key={"c" + i.country_id}>
                        {i.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Please select country
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    size="sm"
                    type="text"
                    placeholder="Enter state name."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter state name
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
                <Link to="/master/states" className="btn btn-danger btn-sm">
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
