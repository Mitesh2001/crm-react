import React, { Component, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button, FormControl, InputGroup } from "react-bootstrap";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";

function Add() {
  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Requisition Form");

  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [states, setStates] = React.useState([]);
  const [redirect, setRedirect] = React.useState(false);
  const [companyLogo, setCompanyLogo] = React.useState(null);
  const [picture, setPicture] = React.useState(null);
  const [currentSum, setCurrentSum] = useState(0);
  const [quantity,setQuantity]=useState("");
  // changes here
  useEffect(() => {
    document.querySelector("#num").value = "";
  }, []);

  // useEffect(getStates, []);
  // useEffect(() => {
  //     document.querySelector('#result').value = "";
  // }, [])

  const Add = (e) => {
    e.preventDefault();

    let currentNum = document.querySelector("#num").value;
    if (currentNum == "") return;
    let sum = 100 * parseInt(currentNum);
    setCurrentSum(sum);
    document.querySelector("#num").value = "";
  };

  const getStates = React.useCallback((cid) => {
    Actions.states(cid).then((data) => {
      if (data.status === "SUCCESS") {
        setStates(data.data.states);
      }
    });
  }, []);

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if(!quantity){
      addToast("Quantity is required", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if(quantity === "0"){
      addToast("Quantity can't be '0'", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (form.checkValidity() === true && quantity !== "0" && quantity !== "") {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.quantity = quantity;
      Actions.add(formDataObj).then((response) => {
        setLoading(false);
        
        if (response.status === "SUCCESS") {
          addToast(response.message, {
            appearance: "success",
            autoDismiss: true,
          });
          setRedirect(true);
        }
        else{
          if(response.message === "The type must be an integer."){
            addToast("'Request For' field is required", {
              appearance: "error",
              autoDismiss: true,
            });
          }
          else if(response.message === "The type must be an integer.,The quantity field is required."){
            addToast("'Request For' field is required", {
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

  if (redirect) {
    return <Redirect to="/requisitionform" />;
  } else {
    return (
      <div className="add-edit-requisitionform">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Card className="rkcrm-card mb-5">
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-4">
                  <Form.Label className="mr-3">
                    {" "}
                    Request For<span className="text-danger">*</span>
                  </Form.Label>
                  <select
                    name="type"
                    className="browser-default custom-select "
                  >
                    <option>Choose your option</option>
                    <option value="1">Email</option>
                    <option value="2">SMS</option>
                  </select>
                </div>

                <div className="App col-md-4">
                  <form>
                    <Form.Group>
                      <Form.Label>
                        Quantity<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="quantity1"
                        size="sm"
                        type="number"
                        id="num"
                        autoComplete="off"
                        placeholder="Enter Quantity"
                        onChange={(e)=>setQuantity(e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter quantity
                      </Form.Control.Feedback>
                    </Form.Group>
                    {/* <Form.Group>
                                        <Form.Label>price</Form.Label>
                                        <Form.Control name="price" size="sm" type="number" id="result" autoComplete="off" value={currentSum} readOnly />
                                        <Form.Control.Feedback type="invalid">Please enter price</Form.Control.Feedback>
                                    </Form.Group> */}
                    {/* <button type="button" class="btn btn-primary" onClick={Add}>Add</button> */}
                  </form>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="row">
            <div className="col-md-12">
              <Button
                size="sm"
                variant="primary"
                className="rk-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading.." : "SAVE"}
              </Button>
              &nbsp;
              <Link to="/requisitionform" className="btn btn-danger btn-sm">
                CANCEL
              </Link>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default React.memo(Add);
