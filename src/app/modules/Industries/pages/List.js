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
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
import App from "../../../Configs/app";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
  textFilter,
  numberFilter,
  Comparator,
} from "react-bootstrap-table2-filter";
import Table from "./Table";
import ToolkitProvider, {
  CSVExport,
  ColumnToggle,
  Search,
} from "react-bootstrap-table2-toolkit";
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
  suhbeader.setTitle("Industry Types");
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [industries, setIndustries] = React.useState([]);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);

  const { ExportCSVButton } = CSVExport;
  const { user } = useSelector((state) => state.auth);

  const checkValidity=(date)=>{
    return new Date(date).getTime() > new Date(new Date()).getTime();
  }
  const columns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
      sort: true,
      csvExport: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      // headerStyle: {
      //     display: "grid"
      //     },
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter ID",
      }),
    },
    {
      dataField: "name",
      text: "Industry",
      sort: true,
      sortCaret: sortCaret,
      // headerStyle: {
      //     display: "grid"
      //     },
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },

    {
      dataField: "created_at",
      text: "Date",
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
              user.user_permission.IndustryType &&
              user.user_permission.IndustryType.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Industry Type</Tooltip>}
                    >
                      <Link
                        to={"/master/industries/" + row.id + "/edit"}
                        className="abtn text-success mr-4"
                      >
                        <EditIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
              {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.IndustryType &&
              user.user_permission.IndustryType.map((item) => {
                return (
                  item.name === "Delete" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Lead</Tooltip>}
                    >
                      <Link
                        to="#"
                        className="abtn text-danger"
                        onClick={() => deleteIndustry(row.id)}
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
          setIndustries(response.data.itypes);
          setRecords(response.data.totalRecord);
          const fromPage = (currentPage - 1) * perPage + 1;
          const toPage =
            (currentPage - 1) * perPage + response.data.itypes.length;
          setFrom(fromPage);
          setTo(toPage);
        }
        setLoading(false);
      }
    );
  }, [queryParams, currentPage, perPage]);

  React.useEffect(getData, [queryParams, currentPage, perPage]);

  const totalPages = Math.ceil(records / perPage);

  const deleteIndustry = (id) => {
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
          <div className="rk-table mb-0" size="md">
            {!loading && industries.length < 1 && (
              <div colSpan="7">No industry found.</div>
            )}
            {!loading && (
              <div className="row text-right">
                <div className="col-md-12">
                  {/* <RemoteAll
                                data={industries}
                                > 
                        
                                {loading && 
                                    (
                                    <div colSpan="6" className="text-center">
                                        <Spinner animation="border" variant="info" />
                                    </div>
                                    )
                                }
                                </RemoteAll>  */}
                  <Table columns={columns} data={industries} />
                </div>
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
