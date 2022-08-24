import React from "react";
import { Link, Redirect } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useSelector } from "react-redux";
import Actions from "../Actions";
import {
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Button,
  Modal,
  Collapse,
  Form,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
// must manually import the stylesheets for each plugin
// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";

export default function Calendar() {
  // const options = [
  //   {
  //     id: 176,
  //     value: "Ashutosh Shrimal",
  //     label: "Ashutosh Shrimal",
  //   },
  //   {
  //     id: 20,
  //     value: "Anish Parikh",
  //     label: "Anish Parikh",
  //   },
  //   {
  //     id: 15,
  //     value: "Drasthi",
  //     label: "Drasthi",
  //   },
  //   {
  //     id: 175,
  //     value: "Vivek Soni",
  //     label: "Vivek Soni",
  //   },
  //   {
  //     id: 14,
  //     value: "Mayank Dulera",
  //     label: "Mayank Dulera",
  //   },
  //   {
  //     id: 2,
  //     value: "Demo User",
  //     label: "Demo User",
  //   },
  // ];
  const [options, setOptions] = React.useState([]);
  const { addToast } = useToasts();
  const calendarComponentRef = React.createRef();
  const [addEvent, setAddEvent] = React.useState(false);
  const [allDay, setAllDay] = React.useState(0);
  const [calendarEvents, setCalendarEvents] = React.useState([
    // initial event data
    // {
    //   title: "event 1",
    //   allDay: false,
    //   id: "22",
    //   type: "1",
    //   start: "2021-07-05T07:00:00",
    //   end: "2021-07-05T09:00:00",
    // },
    // {
    //   title: "event 2",
    //   allDay: false,
    //   id: "73",
    //   type: "1",
    //   start: "2021-07-05T10:00:00",
    //   // backgroundColor: "green",
    //   // borderColor: "grey",
    //   end: "2021-07-05T12:00:00",
    // },
  ]);
  const [calendarWeekends, setCalendarWeekends] = React.useState(true);
  const user_id = useSelector((state) => state.auth.user.id);

  const [user, setUser] = React.useState(user_id);
  const [start, setStart] = React.useState(new Date());
  const endDate = new Date();
  endDate.setMinutes(endDate.getMinutes() + 30);
  const [end, setEnd] = React.useState(endDate);
  const [title, setTitle] = React.useState("");
  const [sendLoading, setSendLoading] = React.useState(false);
  const [sendEventLoading, setSendEventLoading] = React.useState(false);
  const [imp, setImp] = React.useState("false");
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [selectedEventOptions, setSelectedEventOptions] = React.useState([]);
  const [showEvent, setShowEvent] = React.useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = React.useState("");
  const [selectedEventStart, setSelectedEventStart] = React.useState("");
  const [selectedEventEnd, setSelectedEventEnd] = React.useState("");
  const [
    selectedEventDescription,
    setSelectedEventDescription,
  ] = React.useState("");
  const [id, setId] = React.useState("");
  const [type, setType] = React.useState("false");
  const [canEdit, setCanEdit] = React.useState(false);
  const [isFollowUp, setIsFollowUp] = React.useState(false);
  const [leadFollowUpEvents, setLeadFollowUpEvents] = React.useState([]);
  const [contactFollowUpEvents, setContactFollowUpEvents] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [loadButtonClicked, setLoadButtonClicked] = React.useState(false);
  const [loadButtonLoading, setLoadButtonLoading] = React.useState(false);
  const [selectedFollowUpType, setSelectedFollowType] = React.useState();
  const [selectedEventUrl, setSelectedEventUrl] = React.useState("");
  const [selectedEventCreatedBy, setSelectedEventCreatedBy] = React.useState(
    ""
  );
  const getEvents = React.useCallback(() => {
    Actions.events().then((response) => {
      if (response.status === "SUCCESS") {
        setCalendarEvents(response.data.events);
        setEvents(response.data.events);
      }
    });
  }, []);
  React.useEffect(getEvents, []);
  const getEmployee = React.useCallback(() => {
    Actions.users({ is_calendar: "1" }).then((response) => {
      if (response.status === "SUCCESS") {
        setOptions(response.data.employees);
      }
    });
  }, []);
  React.useEffect(getEmployee, []);

  const loadButtonClick = () => {
    if (!loadButtonClicked) {
      setLoadButtonLoading(true);
      setLoadButtonClicked(true);
      Actions.follow_up({ type: "1", user_id: user_id }).then((response) => {
        if (response.status === "SUCCESS") {
          var formattedLeadDetails = response.data.followUp.map(
            ({
              name,
              date,
              time,
              follow_up_type,
              note,
              follow_up_id,
              get_created_by,
            }) => ({
              title: name,
              start: date + "T" + time,
              allDay: "true",
              description: note,
              follow_up_type,
              eventUrl: "/leads/" + follow_up_id + "/show/",
              get_created_by,
            })
          );
          setLeadFollowUpEvents(formattedLeadDetails);
          Actions.follow_up({ type: "2", user_id: user_id }).then(
            (response) => {
              if (response.status === "SUCCESS") {
                var formattedContactDetails = response.data.followUp.map(
                  ({
                    name,
                    date,
                    time,
                    follow_up_type,
                    note,
                    follow_up_id,
                  }) => ({
                    title: name,
                    start: date + "T" + time,
                    allDay: "true",
                    description: note,
                    follow_up_type,
                    eventUrl: "/contacts/" + follow_up_id + "/show/",
                  })
                );
                setContactFollowUpEvents(formattedContactDetails);
                setCalendarEvents([
                  ...events,
                  ...formattedContactDetails,
                  ...formattedLeadDetails,
                ]);
                setLoadButtonLoading(false);
              }
            }
          );
        }
      });
    } else {
      setLoadButtonClicked(false);
      setLeadFollowUpEvents([]);
      setContactFollowUpEvents([]);
      setCalendarEvents(events);
    }
  };

  const dateTimeUtil = (date) => {
    let dateObj = date;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (typeof date !== "object") {
      dateObj = new Date(date);
    }
    return `${("0" + dateObj.getDate()).slice(-2)}${" " +
      monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
      "0" + dateObj.getHours()
    ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}`;
  };

  function getDropdownButtonLabel({ placeholderButtonLabel, value }) {
    if (value && value.some((o) => o.value === "*")) {
      return `${placeholderButtonLabel}: All Selected`;
    } else {
      return `${placeholderButtonLabel}: ${value.length} selected`;
    }
  }

  function onChange(value, event) {
    if (event.action === "select-option" && event.option.value === "*") {
      this.setState(this.options);
    } else if (
      event.action === "deselect-option" &&
      event.option.value === "*"
    ) {
      this.setState([]);
    } else if (event.action === "deselect-option") {
      this.setState(value.filter((o) => o.value !== "*"));
    } else if (value.length === this.options.length - 1) {
      this.setState(this.options);
    } else {
      this.setState(value);
    }
  }
  const handleClose = () => {
    setAddEvent(false);
    setTitle("");
    setDescription("");
    setStart(new Date());
    const endDatee = new Date();
    endDatee.setMinutes(endDatee.getMinutes() + 30);
    setEnd(endDatee);
    setImp("false");
    setSelectedOptions([]);
    setSendLoading(false);
  };
  const handleSubmit = () => {
    setSendLoading(true);
    let dateStart = start;
    if (typeof date !== "object") {
      dateStart = new Date(start);
    }
    let dateEnd = start;
    if (typeof date !== "object") {
      dateEnd = new Date(end);
    }
    if (title !== "") {
      if (
        end === "" ||
        start === "" ||
        dateEnd.getTime() < dateStart.getTime()
      ) {
        addToast(
          end === ""
            ? "End Date can't be empty"
            : start === ""
            ? "Start Date can't be empty"
            : dateEnd.getTime() < dateStart.getTime() &&
              "EndDate should be after Start date",
          {
            appearance: "error",
            autoDismiss: true,
          }
        );
        setSendLoading(false);
      } else {
        var ids = selectedOptions.map((d) => d.id);
        var index = ids.indexOf("*");
        if (index !== -1) {
          ids.splice(index, 1);
        }
        ids.push(user_id);
        ids = [...new Set(ids)];
        if (imp == "true") {
          Actions.add({
            start,
            end,
            title,
            description,
            user_id: ids.toString(),
            allDay,
            type: "2",
          }).then((response) => {
            if (response.status === "SUCCESS") {
              Actions.events().then((response) => {
                if (response.status === "SUCCESS") {
                  setCalendarEvents([
                    ...response.data.events,
                    ...contactFollowUpEvents,
                    ...leadFollowUpEvents,
                  ]);
                  setEvents(response.data.events);
                  addToast("Event Added", {
                    appearance: "success",
                    autoDismiss: true,
                  });
                } else {
                  addToast("Some Error occured in Adding Event", {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              });
            } else {
              addToast("Some Error occured in Fetching Event", {
                appearance: "error",
                autoDismiss: true,
              });
            }
          });
        } else {
          Actions.add({
            start,
            end,
            title,
            description,
            user_id: ids.toString(),
            allDay,
            type: "1",
          }).then((response) => {
            if (response.status === "SUCCESS") {
              Actions.events().then((response) => {
                if (response.status === "SUCCESS") {
                  setCalendarEvents([
                    ...response.data.events,
                    ...contactFollowUpEvents,
                    ...leadFollowUpEvents,
                  ]);
                  setEvents(response.data.events);
                  addToast("Event Added", {
                    appearance: "success",
                    autoDismiss: true,
                  });
                } else {
                  addToast("Some Error occured in Adding Event", {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              });
            } else {
              addToast("Some Error occured in Fetching Event", {
                appearance: "error",
                autoDismiss: true,
              });
            }
          });
        }
        setTitle("");
        setDescription("");
        setStart(new Date());
        const endDatee = new Date();
        endDatee.setMinutes(endDatee.getMinutes() + 30);
        setEnd(endDatee);
        setImp("false");
        setSelectedOptions([]);
        setSendLoading(false);
        setAddEvent(false);
      }
    }
  };

  const handleEventClick = (arg) => {
    if (!arg.event.extendedProps.eventUrl) {
      setId(arg.event.id);
      setSelectedEventTitle(arg.event.title);
      setSelectedEventStart(arg.event.startStr);
      setSelectedEventEnd(arg.event.endStr);
      setSelectedEventDescription(arg.event.extendedProps.description);
      setType(arg.event.extendedProps.type == 2 ? "true" : "false");
      const idArray = arg.event.extendedProps.user_id
        .split(",")
        .map((d) => parseInt(d, 10));
      var ids = options.map((d) => {
        if (idArray.includes(d.id)) {
          return d;
        } else {
          return null;
        }
      });
      ids = ids.filter(function(el) {
        return el != null;
      });
      setSelectedEventOptions(ids);
      if (arg.event.extendedProps.created_by == user_id) {
        setCanEdit(true);
      }
      setShowEvent(true);
    } else {
      setSelectedEventTitle(arg.event.title);
      setSelectedEventStart(arg.event.startStr);
      setSelectedEventDescription(arg.event.extendedProps.description);
      setSelectedFollowType(arg.event.extendedProps.follow_up_type);
      setSelectedEventUrl(arg.event.extendedProps.eventUrl);
      arg.event.extendedProps.get_created_by &&
        setSelectedEventCreatedBy(arg.event.extendedProps.get_created_by.name);
      setShowEvent(true);
    }
  };

  const handleDateClick = (arg) => {
    setAddEvent(true);
  };
  const renderEventContent = (eventInfo) => {
    return (
      <>
        {eventInfo.event.extendedProps.eventUrl ? (
          <div style={{ borderColor: "black",backgroundColor: eventInfo.event.extendedProps.follow_up_type==="call"?"blue":eventInfo.event.extendedProps.follow_up_type==="meeting"?"red":eventInfo.event.extendedProps.follow_up_type==="visit"?"orange":eventInfo.event.extendedProps.follow_up_type==="email"?"purple":eventInfo.event.extendedProps.follow_up_type==="task"?"green":"currentColor" }}>
            {eventInfo.event.title !== null &&
              eventInfo.event.title !== "null" &&
              eventInfo.event.title !== "" && (
                <i>{eventInfo.event.title.substr(0, 12)}-</i>
              )}
            <i>{eventInfo.event.extendedProps.follow_up_type}</i>
            {eventInfo.timeText && <i>{eventInfo.timeText}</i>}
          </div>
        ) : eventInfo.event.extendedProps.type == "2" ? (
          <div
            style={{
              backgroundColor: "#4593cd",
              color: "#fff",
            }}
          >
            <i>{eventInfo.event.title.substr(0, 12)}</i>-
            <i>{eventInfo.timeText}</i>
          </div>
        ) : (
          <div>
            <i>{eventInfo.event.title.substr(0, 12)}</i>-
            <i>{eventInfo.timeText}</i>
          </div>
        )}
      </>
    );
  };

  const handleDelete = () => {
    Actions.delete(id).then((response) => {
      if (response.status === "SUCCESS") {
        Actions.events().then((response) => {
          if (response.status === "SUCCESS") {
            addToast("Event deleted successfully!", {
              appearance: "success",
              autoDismiss: true,
            });
            setCalendarEvents([
              ...response.data.events,
              ...contactFollowUpEvents,
              ...leadFollowUpEvents,
            ]);
            setEvents(response.data.events);
            setId("");
            setShowEvent(false);
            setSelectedEventTitle("");
            setSelectedEventStart("");
            setSelectedEventEnd("");
          }
        });
      }
    });
  };
  const handleUpdate = () => {
    setSendEventLoading(true);
    if (selectedEventTitle !== "") {
      if (selectedEventEnd < selectedEventStart) {
        addToast("endDate should be after start date", {
          appearance: "error",
          autoDismiss: true,
        });
        setSendEventLoading(false);
      } else {
        var ids = selectedEventOptions.map((d) => d.id);
        var index = ids.indexOf("*");
        if (index !== -1) {
          ids.splice(index, 1);
        }
        ids.push(user_id);
        ids = [...new Set(ids)];
        if (type == "true") {
          Actions.update({
            id,
            start: selectedEventStart,
            end: selectedEventEnd,
            title: selectedEventTitle,
            description: selectedEventDescription,
            user_id: ids.toString(),
            allDay,
            type: "2",
          }).then((response) => {
            if (response.status === "SUCCESS") {
              Actions.events().then((response) => {
                if (response.status === "SUCCESS") {
                  setCalendarEvents([
                    ...response.data.events,
                    ...contactFollowUpEvents,
                    ...leadFollowUpEvents,
                  ]);
                  setEvents(response.data.events);
                  addToast("Event Updated", {
                    appearance: "success",
                    autoDismiss: true,
                  });
                } else {
                  addToast("Some Error occured in Fetching Event", {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              });
            } else {
              addToast("Some Error occured in Updating Event", {
                appearance: "error",
                autoDismiss: true,
              });
            }
          });
        } else {
          Actions.update({
            id,
            start: selectedEventStart,
            end: selectedEventEnd,
            title: selectedEventTitle,
            description: selectedEventDescription,
            user_id: ids.toString(),
            allDay,
            type: "1",
          }).then((response) => {
            if (response.status === "SUCCESS") {
              Actions.events().then((response) => {
                if (response.status === "SUCCESS") {
                  setCalendarEvents([
                    ...response.data.events,
                    ...contactFollowUpEvents,
                    ...leadFollowUpEvents,
                  ]);
                  setEvents(response.data.events);
                  addToast("Event Updated", {
                    appearance: "success",
                    autoDismiss: true,
                  });
                } else {
                  addToast("Some Error occured in Fetching Event", {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              });
            } else {
              addToast("Some Error occured in Updating Event", {
                appearance: "error",
                autoDismiss: true,
              });
            }
          });
        }
        setSelectedEventTitle("");
        setSelectedEventStart(new Date());
        setSelectedEventEnd(new Date());
        setType("false");
        setSelectedEventOptions([]);
        setSendEventLoading(false);
        setShowEvent(false);
      }
    }
  };

  const formatDate = (date) => {
    let dateObj = date;
    if (typeof date !== "object") {
      dateObj = new Date(date);
    }
    return `${dateObj.getFullYear()}-${("0" + (dateObj.getMonth() + 1)).slice(
      -2
    )}-${("0" + dateObj.getDate()).slice(-2)}T${(
      "0" + dateObj.getHours()
    ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}`;
  };

  return (
    <>
      <div className="demo-app">
        <div className="demo-app-calendar">
          <div style={{ textAlign: "right", marginBottom: "5px" }}>
            <Button
              variant="primary"
              size="sm"
              className="rk-btn rk-btn-icon"
              disabled={loadButtonLoading}
              onClick={loadButtonClick}
            >
              <RefreshIcon />
              &nbsp;
              {loadButtonLoading
                ? "Loading.."
                : loadButtonClicked
                ? "Remove Follow Ups"
                : "Load Follow Ups"}
            </Button>
          </div>
          <FullCalendar
            defaultView="listWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "listWeek,dayGridMonth,timeGridWeek,timeGridDay",
            }}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            ref={calendarComponentRef}
            weekends={calendarWeekends}
            events={calendarEvents}
            dateClick={handleDateClick}
          />
        </div>
        <Modal show={addEvent}>
          <Modal.Header className="p-3" closeButton>
            <Modal.Title>Add Event</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">
            <div className="row">
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label>Select User</Form.Label>
                  <div style={{ width: "100%" }}>
                    <ReactMultiSelectCheckboxes
                      options={[
                        { label: "All", value: "*", id: "*" },
                        ...options,
                      ]}
                      placeholderButtonLabel="Select Users"
                      getDropdownButtonLabel={getDropdownButtonLabel}
                      value={selectedOptions}
                      onChange={onChange}
                      setState={setSelectedOptions}
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    value={title}
                    placeholder="Enter Title"
                    onChange={(e) => {
                      setTitle(e.currentTarget.value);
                    }}
                  />
                </Form.Group>
              </div>

              <div className="col-md-12">
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    style={{ width: "100%" }}
                    rows={4}
                    value={description}
                    placeholder="Enter Description"
                    onChange={(e) => {
                      setDescription(e.currentTarget.value);
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Event Start</Form.Label>
                  <input
                    style={{ width: "100%" }}
                    type="datetime-local"
                    value={formatDate(start)}
                    min={formatDate(new Date())}
                    onChange={(e) => {
                      setStart(e.currentTarget.value);
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Event End</Form.Label>
                  <input
                    style={{ width: "100%" }}
                    type="datetime-local"
                    value={formatDate(end)}
                    min={formatDate(start)}
                    onChange={(e) => {
                      setEnd(e.currentTarget.value);
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label>Important</Form.Label>
                  <fieldset
                    value={imp}
                    onChange={(e) => {
                      setImp(e.target.value);
                    }}
                  >
                    <input
                      type="radio"
                      value="true"
                      name="important"
                      checked={imp === "true"}
                    />
                    Yes
                    <input
                      type="radio"
                      value="false"
                      name="important"
                      checked={imp === "false"}
                    />
                    No
                  </fieldset>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="p-3">
            <Button variant="danger" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              {sendLoading ? "Loading.." : "Add"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showEvent}
          onMouseLeave={() => {
            if (showEvent) {
              setShowEvent(!showEvent);
              setId("");
              setSelectedEventTitle("");
              setSelectedEventStart("");
              setSelectedEventEnd("");
              setSelectedEventOptions([]);
              setSelectedEventDescription("");
              setSelectedFollowType("");
              setSelectedEventUrl("");
              setSelectedEventCreatedBy("");
              setCanEdit(false);
            }
          }}
        >
          <Modal.Header className="p-3" closeButton>
            <Modal.Title>Event Info</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">
            {selectedEventUrl === "" ? (
              <div className="row">
                {canEdit && (
                  <div className="col-md-12">
                    <Form.Group>
                      <Form.Label>Select User</Form.Label>
                      <div style={{ width: "100%" }}>
                        <ReactMultiSelectCheckboxes
                          options={[
                            { label: "All", value: "*", id: "*" },
                            ...options,
                          ]}
                          placeholderButtonLabel="Select Users"
                          getDropdownButtonLabel={getDropdownButtonLabel}
                          value={selectedEventOptions}
                          onChange={onChange}
                          setState={setSelectedEventOptions}
                        />
                      </div>
                    </Form.Group>
                  </div>
                )}
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>Event Title</Form.Label>
                    {canEdit ? (
                      <input
                        value={selectedEventTitle}
                        placeholder="Enter Title"
                        style={{ width: "100%" }}
                        type="text"
                        onChange={(e) => {
                          setSelectedEventTitle(e.currentTarget.value);
                        }}
                      />
                    ) : (
                      <h4>{selectedEventTitle}</h4>
                    )}
                  </Form.Group>
                </div>
                {selectedEventDescription && (
                  <div className="col-md-12">
                    <Form.Group>
                      <Form.Label>Event Description</Form.Label>
                      {canEdit ? (
                        <textarea
                          value={selectedEventDescription}
                          placeholder="Enter Description"
                          style={{ width: "100%" }}
                          rows={4}
                          onChange={(e) => {
                            setSelectedEventDescription(e.currentTarget.value);
                          }}
                        />
                      ) : (
                        <h4>{selectedEventDescription}</h4>
                      )}
                    </Form.Group>
                  </div>
                )}
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Event Start</Form.Label>
                    <h4>{dateTimeUtil(selectedEventStart)}</h4>
                    {canEdit && (
                      <input
                        style={{ width: "100%" }}
                        type="datetime-local"
                        value={formatDate(selectedEventStart)}
                        min={formatDate(new Date())}
                        onChange={(e) => {
                          setSelectedEventStart(e.currentTarget.value);
                        }}
                      />
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Event End</Form.Label>
                    <h4>{dateTimeUtil(selectedEventEnd)}</h4>
                    {canEdit && (
                      <input
                        style={{ width: "100%" }}
                        type="datetime-local"
                        value={formatDate(selectedEventEnd)}
                        min={formatDate(selectedEventStart)}
                        onChange={(e) => {
                          setSelectedEventEnd(e.currentTarget.value);
                        }}
                      />
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    {canEdit ? (
                      <>
                        <Form.Label>Important</Form.Label>
                        <fieldset
                          value={type}
                          onChange={(e) => {
                            setType(e.target.value);
                          }}
                        >
                          <input
                            type="radio"
                            value="true"
                            name="important"
                            checked={type === "true"}
                          />
                          Yes
                          <input
                            type="radio"
                            value="false"
                            name="important"
                            checked={type === "false"}
                          />
                          No
                        </fieldset>
                      </>
                    ) : type === "true" ? (
                      <h4>
                        <b>Important Event</b>
                      </h4>
                    ) : null}
                  </Form.Group>
                </div>
              </div>
            ) : (
              <div className="row">
                {selectedEventTitle !== "" &&
                  selectedEventTitle !== null &&
                  selectedEventTitle !== "null" && (
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>Event Title</Form.Label>
                        <h4>{selectedEventTitle}</h4>
                      </Form.Group>
                    </div>
                  )}
                {selectedFollowUpType !== "" && (
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Type</Form.Label>
                      <h4>{selectedFollowUpType}</h4>
                    </Form.Group>
                  </div>
                )}
                {selectedEventDescription !== "" && (
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Event Description</Form.Label>
                      <h4>{selectedEventDescription}</h4>
                    </Form.Group>
                  </div>
                )}{" "}
                {selectedEventStart !== "" && (
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Event Start</Form.Label>
                      <h4>{dateTimeUtil(selectedEventStart)}</h4>
                    </Form.Group>
                  </div>
                )}
                {selectedEventCreatedBy !== "" && (
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label>Created By</Form.Label>
                      <h4>{selectedEventCreatedBy}</h4>
                    </Form.Group>
                  </div>
                )}{" "}
                <div className="col-md-12">
                  <Link
                    to={selectedEventUrl}
                    className="rk-btn1 rk-btn-icon btn btn-primary btn-sm"
                  >
                    Check
                  </Link>
                </div>
              </div>
            )}
          </Modal.Body>
          {canEdit && (
            <Modal.Footer className="p-3">
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="primary" size="sm" onClick={handleUpdate}>
                {sendEventLoading ? "Loading.." : "Update"}
              </Button>
            </Modal.Footer>
          )}
        </Modal>
      </div>
    </>
  );
}
