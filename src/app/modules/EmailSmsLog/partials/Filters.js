import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Form, Button, Card, Modal } from "react-bootstrap";
import SearchIcon from "@material-ui/icons/Search";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import jQuery from "jquery";
import Actions from "../Actions";
import { DateRange } from 'react-date-range';
import { useToasts } from "react-toast-notifications";
import Select from "react-select";
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
function Filters({ setQueryParams }) {
  const selectInputRef = React.useRef();
  const selectInputRefUser = React.useRef();
  const selectInputRefCountry=React.useRef();
  const selectInputRefCity = React.useRef();
  const selectInputRefPostCode = React.useRef();
  const [selectionRange,setSelectionRange]=React.useState( {
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection',
  })
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [postCodes, setPostCodes] = React.useState([]);
  const formRef = React.useRef(null);
  const { addToast } = useToasts();

  const [casts, setCast] = React.useState([{ casts: "" }]);
  const [sendCastt, setCastRecord] = React.useState(false);
  const [CastConfirm, setCastConfirm] = React.useState(false);
  const [countries, setCountries] = React.useState([]);
  const [selectedCast, setCastSelected] = React.useState(null);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [typeArray,setTypeArray]=React.useState([{id:"EMAIL",title:"EMAIL"},{id:"SMS",title:"SMS"}])

  const handleCast = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.name = formDataObj.castname;
      Actions.castadd(formDataObj).then((response) => {
        setLoading(false);
        if (response.status === "SUCCESS") {
          handleCastClose();
          setRedirect(false);
          casts.push(response.data.data);
          setCastSelected(response.data.data.id);
        }
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };
  const sendCast = () => {
    setCastRecord();
    setCastConfirm(true);
  };
  const handleCastClose = () => {
    setCastRecord(false);
    setCastConfirm(false);
  };
  const checkCast = (event) => {
    var values = event.target.value;
    if (values == "other") {
      sendCast();
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    var start=selectionRange.startDate;
    var start_string=`${start.getFullYear()}-${("0" + (start.getMonth() + 1)).slice(-2)}-${start.getDate()}`
    var end=selectionRange.endDate;
    var end_string=`${end.getFullYear()}-${("0" + (end.getMonth() + 1)).slice(-2)}-${end.getDate()}`
    setQueryParams({...formDataObj,from_date:start_string,to_date:end_string});
  };
  
  const handleSelect=(ranges)=>{
    setSelectionRange(ranges.selection);
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  }

  const resetForm = () => {
    formRef.current.reset();
    selectInputRef?.current?.select?.clearValue();
    selectInputRefUser?.current?.select?.clearValue();
    selectInputRefCountry?.current?.select?.clearValue();
    selectInputRefCity?.current?.select?.clearValue();
    selectInputRefPostCode?.current?.select?.clearValue();
    setStates([]);
    setQueryParams({});
  };

  const checkValue = (values) => {
    var value = document.getElementsByClassName("house-type")[0].value;
    jQuery(".flat-data").addClass("d-none");
    if (value == "flat") {
      jQuery(".flat-data").removeClass("d-none");
    } else {
      jQuery(".sqft-data").removeClass("d-none");
    }
  };
  const formatLabel = ({ name, id, designation }) => (
    <div style={{ display: "flex" }}>{name}</div>
  );
  const formatOptionLabel = ({ name, id, designation }) => (
    <div style={{ display: "flex" }}>
      {id !== "" ? "(" + id + ")" : null} {name}{" "}
      {designation ? "(" + designation + ")" : null}
    </div>
  );


  const charText = (e) => {
    if(e.key!==" "){
      const re = /[0-9a-zA-Z]+/g;
      if (!re.test(e.key)) {
        e.preventDefault();
      }
    }
  };


  const alphaNumeric = (e) => {
    const re = /[0-9a-fA-F]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  };

  const formatOptionLabel1 = ({ name }) => (
    <div style={{ display: "flex" }}>{name}</div>
  );

  const formatOptionLabel2 = ({ text }) => (
    <div style={{ display: "flex" }}>{text}</div>
  );


  if (redirect) {
    return <Redirect to="/telecaller/Addassign" />;
  } else {
    return (
      <>
        <Form noValidate onSubmit={handleSubmit} ref={formRef}>
          <div className="row pt-5 pb-10">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control
                  size="sm"
                  name="type"
                  as="select"
                  autoComplete="off"
                  placeholder="Select type"
                  style={{ height: "38px" }}
                >
                  <option value="">Select Type</option>
                  {typeArray.map((i) => (
                    <option value={i.id} key={"ls" + i.id}>
                      {i.title}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>


            <div className="col-md-3">
              <Form.Group>
                <Form.Label>From-To</Form.Label>
                <DateRange
                  editableDateInputs={true}
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  direction="horizontal" 
                />
              </Form.Group>
            </div>
            <div className="col-md-12 text-center">
              <Button
                variant="primary"
                className="rk-btn rk-btn-icon"
                size="sm"
                type="submit"
                disabled={loading}
              >
                <SearchIcon />
                &nbsp;{loading ? "Loading.." : "Search"}
              </Button>
              &nbsp;
              <Button
                variant="danger"
                size="sm"
                className="rk-btn-icon"
                onClick={resetForm}
                disabled={loading}
              >
                <RotateLeftIcon />
                &nbsp;Reset
              </Button>
              &nbsp;
              {/*<Button variant="primary" className="rk-btn rk-btn-icon" size="sm" onClick={exportContacts}><SystemUpdateAltIcon />&nbsp;Export</Button>*/}
            </div>
          </div>
        </Form>
        <Modal
          show={CastConfirm}
          onHide={handleCastClose}
          onSubmit={handleCast}
        >
          <Form noValidate validated={validated} onSubmit={handleCast}>
            <Modal.Header className="p-3" closeButton>
              <Modal.Title>Add Cast</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3">
              <div className="row">
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>New Cast</Form.Label>
                    <Form.Control
                      name="castname"
                      size="sm"
                      type="text"
                      autoComplete="off"
                    />
                  </Form.Group>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="col-md-12 text-center">
              <Button
                variant="danger"
                size="sm"
                onClick={handleCastClose}
                disabled={sendLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={sendLoading}
              >
                {sendLoading ? "Loading.." : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
}

export default React.memo(Filters);
