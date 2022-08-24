import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { useSelector } from "react-redux";
import {
  OverlayTrigger,
  Tooltip,
  Card,
  Spinner,
  Modal,
  Button,
  Form,
  Collapse,
} from "react-bootstrap";
import Pagination from "@material-ui/lab/Pagination";
import App from "../../../Configs/app";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import CancelIcon from "@material-ui/icons/Cancel";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Note from "@material-ui/icons/Note";
import AddIcon from "@material-ui/icons/Add";
import Filters from "../partials/Filters";
import FilterListIcon from "@material-ui/icons/FilterList";
import jQuery from "jquery";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport,
  ColumnToggle,
} from "react-bootstrap-table2-toolkit";
import filterFactory, {
  selectFilter,
  textFilter,
  numberFilter,
  Comparator,
} from "react-bootstrap-table2-filter";
import Table from "./Table";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";

export default React.memo(function({ lead }) {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Lead Followup Assign");
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState(0);
  const [selectedRole, setSelectedRole] = React.useState(0);
  // const [selectedFollowup, setSelectedFollowup] = React.useState(0);
  const [records, setRecords] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [validated, setValidated] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [get_assign_contact, setGet_assign_contact] = React.useState([]);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);
  const [note, setNote] = React.useState("");
  const [showNote, setShowNote] = React.useState(false);
  const [roles, setRoles] = React.useState({});
  const [userSelected, setUserSelected] = React.useState(null);

  const { user } = useSelector((state) => state.auth);

  const follow_type = {
    call: "call",
    visit: "visit",
    meeting: "meeting",
    task: "task",
    email: "email",
  };

  const columns = [
    {
      text: (
        <div class="form-check">
          All
          <input class="checkone " type="checkbox" value="" id="a" />
        </div>
      ),

      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            <div class="form-check">
              <input
                class="tele-checkbox checkboxes"
                type="checkbox"
                value={row.id}
                checked={row.is_assign == 1}
              />
              <input class="hidden-id" type="hidden" value={row.id} />
            </div>
          </div>
        );
      },
      csvExport: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "id",
      text: "ID",
      sort: true,
      csvExport: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      hidden: true,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Id",
      }),
    },
    {
      dataField: "get_role.name",
      text: "Role",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      // formatter: (cell) => roles[cell],
      filter: selectFilter({
        options: roles,
      }),
    },
    {
      dataField: "name",
      text: "Follow Up Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "follow_up_type",
      text: "Followup Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      formatter: (cell) => {
        if (cell) {
          return cell.charAt(0).toUpperCase() + cell.slice(1).toLowerCase();
        }
      },
      filter: selectFilter({
        options: follow_type,
      }),
    },
    {
      dataField: "get_created_by.name",
      text: "Created By",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Name",
      }),
    },
    {
      dataField: "date",
      text: "Follow Up Time",
      csvFormatter: (cell) => {
        let dateObj = cell;
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
          dateObj = new Date(cell);
        }
        if (dateObj.getHours() >= 12) {
          dateObj.setHours(dateObj.getHours() - 12);
          return `${("0" + dateObj.getDate()).slice(-2)}${" " +
            monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
            "0" + dateObj.getHours()
          ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}PM`;
        }
        return `${("0" + dateObj.getDate()).slice(-2)}${" " +
          monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
          "0" + dateObj.getHours()
        ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}AM`;
      },
      formatter: (cell) => {
        let dateObj = cell;
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
          dateObj = new Date(cell);
        }
        if (dateObj.getHours() >= 12) {
          dateObj.setHours(dateObj.getHours() - 12);
          return `${("0" + dateObj.getDate()).slice(-2)}${" " +
            monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
            "0" + dateObj.getHours()
          ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}PM`;
        }
        return `${("0" + dateObj.getDate()).slice(-2)}${" " +
          monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
          "0" + dateObj.getHours()
        ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}AM`;
      },
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      text: "Action",

      headerStyle: (colum, colIndex) => {
        return { width: "120px", textAlign: "left" };
      },
      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>View contact</Tooltip>}
            >
              <Link
                to={"/leads/" + row.follow_up_id + "/show"}
                className="abtn text-info "
              >
                <VisibilityIcon />
              </Link>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>View Note</Tooltip>}
            >
              <Link
                to="#"
                className="abtn text-success mr-4"
                onClick={() => {
                  setNote(row.note);
                  setShowNote(true);
                }}
              >
                <Note />
              </Link>
            </OverlayTrigger>
          </div>
        );
      },

      csvExport: false,
      classes: "text-left ml-0",
      headerAlign: "left",
      headerClasses: "pr-3",
      style: {
        minWidth: "120px",
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "id",
      order: "desc",
    },
  ];

  const postUsers = React.useCallback(() => {
    Actions.users().then((data) => {
      if (data.status === "SUCCESS") {
        setUsers(data.data.employees);
      }
    });
  }, []);

  React.useEffect(postUsers, []);

  const getRoles = React.useCallback(() => {
    Actions.roles().then((data) => {
      if (data.status === "SUCCESS") {
        const x = data.data.roles;
        var obj = {};
        x.map((data) => {
          obj[data.name] = data.name;
        });
        setRoles(obj);
      }
    });
  }, []);
  React.useEffect(getRoles, []);

  //select all checkbox
  jQuery(function() {
    jQuery(".checkone").click(function() {
      if (this.checked) {
        jQuery(".checkboxes").prop("checked", true);
      } else {
        jQuery(".checkboxes").prop("checked", false);
      }
    });
    jQuery(".checkboxes").click(function() {
      if (this.checked) {
        jQuery(this).prop("checked", true);
      } else {
        jQuery(this).prop("checked", false);
      }
    });
  });

  const getData = React.useCallback(
    (event) => {
      setLoading(true);
      var selectedUser = jQuery(".tele-drop").val();
      var selectedRole = jQuery(".tele-dropp").val();

      const formData = new FormData(event);
      const formDataObj = Object.fromEntries(formData.entries());

      Actions.list_followup({
        ...queryParams,
        page: currentPage,
        size: perPage,
        role_id: queryParams.roles,
        user_id: queryParams.users,
        follow_up_id: lead,
        type: 1,
      }).then((response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          var formattedContactDetails = response.data.followUp.map(
            ({
              id,
              name,
              date,
              time,
              follow_up_type,
              note,
              follow_up_id,
              get_role,
              get_created_by,
              is_assign,
            }) => ({
              id,
              date: date + "T" + time,
              follow_up_type,
              note,
              follow_up_id,
              name,
              get_role,
              get_created_by,
              is_assign,
            })
          );
          setItems(formattedContactDetails);
          setRecords(response.data.totalRecord);
          const fromPage = (currentPage - 1) * perPage + 1;
          const toPage =
            (currentPage - 1) * perPage + response.data.followUp.length;
          setFrom(fromPage);
          setTo(toPage);
        }
        setLoading(false);
      });
    },
    [queryParams, currentPage, perPage, lead]
  );

  React.useEffect(getData, [queryParams, currentPage, perPage]);

  const totalPages = Math.ceil(records / perPage);

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
    setSelectedRole(event.target.value);
    // setSelectedFollowup(event.target.value);

    setCurrentPage(1);
    getData();
  };

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      var add_user = jQuery(".tele-drop").val();
      var add_role = jQuery(".tele-dropp").val();
      var add_followup = jQuery(".tele-dropid").val();

      var addAssignIds = [];
      jQuery.each(jQuery(".tele-checkbox:checked"), function() {
        addAssignIds.push(jQuery(this).val());
      });

      addAssignIds = addAssignIds.toString();
      var hiddenIds = [];
      jQuery.each(jQuery(".hidden-id"), function() {
        hiddenIds.push(jQuery(this).val());
      });

      hiddenIds = hiddenIds.toString();
      // formDataObj.follow_up_id = lead.id;
      var params = {
        follow_up_id: addAssignIds,
        hiddenids: hiddenIds,
        user_id: queryParams.users,
        role_id: queryParams.roles,
      };
      var assignParameters = params;
      Actions.assignLead(assignParameters).then((response) => {
        setLoading(false);
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
        if (response.status === "SUCCESS") {
          setRedirect(true);
          getData();
        }
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };

  const checkValue = (e) => {
    setPerPage(e.target.value);
    setCurrentPage(1);
  };
  return (
    <>
      <div className="rk-sub-header mb-5">Assign user to lead's Follow Up</div>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          <>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* <div className="col-md-3">
              <Form.Group>
                <Form.Label>
                  {" "}
                  Users<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  size="sm"
                  name="users"
                  as="select"
                  onChange={handleChange}
                  autoComplete="off"
                  className="custom-select tele-drop"
                  placeholder="Select User"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((i) => (
                    <option value={i.id} key={"e" + i.id}>
                      {i.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select user
                </Form.Control.Feedback>
              </Form.Group>
            </div> */}

              {/* <div className="col-md-6">
                                <Button size="sm"
                                    aria-controls="filters"
                                    aria-expanded={showFilter}
                                    style={{ alignItems: 'flex-end', display: 'flex' }}
                                    variant="outline-secondary"
                                    onClick={() => setShowFilter(!showFilter)}>
                                    {showFilter ? <><CancelIcon /> Hide</> : <>
                                        <FilterListIcon /> Show</>}&nbsp;filters</Button>
                            </div> */}

              <Collapse in={showFilter}>
                <div id="filters">
                  <Filters
                    setQueryParams={setQueryParams}
                    setUserSelected={setUserSelected}
                    loading={loading}
                  />
                </div>
              </Collapse>

              <div className="rk-table mb-0" size="md">
                {/* {!loading && items.length < 1 &&
                            (
                                <div colSpan="7">
                                    No lead found.
                                </div>
                            )
                        } */}
                {!loading && (
                  <div className="text-right">
                    <Table columns={columns} data={items} />
                  </div>
                )}
              </div>

              {!loading && records > 0 && (
                <>
                  {userSelected === null && (
                    <p
                      className="ml-2 text-info"
                      style={{ marginBottom: "2px" }}
                    >
                      Select user to Assign
                    </p>
                  )}
                  <div className="row" style={{ marginLeft: "-9px" }}>
                    {user.user_permission.LeadFollowup ? (
                      <div className="col-md-1 text-center">
                        {loading ? (
                          <Button
                            variant="primary"
                            className="abtn-text-primary "
                            size="sm"
                            type="submit"
                            disabled={loading}
                          >
                            Loading..
                          </Button>
                        ) : records > 0 ? (
                          <Button
                            variant="primary"
                            className="abtn-text-primary "
                            size="sm"
                            type="submit"
                            disabled={loading || userSelected === null}
                          >
                            Assign
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="col-md-1" style={{ display: "flex" }}>
                      <select
                        required
                        value={perPage}
                        onChange={checkValue}
                        className="browser-default page-selection"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>

                    <div
                      className="col showing-records-line"
                      style={{ textAlign: "right" }}
                    >
                      <span>
                        Showing {from} to {to} from {records}
                      </span>
                    </div>

                    <div className="col text-right">
                      <Pagination
                        siblingCount={0}
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                        variant="outlined"
                      />
                    </div>
                  </div>
                </>
              )}
            </Form>
            {!loading && (
              <Modal
                show={showNote}
                onMouseLeave={() => {
                  setShowNote(false);
                  setNote("");
                }}
              >
                <Modal.Header className="p-3" closeButton>
                  <Modal.Title>Follow Up Note</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">
                  <h4>{note}</h4>
                </Modal.Body>
                <Modal.Footer className="p-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setShowNote(false);
                      setNote("");
                    }}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </>
        </Card.Body>
      </Card>
      {/* {!loading && (
                    <div className="text-right">
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(event, page) => setCurrentPage(page)}
                            variant="outlined"
                        />
                    </div>
                )} */}
    </>
  );
});
