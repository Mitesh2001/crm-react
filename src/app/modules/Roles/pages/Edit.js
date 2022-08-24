import React from "react";
import { Link, useParams, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";
import { Divider } from "@material-ui/core";

export default React.memo(function() {
  const { id } = useParams();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Edit Role");
  const { addToast } = useToasts();
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [info, setInfo] = React.useState({});
  const [redirect, setRedirect] = React.useState(false);
  const [permissions, setPermissions] = React.useState([]);
  const [selectedPermissions, setSelectedPermissions] = React.useState([]);

  const getPermissions = React.useCallback(() => {
    Actions.permissions().then((response) => {
      if (response.status === "SUCCESS") {
        setPermissions(response.data.permissions);
      } else {
        addToast(response.message, { appearance: "error", autoDismiss: true });
      }
    });
  });

  const getInfo = React.useCallback(() => {
    Actions.info(id).then((response) => {
      if (response.status === "SUCCESS") {
        setInfo(response.data.role);
        setSelectedPermissions(response.data.permissions.map((i) => String(i)));
      } else {
        addToast(response.message, { appearance: "error", autoDismiss: true });
        setRedirect(true);
      }
    });
  }, [id, addToast]);

  React.useEffect(getPermissions, []);
  React.useEffect(getInfo, []);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (selectedPermissions.length < 1) {
      addToast("Please select atleast one permission", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }
    setLoading(true);
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.permissions = selectedPermissions;
      Actions.update({ ...formDataObj, id }).then((response) => {
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
  // style={{backgroundColor:"grey",backgroundPosition: "center" ,height:"50px"}}
  const checkstyle = { paddingTop: "8px", color: "black" };

  const checkLabelStyle = { paddingTop: "2px", color: "black" };
  const toggleCheckbox = (event) => {
    const value = event.target.value;
    let values = [...selectedPermissions];
    event.target.checked
      ? values.push(value)
      : (values = values.filter((i) => i !== value));
    setSelectedPermissions(values);
  };

  if (redirect) {
    return <Redirect to="/rp/roles" />;
  } else {
    return (
      <>
        {" "}
        <Card className="rkcrm-card mb-5">
          <Card.Body className="p-3">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Role Name<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      name="name"
                      defaultValue={info?.name}
                      size="sm"
                      type="text"
                      placeholder="Enter role name"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter role name
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                {Object.values(Object.entries(permissions)).map(([p, j]) => (
                  <div className="col-md-4">
                    <Card
                      style={{backgroundColor: "#DCDCDC",borderRadius:"10px 10px 0px 0px" }}
                    >
                      <Card.Body>
                        <Card.Title style={checkstyle}>{p}</Card.Title>
                      </Card.Body>
                    </Card>
                    <Card
                         style={{ backgroundColor: "#DCDCDC",borderRadius:"0px 0px 10px 10px" ,height:"60%" }}
                    >
                        <Card.Body className="p-3">
                          <div className="row ">
                            {j.map((k) => (
                              <div
                                className="col-md-4 mt-12"
                                key={"checkcol" + k.id}
                              >
                                <Form.Check
                                  type="checkbox"
                                  id={`permission-${k.id}`}
                                >
                                  <Form.Check.Input
                                    value={k.id}
                                    type="checkbox"
                                    style={{height:"auto"}}
                                    onChange={toggleCheckbox}
                                    checked={
                                      selectedPermissions.indexOf(
                                        String(k.id)
                                      ) !== -1
                                    }
                                    isValid
                                  />
                                  <Form.Check.Label style={checkLabelStyle}>
                                    {k.name}
                                  </Form.Check.Label>
                                </Form.Check>
                              </div>
                            ))}
                          </div>
                        </Card.Body>
                    </Card>
                    &nbsp;&nbsp;&nbsp;
                  </div>
                ))}
              </div>

              <Divider style={{ marginBottom: "1rem", marginTop: "1rem" }} />
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
                  <Link to="/rp/roles" className="btn btn-danger btn-sm">
                    CANCEL
                  </Link>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </>
    );
  }
});
