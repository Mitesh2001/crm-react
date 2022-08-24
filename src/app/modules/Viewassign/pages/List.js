import React from "react";
import { Link, Redirect } from 'react-router-dom';
import { useSubheader } from "../../../../_metronic/layout";
import { Table, Card, OverlayTrigger, Tooltip, Spinner, Button, Modal, Form, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import Pagination from '@material-ui/lab/Pagination';
import App from '../../../Configs/app';
import Actions from '../Actions';
import { useToasts } from 'react-toast-notifications';
import FilterListIcon from '@material-ui/icons/FilterList';
import CancelIcon from '@material-ui/icons/Cancel';
import Filters from '../partials/Filters';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import jQuery from 'jquery';
import { string } from "prop-types";

export default React.memo(() => {
    const suhbeader = useSubheader();
    suhbeader.setTitle("Telecalling Management");
    const { addToast } = useToasts();
    const [queryParams, setQueryParams] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [records, setRecords] = React.useState(1);
    const [validated, setValidated] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [deleteConfirm, setDeleteConfirm] = React.useState(false);
    const [redirect, setRedirect] = React.useState(false);
    const [deleteRecord, setDeleteRecord] = React.useState([]);
    const [deleteLoading, setDeleteLoading] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);
    const [users, setUsers] = React.useState([]);


    const postUsers = React.useCallback(() => {
        Actions.users().then((data) => {
            if (data.status === 'SUCCESS') {
                setUsers(data.data.employees);
            }
        });
    }, []);

    React.useEffect(postUsers, []);


 
    const getData = React.useCallback(() => {
        setLoading(true);
        Actions.show({ ...queryParams, page: currentPage }).then((response) => {
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


  

    
const handleDelete = (event) => {
        setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData.entries());
            var removeAssignIds = [];
            jQuery.each(jQuery(".tele-checkbox:checked"), function () {
                removeAssignIds.push(jQuery(this).val());
            });
            removeAssignIds = removeAssignIds.toString();
            var params = { contact_id: removeAssignIds, tele_caller_id: 2 };
            var assignParameters = jQuery.param(params);
            Actions.delete(assignParameters).then((response) => {
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
    


 

    // const handleClose = () => {
    //     setDeleteRecord(false);
    //     setDeleteConfirm(false);
    // }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            getData();
        }
    }


    //select all checkbox

    jQuery(function () {
        jQuery('.checkbox').click(function () {
            if (this.checked) {
                jQuery(".checkboxes").prop("checked", true);
            } else {
                jQuery(".checkboxes").prop("checked", false);
            }
        });
    });

    return (
        <>
            <div className="rk-sub-header mb-5">Assign contacts to tellecaller</div>
            <Card className="rkcrm-card mb-5">
                <Card.Body>
                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleDelete}
                    >

                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>Telecaller Users<span className="text-danger">*</span></Form.Label>
                                    <Form.Control size="sm" name="users" as="select" autoComplete="off" className="browser-default custom-select" placeholder="Select User" required>
                                         <option value="0">Select User</option>
                                        {users.map((i) => <option value={i.id} key={'e' + i.id} selected={i.employee_id === 1}>{i.name}</option>)}  
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">Please select user</Form.Control.Feedback>
                                </Form.Group>
                            </div>

                        {/* <div className="col-md-6">
                            <Button size="sm"
                                aria-controls="filters"
                                aria-expanded={showFilter}
                                style={{ alignItems: 'flex-end', display: 'flex' }}
                                variant="outline-secondary"
                                onClick={() => setShowFilter(!showFilter)}>
                                {showFilter ? <><CancelIcon /> Hide</> : <>
                                    <FilterListIcon /> Show</>}&nbsp;filters</Button>
                        </div>

                        <Collapse in={showFilter}>
                            <div id="filters">
                                <Filters setQueryParams={setQueryParams} loading={loading} />
                            </div>
                        </Collapse> */}

                       <Table className="rk-table mb-0" size="md">
                            <thead>
                                <tr>
                                    <th></th>
                                     <div className="form-check">
                                    <input className="checkbox" type="checkbox" value="" id="a" />
                                        <div className="col-md-3">
                                        <th>Select</th>
                                        </div>
                                    </div>
                                    <th>Id</th>                                    
                                    {/* <th>Telecaller id</th>*/}
                                    <th>Name</th>
                                    <th>Mobile No</th>
                                    <th>Date</th>
                                    <th>Selection</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && items.length < 1 && (
                                    <tr><td colSpan="4">No Contact found.</td></tr>
                                )}
                                {!loading && items.length > 0 && items.map(i => (
                                    <tr key={'tr' + i?.id}>
                                        <td>{i?.select}</td>
                                        <td>
                                            <div className="form-check">
                                                <input className="tele-checkbox checkboxes" name="box" type="checkbox" value={i.id} id="checkitem" />
                                            </div>
                                        </td>
                    
                                        <td>{i.id}</td>
                                        {/* <td>{i.telecaller_id}</td> */}
                                        <td>{i.name}</td>
                                        <td>{i.mobile_no}</td>
                                        <td>{i.date}</td>
                                        <td>{i.selection}</td>
                                    </tr>
                                ))}
                                {loading && (
                                    <tr><td colSpan="5" className="text-center"><Spinner animation="border" variant="info" /></td></tr>
                                )}
                            </tbody>
                        </Table>

                        <div className="col-md-12 text-center">
                            <Button
                                variant="danger"
                                className="abtn-text-danger remove"
                                //onClick={() => deleteItem()}
                                size="sm"
                                type="submit"
                                disabled={loading}>
                                {loading ? 'Loading..' : 'Remove'}
                            </Button>
                        </div>

                    </Form>
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
