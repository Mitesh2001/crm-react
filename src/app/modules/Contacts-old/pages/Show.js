import React from "react";
import { Link, useLocation, useParams, Redirect } from 'react-router-dom';
import { useSubheader } from "../../../../_metronic/layout";
import {Form, Card, Image, Tab, Nav, OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import Summary from '../partials/Summary';
import CompanySummary from '../partials/CompanySummary';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EmailIcon from '@material-ui/icons/Email';
import { useToasts } from 'react-toast-notifications';
import Actions from '../Actions';
import moment from 'moment';
import jQuery from 'jquery';
import App from '../../../Configs/app';
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import FollowUp from '../partials/FollowUp';
import ContactComments from '../partials/ContactComments';
import { Editor } from '@tinymce/tinymce-react';
import ProductInfo from '../partials/ProductInfo';
import InterestedProduct from '../partials/InterestedProduct';
import { isValidImage, validatePhoneOnPress, disableUpDownArrow, TinyEditorKey } from '../../../helpers/Helper';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PhoneIcon from '@material-ui/icons/Phone';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';




function Show({contact}) {
    const suhbeader = useSubheader();
    suhbeader.setTitle("Contact Information");
    let location = useLocation();
    const { id } = useParams();
    const { addToast } = useToasts();
    
    const [queryParams, setQueryParams] = React.useState({});
    const [info, setInfo] = React.useState(location.item ? location.item : {});
    const [redirect, setRedirect] = React.useState(false);
    const [deleteConfirm, setDeleteConfirm] = React.useState(false);
    const [deleteRecord, setDeleteRecord] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);
    const [mailConfirm, setMailConfirm] = React.useState(false);
    const [mailRecord, setMailRecord] = React.useState(false);
    const [sendLoading, setSendLoading] = React.useState(false);
    const [emailTemplate, setEmailTemplate] = React.useState([]);
    const [template, setTemplate] = React.useState([]);
    const [emailcontent, setEmailContent] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [validated, setValidated] = React.useState(false);
    const [isChecked, setIsChecked]=React.useState(false);
    const [sendContact,setContactRecord] = React.useState(false);
    const [ContactConfirm, setContactConfirm] = React.useState(false);
    const [leadredirect, setLeadRedirect] = React.useState(false);

    const sendLead = id =>{
        setContactRecord(id);
        setContactConfirm(true);
    }
    const handleSend = () =>{
        setSendLoading(true);
        Actions.converttolead(sendContact).then((response) =>{
            setSendLoading(false);
            if(response.status === 'SUCCESS'){
                handleSendClose();
				setLeadRedirect(response.data.lead.id);
            }
            addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
        });

    }
    const handleSendClose = () => {
        setContactRecord(false);
        setContactConfirm(false);
    }


    const getInfo = React.useCallback(() => {
        if (location.item === undefined) {
            Actions.info(id).then((response) => {
                if (response.status === 'SUCCESS') {
                    setInfo(response.data.contact);
                } else {
                    addToast(response.message, { appearance: 'error', autoDismiss: true });
                    setRedirect(true);
                }
            });
        }
    }, [location, id, addToast]);

    React.useEffect(getInfo, []);

    const getEmailTemplate = React.useCallback(() => {
        Actions.emailTemplate({ ...queryParams}).then((response) => {
            if (response.status === 'SUCCESS') {
                
                setEmailTemplate(response.data.email);
                
            }
            setLoading(false);
        });
    }, []);

    React.useEffect(getEmailTemplate, []);

    const handleChange = (event) => {
        Actions.selectTemplate(event.target.value).then((response) => {
            if (response.status === 'SUCCESS') {
                setTemplate(response.data.email);
            }
            setLoading(false);
        });
      
    }

    const handleEditorChange = (content, editor) => {
		setEmailContent(content);
	}

    const oldcontent = template.content ? template.content : ''; 

    const deleteItem = id => {
        setDeleteRecord(id);
        setDeleteConfirm(true);
    }
    
    var checked=false;
    const handleCheck= (e)=>{
        if(e.target.checked===true)
        {
            checked=true;
            
        }
        else{
            checked=false;
        }
       
    }

    const handleDelete = () => {
        setDeleteLoading(true);
        Actions.delete(deleteRecord).then((response) => {
            setDeleteLoading(false);
            addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
            if (response.status === 'SUCCESS') {
                setRedirect(true);
            }
        });
    }

    const handleClose = () => {
        setDeleteRecord(false);
        setDeleteConfirm(false);
    }

    const sendEmail = () => {
        setMailRecord();
        setMailConfirm(true);
    }
    const handleMailClose = () => {
        setMailRecord(false);
        setMailConfirm(false);
    }

    const handleMail = (event) => {
        setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData.entries());
            formDataObj.contact_id = id;
            formDataObj.content = (emailcontent)?emailcontent:oldcontent ;
             
            Actions.sendEmail(formDataObj).then((response) => {
                setLoading(false);
                if (response.status === 'SUCCESS') {
                    handleMailClose();
                    setRedirect(false);
                }
                addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
            });
            setValidated(false);
        } else {
            setValidated(true);
            setLoading(false);
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
           formDataObj.is_lock = checked;
            
            formDataObj.contact_id = id;

        
            Actions.lock(formDataObj).then((response) => {
                setLoading(false);
                addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
                if (response.status === 'SUCCESS') {
                    //setRedirect(true);
                    getInfo();
                }
            });
            setValidated(false);
        } else {
            setValidated(true);
            setLoading(false);
        }
    }

    if (redirect) {
        return <Redirect to="/contacts" />
    }

    if(leadredirect){
		const leadeditpath = "/leads/"+leadredirect+"/edit";
		return <Redirect to={leadeditpath} />
	}
    const picture = info?.picture && info.picture !== '' ? App.assetUrl + info.picture : toAbsoluteUrl("/media/users/default.jpg");

    return (
        <>
            <Tab.Container id="left-tabs-example" defaultActiveKey="follow-up">
                <div className="lead-head-section mb-5">
                    <div className="row mb-5">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-3 company_logo text-center">
                                    <Image src={picture} roundedCircle />
                                </div>
                                <div className="col-md-9 company_info">
                                    <ul className="p-5">
                                    <div className="row mb-3">
                                            <div className="abtn text-white mr-4 " >
                                                <AccountCircleIcon fontSize="medium" className="abtn text-success" />&nbsp;{info?.name}&nbsp;{info.company_name}
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="abtn text-white mr-4 " >
                                                <EmailIcon fontSize="medium" className="abtn text-success" />&nbsp;{info.email}
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="abtn text-white mr-4 " >
                                                <PhoneIcon fontSize="medium" className="abtn text-success" />&nbsp;{info.mobile_no}
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="abtn text-white mr-4 " >
                                                <LocationOnIcon fontSize="medium" className="abtn text-success" />&nbsp;{info?.city}
                                            </div>
                                        </div>
                                            
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <li>
                                <Form
                                    noValidate
                                    validated={validated}
                                    onSubmit={handleSubmit}
                            
                                >
                                    <div className="form-check text-white">
                                            
                                        <input className="tele-checkbox checkboxes" type="checkbox" onChange={e => handleCheck(e)} defaultValue={id} defaultChecked={info.is_lock === 1 ? 'true' : 'false'}  /> Are you want to lock this contact? 
                                    </div>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <div style={{marginLeft:"12%", marginTop:"4%"}} >
                                    {info.is_lock ===1 ? <Button
                                        variant="primary"
                                        className="abtn-text-primary"
                                        size="sm"
                                        type="submit"
                                        disabled={loading}>
                                        <LockOpenOutlinedIcon fontSize="small" className="abtn text-white"/>
                                        {loading ? 'Loading..' : 'Unlock'}
                                    </Button>
                                    :
                                    <Button
                                        variant="primary"
                                        className="abtn-text-primary"
                                        size="sm"
                                        type="submit"
                                        disabled={loading}>
                                        <LockOutlinedIcon fontSize="small" className="abtn text-white"/>
                                        {loading ? 'Loading..' : 'Lock'}
                                    </Button>}
                                    </div>
                                </Form>
                                </li>
                            </div>
                        <div className="col-md-3 text-right lead-actions">
                            {info.id && (
                                <ul>
                                    <li>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Back</Tooltip>}>
                                            <Link to="/contacts" className="abtn text-white"><KeyboardBackspaceIcon /></Link>
                                        </OverlayTrigger>
                                    </li>
                                    <li>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Send Email</Tooltip>}>
                                        <Link to="#" onClick={() => sendEmail()} className="abtn text-white" ><EmailIcon /></Link>
                                        </OverlayTrigger>
                                    </li>
                                    <li>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit Contact</Tooltip>}>
                                            <Link to={{
                                                pathname: "/contacts/" + id + "/edit",
                                                item: info
                                            }} className="abtn text-white"><EditIcon /></Link>
                                        </OverlayTrigger>
                                    </li>
                                    <li>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete Contact</Tooltip>}>
                                            <Link to="#" className="abtn text-white" onClick={() => deleteItem(id)}><DeleteIcon /></Link>
                                        </OverlayTrigger>
                                    </li>
                                
                                        <li>
                                     <Button className="ml-3" size="sm"  style={{color:"white",marginTop:"10px"}} variant="outline-secondary"  onClick={() => sendLead(id)}>Convert to Lead</Button> 
                                        </li>
                                </ul>
                            )}
                        </div>
                    </div>
                    <Nav>
                    <Nav.Item>
                            <Nav.Link eventKey="follow-up">Follow Up</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="notes">Notes</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="interested">Interested in Product/Service</Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="product-list">All Products/Services</Nav.Link>
                        </Nav.Item>
                        
                        <Nav.Item>
                            <Nav.Link eventKey="summary">Summary</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="company">Company Information</Nav.Link>
                        </Nav.Item>
                        
                        
                        
                       
                    </Nav>
                </div>
                <Card className="rkcrm-card mb-5">
                    <Card.Body>
                        <Tab.Content>
                            <Tab.Pane eventKey="summary">
                                <Summary item={info} />
                                
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="follow-up">
                                {info.id && (<FollowUp contact={info} />)}
                            </Tab.Pane>
                            <Tab.Pane eventKey="notes">
                                {info.id && (<ContactComments contact={info} />)}
                            </Tab.Pane>
                            
                            
                            <Tab.Pane eventKey="interested">
                                <InterestedProduct contact={info} />
                            </Tab.Pane>

                            <Tab.Pane eventKey="product-list">
                                <ProductInfo contact={info} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="company">
                                <CompanySummary item={info} />
                            </Tab.Pane>
                            

                        </Tab.Content>
                    </Card.Body>
                </Card>
            </Tab.Container>
            <Modal show={deleteConfirm} onHide={handleClose}>
                <Modal.Header className="p-3" closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">Are you sure want to delete?</Modal.Body>
                <Modal.Footer className="p-3">
                    <Button variant="danger" size="sm" onClick={handleClose} disabled={deleteLoading}>No</Button>
                    <Button variant="primary" size="sm" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? 'Loading..' : 'Yes'}</Button>
                </Modal.Footer>
            </Modal>
            <Modal dialogClassName="modal-lg"  className="modal" show={mailConfirm} onHide={handleMailClose}>
                <Modal.Header className="p-3" closeButton>
                    <Modal.Title>Send Email</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3"></Modal.Body>
                <Form 
                    noValidate
                    validated={validated}
                    onSubmit={handleMail}
                >
                    <div className="row">
                        <div className="col-md-5">
                            <Form.Group>
                            
                                <Form.Label className="ml-3"> Email Template<span className="text-danger">*</span></Form.Label>
                                <Form.Control size="sm" name="template_id" as="select" onChange={handleChange} autoComplete="off" className="custom-select tele-drop ml-3" placeholder="Select template" required>
                                    <option  value="">Select email template</option>
                                    {emailTemplate.map((i) => <option value={i.email_template_id} key={'e' + i.email_template_id} >{i.name}</option>)}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">Please select email template</Form.Control.Feedback>

                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label className="ml-3">Email Id</Form.Label>
                                <Form.Control name="to_email" defaultValue={info.email} size="sm" type="text" autoComplete="off" className="ml-2" placeholder="Enter email" required />
                                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-11">
                            <Form.Group>
                                <Form.Label className="ml-3">Subject</Form.Label>
                                <Form.Control name="subject" defaultValue={template.subject} size="sm" type="text" autoComplete="off" className="ml-3" placeholder="Enter Subject" required />
                                <Form.Control.Feedback type="invalid">Please Enter Subject</Form.Control.Feedback>
                            </Form.Group >  
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-11">
                            <Form.Group className="ml-3">
                                <Form.Label className="ml-1">Email Content:</Form.Label>
                                
                                <Editor
                                    init={{
                                        selector: 'textarea#myTextArea',
                                        plugins: [
                                        'lists link image paste help wordcount'
                                        ],
                                        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help'
                                    }}
                                    apiKey={TinyEditorKey}
                                    value={oldcontent}
                                    onEditorChange={handleEditorChange}
                                    
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <Modal.Footer className="">
                        <Button variant="danger" size="sm" onClick={handleMailClose} disabled={sendLoading}>Cancel</Button>
                        <Button className="btnnote" type="submit" variant="primary" size="sm" disabled={sendLoading}>{sendLoading ? 'Loading..' : 'Send'}</Button>
                    </Modal.Footer>
                </Form>
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
    </Modal>
        </>
    );
};

export default React.memo(Show);