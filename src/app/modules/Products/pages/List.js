import React from "react";
import { Link } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { useSelector } from "react-redux";
import {
  Form,
  Accordion,
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
import VisibilityIcon from "@material-ui/icons/Visibility";
import Pagination from "@material-ui/lab/Pagination";
import Table from "./Table";
import App from "../../../Configs/app";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import CloseIcon from "@material-ui/icons/Close";
import {
  validatePhoneOnPress,
  disableUpDownArrow,
} from "../../../helpers/Helper";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport,
  ColumnToggle,
  Search,
} from "react-bootstrap-table2-toolkit";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import filterFactory, {
  textFilter,
  numberFilter,
  Comparator,
} from "react-bootstrap-table2-filter";

export default React.memo(() => {
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);
  const { user } = useSelector((state) => state.auth);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [category, setCategory] = React.useState([{ category: "" }]);
  const [sendCategorys, setCategoryRecord] = React.useState(false);
  const [CategoryConfirm, setCategoryConfirm] = React.useState(false);
  const [selectedCategory, setcategorySelected] = React.useState(null);
  const [redirect, setRedirect] = React.useState(false);

  const { ExportCSVButton } = CSVExport;
  const { SearchBar } = Search;
  const suhbeader = useSubheader();
  suhbeader.setTitle("Products");
  const checkValidity = (date) => {
    return new Date(date).getTime() > new Date(new Date()).getTime();
  };
  const columns = [
    {
      dataField: "id",
      text: "ID",
      csvExport: true,
      sort: true,
      hidden: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter ID",
      }),
    },

    {
      dataField: "skucode",
      text: "SKU Code",
      sort: true,
      hidden: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      filter: textFilter({
        placeholder: "Enter SKU Code",
      }),
    },
    {
      dataField: "name",
      text:
        "Product Name" /* product_type === 1 ? "Product Name" : "Service Name", */,
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
      dataField: "listprice",
      text:
        "Product Price" /* product_type === 1 ? "Product Price" : "Service Price", */,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "product_type",
      text:
        "Product Type" /* product_type === 1 ? "Product Name" : "Service Name", */,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      hidden: true,
      formatter: (cell) => {
        if (cell === 1) {
          return "Product";
        } else {
          return "Service";
        }
      },
      csvFormatter: (cell) => {
        if (cell === 1) {
          return "Product";
        } else {
          return "Service";
        }
      },
    },
    {
      dataField: "offer_start_date_time",
      text:
        "Offer Start" /* product_type === 1 ? "Product Price" : "Service Price", */,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
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
      csvFormatter: (cell) => {
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
    },
    {
      dataField: "offer_end_date_time",
      text:
        "Offer End" /* product_type === 1 ? "Product Price" : "Service Price", */,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      hidden: true,
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
      csvFormatter: (cell) => {
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
    },
    {
      // dataField: "",
      text: "Action",
      formatter: (rowContent, i) => {
        return (
          <div className="actions-btns">
            {user.company_details &&
              checkValidity(user.company_details.expiry_date) &&
              user.user_permission &&
              user.user_permission.Product &&
              user.user_permission.Product.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>View Product</Tooltip>}
                    >
                      <Link
                        to={"/products/" + i.id + "/show"}
                        className="abtn text-info"
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
              user.user_permission.Product &&
              user.user_permission.Product.map((item) => {
                return (
                  item.name === "Edit" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Edit Product</Tooltip>}
                    >
                      <Link
                        to={"/products/" + i.id + "/edit"}
                        className="abtn text-success"
                      >
                        <EditIcon />
                      </Link>
                    </OverlayTrigger>
                  )
                );
              })}
            {checkValidity(user.company_details.expiry_date) &&
              user.user_permission &&
              user.user_permission.Product &&
              user.user_permission.Product.map((item) => {
                return (
                  item.name === "Delete" && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete Product</Tooltip>}
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
      headerAlign: "left",
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

  const CustomToggleList = ({ columns, onColumnToggle, toggles }) => {
    const [show, setShow] = React.useState(false);
    return (
      <div style={{ textAlign: "right" }}>
        <nav
          onMouseLeave={() => {
            if (show) {
              setShow(!show);
            }
          }}
          //className={styles.nav}
          style={{
            float: "right",
            position: "absolute",
            zIndex: "999",
            right: "0px",
          }}
        >
          {" "}
          <Button
            onClick={() => {
              setShow(!show);
            }}
            style={{ right: "0px" }}
            className="rk-add-btn mb-4"
          >
            <ArrowDropDownIcon />
            Select Columns
          </Button>
          <ul style={{ display: "fixed", zIndex: "3" }}>
            <li style={{ listStyle: "none" }}>
              <ul
                //className={styles.nav__submenu}
                style={{
                  textAlign: "left",
                  // marginTop: "38px",
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                {show && (
                  <div
                    style={{
                      backgroundColor: "rgb(220,220,220)",
                      // border: "2px solid black",
                      padding: "2% 3%",
                    }}
                  >
                    {columns
                      .map((column) => ({
                        ...column,
                        toggle: toggles[column.dataField],
                      }))
                      .map((column, index) => (
                        <li
                          //className={styles.nav__submenu_item}
                          style={{
                            backgroundColor: "rgba(220,220,220,0.7)",
                            margin: "10px",
                            listStyle: "none",
                            //textAlign: 'left'
                          }}
                        >
                          <Form.Check
                            id={index}
                            type="checkbox"
                            key={column.dataField}
                            inline
                            label={column.text}
                            //aria-pressed={column.toggle ? "true" : "false"}
                            checked={column.toggle}
                            aria-checked={column.toggle ? "true" : "false"}
                            onChange={() => onColumnToggle(column.dataField)}
                          />
                        </li>
                      ))}
                  </div>
                )}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    );
  };
  const handleCategory = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.name = formDataObj.categoryname;

      Actions.categoryadd(formDataObj).then((response) => {
        setLoading(false);
        if (response.status === "SUCCESS") {
          handleCategoryClose();
          setRedirect(false);
        }
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };
  const sendCategory = () => {
    setCategoryRecord();
    setCategoryConfirm(true);
  };
  const handleCategoryClose = () => {
    setCategoryRecord(false);
    setCategoryConfirm(false);
  };
  const checkCategory = (event) => {
    var values = event.target.value;
    if (values == "other") {
      sendCategory();
    }
  };
  const getCategory = React.useCallback(() => {
    Actions.category().then((data) => {
      if (data.status === "SUCCESS") {
        setCategory(data.data.productsCategory);
      }
    });
  }, []);
  React.useEffect(getCategory, []);

  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.list({ ...queryParams, page: currentPage, size: perPage }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setItems(response.data.products);
          setRecords(response.data.totalRecord);
          const fromPage = (currentPage - 1) * perPage + 1;
          const toPage =
            (currentPage - 1) * perPage + response.data.products.length;
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

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      //formDataObj.lead_status = 0;
      Actions.add(formDataObj).then((response) => {
        setLoading(false);
        
        
        if (response.status === "SUCCESS") {
          addToast(response.message, {
            appearance: "success",
            autoDismiss: true,
          });
          form.reset();
          getData();
        }
        else{
            if(response.message === "The category id field is required."){
              addToast("Category is required.", {
                appearance: "error",
                autoDismiss: true,
              });
            }
            else{
              addToast(response.message, {
                appearance: "error",
                autoDismiss: true,
              });
            }
         
        }
        
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };

  const checkValue = (e) => {
    setPerPage(e.target.value);
    setCurrentPage(1);
  };

  //return (<h1>Under Development..</h1>)

  return (
    <>
      {" "}
      {checkValidity(user.company_details.expiry_date) &&
        user.user_permission &&
        user.user_permission.Product &&
        user.user_permission.Product.map((item) => {
          return (
            item.name === "Create" && (
              <Accordion className="quick-add-lead">
                <Card className="rkcrm-card mb-5">
                  <Accordion.Toggle
                    as={Card.Header}
                    variant="link"
                    eventKey="0"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {isOpen ? <CloseIcon /> : <AddIcon />}{" "}
                    <span>Quick Add Product</span>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                      >
                        <div className="row">
                          <div className="col">
                            <div>
                              <Form.Label>
                                Product Type
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <select
                                type="hidden"
                                name="product_type"
                                required
                                className="browser-default custom-select"
                              >
                                {/* <option value="">Choose your option</option> */}
                                <option value="1">Product</option>
                                <option value="2">Service</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                              <Form.Label>
                                Category<span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                name="category_id"
                                id="category_id"
                                onChange={checkCategory}
                                as="select"
                                className="mycategory"
                              >
                                <option value="">Select Category</option>
                                {category &&
                                  category.map((i) => (
                                    <option value={i.id}>{i.name}</option>
                                  ))}
                                <option value="other">Add category</option>
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                Please select category
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                          <div className="col">
                            <Form.Group>
                              <Form.Label>SKU Code</Form.Label>
                              <Form.Control
                                name="skucode"
                                size="sm"
                                type="text"
                                autoComplete="off"
                                placeholder="Enter SKU code"
                              />
                            </Form.Group>
                          </div>

                          <div className="col">
                            <Form.Group>
                              <Form.Label>
                                Name<span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                name="name"
                                size="sm"
                                type="text"
                                autoComplete="off"
                                placeholder="Enter name."
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Please Enter name
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                          <div className="col">
                            <Form.Group>
                              <Form.Label>
                                Price<span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                name="listprice"
                                size="sm"
                                type="text"
                                autoComplete="off"
                                placeholder="Enter price"
                                onKeyPress={validatePhoneOnPress}
                                onKeyDown={disableUpDownArrow}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Please enter price
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>

                          <div className="col-md-12 text-center">
                            <Button
                              variant="primary"
                              className="rk-btn"
                              size="sm"
                              type="submit"
                              disabled={loading}
                            >
                              {loading ? "Loading.." : "Add Products"}
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            )
          );
        })}
      <div className="rk-sub-header mb-5">
        All Products
        {/* {product_type === 1 ? "All Products" : "All Services"} */}
      </div>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          <div className="row mb-3">
            {/* <div className="col-md-6 text-right">
                            <Link to="/products/add" className="rk-add-btn" ><AddIcon />Add Product</Link>
                        </div> */}
          </div>
          {/*               <Table className="rk-table mb-0" size="md">
                        <thead>
                            <tr>
								<th>No.</th>
								<th>SKU Code</th>
                                <th>Product Name</th>
                                <th>Product Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && items.length < 1 && (
                                <tr><td colSpan="4">No product found.</td></tr>
                            )}
                            {!loading && items.length > 0 && items.map(i => (
                                <tr key={'tr' + i.id}>
                                    <td>{i.id}</td>
                                    <td>{i.skucode}</td>
                                    <td>{i.name}</td>
                                    <td>{i.listprice}</td>
                                    <td>
                                        <div className="actions-btns">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit Product</Tooltip>}>
                                                <Link to={{
                                                    pathname: "/products/" + i.id + "/edit",
                                                    item: i
                                                }} className="abtn text-success"><EditIcon /></Link>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete Product</Tooltip>}>
                                                <Link to="#" className="abtn text-danger" onClick={() => deleteItem(i.id)}><DeleteIcon /></Link>
                                            </OverlayTrigger>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {loading && (
                                <tr><td colSpan="5" className="text-center"><Spinner animation="border" variant="info" /></td></tr>
                            )}
                        </tbody>
                    </Table>
       */}

          <div className="rk-table mb-0" size="md">
            {!loading && (
              <div className="text-right">
                <Table columns={columns} data={items} />
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
      <Modal
        show={CategoryConfirm}
        onHide={handleCategoryClose}
        onSubmit={handleCategory}
      >
        <Form noValidate validated={validated} onSubmit={handleCategory}>
          <Modal.Header className="p-3" closeButton>
            <Modal.Title>Add Category</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">
            <div className="row">
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label>New Category</Form.Label>
                  <Form.Control
                    name="categoryname"
                    size="sm"
                    type="text"
                    autoComplete="off"
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="p-3">
            <Button
              variant="danger"
              size="sm"
              onClick={handleCategoryClose}
              disabled={sendLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={sendLoading}
            >
              {sendLoading ? "Loading.." : "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
});
