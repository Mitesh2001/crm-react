import React from "react";
import { Link, useLocation, useParams, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import {
  Form,
  Card,
  Image,
  Tab,
  Nav,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
} from "react-bootstrap";
import LeadSummary from "../partials/LeadSummary";
import LeadCompanySummary from "../partials/LeadCompanySummary";
import LeadComments from "../partials/LeadComments";
import FollowUp from "../partials/FollowUp";
import LeadStage from "../partials/LeadStage";
import LeadActivities from "../partials/LeadActivities";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import EmailIcon from "@material-ui/icons/Email";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";
import moment from "moment";
import jQuery from "jquery";
import App from "../../../Configs/app";
import { Editor } from "@tinymce/tinymce-react";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import {
  isValidImage,
  validatePhoneOnPress,
  disableUpDownArrow,
  TinyEditorKey,
} from "../../../helpers/Helper";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PhoneIcon from "@material-ui/icons/Phone";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import LockOpenOutlinedIcon from "@material-ui/icons/LockOpenOutlined";
import BusinessOutlined from "@material-ui/icons/BusinessOutlined";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector } from "react-redux";

function Show() {
  const { user } = useSelector((state) => state.auth);
  const LeadAssignPermission = user.user_permission.hasOwnProperty(
    "Leadassign"
  );
  let location = useLocation();
  const { id } = useParams();
  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Lead Information");

  const [info, setInfo] = React.useState(location.item ? location.item : {});
  const [redirect, setRedirect] = React.useState(false);
  const [deleteRedirect, setDeleteRedirect] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [mailRecord, setMailRecord] = React.useState(false);
  const [mailConfirm, setMailConfirm] = React.useState(false);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [interestedProduct, setInterestedProduct] = React.useState([]);
  const [queryParams, setQueryParams] = React.useState({});
  const [emailTemplate, setEmailTemplate] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [template, setTemplate] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [emailcontent, setEmailContent] = React.useState(null);
  const [validated, setValidated] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [removeRecord, setRemoveRecord] = React.useState(false);
  const [removeConfirm, setRemoveConfirm] = React.useState(false);
  const [removeLoading, setRemoveLoading] = React.useState(false);
  const [sendCastt, setUnlockRecord] = React.useState(false);
  const [UnlockConfirm, setUnlockConfirm] = React.useState(false);
  const [stickyNote, setStickyNote] = React.useState("");
  const [leadLock, setLeadLock] = React.useState(true);
  const handleUnlock = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.Contact = id;
      formDataObj.contact_id = id;
      formDataObj.is_lock = checked;
      // var lock =unlock;
      Actions.lock(formDataObj).then((response) => {
        setLoading(false);
        if (response.status === "SUCCESS") {
          handleUnlockClose();
          setRedirect(false);
        }
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };

  const sendUnlock = () => {
    setUnlockRecord();
    setUnlockConfirm(true);
  };
  const handleUnlockClose = () => {
    setUnlockRecord(false);
    setUnlockConfirm(false);
  };

  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          if (response.data.lead.is_lock == 1) {
            setLeadLock(false);
          }
          if (!response.data.lead.is_lock) {
            var formDataObj = {
              lead_id: id,
              is_lock: true,
            };
            // var lock =unlock;
            Actions.lock(formDataObj).then((response) => {
              setLoading(false);
              if (response.status === "SUCCESS") {
                setLeadLock(false);
                handleUnlockClose();
                setRedirect(false);
                addToast(response.message, {
                  appearance: "success",
                  autoDismiss: true,
                });
              }
              if (response.status === "FAIL") {
                let c = 0;
                user?.user_permission?.Lead?.map((item) => {
                  if (item.name == "Create") {
                    c = c + 1;
                  }
                  if (item.name == "Edit") {
                    c = c + 1;
                  }
                  if (item.name == "Delete") {
                    c = c + 1;
                  }
                });
                if (c !== 3) {
                  addToast(response.message, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }

                setLeadLock(true);
              }
            });
          }
          setInfo(response.data.lead);
          setInterestedProduct(response.data.lead.intrested_product);
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

  const getEmailTemplate = React.useCallback(() => {
    Actions.emailTemplate({ ...queryParams }).then((response) => {
      if (response.status === "SUCCESS") {
        setEmailTemplate(response.data.email);
        setEmailContent(
          response.data.email.content ? response.data.email.content : ""
        );
      }
      setLoading(false);
    });
  }, []);

  React.useEffect(getEmailTemplate, []);

  const handleChange = (event) => {
    Actions.selectTemplate(event.target.value).then((response) => {
      if (response.status === "SUCCESS") {
        setTemplate(response.data.email);
        setEmailContent(
          response.data.email.content ? response.data.email.content : ""
        );
      }
      setLoading(false);
    });
  };

  var checked = false;
  const handleCheck = (e) => {
    if (e.target.checked === true) {
      checked = true;
    } else {
      checked = false;
    }
  };

  const handleEditorChange = (content, editor) => {
    setEmailContent(content);
  };

  // const oldcontent = template.content ? template.content : "";

  const deleteItem = (id) => {
    setDeleteRecord(id);
    setDeleteConfirm(true);
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    Actions.delete(deleteRecord).then((response) => {
      setDeleteLoading(false);
      addToast(response.message, {
        appearance: response.status === "SUCCESS" ? "success" : "error",
        autoDismiss: true,
      });
      if (response.status === "SUCCESS") {
        setRedirect(true);
      }
    });
  };

  const handleClose = () => {
    setDeleteRecord(false);
    setDeleteConfirm(false);
  };

  const sendEmail = () => {
    setMailRecord();
    setMailConfirm(true);
  };
  const handleMailClose = () => {
    setMailRecord(false);
    setMailConfirm(false);
  };
  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.is_lock = checked;
      formDataObj.lead_id = id;

      Actions.lock(formDataObj).then((response) => {
        setLoading(false);
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
        if (response.status === "SUCCESS") {
          // setRedirect(true);
          getInfo();
        }
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };

  const handleMail = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.type_id = id;
      formDataObj.content = emailcontent;
      formDataObj.type = 1;

      Actions.sendEmail(formDataObj).then((response) => {
        setLoading(false);
        if (response.status === "SUCCESS") {
          handleMailClose();
          setEmailContent("");
          setRedirect(false);
        }
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };

  const removeItem = (id) => {
    setRemoveRecord(id);
    setRemoveConfirm(true);
  };

  const handleClosee = () => {
    setRemoveRecord(false);
    setRemoveConfirm(false);
  };

  const handleRemove = () => {
    setRemoveLoading(true);
    Actions.remove(removeRecord).then((response) => {
      setRemoveLoading(false);

      addToast(response.message, {
        appearance: response.status === "SUCCESS" ? "success" : "error",
        autoDismiss: true,
      });
      if (response.status === "SUCCESS") {
        setDeleteRedirect(true);
      }
    });
  };

  if (redirect) {
    return <Redirect to="/leads" />;
  }
  if (deleteRedirect) {
    window.location.reload();
  }

  const checkValidity = (date) => {
    return new Date(date).getTime() > new Date(new Date()).getTime();
  };
  const picture =
    info?.company_logo && info.company_logo !== ""
      ? App.assetUrl + "images/" + info.company_logo
      : toAbsoluteUrl("/media/users/default.jpg");

  const stickyInfo = (e) => {
    setStickyNote(e);
  };

  return (
    <>
      <Tab.Container id="left-tabs-example" defaultActiveKey="summary">
        <div className="lead-head-section mb-5">
          <div className="row mb-5">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-3 company_logo text-center">
                  <Image
                    src={picture}
                    roundedCircle
                    style={{
                      width: "125px",
                      height: "125px",
                      marginTop: "16px",
                    }}
                  />
                </div>
                <div className="col-md-9 company_info">
                  <ul className="p-5">
                    {info?.customer_name && (
                      <div className="row mb-3">
                        <div className="abtn text-white mr-4 ">
                          <AccountCircleIcon
                            fontSize="medium"
                            className="abtn text-success"
                          />
                          &nbsp;{info?.customer_name}
                        </div>
                      </div>
                    )}
                    {info.company_name && (
                      <div className="row mb-3">
                        <div className="abtn text-white mr-4 ">
                          <BusinessOutlined
                            fontSize="medium"
                            className="abtn text-success"
                          />
                          &nbsp;{info.company_name}
                        </div>
                      </div>
                    )}
                    {info.email && (
                      <div className="row mb-3">
                        <div className="abtn text-white mr-4 ">
                          <EmailIcon
                            fontSize="medium"
                            className="abtn text-success"
                          />
                          &nbsp;{info.email}
                        </div>
                      </div>
                    )}

                    {info.mobile_no && (
                      <div className="row mb-3">
                        <div className="abtn text-white mr-4 ">
                          <PhoneIcon
                            fontSize="medium"
                            className="abtn text-success"
                          />
                          &nbsp;{info.mobile_no}
                        </div>
                      </div>
                    )}
                    {info?.city && (
                      <div className="row mb-3">
                        <div className="abtn text-white mr-4 ">
                          <LocationOnIcon
                            fontSize="medium"
                            className="abtn text-success"
                          />
                          &nbsp;{info?.city}
                        </div>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-3" style={{ textAlign: "left" }}>
              {interestedProduct.length > 0 && (
                <>
                  <h6 className="text-white" style={{ marginLeft: "40px" }}>
                    Product
                  </h6>
                  <ul className="text-white">
                    {interestedProduct && interestedProduct.length <= 0 && (
                      <li>
                        <div colSpan="7">No record found.</div>
                      </li>
                    )}

                    {interestedProduct &&
                      interestedProduct.map((i) => (
                        <div>
                          <Link className="text-white abtn ">
                            <DeleteIcon
                              style={{
                                width: "30px",
                                border: "1px solid white",
                              }}
                              onClick={() => removeItem(i.ipid)}
                            />
                          </Link>
                          &nbsp;&nbsp;&nbsp;{i?.name}
                        </div>
                      ))}
                  </ul>
                </>
              )}
            </div>
            <div className="col-md-3 text-right lead-actions">
              {info.id && (
                <ul>
                  <li>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Back</Tooltip>}
                    >
                      <Link to="/leads" className="abtn text-white">
                        <KeyboardBackspaceIcon />
                      </Link>
                    </OverlayTrigger>
                  </li>
                  {user.company_details &&
                    checkValidity(user.company_details.expiry_date) &&
                    user.user_permission &&
                    user.user_permission.Sms &&
                    user.user_permission.Sms.map((item) => {
                      return (
                        item.name === "Send" && (
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Send Email</Tooltip>}
                            >
                              <Link
                                to="#"
                                onClick={() => sendEmail()}
                                className="abtn text-white"
                              >
                                <EmailIcon />
                              </Link>
                            </OverlayTrigger>
                          </li>
                        )
                      );
                    })}

                  {user.company_details &&
                    checkValidity(user.company_details.expiry_date) &&
                    user.user_permission &&
                    user.user_permission.Lead &&
                    user.user_permission.Lead.map((item) => {
                      return (
                        item.name === "Edit" && (
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Edit Lead</Tooltip>}
                            >
                              <Link
                                to={{
                                  pathname: "/leads/" + id + "/edit",
                                  item: info,
                                }}
                                className="abtn text-white"
                              >
                                <EditIcon />
                              </Link>
                            </OverlayTrigger>
                          </li>
                        )
                      );
                    })}

                  {user.company_details &&
                    checkValidity(user.company_details.expiry_date) &&
                    user.user_permission &&
                    user.user_permission.Lead &&
                    user.user_permission.Lead.map((item) => {
                      return (
                        item.name === "Delete" && (
                          <li>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Delete Lead</Tooltip>}
                            >
                              <Link
                                to="#"
                                className="abtn text-white"
                                onClick={() => deleteItem(id)}
                              >
                                <DeleteIcon />
                              </Link>
                            </OverlayTrigger>
                          </li>
                        )
                      );
                    })}

                  <br />
                  <br />
                  <div className="row mb-3">
                    {info.sticky_note && (
                      <div className="abtn text-white ">
                        <label>Sticky Note:</label>
                        <span className="st-note ml-2">{info.sticky_note}</span>
                      </div>
                    )}
                  </div>
                </ul>
              )}
            </div>
          </div>
          <Nav>
            {!leadLock || LeadAssignPermission ? (
              <Nav.Item>
                <Nav.Link eventKey="follow-up">Follow Up</Nav.Link>
              </Nav.Item>
            ) : null}
            {!leadLock || LeadAssignPermission ? (
              <Nav.Item>
                <Nav.Link eventKey="comments">Comments</Nav.Link>
              </Nav.Item>
            ) : null}
            {checkValidity(user.company_details.expiry_date) && (!leadLock || LeadAssignPermission) ? (
              <Nav.Item>
                <Nav.Link eventKey="leadstage">Lead Stage</Nav.Link>
              </Nav.Item>
            ) : (
              ""
            )}

            {/* 
                        <Nav.Item>
                            <Nav.Link eventKey="productInfo">Products & Services</Nav.Link>
                        </Nav.Item>
                        */}
            <Nav.Item>
              <Nav.Link eventKey="summary">Summary</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="company">Company Information</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="updates">Activities</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <Card className="rkcrm-card mb-5">
          <Card.Body>
            <Tab.Content>
              {!leadLock || LeadAssignPermission ? (
                <Tab.Pane eventKey="follow-up">
                  {info.id && <FollowUp lead={info} />}
                </Tab.Pane>
              ) : null}
              {!leadLock || LeadAssignPermission ? (
                <Tab.Pane eventKey="comments">
                  {info.id && (
                    <LeadComments lead={info} stickyInfo={stickyInfo} />
                  )}
                </Tab.Pane>
              ) : null}
              {!leadLock || LeadAssignPermission ? (
                <Tab.Pane eventKey="leadstage">
                  <LeadStage lead={info} />
                </Tab.Pane>
              ) : null}

              <Tab.Pane eventKey="summary">
                <LeadSummary lead={info} stickyNote={stickyNote} />
              </Tab.Pane>
              {/* 
                            <Tab.Pane eventKey="productInfo">
                                Coming Soon...
                            </Tab.Pane>
							*/}

              <Tab.Pane eventKey="updates">
                <LeadActivities lead={info} />
              </Tab.Pane>
              <Tab.Pane eventKey="company">
                <LeadCompanySummary lead={info} />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
      <Modal show={deleteConfirm} onHide={handleClose}>
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          Are you sure you want to delete?
        </Modal.Body>
        <Modal.Footer className="p-3">
          <Button
            variant="danger"
            size="sm"
            onClick={handleClose}
            disabled={deleteLoading}
          >
            No
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Loading.." : "Yes"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        dialogClassName="modal-lg"
        className="modal"
        show={mailConfirm}
        onHide={handleMailClose}
      >
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>Send Email</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3"></Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleMail}>
          <div className="row">
            <div className="col-md-5">
              <Form.Group>
                <Form.Label className="ml-3">
                  {" "}
                  Email Template<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  size="sm"
                  name="template_id"
                  as="select"
                  onChange={handleChange}
                  autoComplete="off"
                  className="custom-select tele-drop ml-3"
                  placeholder="Select template"
                  required
                >
                  <option value="">Select email template</option>
                  {emailTemplate.map((i) => (
                    <option
                      value={i.email_template_id}
                      key={"e" + i.email_template_id}
                    >
                      {i.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select email template
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="ml-3">Email Id</Form.Label>
                <Form.Control
                  name="email"
                  defaultValue={info.email}
                  size="sm"
                  type="email"
                  autoComplete="off"
                  className="ml-2"
                  placeholder="Enter email"
                  required
                />
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5">
              <Form.Group>
                <Form.Label className="ml-3">CC</Form.Label>
                <Form.Control
                  name="cc_email"
                  defaultValue={info.cc_email}
                  size="sm"
                  type="text"
                  autoComplete="off"
                  className="ml-3"
                  placeholder="Enter CC"
                />
                <p className="text-muted" style={{ marginLeft: "10px" }}>
                  *Enter Email addressed separted by comma
                </p>
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="ml-3">BCC</Form.Label>
                <Form.Control
                  name="bcc_email"
                  defaultValue={info.bcc_email}
                  size="sm"
                  type="text"
                  autoComplete="off"
                  className="ml-3"
                  placeholder="Enter BCC"
                />
                <p className="text-muted" style={{ marginLeft: "10px" }}>
                  *Enter Email addressed separted by comma
                </p>
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-11">
              <Form.Group>
                <Form.Label className="ml-3">Subject</Form.Label>
                <Form.Control
                  name="subject"
                  defaultValue={template.subject}
                  size="sm"
                  type="text"
                  autoComplete="off"
                  className="ml-3"
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
            <div className="col-md-11">
              <Form.Group className="ml-3">
                <Form.Label className="ml-1">Email Content:</Form.Label>
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
          <Modal.Footer className="">
            <Button
              variant="danger"
              size="sm"
              onClick={handleMailClose}
              disabled={sendLoading}
            >
              Cancel
            </Button>
            <Button
              className="btnnote"
              type="submit"
              variant="primary"
              size="sm"
              disabled={sendLoading}
            >
              {sendLoading ? "Loading.." : "Send"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={removeConfirm} onHide={handleClosee}>
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">Are you sure want to delete?</Modal.Body>
        <Modal.Footer className="p-3">
          <Button
            variant="danger"
            size="sm"
            onClick={handleClosee}
            disabled={removeLoading}
          >
            No
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRemove}
            disabled={removeLoading}
          >
            {deleteLoading ? "Loading.." : "Yes"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={UnlockConfirm}
        onHide={handleUnlockClose}
        onSubmit={handleUnlock}
      >
        <Form noValidate validated={validated} onSubmit={handleUnlock}>
          <Modal.Header className="p-3" closeButton>
            <Modal.Title>Add Reason</Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-3">
            <div className="row">
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label>unlock</Form.Label>
                  <Form.Control
                    name="unlock"
                    size="sm"
                    type="text"
                    autoComplete="off"
                  />
                  {/*                   <div class="form-check text-white">
                    <input class="tele-checkbox checkboxes" type="checkbox" onChange={e => handleCheck(e)} defaultValue={id} defaultChecked={info.is_lock === 1 ? 'true' : 'false'} /> Are you want to lock this contact?
                  </div>
  */}
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="p-3">
            <Button
              variant="danger"
              size="sm"
              onClick={handleUnlockClose}
              disabled={sendLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={sendLoading}
            >
              {sendLoading ? "Loading.." : "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default React.memo(Show);
