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
  TinyEditorKey,
} from "../../../helpers/Helper";
import App from "../../../Configs/app";
//import { CKEditor } from '@ckeditor/ckeditor5-react';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editor } from "@tinymce/tinymce-react";

function Edit() {
  let location = useLocation();
  const { id } = useParams();
  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Edit Email Template");

  const [info, setInfo] = React.useState(location.item ? location.item : {});
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  //const [companyLogo, setCompanyLogo] = React.useState(null);
  //const [picture, setPicture] = React.useState(null);
  const [emailcontent, setEmailContent] = React.useState(null);

  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          setInfo(response.data.email);
          setEmailContent(response.data.email.content)
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

  const handleEditorChange = (content, editor) => {
    setEmailContent(content);
  };

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.content = emailcontent ? emailcontent : oldcontent;
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

  const oldcontent = info.content ? info.content : "";
  if (redirect) {
    return <Redirect to="/email" />;
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
                        Template Name<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="name"
                        defaultValue={info?.name}
                        size="sm"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Template Name"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter Template Name
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label>Subject<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        name="subject"
                        defaultValue={info?.subject}
                        size="sm"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Subject"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Enter Subject
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-8">
                    <Form.Group>
                      <Form.Label>Email Content:</Form.Label>

                      <Editor
                        init={{
                          selector: "textarea#myTextArea",
                          plugins: ["lists link image paste help wordcount"],
                          toolbar:
                            "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help",
                        }}
                        apiKey={TinyEditorKey}
                        value={emailcontent}
                        onEditorChange={handleEditorChange}
                      />
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
                    <Link to="/email" className="btn btn-danger btn-sm">
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
