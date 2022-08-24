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
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import VisibilityIcon from "@material-ui/icons/Visibility";
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

export default React.memo(() => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Lead Assign");
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState(0);
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
      sortCaret: sortCaret,
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
      sort: true,
      csvExport: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      hidden: true,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter ID",
      }),
    },
    {
      dataField: "lead_name",
      text: "Lead",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Lead Name",
      }),
    },
    {
      dataField: "customer_name",
      text: "Customer",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Customer Name",
      }),
    },
    {
      dataField: "email",
      text: "Primary Email",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Email",
      }),
    },
    {
      dataField: "mobile_no",
      text: "Mobile",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Mobile",
      }),
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
              overlay={<Tooltip>View Lead</Tooltip>}
            >
              <Link
                to={"/leads/" + row.id + "/show"}
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
    Actions.list_leads({
      ...queryParams,
      page: currentPage,
      size: perPage,
      user_id: queryParams.users,
    }).then((response) => {
      if (response.status === "SUCCESS") {
        setCurrentPage(response.data.current);
        setItems(response.data.leadData);
        setRecords(response.data.totalRecord);
        const fromPage = (currentPage - 1) * perPage + 1;
        const toPage =
          (currentPage - 1) * perPage + response.data.leadData.length;
        setFrom(fromPage);
        setTo(toPage);
      }
      setLoading(false);
    });
  }, [queryParams, currentPage, perPage]);

  React.useEffect(getData, [queryParams, currentPage, perPage]);

  const totalPages = Math.ceil(records / perPage);

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
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
      // var add_user = jQuery(".tele-drop").val();
      var add_user = queryParams.users;
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
        lead_id: addAssignIds,
        hiddenIds: addHiddenIds,
        user_id: add_user,
      };
      var assignParameters = params;
      Actions.assignLead(assignParameters).then((response) => {
        setLoading(false);
        if (response.status === "SUCCESS") {
          addToast(response.message, {
            appearance: "success",
            autoDismiss: true,
          });
          // setRedirect(true);
          getData();
        } else {
          if (response.message === "The user id field is required.") {
            addToast("Please select user to assign", {
              appearance: "error",
              autoDismiss: true,
            });
          } else if (response.message === "The lead id field is required.") {
            addToast("Please select lead to assign", {
              appearance: "error",
              autoDismiss: true,
            });
          } else if (
            response.message ===
            "The lead id field is required.,The user id field is required."
          ) {
            addToast("Please select user and Lead to assign", {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            addToast(response.message, {
              appearance: "error",
              autoDismiss: true,
            });
          }
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
  const checkValidity = (date) => {
    return new Date(date).getTime() > new Date(new Date()).getTime();
  };

  if (redirect) {
    return <Redirect to="/leads/Addassign" />;
  }
  return (
    <>
      <div className="rk-sub-header mb-5">Assign user to lead</div>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Collapse in={showFilter}>
              <div id="filters">
                <Filters setQueryParams={setQueryParams} loading={loading} />
              </div>
            </Collapse>

            <div className="rk-table mb-0" size="md">
              {!loading && (
                <div className="text-right">
                  <Table columns={columns} data={items} />
                </div>
              )}
            </div>

            {!loading && records > 0 && (
              <>
                {(!queryParams || !queryParams.users) && (
                  <p className="ml-2 text-info" style={{ marginBottom: "2px" }}>
                    Select user to Assign
                  </p>
                )}
                <div class="row" style={{ marginLeft: "-9px" }}>
                  {user.company_details &&
                  checkValidity(user.company_details.expiry_date) &&
                  user.user_permission &&
                  user.user_permission.Leadassign ? (
                    <div className="col-md-1 text-center">
                      {user.company_details &&
                      checkValidity(user.company_details.expiry_date) &&
                      loading ? (
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
                            loading || !queryParams || !queryParams.users
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
});
