import React from "react";
import { Link, Redirect } from 'react-router-dom';
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button, Image } from 'react-bootstrap';
import Actions from '../Actions';
import { useToasts } from 'react-toast-notifications';
import { isValidImage, validatePhoneOnPress, disableUpDownArrow } from '../../../helpers/Helper';

function Add() {
    const { addToast } = useToasts();
    const suhbeader = useSubheader();
    suhbeader.setTitle("Add Contact");

    const [validated, setValidated] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [countries, setCountries] = React.useState([]);
    const [states, setStates] = React.useState([]);
    const [redirect, setRedirect] = React.useState(false);
    const [companyLogo, setCompanyLogo] = React.useState(null);
    const [picture, setPicture] = React.useState(null);
    const [industries, setIndustries] = React.useState([]);
    const [companyTypes, setCompanyTypes] = React.useState([]);


    const getCategory = React.useCallback(() => {
        Actions.category().then((data) => {
            if (data.status === "SUCCESS") {
                setCategory(data.data.category);
            }
        });
    }, []);
    React.useEffect(getCategory, []);


    const getIndustries = React.useCallback(() => {
        Actions.industries().then((data) => {
            if (data.status === 'SUCCESS') {
                setIndustries(data.data.itypes);
            }
        });
    }, []);

    const getCompanyTypes = React.useCallback(() => {
        Actions.companyTypes().then((data) => {
            if (data.status === 'SUCCESS') {
                setCompanyTypes(data.data.ctypes);
            }
        });
    }, []);

    const getCountries = React.useCallback(() => {
        Actions.countries().then((data) => {
            if (data.status === 'SUCCESS') {
                setCountries(data.data.countries);
            }
        });
    }, []);

    const getStates = React.useCallback((cid) => {
        Actions.states(cid).then((data) => {
            if (data.status === 'SUCCESS') {
                setStates(data.data.states);
            }
        });
    }, []);

    React.useEffect(getCompanyTypes, []);
    React.useEffect(getIndustries, []);
    React.useEffect(getCountries, []);
    React.useEffect(getStates, []);

    const handleSubmit = (event) => {
        setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData.entries());
            formDataObj.company_logo = companyLogo;
            formDataObj.picture = picture;
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

    const changePhoto = (event, type) => {
        let files = event.target.files;
        if (files.length > 0 && isValidImage(files[0].type)) {
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = (e) => {
                const image = {
                    name: files[0].name,
                    type: files[0].type,
                    size: files[0].size,
                    base64: e.target.result,
                };
                type === 'C' ? setCompanyLogo(image) : setPicture(image);
            }
        } else {
            addToast('Please select proper image.', { appearance: 'error', autoDismiss: true });
        }
    }

    if (redirect) {
        return <Redirect to="/contacts" />
    }

    return (
        <div className="add-edit-lead">
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
            >
                <Card className="rkcrm-card mb-5">
                    <Card.Header className="p-3">Primary Information</Card.Header>
                    <Card.Body className="p-3">
                        <div className="row">
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control name="name" size="sm" type="text" autoComplete="off" placeholder="Enter name" required />
                                    <Form.Control.Feedback type="invalid">Please enter name</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Primary email <span className="text-danger">*</span></Form.Label>
                                    <Form.Control name="email" size="sm" type="email" autoComplete="off" placeholder="Enter primary email" required />
                                    <Form.Control.Feedback type="invalid">Please enter customer email</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Secondary email</Form.Label>
                                    <Form.Control name="secondary_email" size="sm" type="email" autoComplete="off" placeholder="Enter primary secondary email" />
                                    <Form.Control.Feedback type="invalid">Please enter secondary email</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Primary Mobile <span className="text-danger">*</span></Form.Label>
                                    <Form.Control name="mobile_no" size="sm" type="text" minLength="10" autoComplete="off" placeholder="Enter primary mobile no" onKeyPress={validatePhoneOnPress} onKeyDown={disableUpDownArrow} required />
                                    <Form.Control.Feedback type="invalid">Please enter proper mobile no</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Secondary Mobile</Form.Label>
                                    <Form.Control name="secondary_mobile_no" size="sm" type="text" autoComplete="off" placeholder="Enter secondary mobile no" onKeyPress={validatePhoneOnPress} onKeyDown={disableUpDownArrow} />
                                    <Form.Control.Feedback type="invalid">Please enter proper secondary mobile no</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            {picture?.base64 && (
                                <div className="col-md-1">
                                    <Image style={{ height: '60px' }} src={picture?.base64} />
                                </div>
                            )}
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Picture</Form.Label>
                                    <Form.File id="formcheck-api-custom">
                                        <Form.File.Input onChange={e => changePhoto(e, 'P')} isValid />
                                        <Form.Control.Feedback type="invalid">Please select proper image</Form.Control.Feedback>
                                    </Form.File>
                                </Form.Group>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="rkcrm-card mb-5">
                    <Card.Header className="p-3">Primary Contact Information</Card.Header>
                    <Card.Body className="p-3">
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>Address Line 1</Form.Label>
                                    <Form.Control name="address_line_1" size="sm" type="text" autoComplete="off" placeholder="Enter address line 1" />
                                    <Form.Control.Feedback type="invalid">Please enter address line 1</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control name="address_line_2" size="sm" type="text" autoComplete="off" placeholder="Enter address line 2" />
                                    <Form.Control.Feedback type="invalid">Please enter address line 2</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control size="sm" name="country_id" as="select" autoComplete="off" placeholder="Select country" onChange={e => getStates(e.target.value)} >
                                        <option value="0">Select country</option>
                                        {countries.map((i) => <option value={i.country_id} key={'c' + i.country_id} selected={i.country_id === 101}>{i.name}</option>)}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">Please select country</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control size="sm" name="state_id" as="select" autoComplete="off" placeholder="Select state" >
                                        <option value="0">Select state</option>
                                        {states.map((i) => <option value={i.state_id} key={'s' + i.state_id}>{i?.name}</option>)}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">Please select state</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control name="city" size="sm" type="text" autoComplete="off" placeholder="Enter city" />
                                    <Form.Control.Feedback type="invalid">Please enter city</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Postcode</Form.Label>
                                    <Form.Control name="postcode" size="sm" type="text" autoComplete="off" placeholder="Enter postcode" />
                                    <Form.Control.Feedback type="invalid">Please enter postcode</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="rkcrm-card mb-5">
                    <Card.Header className="p-3">Company Information</Card.Header>
                    <Card.Body className="p-3">
                        <div className="row">
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control name="company_name" size="sm" type="text" autoComplete="off" placeholder="Enter company name" />
                                    <Form.Control.Feedback type="invalid">Please enter company name</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Company Type</Form.Label>
                                    <Form.Control size="sm" name="company_type_id" as="select" autoComplete="off" placeholder="Select company type" >
                                        <option value="">Select company type</option>
                                        {companyTypes.map((i) => <option value={i.id} key={'i' + i.id}>{i.name}</option>)}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">Please select company type</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Industry</Form.Label>
                                    <Form.Control size="sm" name="industry_id" as="select" autoComplete="off" placeholder="Select industry" >
                                        <option value="">Select industry</option>
                                        {industries.map((i) => <option value={i.id} key={'i' + i.id}>{i.name}</option>)}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">Please select industry</Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Establish Year</Form.Label>
                                    <Form.Control name="established_in" size="sm" type="number" autoComplete="off" placeholder="Enter established year" />
                                    <Form.Control.Feedback type="invalid">Please enter establish year</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Annual Turnover</Form.Label>
                                    <Form.Control name="turnover" size="sm" type="text" autoComplete="off" placeholder="Enter annual turnover" />
                                    <Form.Control.Feedback type="invalid">Please enter annual turnover</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>GST Number</Form.Label>
                                    <Form.Control name="gst_no" size="sm" type="text" autoComplete="off" placeholder="Enter GST number" />
                                    <Form.Control.Feedback type="invalid">Please enter GST number</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>PAN Number</Form.Label>
                                    <Form.Control name="pan_no" size="sm" type="text" autoComplete="off" placeholder="Enter PAN number" />
                                    <Form.Control.Feedback type="invalid">Please enter PAN number</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Number of Employees</Form.Label>
                                    <Form.Control name="no_of_employees" size="sm" type="number" autoComplete="off" placeholder="Enter number of employees" />
                                    <Form.Control.Feedback type="invalid">Please enter number of employees</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control name="website" size="sm" type="text" autoComplete="off" placeholder="Enter website" />
                                    <Form.Control.Feedback type="invalid">Please enter website</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            {companyLogo?.base64 && (
                                <div className="col-md-1">
                                    <Image style={{ height: '60px' }} src={companyLogo?.base64} />
                                </div>
                            )}
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Company Logo</Form.Label>
                                    <Form.File id="formcheck-api-custom">
                                        <Form.File.Input onChange={e => changePhoto(e, 'C')} isValid />
                                        <Form.Control.Feedback type="invalid">Please select proper image</Form.Control.Feedback>
                                    </Form.File>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control name="category_id" id="category_id" as="select" className="mycategory">
                                        <option value="">Select Category</option>
                                        {category && category.map((i) => (
                                                <option value={i.id} key={'c' + i.id}>{i.name}</option>
                                            ))}
                                        {/* <option value="other">Add category</option> */}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">Please select category</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Sub Category</Form.Label>
                                    <Form.Control name="sub_category" size="sm" type="text" autoComplete="off" placeholder="Enter Sub category" />
                                    <Form.Control.Feedback type="invalid">Please enter sub category</Form.Control.Feedback>
                                </Form.Group>
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
                        &nbsp;<Link to="/contacts" className="btn btn-danger btn-sm">CANCEL</Link>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default React.memo(Add);