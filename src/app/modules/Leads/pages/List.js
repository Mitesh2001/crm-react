import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSubheader } from "../../../../_metronic/layout";
import QuickAddLead from "../partials/QuickAddLead";
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
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
import App from "../../../Configs/app";
import Table from "./Table";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import ListStatus from "../partials/ListStatus";
import moment from "moment";
import FilterListIcon from "@material-ui/icons/FilterList";
import CancelIcon from "@material-ui/icons/Cancel";
import Filters from "../partials/Filters";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from "react-bootstrap-table2-filter";
import ToolkitProvider, {
  CSVExport,
  ColumnToggle,
} from "react-bootstrap-table2-toolkit";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
//import { Pagination } from "../../../../_metronic/_partials/controls";
import jQuery from "jquery";

import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";

function List() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Leads");
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [filterv, setFilterv] = React.useState({});
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);
  const { ExportCSVButton } = CSVExport;
  const { ToggleList } = ColumnToggle;
  const { user } = useSelector((state) => state.auth);
  const permission = [];

  const selectOptions = {
    1: "PENDING",
    2: "INPROCESS",
    3: "COMPLETED",
  };

  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.list({ ...queryParams, page: currentPage, size: perPage }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setItems(response.data.leads);
          setRecords(response.data.totalRecord);
          const fromPage = (currentPage - 1) * perPage + 1;
          const toPage =
            (currentPage - 1) * perPage + response.data.leads.length;
          setFrom(fromPage);
          setTo(toPage);
        }
        setLoading(false);
      }
    );
  }, [queryParams, currentPage, perPage]);

  React.useEffect(getData, [queryParams, currentPage, perPage]);

  const totalPages = Math.ceil(records / perPage);

  const checkValidity = (date) => {
    return new Date(date).getTime() > new Date(new Date()).getTime();
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
      sort: true,
      csvExport: true,
      sortCaret: sortCaret,
      headerSortingClasses,
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
        placeholder: "Enter Lead",
      }),
    },
    {
      dataField: "customer_name",
      text: "Customer",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      headerAlign: "left",
      classes: "text-left ml-0",
      filter: textFilter({
        placeholder: "Enter Customer",
      }),
    },
    {
      dataField: "email",
      text: "Primary Email",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      headerAlign: "left",
      classes: "text-left ml-0",
      filter: textFilter({
        placeholder: "Enter Primary Email",
      }),
    },
    {
      dataField: "mobile_no",
      text: "Mobile",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      headerAlign: "left",
      classes: "text-left ml-0",
      filter: textFilter({
        placeholder: "Enter Mobile",
      }),
    },
    {
      dataField: "lead_status",
      text: "Lead Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      headerAlign: "left",
      classes: "text-left ml-0 status",
      filter: selectFilter({
        options: selectOptions,
      }),
      csvFormatter: (cell) => {
        if (cell == "1") {
          return "PENDING";
        } else {
          if (cell == "2") {
            return "INPROCESS";
          } else {
            if (cell == "3") {
              return "COMPLETED";
            } else {
              return "";
            }
          }
        }
      },
      formatter: (cell) => {
        if (cell == "2") {
          return (
            <>
              <button
                style={{
                  backgroundColor: "lightblue",
                  border: "none",
                  padding: "3px",
                  marginLeft: "10px",
                  borderRadius: "5px",
                }}
              >
                INPROCESS
              </button>
            </>
          );
        } else {
          if (cell == "3") {
            return (
              <>
                <button
                  style={{
                    backgroundColor: "#81c784",
                    border: "none",
                    padding: "3px",
                    marginLeft: "10px",
                    borderRadius: "5px",
                  }}
                >
                  COMPLETED
                </button>
              </>
            );
          } else {
            if (cell == "1") {
              return (
                <>
                  <button
                    style={{
                      backgroundColor: "lightgrey",
                      border: "none",
                      padding: "3px",
                      marginLeft: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    PENDING
                  </button>
                </>
              );
            } else {
              return <></>;
            }
          }
        }
      },
      // style:{
      //     padding:"3px",
      // }
    },
    {
      dataField: "created_at",
      text: "Created At",
      hidden: true,
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
        if (typeof cell !== "object") {
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
        if (typeof cell !== "object") {
          dateObj = new Date(cell);
        }
        return `${dateObj.getFullYear()}-${(
          "0" +
          (dateObj.getMonth() + 1)
        ).slice(-2)}-${("0" + dateObj.getDate()).slice(-2)}`;
      },
      headerAlign: "left",
      classes: "text-left ml-0",
      textAlign: "left",
      style: {
        minWidth: "120px",
      },
    },
    {
      text: "Action",
      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            {user.company_details &&
              user.user_permission &&
              user.user_permission.Lead &&
              user.user_permission.Lead.map((item) => {
                return (
                  item.name === "View" && (
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
                  )
                );
              })}
            {user.company_details &&
              checkValidity(user.company_details.expiry_date) &&
              user.user_permission &&
              user.user_permission.Lead &&
              user.user_permission.Lead.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Lead</Tooltip>}
                    >
                      <Link
                        to={"/leads/" + row.id + "/edit"}
                        className="abtn text-success "
                      >
                        <EditIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
            {user.company_details &&
              checkValidity(user.company_details.expiry_date) &&
              user.user_permission &&
              user.user_permission.Lead &&
              user.user_permission.Lead.map((item) => {
                return (
                  item.name === "Delete" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Lead</Tooltip>}
                    >
                      <Link
                        to="#"
                        className="abtn text-danger"
                        onClick={() => deleteItem(row.id)}
                      >
                        <DeleteIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}{" "}
          </div>
        );
      },

      csvExport: false,
      classes: "text-left ml-0",
      headerStyle: (colum, colIndex) => {
        return { width: "160px", textAlign: "left" };
      },
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

  const deleteItem = (id) => {
    setDeleteRecord(id);
    setDeleteConfirm(true);
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    Actions.delete(deleteRecord).then((response) => {
      setDeleteLoading(false);
      if (response.status === "SUCCESS") {
        getData();
        handleClose();
      }
      addToast(response.message, {
        appearance: response.status === "SUCCESS" ? "success" : "error",
        autoDismiss: true,
      });
    });
  };

  const handleClose = () => {
    setDeleteRecord(false);
    setDeleteConfirm(false);
  };

  const checkValue = (e) => {
    setPerPage(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {user.user_permission.Lead &&
        user.user_permission.Lead.map((item) => {
          return (
            item.name === "Quick Add" && (
              <QuickAddLead
                currentPage={currentPage}
                getData={getData}
                setQueryParams={setQueryParams}
                setCurrentPage={setCurrentPage}
              />
            )
          );
        })}
      <div className="rk-sub-header mb-5">All Leads</div>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          <div className="row mb-3">
            {/* <div className="col-md-6">
                            <Button size="sm" aria-controls="filters" aria-expanded={showFilter} style={{ alignItems: 'flex-end', display: 'flex' }} variant="outline-secondary" onClick={() => setShowFilter(!showFilter)}>{showFilter ? <><CancelIcon /> Hide</> : <><FilterListIcon /> Show</>}&nbsp;filters</Button>
                        </div> */}
          </div>

          {/* <Collapse in={showFilter}> */}
          <div id="filters">
            <Filters setQueryParams={setQueryParams} loading={loading} />
          </div>
          {/* <div className="col-md-6 text-right ml-5">
                            <Link to="/leads/add" className="rk-add-btn" ><AddIcon />Add Lead</Link>
                        </div> */}
          {/* </Collapse> */}

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
                {/* <RemoteAll
                                        data={items}

                                        // totalSize={totalPages}
                                        // page={records}
                                        // sizePerPage={currentPage}

                                        totalSize={records}
                                        page={currentPage}
                                        sizePerPage={App.perPage}
                                    > */}

                {/* {loading &&
                                            (
                                                <div colSpan="6" className="text-center">
                                                    <Spinner animation="border" variant="info" />
                                                </div>
                                            )
                                        } */}
                <Table columns={columns} data={items} />
                {/* </RemoteAll> */}
              </div>

              // <Table columns={columns} products={items} />
            )}
          </div>
          {!loading && records > 0 && (
            <>
              <div className="row" style={{ marginTop: "20px" }}>
                <div className="col">
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
                <div className="col showing-records-line">
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

      <Modal show={deleteConfirm} onHide={handleClose}>
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">Are you sure want to delete?</Modal.Body>
        <Modal.Footer className="p-3">
          <Button
            variant="danger"
            size="sm"
            onClick={handleClose}
            disabled={deleteLoading}
          >
            No
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Loading.." : "Yes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default React.memo(List);
