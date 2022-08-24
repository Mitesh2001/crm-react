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
  InputGroup,
  FormControl,
  Collapse,
} from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import Send from "@material-ui/icons/Send";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import ControlPointDuplicateIcon from "@material-ui/icons/ControlPointDuplicate";
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
import filterFactory, {
  textFilter,
  numberFilter,
  Comparator,
} from "react-bootstrap-table2-filter";
import ToolkitProvider, {
  CSVExport,
  ColumnToggle,
} from "react-bootstrap-table2-toolkit";
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
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import cellEditFactory from 'react-bootstrap-table2-editor';
// import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';

function List() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Email Templates");
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

  const { ExportCSVButton } = CSVExport;
  const checkValidity=(date)=>{
    return new Date(date).getTime() > new Date(new Date()).getTime();
  }
  const columns = [
    {
      dataField: "email_template_id",
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
      dataField: "subject",
      text: "Subject",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Subject",
      }),
    },

    {
      // dataField: "",
      text: "Action",
      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.Email &&
              user.user_permission.Email.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Email </Tooltip>}
                    >
                      <Link
                        to={"/email/" + row.email_template_id + "/edit"}
                        className="abtn text-success mr-4"
                      >
                        <EditIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
            {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.Email &&
              user.user_permission.Email.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip> Duplicate Template </Tooltip>}
                    >
                      <Link
                        onClick={() => handleUpdateID(row.email_template_id)}
                        className="abtn text-success mr-4 text-info"
                      >
                        <ControlPointDuplicateIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
            {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.Email &&
              user.user_permission.Email.map((item) => {
                return (
                  item.name === "Send" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip> Send Email </Tooltip>}
                    >
                      <Link
                        to={{
                          pathname:
                            "/email/" + row.email_template_id + "/listcontact",
                        }}
                        className="abtn"
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
        return { width: "200px", textAlign: "left" };
      },
      headerClasses: "pr-3",
      style: {
        minWidth: "150px",
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "email_template_id",
      order: "desc",
    },
  ];

  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.list({ ...queryParams, page: currentPage, size: perPage }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setItems(response.data.email);
          setRecords(response.data.totalRecord);
          const fromPage = (currentPage - 1) * perPage + 1;
          const toPage =
            (currentPage - 1) * perPage + response.data.email.length;
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
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getData();
    }
  };

  const handleUpdateID = (id) => {
    setSendLoading(true);
    Actions.updateID(id).then((response) => {
      setSendLoading(false);
      if (response.status === "SUCCESS") {
        setRedirect(response.data.email.email_template_id);
      }
      addToast(response.message, {
        appearance: response.status === "SUCCESS" ? "success" : "error",
        autoDismiss: true,
      });
    });
  };
  const checkValue = (e) => {
    setPerPage(e.target.value);
    setCurrentPage(1);
  };

  if (redirect) {
    const newpath = "/email/" + redirect + "/edit";
    return <Redirect to={newpath} />;
  } else {
    return (
      <>
        <div className="rk-sub-header mb-5">All Email Templates</div>
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
                            <Link to="/email/add" className="rk-add-btn" ><AddIcon />Add Email Template</Link>
                              &nbsp;<Link to="/email/import" className="rk-add-btn" ><CloudUploadIcon />&nbsp;Import email</Link> 
                        </div>
                    </div> */}

            {/* <Collapse in={showFilter}>
                        <div id="filters">
                            <Filters setQueryParams={setQueryParams} loading={loading} />
                        </div>
                    </Collapse> */}

            {/* <Table className="rk-table mb-0" size="md">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && items.length < 1 && (
                                <tr><td colSpan="4">No email templates found.</td></tr>
                            )}
                            {!loading && items.length > 0 && items.map(i => (
                                <tr key={'tr' + i?.email_template_id}>
                                    <td>{i?.name}</td>
                                    <td>{i?.subject}</td>
                                    <td>{i?.created_at !== undefined && i?.created_at !== '' ? moment(i?.created_at).format("lll") : '-'}</td>
                                    <td>
                                        <div className="actions-btns">

                                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit Email Template</Tooltip>}>
                                                <Link to={{
                                                    pathname: "/email/" + i.email_template_id + "/edit",
                                                    item: i
                                                }} className="abtn text-success"><EditIcon /></Link>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete Email Template</Tooltip>}>
                                                <Link to="#" className="abtn text-danger" onClick={() => deleteItem(i.email_template_id)}><DeleteIcon /></Link>
                                            </OverlayTrigger>


                                            <Button size="sm" variant="secondary" className="abtn text-info" onClick={()=>handleUpdateID(i.email_template_id)} > Duplicate Template </Button>

                                             <OverlayTrigger placement="top" overlay={<Tooltip> Send Email </Tooltip>}>
                                                <Link to={{
                                                    pathname: "/email/"+ i.email_template_id  + "/contactList",
                                                    item: i
                                                }} className="abtn ml-3" variant="primary">Send Email</Link>
                                            </OverlayTrigger>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {loading && (
                                <tr><td colSpan="6" className="text-center"><Spinner animation="border" variant="info" /></td></tr>
                            )}
                        </tbody>
                    </Table> */}
            <div className="rk-table mb-0" size="md">
              {!loading && items.length < 1 && (
                <div colSpan="7">No lead found.</div>
              )}
              {!loading && (
                // <div className="text-right">
                //     <RemoteAll
                //     data={items}
                //     >

                //     {loading &&
                //         (
                //         <div colSpan="6" className="text-center">
                //             <Spinner animation="border" variant="info" />
                //         </div>
                //         )
                //     }
                //     </RemoteAll>
                // </div>
                <Table columns={columns} data={items} />
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
      </>
    );
  }
}

export default React.memo(List);
