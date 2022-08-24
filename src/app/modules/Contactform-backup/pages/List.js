import React from "react";
import { Link, Redirect } from 'react-router-dom';
import { useSubheader } from "../../../../_metronic/layout";
import { Table, Card, OverlayTrigger, Tooltip, Spinner, Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Pagination from '@material-ui/lab/Pagination';
import App from '../../../Configs/app';
import Actions from '../Actions';
import { useToasts } from 'react-toast-notifications';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import cellEditFactory from 'react-bootstrap-table2-editor';
// import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';


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
   
	const [sendContact,setContactRecord] = React.useState(false);
    const [ContactConfirm, setContactConfirm] = React.useState(false);
    const [sendLoading, setSendLoading] = React.useState(false);
    const [leadredirect, setLeadRedirect] = React.useState(false);
    




    const { ExportCSVButton } = CSVExport;


    const columns = [{
        dataField: 'id',
        text: ' ID',
        hidden: true
      }, 
      {
        dataField: 'name',
        text: 'Name',
        sort: true
      },  
    //   {
    //       dataField: 'email',
    //       text: 'Primary Email',
    //       sort: true,
    //       hidden:true
    //     },
      {
          dataField: 'mobile_no',
          text: 'Mobile No',
          sort: true
       },

       {
          dataField:'created_at',
          text: 'Date',
          formatter: (cell) => {
            let dateObj = cell;
            if (typeof cell !== 'object') {
              dateObj = new Date(cell);
            } return `${dateObj.getFullYear()}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${('0' + dateObj.getDate()).slice(-2)}`;
          }
              
        },
        {
            dataField: 'selection',
            text: 'Selection',
            sort: true
         },

      {
           // dataField: "",
            text: "Action",
            formatter: (rowContent, row) => {
              return (
                <div className="actions-btns">
                 
                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit Contact</Tooltip>}>
                  <Link to={"/contactform/" + row.id + "/edit"} className="abtn text-success mr-4">
                    <EditIcon /> 
                  </Link>
                  </OverlayTrigger>
  
                  {/* <OverlayTrigger placement="top" overlay={<Tooltip>Delete Lead</Tooltip>}>
                  <Link to="#" className="abtn text-danger" onClick={() => deleteItem(row.id)}>
                      <DeleteIcon />
                  </Link>
                  </OverlayTrigger> */}
                <Button size="sm" variant="outline-secondary" onClick={() => sendLead(row.id)}>Convert to Lead</Button>

  
                  
                </div>
              );
            },
      
      
      }
      
      ];
  
   
  
  
      const defaultSorted = [{
        dataField: 'id',
        order: 'desc'
      }];
      
  
      const RemoteAll = ({ data }) => (
          <div>
            
            <ToolkitProvider
              keyField="id"
              data={ data }
              columns={ columns }
              exportCSV
             >
              {
                props => (
                  <div>
                    {/* <ExportCSVButton { ...props.csvProps } className=" rk-add-btn text-right text-white mb-2">Export CSV</ExportCSVButton> */}
                  
                    <BootstrapTable { ...props.baseProps } />
                  </div>
                )
              }
            </ToolkitProvider> 
           
        </div>
        );








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
                            &nbsp;<Link to="/contactform/import" className="rk-add-btn" ><CloudUploadIcon />&nbsp;Import Contacts</Link>
                        </div>
                    </div>
                    <div className="rk-table mb-0" size="md">
                        {!loading && items.length < 1 && 
                        (
                            <div colSpan="7">
                            No contact found.
                            </div>
                        )
                        }
                        {
                        !loading && 
                        (
                            <div className="text-right"> 
                                <RemoteAll
                                data={items}
                                > 
                        
                                {loading && 
                                    (
                                    <div colSpan="6" className="text-center">
                                        <Spinner animation="border" variant="info" />
                                    </div>
                                    )
                                }
                                </RemoteAll> 
                            </div> 
                            )
                        }
                    </div>
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
        </>
    );
});