import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Form, Spinner, minDate, Modal } from "react-bootstrap";
import FollowUpNotes from "./FollowUpNotes";
import { useSelector } from "react-redux";
import Pagination from "@material-ui/lab/Pagination";
import { useToasts } from "react-toast-notifications";
import TimePicker from "react-bootstrap-time-picker";
//import DatePicker from 'react-bootstrap-date-picker';
import Actions from "../Actions";
import App from "../../../Configs/app";
import moment from "moment";
import jQuery from "jquery";
import DatePicker from "react-datetime";
import "react-datetime/css/react-datetime.css";

export default React.memo(function({ lead }) {
  const { user } = useSelector((state) => state.auth);
  const { addToast } = useToasts();
  const user_id = useSelector((state) => state.auth.user.id);

  const [loading, setLoading] = React.useState(false);
  const [listingLoading, setListingLoading] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [followUp, setFollowUp] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [time, setTime] = React.useState("");
  const [sendContact, setContactRecord] = React.useState(false);
  const [ContactConfirm, setContactConfirm] = React.useState(false);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [leadredirect, setLeadRedirect] = React.useState(false);
  const [list, setList] = React.useState([]);
  const [date, setDate] = React.useState("");
  const [self, setSelf] = React.useState(false);

  let inputProps = {
    placeholder: "Select Follow Up date",
  };

  const getData = React.useCallback(() => {
    setListingLoading(true);
    Actions.followUp({ follow_up_id: lead.id, type: 1 }).then((response) => {
      if (response.status === "SUCCESS") {
        setCurrentPage(response.data.current);
        setFollowUp(response.data.followUp);
        setRecords(response.data.totalRecord);
      }
      setListingLoading(false);
    });
  }, [currentPage, lead]);
  React.useEffect(getData, [currentPage]);

  const totalPages = Math.ceil(records / App.perPage);

  const addFollowup = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.follow_up_id = lead.id;
      formDataObj.type = 1;
      if (formDataObj.assign_type === "3") {
        formDataObj.user_id = user_id;
      }
      if (formDataObj.user_id && formDataObj.user_id !== "") {
        var dateFormat = moment(date).format("YYYY-MM-DD");
        var timeFormat = moment(date).format("HH:mm:ss");
        formDataObj.date = dateFormat;
        formDataObj.time = timeFormat;
        Actions.addfollowup(formDataObj).then((response) => {
          setLoading(false);

          if (response.status === "SUCCESS") {
            addToast(response.message, {
              appearance: "success",
              autoDismiss: true,
            });
            form.reset();
            getData();
          }
          else{
            if(response.message === "The date does not match the format Y-m-d.,The time does not match the format H:i:s."){
              addToast("Date field is required", {
                appearance: "error",
                autoDismiss: true,
              });
            }else{
              addToast(response.message, {
                appearance: "error",
                autoDismiss: true,
              });
            }
          }

        });
        setValidated(false);
      } else {
        addToast("List field is required", {
          appearance: "error",
          autoDismiss: true,
        });
        setLoading(false);
      }
    } else {
      setValidated(true);
      setLoading(false);
    }
  };

  const getList = (value) => {
    jQuery("#assign").show();
    if (value == "2") {
      Actions.listEmployee().then((response) => {
        if (response.status === "SUCCESS") {
          setList(response.data.employees);
        }
      });
    }

    if (value == "1") {
      Actions.listRole().then((response) => {
        if (response.status === "SUCCESS") {
          setList(response.data.roles);
        }
      });
    }
    if (value == "3") {
      jQuery("#assign").hide();
    }
  };

  /*     const handleTimeChange = (time) => {
        setTime(time);
    }
 */
  const handleDateChange = (date, val) => {
    setDate(date);
    setDt(val);
  };

  const [dt, setDt] = useState(moment());
  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  const checkValidity = (date) => {
    return new Date(date).getTime() > new Date(new Date()).getTime();
  };

  return (
    <>
      <div className="lead-comments">
        <div className="add-comment-section mb-5">
          {checkValidity(user.company_details.expiry_date) && (
            <Form noValidate validated={validated} onSubmit={addFollowup}>
              <div className="row">
                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-sm-6">
                      <Form.Group>
                        <Form.Label>
                          Follow Up Type<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          size="sm"
                          name="follow_up_type"
                          as="select"
                          autoComplete="off"
                          placeholder="Select type"
                          style={{ height: "38px" }}
                          required
                        >
                          <option value="">Select follow up type</option>
                          <option value="call">Call</option>
                          <option value="visit">Visit</option>
                          <option value="meeting">Meeting</option>
                          <option value="email">Email</option>
                          <option value="task">Task</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Please select follow up type
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-sm-6">
                      <Form.Group>
                        <Form.Label>
                          Select Date<span className="text-danger">*</span>
                        </Form.Label>

                        <DatePicker
                          isValidDate={disablePastDt}
                          inputProps={inputProps}
                          // value={dt}
                          //value={date}
                          className="followup-datetime"
                          onChange={handleDateChange}
                          dateFormat="YYYY-MM-DD"
                          timeFormat="hh:mm A"
                          //onChange={val => setDt(val)}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please select date and time
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <Form.Group>
                    <Form.Label>
                      Enter Follow up<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="note"
                      size="sm"
                      as="textarea"
                      placeholder="Enter follow up"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter follow up
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-sm-6">
                      <Form.Group>
                        <Form.Label>
                          Assign to<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          size="sm"
                          name="assign_type"
                          as="select"
                          autoComplete="off"
                          placeholder="Select Assign"
                          onChange={(e) => {
                            getList(e.target.value);
                          }}
                          style={{ height: "38px" }}
                          required
                        >
                          <option value="">Select Assign</option>
                          <option value="1">Assign to Role</option>
                          <option value="2">Assign to User</option>
                          <option value="3">Assign to Self</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Please select lead stage
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-sm-6" id="assign">
                      <Form.Group>
                        <Form.Label>
                          List<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          size="sm"
                          name="user_id"
                          as="select"
                          autoComplete="off"
                          placeholder="Select Assign"
                          style={{ height: "38px" }}
                        >
                          <option value="">Select Assign</option>
                          {list.map((i) => (
                            <option value={i.id} key={"ls" + i.id}>
                              {i.name}
                            </option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Please select lead stage
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <Button
                    variant="primary"
                    type="submit"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? "Loading.." : "Add follow up"}
                  </Button>
                  {/* <Button className="ml-3" size="sm" variant="outline-secondary" onClick={() => sendLead(contact.id)} >Convert to Lead</Button> */}
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
            followUp.map((item) => (
              <FollowUpNotes
                followupNote={item}
                key={"followupNote-" + item.id}
              />
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
    </>
  );
});
