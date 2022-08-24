import React from "react";
import { Link, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { useSelector } from "react-redux";
import QuickAdd from "../partials/QuickAdd";
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
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
import SendIcon from "@material-ui/icons/Send";
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
import Table from "./Table";
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
function List() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Contacts");
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
  const [sendContact, setContactRecord] = React.useState(false);
  const [ContactConfirm, setContactConfirm] = React.useState(false);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [leadredirect, setLeadRedirect] = React.useState(false);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);
  const { user } = useSelector((state) => state.auth);

  const columns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
      filter: textFilter(),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      filter: textFilter(),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "email",
      text: "Primary Email",
      sort: true,
      filter: textFilter(),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "mobile_no",
      text: "Primary Mobile",
      sort: true,
      filter: textFilter(),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "company_name",
      text: "Company Name",
      sort: true,
      filter: textFilter(),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "created_at",
      text: "Created At",
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
      filter: textFilter(),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      // dataField: "",
      text: "Action",
      formatter: (rowContent, i) => {
        return (
          <div className="actions-btns">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>View Contacts</Tooltip>}
            >
              <Link
                to={"/contacts/" + i.id + "/show"}
                className="abtn text-info mr-4 ml-3"
              >
                <VisibilityIcon />
              </Link>
            </OverlayTrigger>

            {user.permission.Contact &&
              user.permission.Contact.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Contacts</Tooltip>}
                    >
                      <Link
                        to={"/contacts/" + i.id + "/edit"}
                        className="abtn text-success mr-4"
                      >
                        <EditIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
            {user.permission.Contact &&
              user.permission.Contact.map((item) => {
                return (
                  item.name === "Delete" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Contacts</Tooltip>}
                    >
                      <Link
                        to="#"
                        className="abtn text-danger"
                        onClick={() => deleteItem(i.id)}
                      >
                        <DeleteIcon />
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

  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.list({ ...queryParams, page: currentPage }).then((response) => {
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
  }, [queryParams, currentPage, perPage]);

  React.useEffect(getData, [currentPage, queryParams]);

  const totalPages = Math.ceil(records / perPage);

  const sendLead = (id) => {
    setContactRecord(id);
    setContactConfirm(true);
  };
  const handleSend = () => {
    setSendLoading(true);
    Actions.converttolead(sendContact).then((response) => {
      setSendLoading(false);
      if (response.status === "SUCCESS") {
        handleSendClose();
        setLeadRedirect(response.data.lead.id);
      }
      addToast(response.message, {
        appearance: response.status === "SUCCESS" ? "success" : "error",
        autoDismiss: true,
      });
    });
  };
  const handleSendClose = () => {
    setContactRecord(false);
    setContactConfirm(false);
  };

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
    // var value = document.getElementsByClassName("custom-select")[0].value;

    setPerPage(e.target.value);
    setLoading(true);
    Actions.list({
      ...queryParams,
      page: currentPage,
      size: e.target.value,
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
  };

  if (leadredirect) {
    const leadeditpath = "/leads/" + leadredirect + "/edit";
    return <Redirect to={leadeditpath} />;
  }

  return (
    <>
      {user.permission.Contact &&
        user.permission.Contact.map((item) => {
          return (
            item.name === "Quick Add" && (
              <QuickAdd
                currentPage={currentPage}
                getData={getData}
                setQueryParams={setQueryParams}
                setCurrentPage={setCurrentPage}
              />
            )
          );
        })}
      <div className="rk-sub-header mb-5">All Contacts</div>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
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
                    <CancelIcon /> Hide
                  </>
                ) : (
                  <>
                    <FilterListIcon /> Show
                  </>
                )}
                &nbsp;filters
              </Button>
              {/* 
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
                            */}
            </div>
            {/* <div className="col-md-6 text-right">
                            <Link to="/contacts/add" className="rk-add-btn" ><AddIcon />Add Contact</Link>
                            &nbsp;<Link to="/contacts/import" className="rk-add-btn" ><CloudUploadIcon />&nbsp;Import Contacts</Link>
                        </div> */}
          </div>

          <Collapse in={showFilter}>
            <div id="filters">
              <Filters setQueryParams={setQueryParams} loading={loading} />
            </div>
          </Collapse>

          <div className="rk-table mb-0" size="md">
            {/* {!loading && items.length < 1 &&
                            (
                                <div colSpan="6">
                                    No contact found.
                                </div>
                            )
                        } */}
            {!loading && (
              <div className="text-right">
                {/* <RemoteAll
                                        data={items}
                                    //onTableChange={ handleTableChange }
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
      <Modal show={ContactConfirm} onHide={handleSendClose}>
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          Are you sure want to convert this contact to lead?
        </Modal.Body>
        <Modal.Footer className="p-3">
          <Button
            variant="danger"
            size="sm"
            onClick={handleSendClose}
            disabled={sendLoading}
          >
            No
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={sendLoading}
          >
            {sendLoading ? "Loading.." : "Yes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default React.memo(List);
