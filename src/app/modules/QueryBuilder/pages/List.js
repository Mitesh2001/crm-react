import React from "react";
import { Link } from "react-router-dom";
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
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PlayArrowOutlined from "@material-ui/icons/PlayArrowOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import { useToasts } from "react-toast-notifications";
import { useSubheader } from "../../../../_metronic/layout";
import Table from "./Table";
import Actions from "../Actions";
import { useSelector } from "react-redux";

function List() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Report Builder");
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const { user } = useSelector((state) => state.auth);

  const deleteItem = (id) => {
    setDeleteRecord(id);
    setDeleteConfirm(true);
  };
  const checkValidity=(date)=>{
    return new Date(date).getTime() > new Date(new Date()).getTime();
  }
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

  const columns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
      classes: "text-left ml-0",
      headerAlign: "left",
    },

    {
      dataField: "rule_name",
      text: "Report Name",
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    // {
    //   dataField: "rule_query",
    //   text: "Query",
    //   classes: "text-left ml-0",
    //   headerAlign: "left",
    //   formatter: (cell) => {
    //     return <>{cell.substr(0, 50)}</>;
    //   },
    // },
    {
      dataField: "module",
      text: "Module",
      classes: "text-left ml-0",
      headerAlign: "left",
      formatter: (cell) => {
        if (cell === 1) {
          return <>Leads</>;
        } else {
          return <>Contacts</>;
        }
      },
      csvFormatter: (cell) => {
        if (cell === 1) {
          return "Leads";
        } else {
          return "Contacts";
        }
      },
    },
    // {
    //   dataField: "group_by",
    //   text: "Group By",
    //   classes: "text-left ml-0",
    //   headerAlign: "left",
    // },
    {
      text: "Action",
      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            {user.user_permission &&
              user.user_permission.ReportBuilder &&
              user.user_permission.ReportBuilder.map((item) => {
                return (
                  item.name === "Run" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Run Report</Tooltip>}
                    >
                      <Link
                        to={"/report-builder/" + row.id + "/show"}
                        className="abtn text-info "
                      >
                        <PlayArrowOutlined />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}

            {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.ReportBuilder &&
              user.user_permission.ReportBuilder.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Report</Tooltip>}
                    >
                      <Link
                        to={"/report-builder/" + row.id + "/edit"}
                        className="abtn text-success "
                      >
                        <EditIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
            {checkValidity(user.company_details.expiry_date) && user.user_permission &&
              user.user_permission.ReportBuilder &&
              user.user_permission.ReportBuilder.map((item) => {
                return (
                  item.name === "Delete" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Report</Tooltip>}
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

  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.list().then((response) => {
      if (response.status === "SUCCESS") {
        setItems(response.data.queryRule);
        setLoading(false);
      }
    });
  }, []);

  React.useEffect(getData, [currentPage]);

  return (
    <>
      <div className="rk-sub-header mb-5">All Reports</div>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          {!loading && (
            <div className="rk-table mb-0 text-right" size="md">
              {/* //     <RemoteAll
                            //     data={items}
                            //     > 
                        
                            //     {loading && 
                            //         (
                            //         <div colSpan="6" className="text-center">
                            //             <Spinner animation="border" variant="info" />
                            //         </div>
                            //         )
                            //     }
                            //     </RemoteAll>  */}
              <Table columns={columns} data={items} />
              <Modal show={deleteConfirm} onHide={handleClose}>
                <Modal.Header className="p-3" closeButton>
                  <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">
                  Are you sure want to delete?
                </Modal.Body>
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
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default React.memo(List);
