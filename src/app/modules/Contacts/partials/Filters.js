import React from "react";
import { Form, Button } from "react-bootstrap";
import Actions from "../Actions";
import SearchIcon from "@material-ui/icons/Search";
//import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import Select from "react-select";

function Filters({ setQueryParams, loading }) {
  const selectInputRefComp = React.useRef();
  const selectInputRefIndus = React.useRef();
  const selectInputRefCountry = React.useRef();
  const selectInputRefState = React.useRef();
  const selectInputRefCity = React.useRef();
  const selectInputRefPostCode = React.useRef();
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [countries, setCountries] = React.useState([]);
  const [postCodes, setPostCodes] = React.useState([]);
  const [industries, setIndustries] = React.useState([]);
  const [companyTypes, setCompanyTypes] = React.useState([]);
  const formRef = React.useRef(null);
  const [selectedCountry, setSelectedCountry] = React.useState(0);

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
    Actions.states({ country_id: cid }).then((data) => {
      if (data.status === "SUCCESS") {
        setStates(data.states);
      }
    });
  }, []);
  const getCities = React.useCallback((cid) => {
    Actions.city({ state_name: cid }).then((data) => {
      if (data.status === "SUCCESS") {
        setCities(data.cities);
      }
    });
  }, []);
  const getPostCodes = React.useCallback((cid) => {
    Actions.postcode({ city_name: cid }).then((data) => {
      if (data.status === "SUCCESS") {
        setPostCodes(data.postcodes);
      }
    });
  }, []);

  React.useEffect(getCompanyTypes, []);
  React.useEffect(getIndustries, []);
  React.useEffect(getCountries, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    setQueryParams(formDataObj);
  };

  const resetForm = () => {
    formRef.current.reset();
    selectInputRefState?.current?.select?.clearValue();
    selectInputRefComp?.current?.select?.clearValue();
    selectInputRefIndus?.current?.select?.clearValue();
    selectInputRefCountry?.current?.select?.clearValue();
    selectInputRefCity?.current?.select?.clearValue();
    selectInputRefPostCode?.current?.select?.clearValue();
    setStates([]);
    setQueryParams({});
  };

  const exportContacts = () => {
    const formData = new FormData(formRef.current);
    const formDataObj = Object.fromEntries(formData.entries());
    return false;
    //Do AJAX call here
  };

  const handleindustry = (value) => {};

  const handlecountry = (value) => {
    selectInputRefState?.current?.select?.clearValue();
    setCities([]);
    if (value) {
      setSelectedCountry(parseInt(value.country_id));
      getStates(value.country_id);
    }
  };

  const handlestate = (value) => {
    selectInputRefCity?.current?.select?.clearValue();
    setPostCodes([]);
    if (value) {
      getCities(value.text);
    }
  };
  const handlecity = (value) => {
    selectInputRefPostCode?.current?.select?.clearValue();
    if (value) {
      getPostCodes(value.text);
    }
  };

  const charText = (e) => {
    if (e.key !== " ") {
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

  const formatOptionLabel = ({ name }) => (
    <div style={{ display: "flex" }}>{name}</div>
  );
  const formatOptionLabel1 = ({ text }) => (
    <div style={{ display: "flex" }}>{text}</div>
  );

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
              placeholder="Name, Email, Mobile no, Company Name.."
            />
          </Form.Group>
        </div>
        <div className="col-md-3 dropdown-select">
          <Form.Group>
            <Form.Label>Company Type</Form.Label>
            <Select
              ref={selectInputRefComp}
              className="basic-single tele-drop"
              classNamePrefix="select"
              name="company_type_id"
              closeMenuOnSelect={true}
              placeholder={"Select Company"}
              defaultValue={{ name: "Select Company", id: "" }}
              isSearchable={true}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              formatLabel={formatOptionLabel}
              options={[{ name: "Select Company", id: "" }, ...companyTypes]}
            />
          </Form.Group>
        </div>
        <div className="col-md-3 dropdown-select">
          <Form.Group>
            <Form.Label>Industry</Form.Label>
            <Select
              ref={selectInputRefIndus}
              className="basic-single tele-drop"
              classNamePrefix="select"
              name="industry_type_id"
              closeMenuOnSelect={true}
              placeholder={"Select industry"}
              isSearchable={true}
              defaultValue={{ name: "Select Industry", id: "" }}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              formatOptionLabel={formatOptionLabel}
              options={[{ name: "Select Industry", id: "" }, ...industries]}
              onChange={handleindustry}
            />
            {/* <Form.Control
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
 */}{" "}
          </Form.Group>
        </div>
        <div className="col-md-3 dropdown-select">
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Select
              ref={selectInputRefCountry}
              className="basic-single tele-drop"
              classNamePrefix="select"
              name="country_id"
              closeMenuOnSelect={true}
              placeholder={"Select Country"}
              defaultValue={{ name: "Select Country", country_id: "" }}
              isSearchable={true}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.country_id}
              formatOptionLabel={formatOptionLabel}
              options={[
                { name: "Select Country", country_id: "" },
                ...countries,
              ]}
              onChange={handlecountry}
            />
            <Form.Control.Feedback type="invalid">
              Please select country
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-3 dropdown-select">
          <Form.Group>
            <Form.Label>State</Form.Label>
            {states.length !== 0 ? (
              <Select
                ref={selectInputRefState}
                className="basic-single tele-drop"
                classNamePrefix="select"
                name="state_id"
                closeMenuOnSelect={true}
                defaultValue={{ text: "Select State", id: "" }}
                isSearchable={true}
                getOptionLabel={(option) => option.text}
                getOptionValue={(option) => option.id}
                formatOptionLabel={formatOptionLabel1}
                options={[{ text: "Select State", id: "" }, ...states]}
                onChange={handlestate}
              />
            ) : (
              <Form.Control
                name="state_id"
                size="sm"
                type="text"
                autoComplete="off"
                placeholder="Enter state"
                onKeyPress={(e) => charText(e)}
              />
            )}
          </Form.Group>
        </div>
        <div className="col-md-3 dropdown-select" style={{zIndex:"2"}}>
          <Form.Group>
            <Form.Label>City</Form.Label>
            {states.length !== 0 && cities.length != 0 ? (
              <Select
                ref={selectInputRefCity}
                className="basic-single tele-drop"
                classNamePrefix="select"
                name="city"
                closeMenuOnSelect={true}
                placeholder={"Enter city"}
                defaultValue={{ text: "Select City", id: "" }}
                isSearchable={true}
                getOptionLabel={(option) => option.text}
                getOptionValue={(option) => option.id}
                formatOptionLabel={formatOptionLabel1}
                options={[{ text: "Select City", id: "" }, ...cities]}
                onChange={handlecity}
              />
            ) : (
              <Form.Control
                name="city"
                size="sm"
                type="text"
                autoComplete="off"
                placeholder="Enter city"
              />
            )}
          </Form.Group>
        </div>
        <div className="col-md-3 dropdown-select" style={{zIndex:"2"}}>
          <Form.Group>
            <Form.Label>Postcode</Form.Label>
            {selectedCountry === 101 &&
            states.length !== 0 &&
            cities.length != 0 &&
            postCodes.length !== 0 ? (
              <Select
                ref={selectInputRefPostCode}
                className="basic-single tele-drop"
                classNamePrefix="select"
                name="postcode"
                closeMenuOnSelect={true}
                placeholder={"Enter postcode"}
                isSearchable={true}
                defaultValue={{ text: "Select Postcode", id: "" }}
                getOptionLabel={(option) => option.text}
                getOptionValue={(option) => option.id}
                formatOptionLabel={formatOptionLabel1}
                options={[{ text: "Select Postcode", id: "" }, ...postCodes]}
              />
            ) : (
              <Form.Control
                name="postcode"
                size="sm"
                type="text"
                autoComplete="off"
                placeholder="Enter postcode"
                onKeyPress={(e) => alphaNumeric(e)}
                minLength="5"
                maxLength="10"
              />
            )}
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
