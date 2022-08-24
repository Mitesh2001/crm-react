import React from "react";
import { Link, useLocation, useParams, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button, Image } from "react-bootstrap";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import {
  isValidImage,
  validatePhoneOnPress,
  disableUpDownArrow,
} from "../../../helpers/Helper";
import App from "../../../Configs/app";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function Edit() {
  let location = useLocation();
  const { id } = useParams();
  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Edit SMS Templates");

  const [info, setInfo] = React.useState(location.item ? location.item : {});
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  //const [companyLogo, setCompanyLogo] = React.useState(null);
  //const [picture, setPicture] = React.useState(null);

  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          setInfo(response.data.sms);
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
      //formDataObj.company_logo = companyLogo;
      //formDataObj.picture = picture;
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
    return <Redirect to="/sms" />;
  } else {
    return (
      <div className="add-edit-lead">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                        defaultValue={info?.name}
                        size="sm"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter SMS Template Name"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter SMS Template Name
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label>SMS Content<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        name="content"
                        defaultValue={info?.content}
                        size="sm"
                        type="textarea"
                        autoComplete="off"
                        placeholder="Enter SMS Content"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter SMS Content
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <Button
                      variant="primary"
                      className="rk-btn"
                      size="sm"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Loading.." : "SAVE"}
                    </Button>
                    &nbsp;
                    <Link to="/sms" className="btn btn-danger btn-sm">
                      CANCEL
                    </Link>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Form>
      </div>
    );
  }
}

export default React.memo(Edit);
