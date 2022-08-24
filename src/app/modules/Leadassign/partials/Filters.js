import React from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import SearchIcon from "@material-ui/icons/Search";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import jQuery from "jquery";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import Select from "react-select";

function Filters({ setQueryParams }) {
  const selectInputRefUser = React.useRef();
  const selectInputRefCountry = React.useRef();
  const selectInputRefState = React.useRef();
  const selectInputRefCity = React.useRef();
  const selectInputRefPostCode = React.useRef();
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState(0);
  const [selectedState, setSelectedState] = React.useState(0);
  const [selectedCountry, setSelectedCountry] = React.useState(0);

  const postUsers = React.useCallback(() => {
    Actions.users().then((data) => {
      if (data.status === "SUCCESS") {
        setUsers(data.data.employees);
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
  React.useEffect(postUsers, []);
  React.useEffect(getCountries, []);

  const getCast = React.useCallback(() => {
    Actions.cast().then((data) => {
      if (data.status === "SUCCESS") {
        setCast(data.data.casts);
      }
    });
  }, []);
  React.useEffect(getCast, []);
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
    setQueryParams(formDataObj);
  };

  const resetForm = () => {
    formRef.current.reset();
    selectInputRefState?.current?.select?.clearValue();
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
            <div className="col-md-3 dropdown-select">
              <Form.Group>
                <Form.Label>
                  {" "}
                  Users<span className="text-danger">*</span>
                </Form.Label>
                <Select
                  ref={selectInputRefUser}
                  className="basic-single tele-drop"
                  classNamePrefix="select"
                  name="users"
                  defaultValue={{ name: "Select User", id: "" }}
                  closeMenuOnSelect={true}
                  placeholder={"Select User"}
                  isSearchable={true}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  formatOptionLabel={formatOptionLabel}
                  options={[{ name: "Select User", id: "" }, ...users]}
                  onChange={(e) => {
                    if (e) setQueryParams({ users: e.id });
                  }}
                />
                {/* <Form.Control
                size="sm"
                name="users"
                as="select"
                onChange={handleChange}
                autoComplete="off"
                className="custom-select tele-drop"
                placeholder="Select User"
                required
                
              >
                <option value="">Select User</option>
                {users.map((i) => (
                  <option value={i.id} key={"e" + i.id}>
                    ({i.id}) {i.name}{" "}
                    {i.designation ? "(" + i.designation + ")" : null}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select user
              </Form.Control.Feedback> */}
              </Form.Group>
            </div>
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
                  formatOptionLabel={formatOptionLabel1}
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
                    formatOptionLabel={formatOptionLabel2}
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
            <div className="col-md-3 dropdown-select" style={{ zIndex: "2" }}>
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
                    formatOptionLabel={formatOptionLabel2}
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
            <div className="col-md-3 dropdown-select">
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
                    formatOptionLabel={formatOptionLabel2}
                    options={[
                      { text: "Select Postcode", id: "" },
                      ...postCodes,
                    ]}
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

            <div className="col-md-4 d-none">
              <Form.Group>
                <Form.Label>Cast</Form.Label>
                <Form.Control
                  name="cast_id"
                  id="cast_id"
                  as="select"
                  onChange={checkCast}
                  className="mycast"
                >
                  <option value="">Select Cast</option>
                  {casts &&
                    casts.map((i) => (
                      <option value={i.id} selected={selectedCast == i.id}>
                        {i.name}
                      </option>
                    ))}
                  <option value="other">Add Cast</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please select cast
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="col-md-4 d-none">
              <div>
                <Form.Label>
                  Project Type<span className="text-danger">*</span>
                </Form.Label>
                <select
                  name="project_type"
                  required
                  onChange={checkValue}
                  className="browser-default custom-select house-type"
                >
                  <option>Select Project Type</option>
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
                  <div class="form-check-inline">
                    <label class="form-check-label">
                      <input
                        type="radio"
                        class="form-check-input"
                        defaultValue="1"
                        name="flat_selection"
                      />
                      1 BHK
                    </label>
                  </div>
                  <div class="form-check-inline">
                    <label class="form-check-label">
                      <input
                        type="radio"
                        class="form-check-input"
                        defaultValue="2"
                        name="flat_selection"
                      />
                      2 BHK
                    </label>
                  </div>
                  <div class="form-check-inline">
                    <label class="form-check-label">
                      <input
                        type="radio"
                        class="form-check-input"
                        defaultValue="3"
                        name="flat_selection"
                      />
                      3 BHK
                    </label>
                  </div>
                  <div class="form-check-inline">
                    <label class="form-check-label">
                      <input
                        type="radio"
                        class="form-check-input"
                        defaultValue="4"
                        name="flat_selection"
                      />
                      4 BHK
                    </label>
                  </div>
                </div>
              </Form.Group>
            </div>
            <div className="col-md-4 d-none flat-data sqft-data">
              <Form.Group>
                <Form.Label>Squre Foot </Form.Label>
                <Form.Control
                  name="foot"
                  size="sm"
                  type="number"
                  autoComplete="off"
                  placeholder="Enter Squre Foot"
                />
                <Form.Control.Feedback type="invalid">
                  Please enter SQURE FOOT
                </Form.Control.Feedback>
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
