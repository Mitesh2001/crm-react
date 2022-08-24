import React from "react";
import { Card, Form, Button, ButtonToggle } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";
import { Link, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import {
  validatePhoneOnPress,
  disableUpDownArrow,
  TinyEditorKey,
} from "../../../helpers/Helper";
import { render } from "react-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Editor } from "@tinymce/tinymce-react";

function Add() {
  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Add Email Template");

  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  // const [companyLogo, setCompanyLogo] = React.useState(null);
  // const [picture, setPicture] = React.useState(null);
  const [emailcontent, setEmailContent] = React.useState(null);

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      // formDataObj.company_logo = companyLogo;
      // formDataObj.picture = picture;
      formDataObj.content = emailcontent;
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

  const handleEditorChange = (content, editor) => {
    setEmailContent(content);
  };
  if (redirect) {
    return <Redirect to="/email" />;
  } else {
    return (
      <div className="add-edit-show">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Card className="rkcrm-card mb-5">
            <Card.Body>
              <div className="row">
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>
                      Email Template Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="name"
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
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter Subject"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Enter subject
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <Form.Group>
                    <Form.Label>Email Content</Form.Label>
                    <Editor
                      init={{
                        selector: "textarea#myTextArea",
                        plugins: ["lists link image paste help wordcount"],
                        toolbar:
                          "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help",
                      }}
                      apiKey={TinyEditorKey}
                      onEditorChange={handleEditorChange}
                    />

                    {/* <CKEditor name="myEditor" editor={ ClassicEditor } formControl="myForm.controls.editor"></CKEditor> */}

                    {/* <CKEditor name="content" formControl="myForm.controls.editor" editor={ ClassicEditor }
                    onReady={ editor => {}} /> */}
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
                  &nbsp;
                  <Link to="/email" className="btn btn-danger btn-sm">
                    CANCEL
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Form>
      </div>
    );
  }
}

export default React.memo(Add);
