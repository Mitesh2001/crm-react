import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import Actions from '../Actions';
import { useToasts } from 'react-toast-notifications';
import { TextField } from "@material-ui/core";
import jQuery from 'jquery';


function Add() {
    const { addToast } = useToasts();
    const suhbeader = useSubheader();
    suhbeader.setTitle("Add Contact");

    const [validated, setValidated] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [states, setStates] = React.useState([]);
    const [redirect, setRedirect] = React.useState(false);
    const [sendLoading, setSendLoading] = React.useState(false);
    const [sendResponse,setResponseRecord] = React.useState(false);
    const [ResponseConfirm, setResponseConfirm] = React.useState(false);
    const [responsedirect, setResponseRedirect] = React.useState(false);

    const getStates = React.useCallback((cid) => {
        Actions.states(cid || 101).then((data) => {
            if (data.status === 'SUCCESS') {
                setStates(data.data.states);
            }
        });
    }, []);

    const checkValue = (values) => {
        var value = document.getElementsByClassName('house-type')[0].value;
        jQuery('.flat-data').addClass('d-none');
        if (value == 'flat') {
            jQuery('.flat-data').removeClass('d-none');
        }
        else {
            jQuery('.sqft-data').removeClass('d-none');
        }
    }


    const handleSubmit = (event) => {
        setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData.entries());
            Actions.add(formDataObj).then((response) => {
                setLoading(false);
                addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
                if (response.status === 'SUCCESS') {
                    setRedirect(true);
                }
            });
            setValidated(false);
        } else {
            setValidated(true);
            setLoading(false);
        }
    }


    if (redirect) {
        return <Redirect to="/contactform" />
    }

    return (
        <>
        <div className="add-edit-contactform">
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
            >
                <Card className="rkcrm-card mb-5">
                    <Card.Body className="p-3">
                        <div className="row">

                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control name="name" size="sm" type="text" autoComplete="off" placeholder="Enter name " required />
                                    <Form.Control.Feedback type="invalid">Please enter name </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Mobile No.<span className="text-danger">*</span></Form.Label>
                                    <Form.Control name="mobile_no" size="sm" type="text" minLength="10" autoComplete="off" placeholder="Enter mobile no" required />
                                    <Form.Control.Feedback type="invalid">Please enter mobile no</Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Business</Form.Label>
                                    <Form.Control name="business" size="sm" type="text" autoComplete="off" placeholder="Enter business" />
                                    <Form.Control.Feedback type="invalid">Please enter business</Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Cast</Form.Label>
                                    <Form.Control name="cast_id" as="select"  className="browser-default custom-select castt">                                       
                                     <option value="0">Select Cast</option>
                                                             
                                        <option className="actions-btns" value = "other" >Other</option>
                                    </Form.Control>
                                    <Form.Control size="sm" style = {{display:'none'}} type="text" name="addcast" placeholder="Add Your Cast Here" id="txtOther" />
                                    <Form.Control.Feedback type="invalid">Please select cast</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Budget</Form.Label>
                                    <Form.Control name="budget" size="sm" type="number" autoComplete="off" placeholder="Enter budget" />
                                    <Form.Control.Feedback type="invalid">Please enter budget</Form.Control.Feedback>
                                </Form.Group>
                            </div>


                            <div className="col-md-3">

                            <div>
                                <Form.Label>Select Project Type<span className="text-danger">*</span></Form.Label>
                                <select name="tenament" required onChange={checkValue} className="browser-default custom-select house-type">
                                    <option>Choose your option</option>
                                    <option value="flat">Flat </option>
                                    <option value="house">House</option>
                                    <option value="office">Office</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4 d-none flat-data">
                            <Form.Group>
                                <Form.Label>Flat Selection</Form.Label>
                                <div className="col-md-12">
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input" defaultValue="1" name="flat_selection" />1 BHK
                                            </label>
                                    </div>
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input" defaultValue="2" name="flat_selection" />2 BHK
                                            </label>
                                    </div>
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input" defaultValue="3" name="flat_selection" />3 BHK
                                            </label>
                                    </div>
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input" defaultValue="4" name="flat_selection" />4 BHK
                                            </label>
                                    </div>
                                </div>
                            </Form.Group>
                        </div>
                        <div className="col-md-4 d-none flat-data sqft-data">
                            <Form.Group>
                                <Form.Label>Square Foot </Form.Label>
                                <Form.Control name="foot" size="sm" type="number" autoComplete="off" placeholder="Enter Square Foot" />
                                <Form.Control.Feedback type="invalid">Please enter Square Foot</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Favourite Location </Form.Label>
                                <Form.Control name="fav_location" size="sm" type="text" autoComplete="off" placeholder="Enter favourite location" />
                                <Form.Control.Feedback type="invalid">Please enter favourite location</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Favourite Floor </Form.Label>
                                <Form.Control name="fav_floor" size="sm" type="text" autoComplete="off" placeholder="Enter favourite floor" />
                                <Form.Control.Feedback type="invalid">Please enter favourite floor</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Reference </Form.Label>
                                <Form.Control name="reference" size="sm" type="text" autoComplete="off" placeholder="Enter reference" />
                                <Form.Control.Feedback type="invalid">Please enter reference</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Broker Name</Form.Label>
                                <Form.Control name="broker_name" size="sm" type="text" autoComplete="off" placeholder="Enter broker name" />
                                <Form.Control.Feedback type="invalid">Please enter broker name</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Broker Mobile No. </Form.Label>
                                <Form.Control name="broker_mobile_no" size="sm" type="text" autoComplete="off" placeholder="Enter broker mobile no" />
                                <Form.Control.Feedback type="invalid">Please enter broker mobile no</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Buy / Token time</Form.Label>
                                <Form.Control name="tokan_time" size="sm" type="text" autoComplete="off" placeholder="Enter buy / token Time" />
                                <Form.Control.Feedback type="invalid">Please enter token time</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Birth Dates</Form.Label>
                                <div className="col-md-12">
                                    <Form.Label>Husband
                                <Form.Control name="birthdates_h" id="h_birthdates" size="sm" type="date" max="3000-12-31" min="1000-01-01" autoComplete="off" placeholder="Birthday" />
                                    </Form.Label>
                                </div>
                                <div className="col-md-12">
                                    <Form.Label>Wife
                                <Form.Control name="birthdates_w" id="w_birthdates" size="sm" type="date" max="3000-12-31" min="1000-01-01" autoComplete="off" placeholder="Birthday" />
                                    </Form.Label>
                                </div>
                                <div className="col-md-12">
                                    <Form.Label>Child 1
                                <Form.Control name="birthdates_c1" id="c1_birthdates" size="sm" type="date" max="3000-12-31" min="1000-01-01" autoComplete="off" placeholder="Birthday" />
                                    </Form.Label>
                                </div>
                                <div className="col-md-12">
                                    <Form.Label>Child 2
                                <Form.Control name="birthdates_c2" id="c2_birthdates" size="sm" type="date" max="3000-12-31" min="1000-01-01" autoComplete="off" placeholder="Birthday" />
                                    </Form.Label>
                                </div>
                            </Form.Group>
                        </div>


                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Anniversary</Form.Label>
                                <Form.Control name="anniversary" size="sm" type="date" max="3000-12-31" min="1000-01-01" autoComplete="off" placeholder="Enter anniversary" />
                                <Form.Control.Feedback type="invalid">Please enter anniversary</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Follow Up / Response</Form.Label>
                                <div className="form-group row">
                                    <Form.Label className="col-md-1 col-form-label">1</Form.Label>
                                    <div className="col-md-11">
                                        <Form.Control name="followup1" id="1_followup" size="sm" type="text" autoComplete="off" placeholder="followup 1" />
                                    </div></div>
                                <div className="form-group row">
                                    <Form.Label className="col-md-1 col-form-label">2</Form.Label>
                                    <div className="col-md-11">
                                        <Form.Control name="followup2" id="2_followup" size="sm" type="text" autoComplete="off" placeholder="followup 2" />
                                    </div></div>
                                <div className="form-group row">
                                    <Form.Label className="col-md-1 col-form-label">3</Form.Label>
                                    <div className="col-md-11">
                                        <Form.Control name="followup3" id="3_followup" size="sm" type="text" autoComplete="off" placeholder="followup 3" />
                                    </div></div>
                                <div className="form-group row">
                                    <Form.Label className="col-md-1 col-form-label">4</Form.Label>
                                    <div className="col-md-11">
                                        <Form.Control name="followup4" id="4_followup" size="sm" type="text" autoComplete="off" placeholder="followup 4" />
                                    </div></div>
                                <div className="form-group row">
                                    <Form.Label className="col-md-1 col-form-label">5</Form.Label>
                                    <div className="col-md-11">
                                        <Form.Control name="followup5" id="5_followup" size="sm" type="text" autoComplete="off" placeholder="followup 5" />
                                    </div></div>
                                <div className="form-group row">
                                    <Form.Label className="col-md-1 col-form-label">6</Form.Label>
                                    <div className="col-md-11">
                                        <Form.Control name="followup6" id="6_followup" size="sm" type="text" autoComplete="off" placeholder="followup 6" />
                                    </div></div>
                            </Form.Group>
                        </div>

                        <div className="col-md-6">
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control as="textarea" rows="3" className="form-control" name="remarks" placeholder="Enter remarks" />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Label>I.L.</Form.Label>
                            <div className="col-md-12">
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" defaultValue="1" name="il" /><i className="fas fa-star" />
                                    </label>
                                </div>
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" defaultValue="2" name="il" /><i className="fas fa-star" /><i className="fas fa-star" />
                                    </label>
                                </div>
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" defaultValue="3" name="il" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                                    </label>
                                </div>
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" defaultValue="4" name="il" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                                    </label>
                                </div>
                            </div>
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
                        disabled={loading}>
                        {loading ? 'Loading..' : 'SAVE'}
                    </Button>
                        &nbsp;<Link to="/Contactform" className="btn btn-danger btn-sm">CANCEL</Link>
                </div>
            </div>
            </Form>
        </div>

            </>
    );
};

export default React.memo(Add);