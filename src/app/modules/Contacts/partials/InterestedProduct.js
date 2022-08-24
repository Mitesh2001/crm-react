import React, { useState } from "react";
import { Link, Redirect, useParams, useLocation } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import { Multiselect } from "multiselect-react-dropdown";
import Pagination from "@material-ui/lab/Pagination";
import { useToasts } from "react-toast-notifications";
import { Modal } from "react-bootstrap";
import TimePicker from "react-bootstrap-time-picker";
import Actions from "../Actions";
import AddIcon from "@material-ui/icons/Add";
import Select from "react-select";
import App from "../../../Configs/app";
import DeleteIcon from "@material-ui/icons/Delete";
import InterestedProductNotes from "./InterestedProductNotes";

export default React.memo(function({ contact, getInfo1 }) {
  const { addToast } = useToasts();
  const { id } = useParams();
  let location = useLocation();
  const [redirect, setRedirect] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [listingLoading, setListingLoading] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [option, setOption] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);

  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [product, setProduct] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [listproducts, setListProducts] = React.useState([]);
  const [interestedProduct, setInterestedProduct] = React.useState([]);

  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          setInterestedProduct(response.data.contact.intrested_product);
          // setOption(response.data.contact.intrested_product.map(d=>d.id));
        } else {
          setRedirect(true);
        }
      });
    }
  }, [location, id, addToast]);
  React.useEffect(getInfo, []);

  const getProductnote = React.useCallback(() => {
    setListingLoading(true);
    Actions.listProducts().then((response) => {
      if (response.status === "SUCCESS") {
        setCurrentPage(response.data.current);
        setHistory(response.data.listProducts);
        setRecords(response.data.totalRecord);
      }
      setListingLoading(false);
    });
  }, []);
  React.useEffect(getProductnote, [currentPage]);

  const totalPages = Math.ceil(records / App.perPage);

  // handle input change event
  const handleInputChange = (value) => {
    setValue(value);
  };

  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  /*     const getlistProducts = React.useCallback((cid) => {
        setListingLoading(true);
        Actions.listProducts().then((data) => {
            if (data.status === 'SUCCESS') {
                setProduct(data.data.products);
            }
            setListingLoading(false);
        });
    }, []);
   React.useEffect(getlistProducts, [currentPage]); */

  //const [options]=React.useState(product);
  const getProducts = React.useCallback((cid) => {
    Actions.listProducts().then((data) => {
      if (data.status === "SUCCESS") {
        setProduct(data.data.products);
      }
    });
  }, []);
  React.useEffect(getProducts, []);

  const addProduct = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      var result = [];
      result = option.map((x) => x);
      result = result.toString();
      var params = { contact_id: contact.id, product_id: result };
      var assignParameters = params;
      Actions.addProduct(assignParameters).then((response) => {
        setLoading(false);
        if (response.message === "The product id field is required.") {
          addToast("Please Select Product/Service", {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          addToast(response.message, {
            appearance: response.status === "SUCCESS" ? "success" : "error",
            autoDismiss: true,
          });
        }
        if (response.status === "SUCCESS") {
          form.reset();
          getProductnote();
          getInfo1();
          setOption([]);
          getInfo();
          getProducts();
        }
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };
  const deleteItem = (id) => {
    const newOption = option.filter((item) => item !== id);
    setOption(newOption);
  };
  const onSelect = (event) => {
    setOption(Array.isArray(event) ? event.map((x) => x.id) : []);
  };

  const formatOptionLabel = ({ name }) => (
    <div style={{ display: "flex" }}>{name}</div>
  );
  return (
    <>
      <div className="lead-comments">
        <div className="add-comment-section mb-5">
          <Form noValidate validated={validated} onSubmit={addProduct}>
            <div className="row">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-4">
                    <Form.Group>
                      <Form.Label>Interested In Product/Service</Form.Label>
                      <Select
                        isMulti
                        name="products"
                        width="100%"
                        hideSelectedOptions={true}
                        options={product.filter(
                          (o1) =>
                            !interestedProduct.some((o2) => o1.id === o2.id)
                        )}
                        className="basic-multi-select tele-drop"
                        classNamePrefix="select"
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        formatOptionLabel={formatOptionLabel}
                        value={product.filter((obj) => option.includes(obj.id))} // set selected values
                        onChange={onSelect}
                      />
                      {/* <Multiselect 
                                            name="products"
                                            options={product}
                                            displayValue="name" 
                                            onChange={onSelect}
                                            value={option.name}      
                                        /> */}
                    </Form.Group>
                  </div>
                </div>
                {product &&
                  product.map((item) => {
                    if (option.includes(item.id)) {
                      return (
                        <div
                          className="row"
                          style={{
                            backgroundColor: "honeydew",
                            margin: "8px 5px",
                            padding: "8px 2px",
                          }}
                        >
                          <div className="col-md-6">{item.name} </div>
                          <div
                            className="col-md-6"
                            style={{ textAlign: "right" }}
                          >
                            <Link to="#" className="abtn">
                              <DeleteIcon onClick={() => deleteItem(item.id)} />
                            </Link>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                <div className="row">
                  <div className="col-sm-4 mt-8">
                    <Button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
                      <AddIcon style={{ fontSize: "xl" }} />{" "}
                      {loading ? "Loading.." : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
});
