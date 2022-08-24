import React from "react";
import { Link, Redirect } from 'react-router-dom';
import { Button, Form, Spinner } from 'react-bootstrap';
import {Multiselect} from 'multiselect-react-dropdown';
import Pagination from '@material-ui/lab/Pagination';
import { useToasts } from 'react-toast-notifications';
import {  Modal } from 'react-bootstrap';
import TimePicker from 'react-bootstrap-time-picker';
import Actions from '../Actions';
import AddIcon from '@material-ui/icons/Add';
import App from '../../../Configs/app';


export default React.memo(function ({ contact}) {
    const { addToast } = useToasts();
    const [loading, setLoading] = React.useState(false);
    const [listingLoading, setListingLoading] = React.useState(false);
    const [validated, setValidated] = React.useState(false);
    const [product, setProduct] = React.useState([]);
    const [option, setOption] = React.useState([]);
   
   

    const getProducts = React.useCallback((cid) => {
        Actions.listProducts().then((data) => {
            if (data.status === 'SUCCESS') {
                setProduct(data.data.products);
            }
        });
    }, []);
   React.useEffect(getProducts, []);

   //const [options]=React.useState(product);

   const addProduct = (event) => {
         setLoading(true);
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const formData = new FormData(event.target);
            var result=[]; 
            result= option.map(x => x.id)
            result=result.toString();
            var params = { contact_id: contact.id, product_id: result };
            var assignParameters = params;
            Actions.addProduct(assignParameters).then((response) => {
                setLoading(false);
                addToast(response.message, { appearance: response.status === 'SUCCESS' ? 'success' : 'error', autoDismiss: true });
                if (response.status === 'SUCCESS') {
                    form.reset();
                 
                }
            });
            setValidated(false);
        } else {
            setValidated(true);
            setLoading(false);
        }
    }


const onSelect =(event)=>{

    setOption(event);

}

  

  

    return (
        <>
        <div className="lead-comments">
            <div className="add-comment-section mb-5">
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={addProduct}
                >
        <div className="row">
                    <div className="col-sm-12">
                            <div className="row">
                                <div className="col-sm-4">  
                                    <Form.Group>
                                    
                                        <Form.Label>Interested In Products/Service</Form.Label>
                                        <Multiselect 
                                            name="name"
                                            options={product}
                                            displayValue="name" 
                                            onSelect={onSelect}
                                            value={option.name}

                                        />
                                       
                                    </Form.Group>
                                </div>

                            <div className="col-sm-4 mt-8">  
                            
                            <Button variant="primary" type="submit"  disabled={loading}><AddIcon style={{ fontSize: 'xl' }} />  {loading ? 'Loading..' : 'Add'}</Button>

                            </div>
                            </div>
                     </div>

                       

                    </div>
                </Form>
            </div>
            
        </div>
    
    </>
    );
});
