import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import Comment from "./Comment";
import Pagination from "@material-ui/lab/Pagination";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";
import App from "../../../Configs/app";
import jQuery from "jquery";
import { useSelector } from "react-redux";

export default React.memo(function({ lead, stickyInfo }) {
  const { addToast } = useToasts();
  const [loading, setLoading] = React.useState(false);
  const [listingLoading, setListingLoading] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [checked, setChecked] = React.useState(false);
  const { user } = useSelector((state) => state.auth);

  const getData = React.useCallback(() => {
    setListingLoading(true);
    Actions.comments({ page: currentPage, lead_id: lead.id }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setComments(response.data.comments);
          setRecords(response.data.totalRecord);
        }
        setListingLoading(false);
      }
    );
  }, [currentPage, lead]);
  React.useEffect(getData, [currentPage]);

  const totalPages = Math.ceil(records / App.perPage);

  const addComment = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      if (checked) {
        stickyInfo(formDataObj.remark);
      }
      formDataObj.lead_id = lead.id;
      formDataObj.is_sticky_note = checked;

      Actions.addComment(formDataObj).then((response) => {
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
  const handleCheck = (e) => {
    if (e.target.checked === true) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };
  const checkValidity = (date) => {
    return new Date(date).getTime() > new Date(new Date()).getTime();
  };
  return (
    <div className="lead-comments">
      <div className="add-comment-section mb-5">
        {checkValidity(user.company_details.expiry_date) && (
          <Form noValidate validated={validated} onSubmit={addComment}>
            <div className="row">
              <div className="col-sm-12">
                <Form.Group>
                  <Form.Control
                    name="remark"
                    size="sm"
                    as="textarea"
                    placeholder="Enter comment."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter comment
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              {
                <div className="form-check text-white">
                  {/* {comments.is_sticky_note == 1 ?  */}
                  <input
                    id="is_Sticky"
                    className="tele-checkbox checkboxes is-sticky"
                    type="checkbox"
                    onChange={(e) => handleCheck(e)}
                    // defaultValue={lead_id}
                    // defaultChecked="true"
                  />
                  <label
                    style={{ color: "black", marginLeft: "8px" }}
                    for="is_Sticky"
                  >
                    Add this as Sticky Note
                  </label>
                  {/* <input className="checkboxes" type="checkbox"   defaultChecked={is_sticky_note === checked ?'1':'0'} />  */}
                </div>
              }

              <div className="col-sm-12">
                <Button
                  variant="primary"
                  type="submit"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? "Loading.." : "Add Comment"}
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
          comments.map((item) => (
            <Comment comment={item} key={"comment-" + item.id} />
          ))}
      </div>

      {!listingLoading && checkValidity(user.company_details.expiry_date) && (
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
