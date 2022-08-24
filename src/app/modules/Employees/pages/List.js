import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSubheader } from "../../../../_metronic/layout";
import {
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
import App from "../../../Configs/app";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport,
  ColumnToggle,
  Search,
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
import PersonIcon from "@material-ui/icons/Person";

export default React.memo(() => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Employees");
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
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);

  const { ExportCSVButton } = CSVExport;
  const { ToggleList } = ColumnToggle;
  const { user } = useSelector((state) => state.auth);

  const checkValidity = (date) => {
    return new Date(date).getTime() > new Date(new Date()).getTime();
  };

  const columns = [
    {
      dataField: "id",
      text: " ID",
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
      filter: textFilter(),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Name",
      }),
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      filter: textFilter(),
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      //   hidden:true
      filter: textFilter({
        placeholder: "Enter Email",
      }),
    },
    {
      dataField: "mobileno",
      text: "Mobile No",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Mobile No",
      }),
    },

    {
      dataField: "designation",
      text: "Designation",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Designation",
      }),
    },

    {
      // dataField: "",
      text: "Action",
      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            {user.company_details &&
              checkValidity(user.company_details.expiry_date) &&
              user.user_permission &&
              user.user_permission.Employees &&
              user.user_permission.Employees.map((item) => {
                return (
                  item.name === "View" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>View Employee</Tooltip>}
                    >
                      <Link
                        to={"/employees/" + row.id + "/show"}
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
              user.user_permission.Employees &&
              user.user_permission.Employees.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Employee</Tooltip>}
                    >
                      <Link
                        to={"/employees/" + row.id + "/edit"}
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
              user.user_permission.Employees &&
              user.user_permission.Employees.map((item) => {
                return (
                  item.name === "Delete" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Employee</Tooltip>}
                    >
                      <Link
                        to="#"
                        className="abtn text-success "
                        onClick={() => deleteItem(row.id)}
                      >
                        <DeleteIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
            {/* <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Permission</Tooltip>}
            >
              <Link
                to={"/employees/" + row.id + "/permission"}
                className="abtn text-primary"
              >
                <PersonIcon />
              </Link>
            </OverlayTrigger>*/}

            {/* <OverlayTrigger placement="top" overlay={<Tooltip>Delete Lead</Tooltip>}>
                  <Link to="#" className="abtn text-danger" onClick={() => deleteItem(row.id)}>
                      <DeleteIcon />
                  </Link>
                  </OverlayTrigger> */}
          </div>
        );
      },
      csvExport: false,
      classes: "text-left ml-0",
      headerStyle: (colum, colIndex) => {
        return { width: "120px", textAlign: "left" };
      },
      headerClasses: "pr-3",
      style: {
        minWidth: "120px",
      },
    },
  ];

  const MySearch = (props) => {
    let input;
    const handleClick = () => {
      props.onSearch(input.value);
    };
    return (
      <div>
        <input
          className="form-control"
          style={{ size: "10px" }}
          ref={(n) => (input = n)}
          size="sm"
          type="text"
          placeholder="Search"
          onChange={handleClick}
        />
      </div>
    );
  };

  const Search = () => {
    return (
      <InputGroup>
        <FormControl
          name="name"
          size="sm"
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Search"
          onChange={(e) =>
            setQueryParams({ ...queryParams, searchTxt: e.target.value })
          }
          required
        />
        <InputGroup.Append>
          <Button size="sm" onClick={getData} variant="outline-secondary">
            Search
          </Button>
        </InputGroup.Append>
      </InputGroup>
    );
  };

  const defaultSorted = [
    {
      dataField: "id",
      order: "desc",
    },
  ];

  const CustomToggleList = ({ columns, onColumnToggle, toggles }) => (
    <div
      className="text-centre  mr-0"
      style={{ position: "relative", display: "block" }}
    >
      <div
        style={{
          display: "inline-block",
          zIndex: "100",
          position: "absolute",
          right: "0",
          background: "#FFF",
        }}
      >
        <ul>
          {columns
            .map((column) => ({
              ...column,
              toggle: toggles[column.dataField],
            }))
            .map((column, index) => (
              <li style={{ listStyle: "none", textAlign: "left" }}>
                <Form.Check
                  type="checkbox"
                  key={column.dataField}
                  inline
                  label={column.text}
                  id={column.dataField}
                  className="columnName"
                  //aria-pressed={(column.toggle) ? "true" : "false"}
                  checked={column.toggle}
                  aria-checked={column.toggle ? "true" : "false"}
                  onChange={() => onColumnToggle(column.dataField)}
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );

  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.list({ ...queryParams, page: currentPage, size: perPage }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setItems(response.data.employees);
          setRecords(response.data.totalRecord);
          const fromPage = (currentPage - 1) * perPage + 1;
          const toPage =
            (currentPage - 1) * perPage + response.data.employees.length;
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

  const checkValue = (e) => {
    setPerPage(e.target.value);
    setCurrentPage(1);
  };
  //return (<h1>Under Development..</h1>)

  return (
    <>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          {/* <div className="row mb-3">
                        <div className="col-md-4 ">
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
                       
                    </div> */}

          <div className="rk-table mb-0" size="md">
            {!loading && (
              <div className="text-right">
                {/* <RemoteAll
                                data={items}
                                onKeyDown={handleKeyDown}
                                onChange={(e) =>setQueryParams({ ...queryParams, searchTxt: e.target.value })}
                                > 
                        
                                {loading && 
                                    (
                                    <div colSpan="6" className="text-center">
                                        <Spinner animation="border" variant="info" />
                                    </div>
                                    )
                                }
                                </RemoteAll> */}
                <Table columns={columns} data={items} total={records} />
              </div>
            )}
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
          </div>
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
});
