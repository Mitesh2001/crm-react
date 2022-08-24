import React from "react";
import { Link, useLocation, useParams, Redirect,useHistory } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import {
  Card,
  Form,
  Button,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
// import Editor from '../../../Core/Editor';
import Actions from "../Actions";
import App from "../../../Configs/app";
import jQuery from "jquery";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

export default React.memo(function(props) {
  let location = useLocation();
  let history=useHistory();
  const { id } = useParams();
  const suhbeader = useSubheader();
  suhbeader.setTitle("View Product");
  const { addToast } = useToasts();
  const [info, setInfo] = React.useState(location.item ? location.item : {});
  const [redirect, setRedirect] = React.useState(false);
  const [category, setCategory] = React.useState([{ countries: "" }]);

  const getCategory = React.useCallback(() => {
    Actions.category().then((data) => {
      if (data.status === "SUCCESS") {
        setCategory(data.data.countries);
      }
    });
  }, []);
  React.useEffect(getCategory, []);
  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          setInfo(response.data.product);
          jQuery(".offerDescription").append(
            response.data.product.offer_description
          );
          jQuery(".showDescription").append(response.data.product.description);
          jQuery(".showNote").append(response.data.product.comment);
        } else {
          addToast(response.message, {
            appearance: "error",
            autoDismiss: true,
          });
          setRedirect(true);
        }
      });
    }
  }, [location, id, addToast]);

  React.useEffect(getInfo, []);

  const getType = (value) => {
    jQuery(".unit").show();
    if (value == "2") {
      jQuery(".unit").hide();
    }
  };

  const formatDate = (cell) => {
    let dateObj = cell;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (typeof date !== "object") {
      dateObj = new Date(cell);
    }
    if (dateObj.getHours() >= 12) {
      dateObj.setHours(dateObj.getHours() - 12);
      return `${("0" + dateObj.getDate()).slice(-2)}${" " +
        monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
        "0" + dateObj.getHours()
      ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}PM`;
    }
    return `${("0" + dateObj.getDate()).slice(-2)}${" " +
      monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
      "0" + dateObj.getHours()
    ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}AM`;
  };

  const image =
    info.image && info.image !== "" ? App.assetUrl +'images/' +info.image : false;
  const doc = 
    info.document && info.document !== "" ? App.assetUrl +"doc/" +info.document : false;
  if (redirect) {
    return <Redirect to="/products" />;
  }
  return (
    <>
      <div className="col-md-12" style={{marginBottom:"10px"}}>
        {" "}
        <OverlayTrigger placement="top" overlay={<Tooltip>Back</Tooltip>}>
          <Link to="#" onClick={()=>{history.goBack()}} className="abtn" style={{border:"1px solid black",color:"black",marginBottom:"15px",padding:"12px 10px"}} >
            <KeyboardBackspaceIcon />
          </Link>
        </OverlayTrigger>
      </div>
      <Card className="add-edit-product">
        <Card.Body className="p-3">
          <Form>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3" style={{background: "#33475b", color: "white"}}>Primary Information</Card.Header>
              <Card.Body className="p-3">
                <div className="row">
                  <div className="col-md-3">
                    <div>
                      <Form.Label>Type</Form.Label>
                      {info.product_type === 1 ? (
                        <h4>Product</h4>
                      ) : (
                        <h4>Services</h4>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Category</Form.Label>
                      <h4>{info.category?.name}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label>SKU Code</Form.Label>
                      <h4>{info?.skucode}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <h4>{info?.name}</h4>
                    </Form.Group>
                  </div>
                  {info.product_type === 1 && info.unit && (
                    <div className="col-md-3 unit">
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Product Unit</Form.Label>
                        <h4>{info.unit}</h4>
                      </Form.Group>
                    </div>
                  )}
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <h4>{info?.listprice}</h4>
                    </Form.Group>
                  </div>
                  {/*                 <div className="col-md-3">
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Discount(%)</Form.Label>
                    <h4>{info?.discount_percent}</h4>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Final Amount</Form.Label>
                    <h4>{info?.final_amount}</h4>
                  </Form.Group>
                </div>
 */}
                  {info?.offer_start_date_time && (
                    <div className="col-md-3">
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Start Offer Period</Form.Label>
                        <h4>{formatDate(info?.offer_start_date_time)}</h4>
                      </Form.Group>
                    </div>
                  )}

                  {info?.offer_end_date_time && (
                    <div className="col-md-3">
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>End Offer Period</Form.Label>
                        <h4>{formatDate(info?.offer_end_date_time)}</h4>
                      </Form.Group>
                    </div>
                  )}
                  {info?.comment && (
                    <div className="col-md-3">
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Note</Form.Label>
                        <h4>{info?.comment}</h4>
                      </Form.Group>
                    </div>
                  )}
                </div>
               
                <div className="row">
                  {image &&<div className="col-md-3"><Image style={{ height: "60px", maxWidth:"60px" }} src={image} /></div>}
                  {doc && <div className="col-md-3" style={{marginTop:"20px" }}><a style={{ border:"2px solid black", padding:"10px"}} href={doc}><CloudDownloadIcon/>document</a></div>}
                  {info?.offer_description && (
                    <div className="col-md-3">
                      <Form.Label>OfferDescription</Form.Label>
                      <h5 className="offerDescription"></h5>
                    </div>
                  )}
                  {info?.description && (
                    <div className="col-md-3">
                      <Form.Label>Description</Form.Label>
                      <h5 className="showDescription"></h5>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
});
