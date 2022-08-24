import React from "react";
import { Card, Form, Button, Accordion } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import Actions from '../Actions';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { validatePhoneOnPress, disableUpDownArrow } from '../../../helpers/Helper';

export default React.memo(function ({ getData }) {
    const { addToast } = useToasts();

    const [validated, setValidated] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSubmit = (event) => {
        setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData.entries());
            formDataObj.lead_status = 0;
            Actions.add(formDataObj).then((response) => {
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

    return (
        <Accordion className="quick-add-lead">
            <Card className="rkcrm-card mb-5">
                <Accordion.Toggle as={Card.Header} variant="link" eventKey="0" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <CloseIcon /> : <AddIcon />} <span>Quick Add Contact</span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Form
                            noValidate
                            validated={validated}
                            onSubmit={handleSubmit}
                        >
                            <div className="row">
                                <div className="col-md-3">
                                    <Form.Group>
                                        <Form.Label>Person Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control name="name" size="sm" type="text" autoComplete="off" placeholder="Enter name." required />
                                        <Form.Control.Feedback type="invalid">Please enter name</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-3">
                                    <Form.Group>
                                        <Form.Label>Mobile Number<span className="text-danger">*</span></Form.Label>
                                        <Form.Control name="mobile_no" size="sm" type="text" minLength="10" autoComplete="off" placeholder="Enter mobile no" onKeyPress={validatePhoneOnPress} onKeyDown={disableUpDownArrow} required />
                                        <Form.Control.Feedback type="invalid">Please enter mobile no</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-3">
                                    <Form.Group>
                                        <Form.Label>Company Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control name="company_name" size="sm" type="text" autoComplete="off" placeholder="Enter company name." required />
                                        <Form.Control.Feedback type="invalid">Please enter company name</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-3">
                                    <Form.Group>
                                        <Form.Label>City <span className="text-danger">*</span></Form.Label>
                                        <Form.Control name="city" size="sm" type="text" autoComplete="off" placeholder="Enter city" required />
                                        <Form.Control.Feedback type="invalid">Please enter City</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-12 text-center">
                                    <Button
                                        variant="primary"
                                        className="rk-btn"
                                        size="sm"
                                        type="submit"
                                        disabled={loading}>
                                        {loading ? 'Loading..' : 'Add Contact'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
});
