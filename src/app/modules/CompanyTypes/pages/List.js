import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
} from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
import App from "../../../Configs/app";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import moment from "moment";
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
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import cellEditFactory from 'react-bootstrap-table2-editor';
// import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';

export default React.memo(function() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Company Types");
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);

  const { ExportCSVButton } = CSVExport;
  const { user } = useSelector((state) => state.auth);
  const permission = [];
  // user.user_permission.Companytype &&
  //   user.user_permission.Companytype.map((item) => {
  //   });
  const checkValidity=(date)=>{
    return new Date(date).getTime() > new Date(new Date()).getTime();
  }

  const columns = [
    {
      dataField: "id",
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
      text: "Company Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Company Type",
      }),
    },

    {
      dataField: "created_at",
      text: "Created At",
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
        if (cell) {
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
        } else {
          return " ";
        }
      },
      classes: "text-left ml-0",
      headerAlign: "left",
    },

    {
      // dataField: "",
      text: "Action",
      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.CompanyType &&
              user.user_permission.CompanyType.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Company Type</Tooltip>}
                    >
                      <Link
                        to={"/master/company-types/" + row.id + "/edit"}
                        className="abtn text-success mr-4"
                      >
                        <EditIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}

            {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.CompanyType &&
              user.user_permission.CompanyType.map((item) => {
                return (
                  item.name === "Delete" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Company Type</Tooltip>}
                    >
                      <Link
                        to="#"
                        className="abtn text-danger mr-4"
                        onClick={() => deleteCompanyType(row.id)}
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
        return { width: "120px", textAlign: "left" };
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
    Actions.list({ ...queryParams, page: currentPage, size: perPage }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setItems(response.data.ctypes);
          setRecords(response.data.totalRecord);
          const fromPage = (currentPage - 1) * perPage + 1;
          const toPage =
            (currentPage - 1) * perPage + response.data.ctypes.length;
          setFrom(fromPage);
          setTo(toPage);
        }
        setLoading(false);
      }
    );
  }, [queryParams, currentPage, perPage]);

  React.useEffect(getData, [queryParams, currentPage, perPage]);

  const totalPages = Math.ceil(records / perPage);

  const deleteCompanyType = (id) => {
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

  return (
    <>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          {/* <div className="row mb-3">
                        <div className="col-md-6">
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
                            <Link to="/master/company-types/add" className="rk-add-btn" ><AddIcon />Add Company Type</Link>
                        </div>
                    </div> */}
          <div className="rk-table mb-0" size="md">
            {!loading && items.length < 1 && (
              <div colSpan="7">No company found.</div>
            )}
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
});
