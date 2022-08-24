import React, { Component } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import {
  Card,
  Form,
  Button,
  Modal,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import { CardHeader, TextField } from "@material-ui/core";
import jQuery from "jquery";
import { SettingsInputCompositeSharp } from "@material-ui/icons";

function Add() {
  let employee = useLocation();

  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Add Contact");
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [states, setStates] = React.useState([]);
  const [redirect, setRedirect] = React.useState(false);
  const [dynamicItem, setInfo] = React.useState([]);
  const [adddata, setData] = React.useState([]);

  const getInfo = React.useCallback(() => {
    Actions.dynamiccontact().then((response) => {
      if (response.status === "SUCCESS") {
        setInfo(response.data);
      } else {
        addToast(response.message, { appearance: "error", autoDismiss: true });
        setRedirect(true);
      }
    });
  }, []);

  React.useEffect(getInfo, []);

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
    return <Redirect to="/contactform" />;
  }

  return (
    <div className="add-edit-contactform">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {dynamicItem.map((data) => (
          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">{data.section_title}</Card.Header>
            {data &&
              data.field_data.map((sub) => {
                switch (sub.input_type) {
                  case "textarea":
                    return (
                      <Card.Body className="p-3">
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label>
                                {sub.label_name}
                                {sub.is_required ? (
                                  <span className="text-danger">*</span>
                                ) : null}
                              </Form.Label>
                              <Form.Control
                                name={sub.label_name}
                                size="sm"
                                as={sub.input_type}
                                autoComplete="off"
                                maxvalue={sub.maxvalue}
                                maxLength={sub.maxlength}
                                minLength={sub.minlength}
                                pattern={sub.pattern}
                                minvalue={sub.minvalue}
                                is_required={sub.is_required}
                                isSearchable={sub.isSearchable}
                                placeholder={sub.label_name}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please Enter {sub.label_name}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </div>
                      </Card.Body>
                    );
                  case "text":
                    return (
                      <Card.Body className="p-3">
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label>
                                {sub.label_name}
                                {sub.is_required ? (
                                  <span className="text-danger">*</span>
                                ) : null}
                              </Form.Label>
                              <Form.Control
                                name={sub.label_name}
                                size="sm"
                                type={sub.input_type}
                                autoComplete="off"
                                placeholder={sub.label_name}
                                maxvalue={sub.maxvalue}
                                maxLength={sub.maxlength}
                                minLength={sub.minlength}
                                pattern={sub.pattern}
                                required={sub.is_required}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please Enter {sub.label_name}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </div>
                      </Card.Body>
                    );
                  case "select":
                    return (
                      <Card.Body className="p-3">
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label>
                                {sub.label_name}
                                {sub.is_required ? (
                                  <span className="text-danger">*</span>
                                ) : null}
                              </Form.Label>
                              <Form.Control
                                name={sub.label_name}
                                size="sm"
                                as={sub.input_type}
                                autoComplete="off"
                                placeholder={sub.label_name}
                                is_select_multiple={sub.is_select_multiple}
                                is_searchable={sub.is_searchable}
                                is_required={sub.is_required}
                                maxvalue={sub.maxvalue}
                                maxLength={sub.maxlength}
                                minLength={sub.minlength}
                                pattern={sub.pattern}
                                required={sub.is_required}
                              >
                                <option value="">
                                  Select {sub.label_name}
                                </option>
                                v
                                {sub &&
                                  sub.values.map((gender) => (
                                    <option value={gender.value}>
                                      {gender.value}
                                    </option>
                                  ))}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                Please Select {sub.label_name}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </div>
                      </Card.Body>
                    );
                  case "number":
                    return (
                      <Card.Body className="p-3">
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label>
                                {sub.label_name}
                                {sub.is_required ? (
                                  <span className="text-danger">*</span>
                                ) : null}{" "}
                              </Form.Label>
                              <Form.Control
                                name={sub.label_name}
                                size="sm"
                                type={sub.input_type}
                                autoComplete="off"
                                placeholder={sub.label_name}
                                required={sub.is_required}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please Enter {sub.label_name}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </div>
                      </Card.Body>
                    );
                  default:
                    return (
                      <Card.Body className="p-3">
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label>
                                {sub.label_name}
                                {sub.is_required ? (
                                  <span className="text-danger">*</span>
                                ) : null}
                              </Form.Label>
                              <Form.Control
                                name={sub.label_name}
                                size="sm"
                                type={sub.input_type}
                                autoComplete="off"
                                placeholder={sub.label_name}
                                required={sub.is_required}
                              />
                              <Form.Control.Feedback type="invalid">
                                Please Enter {sub.label_name}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </div>
                      </Card.Body>
                    );
                }
              })}
          </Card>
        ))}

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
            <Link to="/contactform" className="btn btn-danger btn-sm">
              CANCEL
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default React.memo(Add);
