import React from "react";
import { useToasts } from "react-toast-notifications";
import { Button, Form } from "react-bootstrap";
import Actions from "../Actions";
import { useParams } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import jQuery from "jquery";

function Assigncontact({ contact }) {
  const { addToast } = useToasts();
  const { id } = useParams();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  const [validated, setValidated] = React.useState(false);

  const postUsers = React.useCallback(() => {
    Actions.listEmployee().then((data) => {
      if (data.status === "SUCCESS") {
        setUsers(data.data.employees);
      }
    });
  }, []);
  React.useEffect(postUsers, []);

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      // var add_user = jQuery(".tele-drop").val();

      // formDataObj.user_id= add_user;
      formDataObj.contact_id = id;

      Actions.assignContact(formDataObj).then((response) => {
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

  return (
    <>
      {" "}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>
              {" "}
              Users<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              size="sm"
              name="tele_caller_id"
              as="select"
              autoComplete="off"
              className="custom-select tele-drop"
              placeholder="Select User"
              required
            >
              {/* <input name="inputdrop" type="text" placeholder="Search" /> */}
              <option value="">Select User</option>
              {users.map((i) => (
                <option value={i.id} key={"e" + i.id}>
                  ({i.id}) {i.name}{" "}
                  {i.designation ? "(" + i.designation + ")" : null}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select user
            </Form.Control.Feedback>
          </Form.Group>
          <div className="row">
            <div className="col-md-12">
              <Button
                size="sm"
                variant="primary"
                className="rk-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading.." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}

export default React.memo(Assigncontact);
