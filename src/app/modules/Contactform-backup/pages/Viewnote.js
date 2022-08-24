import React, { Component } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button, Modal, Table, Spinner } from 'react-bootstrap';
import Actions from '../Actions';
import { useToasts } from 'react-toast-notifications';
import jQuery from 'jquery';

function Viewnote() {
    const { addToast } = useToasts();
    const suhbeader = useSubheader();
    suhbeader.setTitle("View Note");
    const { id } = useParams();
    const [queryParams, setQueryParams] = React.useState({});
    const [validated, setValidated] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [redirect, setRedirect] = React.useState(false);
    const [noteRecord, setNoteRecord] = React.useState(false);
    const [noteConfirm, setNoteConfirm] = React.useState(false);
    const [sendLoading, setSendLoading] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [records, setRecords] = React.useState(1);
    const [viewnote, setViewnote] = React.useState([]);



    const handleNote = (event) => {
        setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData.entries());
            formDataObj.contact_id = id;
            
            Actions.addnote(formDataObj).then((response) => {
                setLoading(false);
                if (response.status === 'SUCCESS') {
                    handleNoteClose();
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

    const sendNote = () => {
        setNoteRecord();
        setNoteConfirm(true);
    }
    const handleNoteClose = () => {
        setNoteRecord(false);
        setNoteConfirm(false);
    }

    const postViewnote = React.useCallback(() => {
        setLoading(true);
        Actions.viewnote({ ...queryParams, page: currentPage }).then((response) => {
            if (response.status === 'SUCCESS') {
                setCurrentPage(response.data.current);
                setViewnote(response.data.viewnote);
            }
            setLoading(false);
        });
    }, [queryParams, currentPage]);

    React.useEffect(postViewnote, [currentPage]);

    if (redirect) {
        return <Redirect to="/contactform" />
    }

    return (
        <>
            <div className="add-note-contactform">
                <Form
                // noValidate
                // validated={validated}
                // onaddNote={handleNote}
                >
                    <Card className="rkcrm-card mb-5">
                        <Card.Body className="p-3">
                            <Button variant="primary" size="sm" onClick={() => sendNote()}> Add Note</Button>

                            <div className="col-md-3">
                                <Form.Group>
                                    <Form.Label>View Note</Form.Label>
                                    <Form.Control size="sm" name="viewnote"  as="textarea" autoComplete="off" >

                                        {viewnote.map((i) => <option value={i.id} key={'i' + i.id}>{i.name}</option>)}
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </Card.Body>
                    </Card>

                    <div className="row">
                        <div className="col-md-12">
                            &nbsp;<Link to="/Contactform" className="btn btn-danger btn-sm">CANCEL</Link>
                        </div>
                    </div>
                </Form>
            </div>


            <Modal show={noteConfirm} onHide={handleNoteClose}>
                <Modal.Header className="p-3" closeButton>
                    <Modal.Title>Send Note</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">Add Note:</Modal.Body>
                <Form noValidate
                    validated={validated}
                    onSubmit={handleNote}>
                    <Form.Group>
                        <Form.Control className="txtnote" name="note" size="sm" type="text" autoComplete="off" required />
                    </Form.Group>
                    <Modal.Footer className="p-3">
                        <Button variant="danger" size="sm" onClick={handleNoteClose} disabled={sendLoading}>Cancel</Button>
                        <Button className="btnnote" type="submit" variant="primary" size="sm" disabled={sendLoading}>{sendLoading ? 'Loading..' : 'Submit'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default React.memo(Viewnote);