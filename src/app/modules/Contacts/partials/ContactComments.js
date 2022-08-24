import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import Note from "./Note";
import Pagination from "@material-ui/lab/Pagination";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";
import App from "../../../Configs/app";
import jQuery from "jquery";
import { useSelector } from "react-redux";

export default React.memo(function({ contact }) {
  const { addToast } = useToasts();
  const [loading, setLoading] = React.useState(false);
  const [listingLoading, setListingLoading] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [notes, setNotes] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const { user } = useSelector((state) => state.auth);

  const getData = React.useCallback(() => {
    setListingLoading(true);
    Actions.notes({ page: currentPage, contact_id: contact.id }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setNotes(response.data.teleContactNote);
          setRecords(response.data.totalRecord);
        }
        setListingLoading(false);
      }
    );
  }, [currentPage, contact]);
  React.useEffect(getData, [currentPage]);


  const totalPages = Math.ceil(records / App.perPage);

  const addNote = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.contact_id = contact.id;
      formDataObj.is_sticky_note = checked;

      Actions.addnote(formDataObj).then((response) => {
        setLoading(false);
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
        if (response.status === "SUCCESS") {
          var isSticky = jQuery(".is-sticky:checked").val();
          if (isSticky == "on") {
            jQuery(".st-note").text(jQuery(".cmt").val());
          }
          form.reset();
          getData();
        }
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };
  var checked = false;
  const handleCheck = (e) => {
    if (e.target.checked === true) {
      checked = true;
    } else {
      checked = false;
    }
  };

  const checkValidity = (date) => {
    return new Date(date).getTime() > new Date(new Date()).getTime();
  };

  return (
    <div className="lead-comments">
      <div className="add-comment-section mb-5">
        {checkValidity(user.company_details.expiry_date) && (
          <Form noValidate validated={validated} onSubmit={addNote}>
            <div className="row">
              <div className="col-sm-12">
                <Form.Group>
                  <Form.Control
                    name="note"
                    size="sm"
                    as="textarea"
                    placeholder="Enter note."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter note.
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              {
                <div className="form-check">
                  {/* {comments.is_sticky_note == 1 ?  */}
                  <input
                    className="tele-checkbox checkboxes is-sticky"
                    type="checkbox"
                    onChange={(e) => handleCheck(e)}
                    // defaultValue={lead_id}
                    // defaultChecked="true"
                  />
                  {/* <input class="checkboxes" type="checkbox"   defaultChecked={is_sticky_note === checked ?'1':'0'} />  */}
                  &nbsp;Are you want to show the comment to sticky note?
                </div>
              }

              <div className="col-sm-12">
                <Button
                  variant="primary"
                  type="submit"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? "Loading.." : "Add Note"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </div>
      <div className="comments-section mb-5">
        {listingLoading && (
          <div className="text-center">
            <Spinner animation="border" variant="info" />
          </div>
        )}
        {!listingLoading &&
          notes.map((item) => <Note note={item} key={"comment-" + item.id} />)}
      </div>

      {!listingLoading && totalPages > 0 && (
        <div className="comments-pagination">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            variant="outlined"
          />
        </div>
      )}
    </div>
  );
});
