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
} from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
import App from "../../../Configs/app";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import filterFactory, {
  textFilter,
  selectFilter,
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

export default React.memo(() => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Requisition Form");
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

  const selectOptions = {
    1: "Email",
    2: "SMS",
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
      dataField: "type",
      text: "Request For",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: selectFilter({
        options: selectOptions,
      }),
      formatter: (cell) => {
        if(cell=="1"){
          return "Email"
        }else{
          return "SMS"
        }
      },
      csvFormatter: (cell) => {
        if(cell=="1"){
          return "Email"
        }else{
          return "SMS"
        }
      }
    },
    {
      dataField: "quantity",
      text: "Quantity",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter Quantity",
      }),
    },

    // {
    //   // dataField: "",
    //   text: "Action",
    //   formatter: (rowContent, row) => {
    //     return (
    //       <div className="actions-btns">
    //         {user.user_permission &&
    //           user.user_permission.Requisitionform &&
    //           user.user_permission.Requisitionform.map((item) => {
    //             return (
    //               item.name === "Edit" && (
    //                 <OverlayTrigger
    //                   placement="top"
    //                   overlay={<Tooltip>Edit Company Type</Tooltip>}
    //                 >
    //                   <Link
    //                     to={"/master/company-types/" + row.id + "/edit"}
    //                     className="abtn text-success mr-4"
    //                   >
    //                     <EditIcon />
    //                   </Link>
    //                 </OverlayTrigger>
    //               )
    //             );
    //           })}
    //       </div>
    //     );
    //   },
    //   csvExport: false,
    //   classes: "text-left ml-0",
    //   headerStyle: (colum, colIndex) => {
    //     return { width: "120px", textAlign: "left" };
    //   },
    //   headerClasses: "pr-3",
    //   style: {
    //     minWidth: "120px",
    //   },
    // },
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
          setItems(response.data.requisition);
          setRecords(response.data.totalRecord);
          const fromPage = (currentPage - 1) * perPage + 1;
          const toPage =
            (currentPage - 1) * perPage + response.data.requisition.length;
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
          <div className="rk-table mb-0" size="md">
            {/* {!loading && items.length < 1 && 
                        (
                            <div colSpan="7">
                            No product found.
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
                                </RemoteAll>  */}
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
    </>
  );
});
