import React from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
//import QuickAdd from '../partials/QuickAdd';
import {
  Table,
  Form,
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Button,
  Modal,
  Collapse,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
import SendIcon from "@material-ui/icons/Send";
//import ImportExportIcon from '@material-ui/icons/ImportExport';
import App from "../../../Configs/app";
import Actions from "../../SMS/Actions";
import { useToasts } from "react-toast-notifications";
import moment from "moment";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FilterListIcon from "@material-ui/icons/FilterList";
import CancelIcon from "@material-ui/icons/Cancel";
import Filters from "../../SMS/partials/Filters";
import filterFactory, {
  textFilter,
  numberFilter,
  Comparator,
} from "react-bootstrap-table2-filter";
import ToolkitProvider, {
  CSVExport,
  ColumnToggle,
} from "react-bootstrap-table2-toolkit";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
//import { Pagination } from "../../../../_metronic/_partials/controls";
//import Table from './Table';

import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import jQuery from "jquery";

function ContactList() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Contacts List");
  const { id } = useParams();
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
  const [validated, setValidated] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  const columns = [
    {
      text: (
        <div class="form-check">
          <input class="checkone " type="checkbox" value="" id="a" />
          Select All
        </div>
      ),

      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            <div class="form-check">
              <input
                class="tele-checkbox checkboxes"
                type="checkbox"
                value={row.id}
                checked={row.is_assign == 1}
              />
            </div>
          </div>
        );
      },
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left mr-0",
      headerAlign: "left",
    },
    {
      dataField: "id",
      text: "ID",
      sortCaret: sortCaret,
      headerSortingClasses,
      hidden: true,
      sort: true,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter(),
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter(),
    },
    {
      dataField: "email",
      text: "Primary Email",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter(),
    },
    {
      dataField: "mobile_no",
      text: "Primary Mobile",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter(),
    },
    {
      dataField: "company_name",
      text: "Company Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter(),
    },
  ];

  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.contactlist({ ...queryParams, page: currentPage }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setItems(response.data.contacts);
          setRecords(response.data.totalRecord);
        }
        setLoading(false);
      }
    );
  }, [queryParams, currentPage]);

  React.useEffect(getData, [queryParams, currentPage]);

  const totalPages = Math.ceil(records / App.perPage);

  //select all checkbox
  jQuery(function() {
    jQuery(".checkall").click(function() {
      if (this.checked) {
        jQuery(".checkboxes").prop("checked", true);
      } else {
        jQuery(".checkboxes").prop("checked", false);
      }
    });
  });

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      var addAssignIds = [];
      jQuery.each(jQuery(".tele-checkbox:checked"), function() {
        addAssignIds.push(jQuery(this).val());
      });
      addAssignIds = addAssignIds.toString();
      formDataObj.contact_id = addAssignIds;
      formDataObj.sms_template_id = id;
      // for select all
      formDataObj.selectAll =
        jQuery(".checkall:checked").length == jQuery(".checkall").length;
      formDataObj.query = queryParams;

      Actions.sendEmail(formDataObj).then((response) => {
        setLoading(false);
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
        if (response.status === "SUCCESS") {
          setRedirect(true);
        }
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };

  /*     const deleteItem = id => {
        setDeleteRecord(id);
        setDeleteConfirm(true);
    } */

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getData();
    }
  };

  /* const handleDelete = () => {
        setDeleteLoading(true);
        Actions.delete(deleteRecord).then((response) => {
            setDeleteLoading(false);
            if (response.status === 'SUCCESS') {
                getData();
                handleClose();
            }
            addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
        });
    }
 
    const handleClose = () => {
        setDeleteRecord(false);
        setDeleteConfirm(false);
    }
 */

  if (leadredirect) {
    const leadeditpath = "/leads/" + leadredirect + "/edit";
    return <Redirect to={leadeditpath} />;
  } else {
    return (
      <>
        <div className="rk-sub-header mb-5">Send SMS to Contacts</div>
        <Card className="rkcrm-card mb-5">
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
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
                        <FilterListIcon /> &nbsp;Show
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

              <Table className="rk-table mb-0" size="md">
                <thead>
                  <tr>
                    <th></th>
                    <div className="form-check">
                      <input
                        className="checkall "
                        type="checkbox"
                        value=""
                        id="a"
                      />
                      <div className="col-md-3">
                        <th>Select</th>
                      </div>
                    </div>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Primary Email</th>
                    <th>Primary Mobile</th>
                    <th>Company Name</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && items.length < 1 && (
                    <tr>
                      <td colSpan="6">No contact found.</td>
                    </tr>
                  )}
                  {!loading &&
                    items.length > 0 &&
                    items.map((i) => (
                      <tr key={"tr" + i?.id}>
                        <td>{i?.select}</td>
                        <td>
                          <div className="form-check">
                            <input
                              className="tele-checkbox checkboxes"
                              type="checkbox"
                              value={i.id}
                              id="checkitem"
                            />
                          </div>
                        </td>
                        <td>{i?.id}</td>
                        <td>{i?.name}</td>
                        <td>{i?.email}</td>
                        <td>{i?.mobile_no}</td>
                        <td>{i?.company_name}</td>
                      </tr>
                    ))}
                  {loading && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <Spinner animation="border" variant="info" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div className="col-md-12 text-center">
                <Button
                  variant="primary"
                  className="abtn-text-primary"
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading.." : "Send"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {!loading && (
          <div className="text-right">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              variant="outlined"
            />
          </div>
        )}

        {/* <Modal show={deleteConfirm} onHide={handleClose}>
                <Modal.Header className="p-3" closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">Are you sure want to delete?</Modal.Body>
                <Modal.Footer className="p-3">
                    <Button variant="danger" size="sm" onClick={handleClose} disabled={deleteLoading}>No</Button>
                    <Button variant="primary" size="sm" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? 'Loading..' : 'Yes'}</Button>
                </Modal.Footer>
            </Modal>
             <Modal show={ContactConfirm} onHide={handleSendClose}>
                <Modal.Header className="p-3" closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">Are you sure want to convert this contact to lead?</Modal.Body>
                <Modal.Footer className="p-3">
                    <Button variant="danger" size="sm" onClick={handleSendClose} disabled={sendLoading}>No</Button>
                    <Button variant="primary" size="sm" onClick={handleSend} disabled={sendLoading}>{sendLoading ? 'Loading..' : 'Yes'}</Button>
                </Modal.Footer>
            </Modal>  */}
      </>
    );
  }
}

export default React.memo(ContactList);
