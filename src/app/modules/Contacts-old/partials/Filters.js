import React from "react";
import { Form, Button } from "react-bootstrap";
import Actions from "../Actions";
import SearchIcon from "@material-ui/icons/Search";
//import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import RotateLeftIcon from "@material-ui/icons/RotateLeft";

function Filters({ setQueryParams, loading }) {
  const [states, setStates] = React.useState([]);
  const [industries, setIndustries] = React.useState([]);
  const [companyTypes, setCompanyTypes] = React.useState([]);
  const [countries, setCountries] = React.useState([]);
  const formRef = React.useRef(null);

  const getIndustries = React.useCallback(() => {
    Actions.industries().then((data) => {
      if (data.status === "SUCCESS") {
        setIndustries(data.data.itypes);
      }
    });
  }, []);

  const getCompanyTypes = React.useCallback(() => {
    Actions.companyTypes().then((data) => {
      if (data.status === "SUCCESS") {
        setCompanyTypes(data.data.ctypes);
      }
    });
  }, []);

  const getCountries = React.useCallback(() => {
    Actions.countries().then((data) => {
      if (data.status === "SUCCESS") {
        setCountries(data.data.countries);
      }
    });
  }, []);

  const getStates = React.useCallback((cid) => {
    Actions.states(cid).then((data) => {
      if (data.status === "SUCCESS") {
        setStates(data.data.states);
      }
    });
  }, []);

  React.useEffect(getCompanyTypes, []);
  React.useEffect(getIndustries, []);
  React.useEffect(getCountries, []);
  React.useEffect(getStates, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    setQueryParams(formDataObj);
  };

  const resetForm = () => {
    formRef.current.reset();
    setStates([]);
    setQueryParams({});
  };

  const exportContacts = () => {
    const formData = new FormData(formRef.current);
    const formDataObj = Object.fromEntries(formData.entries());
    return false;
    //Do AJAX call here
  };

  return (
    <Form noValidate onSubmit={handleSubmit} ref={formRef}>
      <div
        className="row pt-5 pb-10"
        style={{ paddingLeft: "12.5px", paddingRight: "12.5px" }}
      >
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <Form.Control
              name="searchTxt"
              size="sm"
              type="text"
              autoComplete="off"
              placeholder="name, email, mobile no, company name.."
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Company Type</Form.Label>
            <Form.Control
              size="sm"
              name="company_type_id"
              as="select"
              autoComplete="off"
              placeholder="Select company type"
            >
              <option value="">Select company type</option>
              {companyTypes.map((i) => (
                <option value={i.id} key={"i" + i.id}>
                  {i.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Industry</Form.Label>
            <Form.Control
              size="sm"
              name="industry_type_id"
              as="select"
              autoComplete="off"
              placeholder="Select industry"
            >
              <option value="">Select Industry</option>
              {industries.map((i) => (
                <option value={i.id} key={"i" + i.id}>
                  {i.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Form.Control
              size="sm"
              name="country_id"
              as="select"
              autoComplete="off"
              placeholder="Select country"
              onChange={(e) => getStates(e.target.value)}
            >
              <option value="0">Select country</option>
              {countries.map((i) => (
                <option
                  value={i.country_id}
                  key={"c" + i.country_id}
                  selected={i.country_id === 101}
                >
                  {i.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>State</Form.Label>
            <Form.Control
              size="sm"
              name="state_id"
              as="select"
              autoComplete="off"
              placeholder="Select state"
            >
              <option value="0">Select state</option>
              {states.map((i) => (
                <option value={i.state_id} key={"s" + i.state_id}>
                  {i?.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control
              name="city"
              size="sm"
              type="text"
              autoComplete="off"
              placeholder="Enter city"
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              name="postcode"
              size="sm"
              type="text"
              autoComplete="off"
              placeholder="Enter postcode"
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
  );
}

export default React.memo(Filters);
