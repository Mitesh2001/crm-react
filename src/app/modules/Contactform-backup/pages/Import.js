import React, {useRef} from "react";
import { Link, Redirect } from 'react-router-dom';
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button, Image } from 'react-bootstrap';
import Actions from '../Actions';
import { useToasts } from 'react-toast-notifications';
import { CSVLink } from "react-csv";

const headings = [["Name*", "mobile no*", "Business", "Cast", "Budget", "Tenament", "Flat","Office", "flat selection", "square Foot","Favourite Location", "Favourite Floor", "Reference", "Broker Name", "Broker Mobile No.", "Buy / Token time", "Husband Birthdates", "Wife Birthdates", "Child 1 Birthdates", "Child 2 Birthdates", "Anniversary", "followup 1", "followup 2", "followup 3", "Birth Dates", "followup 4",  "followup 5", "followup 6", "Remarks", "I.L"]];

function Import() {
    const { addToast } = useToasts();
    const suhbeader = useSubheader();
    suhbeader.setTitle("Import Contacts");
    const fileInput = useRef(null);
    
    const [importFile, setImportFile] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const uploadImportFile = () => {
        if (importFile !== null) {
            setLoading(true);
            Actions.import({ importFile }).then((response) => {
                setLoading(false);
                if (response.status === 'SUCCESS') {
                    setImportFile(null);
                    fileInput.current.value = "";
                }
                addToast(response.message, { appearance: (response.status === 'SUCCESS' ? 'success' : 'error'), autoDismiss: true });
            });
        } else {
            addToast('Please select proper csv file.', { appearance: 'error', autoDismiss: true });
        }
    }

    const isValidFile = (type) => (type === 'text/csv' ? true : false);

    const changeFile = (event) => {
        let files = event.target.files;
        //if (files.length > 0 && isValidFile(files[0].type)) {
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = (e) => {
                setImportFile({
                    name: files[0].name,
                    type: files[0].type,
                    size: files[0].size,
                    base64: e.target.result,
                });
            }
        /* } else {
            setImportFile(null);
            addToast('Please select proper csv file.', { appearance: 'error', autoDismiss: true });
            return false;
        } */
    }

    return (
        <div className="add-edit-contactform">
            <Card className="rkcrm-card mb-5">
                <Card.Body className="p-3">
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label>Import File</Form.Label>
                                <Form.File id="formcheck-api-custom">
								<Form.File.Input ref={fileInput} onChange={changeFile}  /> 
                                </Form.File>
                            </Form.Group>
                            <div className="row">
                                <div className="col-md-12">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        className="rk-btn"
                                        onClick={uploadImportFile}
                                        disabled={loading}>
                                        {loading ? 'Loading..' : 'SAVE'}
                                    </Button>
                                    &nbsp;<Link to="/contactform" className="btn btn-danger btn-sm">CANCEL</Link>&nbsp;
                                    <CSVLink className="rk-btn btn btn-primary btn-sm" data={headings} filename={"contact-import.csv"} target="_blank">Download Format File</CSVLink>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <strong>Notes:</strong>
                            <ul>
                                <li>Only CSV file format valid.</li>
                                <li>Please download import file format.</li>
                                <li>The column marked with "*" is mandatory.</li>
                                <li>Do not change any columns order and do not delete any columns.</li>
                                <li>Leave empty columns if data not available.</li>
                            </ul>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
};

export default React.memo(Import);