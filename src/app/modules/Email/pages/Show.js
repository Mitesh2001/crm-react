import React from "react";
import { Link, useLocation, useParams, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import {
  Card,
  Image,
  Tab,
  Nav,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
} from "react-bootstrap";
import Summary from "../partials/Summary";
// import CompanySummary from '../partials/CompanySummary';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import EmailIcon from "@material-ui/icons/Email";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";
import moment from "moment";
import App from "../../../Configs/app";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";

function Show() {
  let location = useLocation();
  const { id } = useParams();
  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Email Information");

  const [info, setInfo] = React.useState(location.item ? location.item : {});
  const [redirect, setRedirect] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          setInfo(response.data.email);
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

  const picture =
    info?.picture && info.picture !== ""
      ? App.assetUrl + info.picture
      : toAbsoluteUrl("/media/users/default.jpg");
  if (redirect) {
    return <Redirect to="/email" />;
  } else {
    return (
      <>
        <Tab.Container id="left-tabs-example" defaultActiveKey="summary">
          <div className="lead-head-section mb-5">
            <div className="row mb-5">
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-2 company_logo text-center">
                    <Image src={picture} roundedCircle />
                  </div>
                  <div className="col-md-10 company_info">
                    <ul className="p-5">
                      <li>
                        <h3>{info?.name}</h3>
                      </li>
                      {info?.company_name && <li>{info.company_name}</li>}
                      <li>
                        Created At: {moment(info?.created_at).format("lll")}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-right lead-actions">
                {info.id && (
                  <ul>
                    <li>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Back</Tooltip>}
                      >
                        <Link to="/email" className="abtn text-white">
                          <KeyboardBackspaceIcon />
                        </Link>
                      </OverlayTrigger>
                    </li>
                    <li>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Send Email</Tooltip>}
                      >
                        <Link to="#" className="abtn text-white">
                          <EmailIcon />
                        </Link>
                      </OverlayTrigger>
                    </li>
                    <li>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit Email</Tooltip>}
                      >
                        <Link
                          to={{
                            pathname: "/edit/" + id + "/edit",
                            item: info,
                          }}
                          className="abtn text-white"
                        >
                          <EditIcon />
                        </Link>
                      </OverlayTrigger>
                    </li>
                    <li>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete Email</Tooltip>}
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
                  </ul>
                )}
              </div>
            </div>
            <Nav>
              <Nav.Item>
                <Nav.Link eventKey="summary">Email Summary</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          {/* <Card className="rkcrm-card mb-5">
                    <Card.Body>
                        <Tab.Content>
                            <Tab.Pane eventKey="summary">
                                <Summary item={info} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="company">
                                <CompanySummary item={info} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Card.Body>
                </Card> */}
        </Tab.Container>
        <Modal show={deleteConfirm} onHide={handleClose}>
          <Modal.Header className="p-3" closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">Are you sure want to delete?</Modal.Body>
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
      </>
    );
  }
}

export default React.memo(Show);
