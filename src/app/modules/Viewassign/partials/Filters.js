import React from 'react'
import { Form, Button } from 'react-bootstrap';
import SearchIcon from '@material-ui/icons/Search';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import jQuery from 'jquery';

function Filters({ setQueryParams, loading }) {
    const [states, setStates] = React.useState([]);
    const formRef = React.useRef(null);


    
    const handleSubmit = e => {
        e.preventDefault();
        e.stopPropagation();
        const formData = new FormData(e.target);
        const formDataObj = Object.fromEntries(formData.entries());
        setQueryParams(formDataObj);
    }

    const resetForm = () => {
        formRef.current.reset();
        setStates([]);
        setQueryParams({});
    }


    const checkValue = (values) => {
        var value = document.getElementsByClassName('house-type')[0].value;
        jQuery('.flat-data').addClass('d-none');
        if (value == 'flat') {
            jQuery('.flat-data').removeClass('d-none');                
        }
        else  {
            jQuery('.sqft-data').removeClass('d-none');                
        }
    }

    return (
        <Form
            noValidate
            onSubmit={handleSubmit}
            ref={formRef}
        >
            <div className="row pt-5 pb-10">
                <div className="col-md-3">
                    <div>
                        <Form.Label>select Project Type<span className="text-danger">*</span></Form.Label>
                        <select name="project_type" required onChange={checkValue} className="browser-default custom-select house-type">
                            <option>Project Type</option>
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
                        <Form.Label>SQURE FOOT </Form.Label>
                        <Form.Control name="foot" size="sm" type="number" autoComplete="off" placeholder="Enter SQUARE FOOT" />
                        <Form.Control.Feedback type="invalid">Please enter SQURE FOOT</Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className="col-md-12 text-center">
                    <Button variant="primary" className="rk-btn rk-btn-icon" size="sm" type="submit" disabled={loading}><SearchIcon />&nbsp;{loading ? 'Loading..' : 'Search'}</Button>&nbsp;
                    <Button variant="danger" size="sm" className="rk-btn-icon" onClick={resetForm} disabled={loading}><RotateLeftIcon />&nbsp;Reset</Button>&nbsp;
                    {/*<Button variant="primary" className="rk-btn rk-btn-icon" size="sm" onClick={exportContacts}><SystemUpdateAltIcon />&nbsp;Export</Button>*/}
                </div>
            </div>
        </Form>
    )
}

export default React.memo(Filters);
