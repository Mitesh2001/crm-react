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
  suhbeader.setTitle("Contacts");
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
      classes: "text-left ml-0",
      headerAlign: "left",
      sort: true,
    },
    {
      dataField: "name",
      text: "Name",
      classes: "text-left ml-0",
      headerAlign: "left",
      sort: true,
    },
    {
      dataField: "category.name",
      text: "Category",
      classes: "text-left ml-0",
      headerAlign: "left",
      sort: true,
    },
    {
      dataField: "listprice",
      text: "Price",
      classes: "text-left ml-0",
      headerAlign: "left",
      sort: true,
    },

    {
      dataField: "listprice",
      text: "Product Price",
      classes: "text-left ml-0",
      headerAlign: "left",
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
            <BootstrapTable
              //wrapperClasses="table-responsive "
              classes="table table-head-custom table-vertical-center"
              bootstrap4
              hover
              {...props.baseProps}
            />
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

  if (loading) {
    return (
      <div colSpan="6" className="text-center">
        <Spinner animation="border" variant="info" />
      </div>
    );
  }
  if (!loading && items.length < 1) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>No Product Found</h1>
      </div>
    );
  }
  return (
    <>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <InputGroup className="mb-0 ml-8">
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
    </>
  );
});
