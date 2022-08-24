import React from "react";
import { Link, useLocation, useParams, Redirect,useHistory } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";
import { useSelector } from "react-redux";


export default React.memo(function() {
  let history=useHistory()
  let location = useLocation();
  const { id } = useParams();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Edit Industry Type");
  const { addToast } = useToasts();
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [info, setInfo] = React.useState(location.item ? location.item : {});
  const { user } = useSelector((state) => state.auth);
  const [redirect, setRedirect] = React.useState(false);
  const checkPermission = React.useCallback(() => {
    let allowed=false;
    user.user_permission &&
    user.user_permission.IndustryType &&
    user.user_permission.IndustryType.map((item) => {
          if(item.name==="Edit"){
            allowed=true;
          }
        })
    if(!allowed){
      // setNotAllowed(true)
      history.goBack();
    }
    else{
      if(user.company_details&&(new Date(user.company_details.expiry_date).getTime() < new Date(new Date()).getTime())){
        history.goBack();
      }
    }
  }, []);

  React.useEffect(checkPermission, []);


  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          setInfo(response.data.itype);
        } else {
          addToast(response.message, {
            appearance: "error",
            autoDismiss: true,
          });
          setRedirect(true);
        }
      });
    }
  }, [location, id, addToast]);

  React.useEffect(getInfo, []);

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
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

  if (redirect) {
    return <Redirect to="/master/industries" />;
  } else {
    return (
      <Card className="rkcrm-card mb-5">
        <Card.Body className="p-3">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Industry Name<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="name"
                    defaultValue={info?.name}
                    size="sm"
                    type="text"
                    placeholder="Enter industry name."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter industry name
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
                <Link to="/master/industries" className="btn btn-danger btn-sm">
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
