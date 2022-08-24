import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { useSelector } from "react-redux";
import {
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Button,
  Modal,
  Collapse,
} from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import Send from "@material-ui/icons/Send";
import EditIcon from "@material-ui/icons/Edit";
import ControlPointDuplicateIcon from "@material-ui/icons/ControlPointDuplicate";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
//import ImportExportIcon from '@material-ui/icons/ImportExport';
import App from "../../../Configs/app";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import moment from "moment";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FilterListIcon from "@material-ui/icons/FilterList";
import CancelIcon from "@material-ui/icons/Cancel";
import Filters from "../partials/Filters";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
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
import rowConsumer from "react-bootstrap-table2-editor/lib/src/row-consumer";

function List() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("SMS Templates");
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);
  const { user } = useSelector((state) => state.auth);
  const checkValidity=(date)=>{
    return new Date(date).getTime() > new Date(new Date()).getTime();
  }
  const columns = [
    {
      dataField: "sms_template_id",
      text: "ID",
      hidden: true,
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
      dataField: "name",
      text: "Name",
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
      dataField: "created_at",
      text: "Created At",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
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
    },

    {
      text: "Action",
      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.Sms &&
              user.user_permission.Sms.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit SMS </Tooltip>}
                    >
                      <Link
                        to={"/sms/" + row.sms_template_id + "/edit"}
                        className="abtn text-success mr-4"
                      >
                        <EditIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
            {
              checkValidity(user.company_details.expiry_date) && <OverlayTrigger
              placement="top"
              overlay={<Tooltip> Duplicate Template </Tooltip>}
            >
              <Link
                onClick={() => handleUpdateID(row.sms_template_id)}
                className="abtn text-info mr-4"
              >
                <ControlPointDuplicateIcon />
              </Link>
            </OverlayTrigger>
            }
            
            {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.Sms &&
              user.user_permission.Sms.map((item) => {
                return (
                  item.name === "Send" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip> Send SMS </Tooltip>}
                    >
                      <Link
                        to={{
                          pathname:
                            "/sms/" + row.sms_template_id + "/listcontact",
                        }}
                        className="abtn "
                        variant="primary"
                      >
                        <Send />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
          </div>
        );
      },
      csvExport: false,
      classes: "text-left ml-0",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
      headerClasses: "pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "sms_template_id",
      order: "desc",
    },
  ];

  const RemoteAll = ({ data }) => (
    <div>
      <ToolkitProvider keyField="id" data={data} columns={columns} exportCSV>
        {(props) => (
          <div>
            <BootstrapTable {...props.baseProps} />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );

  const handleUpdateID = (id) => {
    setSendLoading(true);
    Actions.updateID(id).then((response) => {
      setSendLoading(false);
      if (response.status === "SUCCESS") {
        setRedirect(response.data.sms.sms_template_id);
      }
      addToast(response.message, {
        appearance: response.status === "SUCCESS" ? "success" : "error",
        autoDismiss: true,
      });
    });
  };
  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.list({ ...queryParams, page: currentPage, size: perPage }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setItems(response.data.sms);
          setRecords(response.data.totalRecord);
          const fromPage = (currentPage - 1) * perPage + 1;
          const toPage = (currentPage - 1) * perPage + response.data.sms.length;
          setFrom(fromPage);
          setTo(toPage);
        }
        setLoading(false);
      }
    );
  }, [queryParams, currentPage, perPage]);

  React.useEffect(getData, [queryParams, currentPage, perPage]);

  const totalPages = Math.ceil(records / perPage);

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

  if (redirect) {
    const newpath = "/sms/" + redirect + "/edit";
    return <Redirect to={newpath} />;
  } else {
    return (
      <>
        <div className="rk-sub-header mb-5">All SMS Templates</div>
        <Card className="rkcrm-card mb-5">
          <Card.Body>
            {/* <div className="row mb-3">
                        <div className="col-md-6">
                            <Button size="sm" aria-controls="filters" aria-expanded={showFilter} style={{ alignItems: 'flex-end', display: 'flex' }} variant="outline-secondary" onClick={() => setShowFilter(!showFilter)}>{showFilter ? <><CancelIcon /> Hide</> : <><FilterListIcon /> Show</>}&nbsp;filters</Button>
                           
                            <InputGroup className="mb-0">
                                <FormControl
                                    name="name"
                                    size="sm"
                                    type="text"
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search.."
                                    onChange={(e) => setQueryParams({ ...queryParams, searchTxt: e.target.value })}
                                    required
                                />
                                <InputGroup.Append>
                                    <Button size="sm" onClick={getData} variant="outline-secondary">Search</Button>
                                </InputGroup.Append>
                            </InputGroup>
                           
                        </div>
                        <div className="col-md-6 text-right">
                            <Link to="/sms/add" className="rk-add-btn" ><AddIcon />Add SMS Template</Link>
                             &nbsp;<Link to="/sms/import" className="rk-add-btn" ><CloudUploadIcon />&nbsp;Import SMS</Link> 
                        </div>
                    </div> */}

            {/* <Collapse in={showFilter}>
                        <div id="filters">
                            <Filters setQueryParams={setQueryParams} loading={loading} />
                        </div>
                    </Collapse> */}

            <div className="rk-table mb-0" size="md">
              {!loading && (
                <div className="text-right">
                  <Table columns={columns} data={items} />
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

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
}

export default React.memo(List);
