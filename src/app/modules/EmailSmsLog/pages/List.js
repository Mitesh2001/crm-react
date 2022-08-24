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
  suhbeader.setTitle("Email sms log");
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
      dataField: "log_id",
      text: "ID",
      csvExport: true,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "type",
      text: "Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "response",
      text: "Status",
      csvExport: true,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      csvFormatter:(e)=>{
        if(e==1){
          return "SUCCESS"
        }else{
          return "FAIL"
        }
      },
      formatter:(e)=>{
        if(e==1){
          return "SUCCESS"
        }else{
          return "FAIL"
        }
      }
    },
    {
      dataField: "created_at",
      text:
        "Created At" /* product_type === 1 ? "Product Price" : "Service Price", */,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      formatter:(date)=>{
          if(date){
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
          }
        }
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
    Actions.email_sms_log({
      ...queryParams,
      page: currentPage,
      size: perPage,
      //searchTxt:"admin"
    }).then((response) => {
      if (response.status === "SUCCESS") {
        setCurrentPage(response.data.current);
        setItems(response.data.email_sms_log);
        setRecords(response.data.totalRecord);
        const fromPage = (currentPage - 1) * perPage + 1;
        const toPage =
          (currentPage - 1) * perPage + response.data.email_sms_log.length;
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
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
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
  const checkValidity=(date)=>{
    return new Date(date).getTime() > new Date(new Date()).getTime();
  }

  if (redirect) {
    return <Redirect to="/leads/Addassign" />;
  }

  return (
    <>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div
              className="col-md-6"
              style={{ paddingLeft: "25px", marginTop: "12.5px" }}
            >
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
          </div>
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
                <div className="row" style={{ marginTop: "20px" }}>
                  <div className="col-md-1">
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
        </Card.Body>
      </Card>
    </>
  );
});
