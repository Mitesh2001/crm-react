import React from "react";
import { Link, Redirect } from 'react-router-dom';
import { useSubheader } from "../../../../_metronic/layout";
import { Table, Card, OverlayTrigger, Tooltip, Spinner,Form, Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Pagination from '@material-ui/lab/Pagination';
import App from '../../../Configs/app';
import Actions from '../Actions';
import { useToasts } from 'react-toast-notifications';
import CloseIcon from '@material-ui/icons/Close';


export default React.memo(() => {
    const suhbeader = useSubheader();
    suhbeader.setTitle("Contacts");
    const { addToast } = useToasts();
    const [queryParams, setQueryParams] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [records, setRecords] = React.useState(1);
    const [items, setItems] = React.useState([]);
    const [deleteConfirm, setDeleteConfirm] = React.useState(false);
    const [deleteRecord, setDeleteRecord] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);
    const [validated, setValidated] = React.useState(false);
    const [redirect, setRedirect] = React.useState(false);

    const [sendResponse,setResponseRecord] = React.useState(false);
    const [ResponseConfirm, setResponseConfirm] = React.useState(false);
    const [responsedirect, setResponseRedirect] = React.useState(false);


	const [sendContact,setContactRecord] = React.useState(false);
    const [ContactConfirm, setContactConfirm] = React.useState(false);
    const [sendLoading, setSendLoading] = React.useState(false);
	const [leadredirect, setLeadRedirect] = React.useState(false);

    const getData = React.useCallback(() => {
        setLoading(true);
        Actions.list({ ...queryParams, page: currentPage }).then((response) => {
            if (response.status === 'SUCCESS') {
                setCurrentPage(response.data.current);
                setItems(response.data.contacts);
                setRecords(response.data.totalRecord);
            }
            setLoading(false);
        });
    }, [queryParams, currentPage]);

    React.useEffect(getData, [currentPage]);

    const totalPages = Math.ceil(records / App.perPage);

    const deleteItem = id => {
        setDeleteRecord(id);
        setDeleteConfirm(true);
    }

    const handleDelete = () => {
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
	
	if(leadredirect){
		const leadeditpath = "/leads/"+leadredirect+"/edit";
		return <Redirect to={leadeditpath} />
	}

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            getData();
        }
    }
    const sendRespo = id =>{
        setResponseRecord(id);
        setResponseConfirm(true);
    }
    const handleResponse = (event) => {
        setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            
            const formDataObj = Object.fromEntries(formData.entries());
            
            Actions.noteresponse(formDataObj).then((response) => {
                // setResponseRedirect(response.data.contacts_id);
                setLoading(false);
                if (response.status === 'SUCCESS') {
                    handleResponseClose();
                    setRedirect(true);
                }
                addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
            });
            setValidated(false);
        } else {
            setValidated(true);
            setLoading(false);
        }
}
    const handleResponseClose = () => {
        setResponseRecord(false);
        setResponseConfirm(false);
    }

    return (
        <>        
            <div className="rk-sub-header mb-5">
                All Contacts
            </div>
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
                                    onChange={(e) => setQueryParams({ ...queryParams, searchTxt: e.target.value })}
                                    required
                                />
                                <InputGroup.Append>
                                    <Button size="sm" onClick={getData} variant="outline-secondary">Search</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                        <div className="col-md-6 text-right">
                            <Link to="/contactform/add" className="rk-add-btn" ><AddIcon />Add Contact</Link>
                        </div>
                    </div>
                    <Table className="rk-table mb-0" size="md">
                        <thead>
                        
                            <tr>
                            {items.slice(0,4).map(i => (<th key={'th' + i.id} >{i.name}</th>                            
                             ))}
                            <th>Action</th>
                            </tr>
                           
                        </thead>
                        <tbody>
                            {!loading && items.length < 1 && (
                                <tr><td colSpan="4">No Contact found.</td></tr>
                            )}
                            {!loading && items.length > 0 && items.map(i => (
                                <tr key={'tr' + i.id}>
                                    <td>{i.name}</td>
                                    <td>{i.mobile_no}</td>
                                    <td>{i.date}</td>
                                    <td>{i.selection}</td>
                                    <td>
                                        <div className="actions-btns">
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit Contact</Tooltip>}>
                                                <Link to={{
                                                    pathname: "/contactform/" + i.id + "/edit",
                                                    item: i
                                                }} className="abtn text-success"><EditIcon /></Link>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete Contact</Tooltip>}>
                                                <Link to="#" className="abtn text-danger" onClick={() => deleteItem(i.id)}><DeleteIcon /></Link>
                                            </OverlayTrigger>
											<Button size="sm" variant="outline-secondary" onClick={() => sendLead(i.id)}>Convert to Lead</Button>
                                            &nbsp; <Button size="sm" variant="outline-secondary" onClick={() => sendRespo(i.id)}>Response</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {loading && (
                                <tr><td colSpan="5" className="text-center"><Spinner animation="border" variant="info" /></td></tr>
                            )}
                        </tbody>
                    </Table>
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
            <Modal show={ResponseConfirm} onHide={handleResponseClose} onSubmit={handleResponse}>
                <Modal.Header className="p-3" closeButton>
                    <Modal.Title>Send Data</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">Note:</Modal.Body>
                <Form noValidate
                    validated={validated} onSubmit={handleResponse}>
                <Form.Group>
                <Form.Control name="note" size="sm" as="textarea" autoComplete="off" required />
                {/* <Form.Control type="hidden" id="contId" name="contId" value={i.id} /> */}

                </Form.Group>

                <Modal.Footer className="p-3">
                    
                    <Button variant="danger" size="sm" onClick={handleResponseClose} disabled={sendLoading}>Cancel</Button>
                    <Button type="submit" variant="primary" size="sm"  disabled={sendLoading}>{sendLoading ? 'Loading..' : 'Submit'}</Button>
                </Modal.Footer>
                </Form>
            </Modal>
            
        </>
    );
});