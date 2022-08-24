import React from "react";
import { Link, Redirect } from 'react-router-dom';
import { Button, Form, Spinner } from 'react-bootstrap';
import FollowUpNotes from './FollowUpNotes';
import Pagination from '@material-ui/lab/Pagination';
import { useToasts } from 'react-toast-notifications';
import {  Modal } from 'react-bootstrap';
import TimePicker from 'react-bootstrap-time-picker';
import Actions from '../Actions';
import App from '../../../Configs/app';
import jQuery from 'jquery';
import moment from 'moment';
import DatePicker from 'react-datetime';
import 'react-datetime/css/react-datetime.css';




export default React.memo(function ({ contact }) {
    const { addToast } = useToasts();
    const [loading, setLoading] = React.useState(false);
    const [listingLoading, setListingLoading] = React.useState(false);
    const [validated, setValidated] = React.useState(false);
    const [followup, setFollowup] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [records, setRecords] = React.useState(1);
    const [time, setTime]=React.useState('');
    const [sendContact,setContactRecord] = React.useState(false);
    const [ContactConfirm, setContactConfirm] = React.useState(false);
    const [sendLoading, setSendLoading] = React.useState(false);
    const [leadredirect, setLeadRedirect] = React.useState(false);
    const [list, setList] = React.useState([]);
    const [date, setDate] = React.useState('');


    const getData = React.useCallback(() => {
        setListingLoading(true);
         Actions.followUp({follow_up_id: contact.id, type:2 }).then((response) => {
            if (response.status === 'SUCCESS') {
                setCurrentPage(response.data.current);
                setFollowup(response.data.followUp);
                setRecords(response.data.totalRecord);
            }
            setListingLoading(false);
        });
    }, [currentPage, contact]);
    React.useEffect(getData, [currentPage]);

    const totalPages = Math.ceil(records / App.perPage);

   const addFollowup = (event) => {
         setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData.entries());
            formDataObj.follow_up_id = contact.id;
            formDataObj.type=2;
            var dateFormat = moment(date).format('YYYY-MM-DD');
            var timeFormat = moment(date).format('HH:mm:ss');
            formDataObj.date = dateFormat;
            formDataObj.time = timeFormat;
            Actions.addfollowup(formDataObj).then((response) => {
                setLoading(false);
                addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
                if (response.status === 'SUCCESS') {
                    form.reset();
                    getData();
                }
            });
            setValidated(false);
        } else {
            setValidated(true);
            setLoading(false);
        }
    }

    // const sendLead = id =>{
    //     setContactRecord(id);
    //     setContactConfirm(true);
    // }

    // const handleSend = () =>{
    //     setSendLoading(true);
    //     Actions.converttolead(sendContact).then((response) =>{
    //         setSendLoading(false);
    //         if(response.status === 'SUCCESS'){
    //             handleSendClose();
	// 			setLeadRedirect(response.data.lead.id);
    //         }
    //         addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
    //     });

    // }
    // const handleSendClose = () => {
    //     setContactRecord(false);
    //     setContactConfirm(false);
    // }

    const getList=(value)=>{
        jQuery('#assign').show();
        if(value=='3')
        {
            Actions.listEmployee().then((response)=>{
                if (response.status === 'SUCCESS') {
                    setList(response.data.employees);
                }
            });
        }

        if(value=='2')
        {
            Actions.listRole().then((response)=>{
                if (response.status === 'SUCCESS') {
                    setList(response.data.roles);
                }
            });
        }
        if(value=='1')
        {
                jQuery('#assign').hide();
        }


    }  

    // const handleTimeChange =(time)=>
    // {
    //     setTime(time);
    // }

    const handleDateChange = (date,val) => {
        setDate(date);
        setDt(val)
    }

    const [dt, setDt] = useState(moment());
    const yesterday = moment().subtract(1, 'day');
    const disablePastDt = current => {
        return current.isAfter(yesterday);
    };

    if(leadredirect){
		const leadeditpath = "/leads/"+leadredirect+"/edit";
		return <Redirect to={leadeditpath} />
	}

    return (
        <>
        <div className="lead-comments">
            <div className="add-comment-section mb-5">
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={addFollowup}
                >
                    <div className="row">
                    <div className="col-sm-12">
                            <div className="row">
                            <div className="col-sm-4">
                                    <Form.Group>
                                    
                                        <Form.Label>Follow Up Type</Form.Label>
                                        <Form.Control size="sm" name="follow_up_type" as="select" autoComplete="off" placeholder="Select type" >
                                            <option value="">Select type of follow up</option>
                                            <option value="call">Call</option>
                                            <option value="visit">Visit</option>
                                            <option value="meeting">Meeting</option>
                                            <option value="email">Email</option>
                                            <option value="task">Task</option>
                                        
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">Please select follow up type</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-sm-6">
                                        <Form.Group>
                                            <Form.Label>Select Date</Form.Label>
                                            <DatePicker
                                                isValidDate={disablePastDt}
                                                // value={dt}
                                                //value={date}
                                                className="followup-datetime"
                                                onChange={handleDateChange}
                                                dateFormat="YYYY-MM-DD"
                                                timeFormat="hh:mm A"
                                                //onChange={val => setDt(val)}
                                            />
                                        </Form.Group>
                                    </div>                                

{/*                             <div className="col-sm-4">  
                            <Form.Group>
                            <   Form.Label>Select Date</Form.Label>
                                <Form.Control name="date" size="sm" type="date" placeholder="Please choose the date" required />
                                <Form.Control.Feedback type="invalid">Please enter date.</Form.Control.Feedback>
                            </Form.Group>
                            </div>

                            <div className="col-sm-4">  
                            <Form.Group>
                            <   Form.Label>Select Time</Form.Label>
                                <TimePicker 
                                    start="6:00"
                                    end="24:00"
                                    steps={30}
                                    onChange={handleTimeChange} 
                                    value={time} 
                                />
                            </Form.Group>
                            </div>
 */}                            </div>
                     </div>

                        <div className="col-sm-12">
                            <Form.Group>
                                <Form.Control name="note" size="sm" as="textarea" placeholder="Enter follow up" required />
                                <Form.Control.Feedback type="invalid">Please enter follow up</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-sm-12 ">
                            <div className="row">
                            <div className="col-sm-6">
                                <Form.Group>
                                <Form.Label>Assign to</Form.Label>
                                    <Form.Control size="sm" name="assign_type" as="select"  autoComplete="off" placeholder="Select assign" onChange={e => getList(e.target.value)}>
                                        <option value="">Select assign</option>
                                        <option value="1">Assign to Self</option>
                                        <option value="2">Assign to Role</option>
                                        <option value="3">Assign to User</option>                                    
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">Please select lead stage</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-sm-6" id="assign">
                                <Form.Group>
                                <Form.Label>List</Form.Label>
                                    <Form.Control size="sm" name="user_id"  as="select" autoComplete="off" placeholder="Select assign" >
                                        <option value="">Select assign</option>
                                        {list.map((i) => <option value={i.id} key={'ls' + i.id}>{i.name}</option>)}
                                    
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">Please select lead stage</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <Button variant="primary" type="submit" size="sm" disabled={loading}>{loading ? 'Loading..' : 'Add follow up'}</Button>
                             {/* <Button className="ml-3" size="sm" variant="outline-secondary" onClick={() => sendLead(contact.id)} >Convert to Lead</Button>  */}
                        </div>


                    </div>
                </Form>
            </div>
            <div className="comments-section mb-5">
                {listingLoading && (
                    <div className="text-center"><Spinner animation="border" variant="info" /></div>
                )}
                {!listingLoading && followup.map(item => <FollowUpNotes followupNote={item} key={'followupNote-' + item.id} />)}
            </div>

            {/* {!listingLoading && (
                <div className="comments-pagination">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                        variant="outlined"
                    />
                </div>
            )} */}
        </div>
        {/* <Modal show={ContactConfirm} onHide={handleSendClose}>
        <Modal.Header className="p-3" closeButton>
            <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">Are you sure want to convert this contact to lead?</Modal.Body>
        <Modal.Footer className="p-3">
            <Button variant="danger" size="sm" onClick={handleSendClose} disabled={sendLoading}>No</Button>
            <Button variant="primary" size="sm" onClick={handleSend} disabled={sendLoading}>{sendLoading ? 'Loading..' : 'Yes'}</Button>
        </Modal.Footer>
    </Modal> */}
    </>
    );
});
