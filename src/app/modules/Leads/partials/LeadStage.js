import React from "react";
import { Link, useParams, Redirect } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import StageHistory from "./StageHistory";
import Pagination from "@material-ui/lab/Pagination";
import { useToasts } from "react-toast-notifications";
import { Modal } from "react-bootstrap";
import TimePicker from "react-bootstrap-time-picker";
import Actions from "../Actions";
import App from "../../../Configs/app";

export default React.memo(function({ lead }) {
  const { id } = useParams();
  const { addToast } = useToasts();
  const [loading, setLoading] = React.useState(false);
  const [listingLoading, setListingLoading] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [history, setHistory] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [time, setTime] = React.useState("");
  const [sendContact, setContactRecord] = React.useState(false);
  const [ContactConfirm, setContactConfirm] = React.useState(false);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [leadredirect, setLeadRedirect] = React.useState(false);

  const getData = React.useCallback(() => {
    setListingLoading(true);
    Actions.showStage(id).then((response) => {
      if (response.status === "SUCCESS") {
        setCurrentPage(response.data.current);
        setHistory(response.data.leadStage);
        setRecords(response.data.totalRecord);
      }
      setListingLoading(false);
    });
  }, []);
  React.useEffect(getData, [currentPage]);

  const totalPages = Math.ceil(records / App.perPage);

  const addStage = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.lead_id = lead.id;

      Actions.addleadstage(formDataObj).then((response) => {
        setLoading(false);
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
        if (response.status === "SUCCESS") {
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

  return (
    <>
      <div className="lead-comments">
        <div className="add-comment-section mb-5">
          <Form noValidate validated={validated} onSubmit={addStage}>
            <div className="row">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Group>
                      <Form.Label>Lead Stage</Form.Label>
                      <Form.Control
                        size="sm"
                        name="lead_stage"
                        as="select"
                        autoComplete="off"
                        placeholder="Select lead stage"
                      >
                        <option value="">Select lead stage</option>
                        <option value="cold">Cold</option>
                        <option value="warm">Warm</option>
                        <option value="hot">Hot</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                        <option value="crossupsell">Cross-Sell/Up-Sell</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Please select lead stage
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  <div className="col-sm-4 mt-8">
                    <Button
                      variant="primary"
                      type="submit"
                      size="sm"
                      disabled={loading}
                    >
                      {loading ? "Loading.." : "Add lead stage"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className="comments-section">
          {listingLoading && (
            <div className="text-center">
              <Spinner animation="border" variant="info" />
            </div>
          )}
          {!listingLoading &&
            history.map((item) => (
              <StageHistory history={item} key={"history-" + item.id} />
            ))}
        </div>

        {/* {!listingLoading && (
                <div className="comments-pagination">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                        variant="outlined"
                    />
                </div>
            )} */}
      </div>
    </>
  );
});
