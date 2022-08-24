import React from "react";
import { Form, Button } from "react-bootstrap";
import Actions from "../Actions";
import SearchIcon from "@material-ui/icons/Search";
//import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import Select from "react-select";

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

  const formatLabel = ({ name, id, designation }) => (
    <div style={{ display: "flex" }}>{name}</div>
  );

  return (
    <Form noValidate onSubmit={handleSubmit} ref={formRef}>
      <div className="row pt-5 pb-10">
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <Form.Control
              name="searchTxt"
              size="sm"
              type="text"
              autoComplete="off"
              placeholder="name, email, mobile no, company name.."
              style={{ height: "38px" }}
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Company Type</Form.Label>

            <Select
              className="basic-single tele-drop"
              classNamePrefix="select"
              name="company_type_id"
              closeMenuOnSelect={true}
              placeholder={"Select Company"}
              defaultValue={{ name: "Select Company", id: "" }}
              isSearchable={true}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              formatLabel={formatLabel}
              options={[{ name: "Select Company", id: "" }, ...companyTypes]}
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Industry</Form.Label>
            <Select
              className="basic-single tele-drop"
              classNamePrefix="select"
              name="industry_type_id"
              closeMenuOnSelect={true}
              placeholder={"Select Industry"}
              defaultValue={{ name: "Select Industry", id: "" }}
              isSearchable={true}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              formatLabel={formatLabel}
              options={[{ name: "Select Industry", id: "" }, ...industries]}
            />
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
              style={{ height: "38px" }}
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
            <Select
              className="basic-single tele-drop"
              classNamePrefix="select"
              name="state_id"
              closeMenuOnSelect={true}
              placeholder={"Select state"}
              defaultValue={{ name: "Select state", state_id: "" }}
              isSearchable={true}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.state_id}
              formatLabel={formatLabel}
              options={[{ name: "Select state", state_id: "" }, ...states]}
            />
            <Form.Control.Feedback type="invalid">
              Please select state
            </Form.Control.Feedback>
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
              style={{ height: "38px" }}
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
              style={{ height: "38px" }}
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
