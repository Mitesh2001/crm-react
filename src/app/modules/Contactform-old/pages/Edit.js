import React from "react";
import { Link, useLocation, useParams, Redirect } from 'react-router-dom';
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button, Image, FormControl, InputGroup } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import Editor from '../../../Core/Editor';
import Actions from '../Actions';
import { isValidImage, validatePhoneOnPress, disableUpDownArrow } from '../../../helpers/Helper';
import App from '../../../Configs/app';

export default React.memo(function () {
    let location = useLocation();
    const { id } = useParams();
    const suhbeader = useSubheader();
    suhbeader.setTitle("Edit Contact");
    const { addToast } = useToasts();
    const [validated, setValidated] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [info, setInfo] = React.useState(location.item ? location.item : {});
    const [birthdates, setBirthdates] = React.useState(false);
    const [followup, setFollowup] = React.useState(false);
    const [redirect, setRedirect] = React.useState(false);
    const [cast, setCast] = React.useState([]);
    const [dynamicItem, setInformation] = React.useState([]);

    const getInformation = React.useCallback(() => {
             Actions.dynamiccontact().then((response) => {
                 if (response.status === 'SUCCESS') {
                     setInformation(response.data);
                     
                 } else {
                     addToast(response.message, { appearance: 'error', autoDismiss: true });
                     setRedirect(true);
                 }
             });
     }, []);
 
 
     React.useEffect(getInformation, []);
 

	//const [picture, setPicture] = React.useState(null);
    //const [description, setDescription] = React.useState("");

    const getCast = React.useCallback(() => {
        Actions.cast().then((data) => {
            if (data.status === 'SUCCESS') {
                setCast(data.data.cast);
            }
        });
    }, []);
    

    const getInfo = React.useCallback(() => {
        if (location.item === undefined) {
            Actions.info(id).then((response) => {
                if (response.status === 'SUCCESS') {
                    setInfo(response.data.contact)
                    setBirthdates(response.data.contact.birthdates)
                    setFollowup(response.data.contact.followup)
                } else {
                    addToast(response.message, { appearance: 'error', autoDismiss: true });
                    setRedirect(true);
                }
            });
        }
    }, [location, id, addToast]);

    React.useEffect(getInfo, []);
    
    const handleSubmit = (event) => {
        setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData.entries());		
            Actions.update({...formDataObj, id}).then((response) => {
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
	
	//const image = info.image && info.image !== '' ? App.assetUrl + info.image : false;

    return (
        <div className="add-edit-contactform">
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
            >                
            {dynamicItem.map((data) =>
    <Card className="rkcrm-card mb-5">
    <Card.Header className="p-3">{data.section_title}</Card.Header>
    { data && data.field_data.map((sub) =>

    { 
        switch (sub.input_type)
        {
        case 'textarea':
            return (
        <Card.Body className="p-3">
            <div className="row">
                <div className="col-md-4">
                    <Form.Group>
                        <Form.Label>{sub.label_name}<span className="text-danger">*</span></Form.Label>
                        <Form.Control name={sub.label_name} size="sm" as={sub.input_type} defaultValue={info?.remarks} autoComplete="off" maxvalue={sub.maxvalue} maxlength={sub.maxlength} minlength={sub.minlength} pattern={sub.pattern} minvalue={sub.minvalue} is_required={sub.is_required} isSearchable={sub.isSearchable} placeholder={sub.label_name} required />
                        <Form.Control.Feedback type="invalid">Please enter name</Form.Control.Feedback>
                    </Form.Group>
                </div>
            </div> 
            </Card.Body>
            )
        case 'text':
            return (
                <Card.Body className="p-3">
                    <div className="row">
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>{sub.label_name}<span className="text-danger">*</span></Form.Label>
                                <Form.Control name={sub.label_name} size="sm" defaultValue={info?.name} type={sub.input_type} autoComplete="off" placeholder={sub.label_name} maxvalue={sub.maxvalue} maxlength={sub.maxlength} minlength={sub.minlength} pattern={sub.pattern} required />
                                <Form.Control.Feedback type="invalid">Please enter name</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </div> 
                    </Card.Body>
                    )       
        case 'number':
            return (
                <Card.Body className="p-3">
                    <div className="row">
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>{sub.label_name}<span className="text-danger">*</span></Form.Label>
                                <Form.Control name={sub.label_name} size="sm" type={sub.input_type} defaultValue={info?.mobile_no} autoComplete="off" placeholder={sub.label_name} is_select_multiple={sub.is_select_multiple} is_searchable={sub.is_searchable} is_required={sub.is_required} maxvalue={sub.maxvalue} maxlength={sub.maxlength} minlength={sub.minlength} pattern={sub.pattern} required />
                                <Form.Control.Feedback type="invalid">Please enter name</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </div> 
                    </Card.Body>
                    )
        case 'select':
            return (
                <Card.Body className="p-3">
                    <div className="row">
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>{sub.label_name}<span className="text-danger">*</span></Form.Label>
                                <Form.Control name={sub.label_name} size="sm" as={sub.input_type} autoComplete="off" placeholder={sub.label_name} is_select_multiple={sub.is_select_multiple} is_searchable={sub.is_searchable} is_required={sub.is_required} maxvalue={sub.maxvalue} maxlength={sub.maxlength} minlength={sub.minlength} pattern={sub.pattern} required >
                                <option value="">Select gender</option>
                                { sub && sub.values.map((gender) =>
                                <option value={gender.value}>{gender.value}</option>
                                )}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">Please enter name</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </div> 
                    </Card.Body>
                    )
        }   
    }
)}    </Card>
                   )}   


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
                        &nbsp;<Link to="/employees" className="btn btn-danger btn-sm">CANCEL</Link>
                    </div>
                </div>
            </Form>
        </div>    
    );
});
