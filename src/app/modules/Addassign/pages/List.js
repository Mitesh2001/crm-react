import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { useSelector } from "react-redux";
import {
  OverlayTrigger,
  Tooltip,
  Card,
  Spinner,
  Button,
  Form,
  Collapse,
} from "react-bootstrap";
import Pagination from "@material-ui/lab/Pagination";
import App from "../../../Configs/app";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import CancelIcon from "@material-ui/icons/Cancel";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AddIcon from "@material-ui/icons/Add";
import Filters from "../partials/Filters";
import FilterListIcon from "@material-ui/icons/FilterList";
import jQuery from "jquery";
import axios from "axios";
import Table from "./Table";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
  textFilter,
  numberFilter,
  Comparator,
} from "react-bootstrap-table2-filter";
import ToolkitProvider, {
  CSVExport,
  ColumnToggle,
} from "react-bootstrap-table2-toolkit";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import Select from "react-select";

export default React.memo(() => {
  const selectInputUserRef = React.useRef();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Telecalling Management");
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState(0);
  const [records, setRecords] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [validated, setValidated] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [get_assign_contact, setGet_assign_contact] = React.useState([]);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);
  const { user } = useSelector((state) => state.auth);
  const columns = [
    {
      text: (
        <div class="form-check">
          <input
            class="checkone "
            type="checkbox"
            value=""
            id="a"
            style={{ margin: "0 5px" }}
          />
          All
        </div>
      ),
      csvExport: false,
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
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      style: {
        minWidth: "100px",
      },
    },
    {
      dataField: "id",
      text: "ID",
      csvExport: true,
      hidden: true,
      filter: textFilter({
        placeholder: "Enter ID",
      }),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      filter: textFilter({
        placeholder: "Enter Name",
      }),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "mobile_no",
      text: "Mobile Number",
      sort: true,
      filter: textFilter({
        placeholder: "Enter Mobile",
      }),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "city",
      text: "City",
      sort: true,
      filter: textFilter({
        placeholder: "Enter city",
      }),
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
              overlay={<Tooltip>View Contact</Tooltip>}
            >
              <Link
                to={"/contacts/" + row.id + "/show"}
                className="abtn text-info "
              >
                <VisibilityIcon />
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

  const getData = React.useCallback(() => {
    setLoading(true);

    Actions.show({
      ...queryParams,
      page: currentPage,
      tele_caller_id: selectedUser,
      size: perPage,
    }).then((response) => {
      if (response.status === "SUCCESS") {
        setCurrentPage(response.data.current);
        setItems(response.data.contacts);
        setRecords(response.data.totalRecord);
        const fromPage = (currentPage - 1) * perPage + 1;
        const toPage =
          (currentPage - 1) * perPage + response.data.contacts.length;
        setFrom(fromPage);
        setTo(toPage);
      }
      setLoading(false);
    });
  }, [queryParams, currentPage, perPage, selectedUser]);

  React.useEffect(getData, [currentPage, selectedUser, queryParams, perPage]);

  const totalPages = Math.ceil(records / perPage);

  const handleChange = (value) => {
    if (value) {
      setSelectedUser(parseInt(value.id));
      setCurrentPage(1);
      //getData();
    }
  };
  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      var add_user = jQuery(".tele-drop").val();
      var addAssignIds = [];
      jQuery.each(jQuery(".tele-checkbox:checked"), function() {
        addAssignIds.push(jQuery(this).val());
      });

      addAssignIds = addAssignIds.toString();
      var addHiddenIds = [];
      jQuery.each(jQuery(".hidden-id"), function() {
        addHiddenIds.push(jQuery(this).val());
      });

      addHiddenIds = addHiddenIds.toString();

      var params = {
        contact_id: addAssignIds,
        hiddenIds: addHiddenIds,
        tele_caller_id: selectedUser,
      };
      var assignParameters = params;
      Actions.add(assignParameters).then((response) => {
        setLoading(false);
        if(response.message === "The contact id field is required."){
          addToast("Please Select Contact", {
            appearance: "error",
            autoDismiss: true,
          });
        }else{
          addToast(response.message, {
            appearance: response.status === "SUCCESS" ? "success" : "error",
            autoDismiss: true,
          });
        }
        
        if (response.status === "SUCCESS") {
          // setRedirect(true);
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

  const formatOptionLabel = ({ name, id, designation }) => (
    <div style={{ display: "flex" }}>
      {id !== "" ? "(" + id + ")" : null} {name}{" "}
      {designation ? "(" + designation + ")" : null}
    </div>
  );

  const checkValidity = (date) => {
    return new Date(date).getTime() > new Date(new Date()).getTime();
  };

  const setUserNull = () => {
    selectInputUserRef.current.select.clearValue();
  };

  if (redirect) {
    return <Redirect to="/contacts" />;
  } else {
    return (
      <>
        <div className="rk-sub-header mb-5">Assign contacts to tellecaller</div>
        <Card className="rkcrm-card mb-5">
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Card.Body className="p-3"></Card.Body>
              <div
                className="col-md-3 dropdown-select"
                style={{ paddingLeft: "12.5px" }}
              >
                <Form.Group>
                  <Form.Label>
                    Telecaller Users<span className="text-danger">*</span>
                  </Form.Label>
                  <Select
                    ref={selectInputUserRef}
                    className="basic-single tele-drop"
                    classNamePrefix="select"
                    name="users"
                    closeMenuOnSelect={true}
                    placeholder={"Select User"}
                    isSearchable={true}
                    defaultValue={{ name: "Select User", id: "" }}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    formatOptionLabel={formatOptionLabel}
                    options={[{ name: "Select User", id: "" }, ...users]}
                    onChange={handleChange}
                  />
                  {/* <Form.Control
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
                      ({i.id}){i.name}({i.designation})
                    </option>
                  ))}
                </Form.Control> */}
                  <Form.Control.Feedback type="invalid">
                    Please select Telecaller user
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Button
                  size="sm"
                  aria-controls="filters"
                  aria-expanded={showFilter}
                  style={{ alignItems: "flex-end", display: "flex" }}
                  variant="outline-secondary"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  {showFilter ? (
                    <>
                      <CancelIcon />
                      &nbsp; Hide
                    </>
                  ) : (
                    <>
                      <FilterListIcon />
                      &nbsp; Show
                    </>
                  )}
                  &nbsp;filters
                </Button>
              </div>

              <Collapse in={showFilter}>
                <div id="filters">
                  <Filters
                    setQueryParams={setQueryParams}
                    loading={loading}
                    setUserNull={setUserNull}
                  />
                </div>
              </Collapse>

              <div className="rk-table mb-0" size="md">
                {/* {!loading && items.length < 1 &&
                            (
                                <div colSpan="7">
                                    No list found.
                                </div>
                            )
                        } */}
                {!loading && (
                  <div className="text-right">
                    {/* <RemoteAll
                                        data={items}
                                    >

                                        {loading &&
                                            (
                                                <div colSpan="6" className="text-center">
                                                    <Spinner animation="border" variant="info" />
                                                </div>
                                            )
                                        }
                                    </RemoteAll> */}
                    <Table columns={columns} data={items} />
                  </div>
                )}
              </div>
              {!loading && records > 0 && (
                <>
                {(selectedUser === NaN || !selectedUser) && (
                  <p className="ml-2 text-info" style={{ marginBottom: "2px" }}>
                    Select user to Assign
                  </p>
                )}
                  <div class="row" style={{ marginLeft: "-9px" }}>
                    {user.company_details&&checkValidity(user.company_details.expiry_date) && user.user_permission && user.user_permission.Telecaller ? (
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
                            disabled={
                              loading || selectedUser === NaN || !selectedUser
                            }
                          >
                            Assign
                          </Button>
                        ) : null}
                      </div>
                    ) : null}

                    <div class="col-md-1" style={{ display: "flex" }}>
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
                      class="col showing-records-line"
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
          </Card.Body>
        </Card>
      </>
    );
  }
});
