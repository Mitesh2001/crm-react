import React from "react";
import { Link } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import {
  Table,
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
import App from "../../../Configs/app";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import CloseIcon from "@material-ui/icons/Close";
import {
  validatePhoneOnPress,
  disableUpDownArrow,
} from "../../../helpers/Helper";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import cellEditFactory from 'react-bootstrap-table2-editor';
// import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';

export default React.memo(() => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Products");
  const { addToast } = useToasts();
  const [queryParams, setQueryParams] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [viewConfirm, setViewConfirm] = React.useState(false);
  const [products, setProducts] = React.useState({});
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [validated, setValidated] = React.useState(false);

  const { ExportCSVButton } = CSVExport;

  const columns = [
    // {
    //     dataField: 'id',
    //     text: ' No.',
    //    // hidden: true
    //   },
    //   {
    //     dataField: 'skucode',
    //     text: 'SKU Code',
    //     sort: true
    //   },

    {
      dataField: "skucode",
      text: "SKUCode",
      sort: true,
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "category.name",
      text: "Category",
      sort: true,
    },
    {
      dataField: "listprice",
      text: "Price",
      sort: true,
    },

    {
      dataField: "listprice",
      text: "Product Price",
      sort: true,
    },

    {
      // dataField: "",
      text: "Action",
      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            {/* <OverlayTrigger placement="top" overlay={<Tooltip>Edit Product</Tooltip>}>
                  <Link to={"/products/" + row.id + "/edit"} className="abtn text-success mr-4">
                    <EditIcon /> 
                  </Link>
                  </OverlayTrigger> */}
            {/*   
                  <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                  <Link to="#" className="abtn text-info" onClick={() => viewItem(row.id)}>
                       <VisibilityIcon />
                  </Link>
                  </OverlayTrigger> */}

            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Link
                to={"/products/" + row.id + "/show"}
                className="abtn text-info"
                // onClick={() => viewItem(row.id)}
              >
                <VisibilityIcon />
              </Link>
            </OverlayTrigger>
          </div>
        );
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "id",
      order: "desc",
    },
  ];

  const RemoteAll = ({ data }) => (
    <div className="contact-product-table">
      <ToolkitProvider keyField="id" data={data} columns={columns} exportCSV>
        {(props) => (
          <div>
            {/* <ExportCSVButton { ...props.csvProps } className=" rk-add-btn text-right text-white mb-2">Export CSV</ExportCSVButton> */}

            <BootstrapTable {...props.baseProps} classes="table" bootstrap4 />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );

  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.listProducts({ ...queryParams, page: currentPage }).then(
      (response) => {
        if (response.status === "SUCCESS") {
          setCurrentPage(response.data.current);
          setItems(response.data.products);
          setRecords(response.data.totalRecord);
        }
        setLoading(false);
      }
    );
  }, [queryParams, currentPage]);

  React.useEffect(getData, [currentPage]);

  const totalPages = Math.ceil(records / App.perPage);

  const viewItem = (id) => {
    // setDeleteRecord(id);
    Actions.infoProducts(id).then((response) => {
      if (response.status === "SUCCESS") {
        setProducts(response.data.product);
      }
    });
    setViewConfirm(true);
  };

  const handleClose = () => {
    //setDeleteRecord(false);
    setViewConfirm(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getData();
    }
  };

  //return (<h1>Under Development..</h1>)

  return (
    <>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <InputGroup className="mb-0">
                <FormControl
                  name="name"
                  size="sm"
                  type="text"
                  onKeyDown={handleKeyDown}
                  placeholder="Search.."
                  onChange={(e) =>
                    setQueryParams({
                      ...queryParams,
                      searchTxt: e.target.value,
                    })
                  }
                  required
                />
                <InputGroup.Append>
                  <Button
                    size="sm"
                    onClick={getData}
                    variant="outline-secondary"
                  >
                    Search
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </div>
          </div>

          <div className="rk-table mb-0" size="md">
            {!loading && items.length < 1 && (
              <div colSpan="7">No product found.</div>
            )}
            {!loading && (
              <div className="text-right">
                <RemoteAll data={items}>
                  {loading && (
                    <div colSpan="6" className="text-center">
                      <Spinner animation="border" variant="info" />
                    </div>
                  )}
                </RemoteAll>
              </div>
            )}
          </div>
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

      {/* <Modal show={viewConfirm} onHide={handleClose}>
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>Brief Info About the Products/Service</Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-3">
          <div className="row item-summary">
            <div className="col-md-4">
              <label>
                <strong>SKU Code : </strong>
              </label>
              <p>{products?.skucode}</p>
            </div>
            <div className="col-md-4">
              <label>
                <strong>Name:</strong>
              </label>
              <p>{products?.name}</p>
            </div>
            <div className="col-md-4">
              <label>
                <strong>Category:</strong>
              </label>
              <p>{products?.name}</p>
            </div>
            <div className="col-md-4">
              <label>
                <strong>Price:</strong>
              </label>
              <p>{products?.listprice}</p>
            </div>
            <div className="col-md-4">
              <label>
                <strong>Discount % :</strong>
              </label>
              <p>{products?.discount_percent}</p>
            </div>
            <div className="col-md-4">
              <label>
                <strong>Discount Amount:</strong>
              </label>
              <p>{products?.discount_amount}</p>
            </div>

            <div className="col-md-4">
              <label>
                <strong>Final Amount:</strong>
              </label>
              <p>{products?.final_amount}</p>
            </div>
            <div className="col-md-4">
              <label>
                <strong>Offer Period:</strong>
              </label>
              <p>{products?.offer_end_date}</p>
            </div>
            <div className="col-xl-8">
              <label>
                <strong>Description:</strong>
              </label>
              <p>{products?.description}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="p-3">
          <Button
            variant="danger"
            size="sm"
            onClick={handleClose}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
});
