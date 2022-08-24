import React from "react";
import { connect, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { useSubheader } from "../../_metronic/layout";
import { Card, Form, Button, Image } from "react-bootstrap";
import Actions from "./Actions";
import * as auth from "../modules/Auth/_redux/authRedux";
import {
  isValidImage,
  validatePhoneOnPress,
  disableUpDownArrow,
} from "../helpers/Helper";
import App from "../Configs/app";
import Select from "react-select";

function UpdateProfile(props) {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Update Profile");
  const selectInputRefCity = React.useRef();
  const selectInputRefPostCode = React.useRef();
  const selectInputRefState = React.useRef();
  const { addToast } = useToasts();
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { user } = useSelector((state) => state.auth);
  const [photo, setPhoto] = React.useState(null);
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [postCodes, setPostCodes] = React.useState([]);

  const [selectedCountry, setSelectedCountry] = React.useState(user.country_id);
  const [selectedState, setSelectedState] = React.useState(user.state_id);
  const [selectedCity, setSelectedCity] = React.useState(user.city);
  const [selectedPostCode, setSelectedPostCode] = React.useState(user.pincode);

  const [redirect, setRedirect] = React.useState(false);

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

  React.useEffect(getCountries, []);

  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.target);
    const formDataObj = Object.fromEntries(formData.entries());

    const countryId = formDataObj.country_id;
    const stateId = formDataObj.state_id;
    const cityId = formDataObj.city;

    if (countryId === "") {
      addToast("Please select Country", {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (stateId === "") {
      addToast("Please select State", {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (cityId === "") {
      addToast("Please select City", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (
      form.checkValidity() === true &&
      countryId !== "" &&
      stateId !== "" &&
      cityId !== ""
    ) {
      formDataObj.picture = photo;
      Actions.updateProfile(formDataObj).then((data) => {
        setLoading(false);
        if (data.status === "SUCCESS") {
          props.fulfillUser(data.data.user);
          addToast(data.message, { appearance: "success", autoDismiss: true });
          setRedirect(true);
        } else {
          addToast(data.message, { appearance: "error", autoDismiss: true });
        }
      });
      setValidated(false);
    } else {
      setValidated(true);
      setLoading(false);
    }
  };

  const changePhoto = (event) => {
    let files = event.target.files;
    if (files.length > 0 && isValidImage(files[0].type)) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        setPhoto({
          name: files[0].name,
          type: files[0].type,
          size: files[0].size,
          base64: e.target.result,
        });
      };
    } else {
      addToast("Please select proper image.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
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
      setSelectedState(value.id);
      getCities(value.text);
    }
  };
  const handlecity = (value) => {
    selectInputRefPostCode?.current?.select?.clearValue();
    if (value) {
      setSelectedCity(value.id);
      getPostCodes(value.id);
    }
  };
  const handlepostcode = (value) => {
    if (value) {
      setSelectedPostCode(value.id);
    }
  };
  const formatOptionLabel = ({ name }) => (
    <div style={{ display: "flex" }}>{name}</div>
  );
  const formatOptionLabel1 = ({ text }) => (
    <div style={{ display: "flex" }}>{text}</div>
  );

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

  const picture =
    user.picture && user.picture !== "" ? App.assetUrl + user.picture : false;

  if (redirect) {
    return <Redirect to="/profile" />;
  } else {
    return (
      <div className="update-profile">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">Personal Information</Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      defaultValue={user.name}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter name"
                      onKeyPress={(e) => charText(e)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter name
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      defaultValue={user?.email}
                      size="sm"
                      type="email"
                      autoComplete="off"
                      placeholder="Enter email"
                      required
                      readOnly
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter email
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Mobile No</Form.Label>
                    <Form.Control
                      name="mobileno"
                      defaultValue={user?.mobileno}
                      size="sm"
                      type="text"
                      minLength="10"
                      autoComplete="off"
                      placeholder="Enter mobile no"
                      onKeyPress={validatePhoneOnPress}
                      onKeyDown={disableUpDownArrow}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter mobile no
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Additional Contact No</Form.Label>
                    <Form.Control
                      name="alt_mobileno"
                      defaultValue={user?.alt_mobileno}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      onKeyPress={validatePhoneOnPress}
                      onKeyDown={disableUpDownArrow}
                      placeholder="Enter additional contact no"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter additional contact no
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Occupation</Form.Label>
                    <Form.Control
                      name="designation"
                      defaultValue={user?.designation}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter occupation"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter occupation
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      size="sm"
                      defaultValue={user?.gender}
                      name="gender"
                      as="select"
                      autoComplete="off"
                      placeholder="Select gender"
                    >
                      <option value="">Select gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please select gender
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                {(photo?.base64 || picture) && (
                  <div className="col-md-1">
                    <Image
                      style={{ height: "60px" }}
                      src={photo?.base64 || picture}
                    />
                  </div>
                )}
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.File id="formcheck-api-custom">
                      <Form.File.Input onChange={changePhoto} isValid />
                      <Form.Control.Feedback type="invalid">
                        Please select proper image
                      </Form.Control.Feedback>
                    </Form.File>
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">Contact Information</Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                      name="address_line_1"
                      defaultValue={user?.address_line_1}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter address line 1"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter address line 1
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control
                      name="address_line_2"
                      defaultValue={user?.address_line_2}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter address line 2"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter address line 2
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>
                      Country<span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      className="basic-single tele-drop"
                      classNamePrefix="select"
                      name="country_id"
                      closeMenuOnSelect={true}
                      placeholder={"Select Country"}
                      isSearchable={true}
                      value={countries.filter(
                        (value) => value.country_id === selectedCountry
                      )}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.country_id}
                      formatOptionLabel={formatOptionLabel}
                      options={countries}
                      onChange={handlecountry}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select country
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3" id="select">
                  <Form.Group>
                    <Form.Label>
                      State<span className="text-danger">*</span>
                    </Form.Label>
                    {states.length !== 0 ? (
                      <Select
                        ref={selectInputRefState}
                        className="basic-single tele-drop"
                        classNamePrefix="select"
                        name="state_id"
                        closeMenuOnSelect={true}
                        placeholder={"Select state"}
                        isSearchable={true}
                        value={states.filter(
                          (value) => value.id === selectedState
                        )}
                        getOptionLabel={(option) => option.text}
                        getOptionValue={(option) => option.id}
                        formatOptionLabel={formatOptionLabel1}
                        options={states}
                        onChange={handlestate}
                      />
                    ) : (
                      <Form.Control
                        name="state_id"
                        size="sm"
                        type="text"
                        defaultValue={user?.state_id}
                        autoComplete="off"
                        placeholder="Enter state"
                        onKeyPress={(e) => charText(e)}
                        required
                      />
                    )}
                    <Form.Control.Feedback type="invalid">
                      Please select state
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>
                      City<span className="text-danger">*</span>
                    </Form.Label>
                    {states.length !== 0 && cities.length !== 0 ? (
                      <Select
                        ref={selectInputRefCity}
                        className="basic-single tele-drop"
                        classNamePrefix="select"
                        name="city"
                        closeMenuOnSelect={true}
                        placeholder={"Enter city"}
                        isSearchable={true}
                        value={cities.filter(
                          (value) => value.id === selectedCity
                        )}
                        getOptionLabel={(option) => option.text}
                        getOptionValue={(option) => option.id}
                        formatOptionLabel={formatOptionLabel1}
                        options={cities}
                        onChange={handlecity}
                      />
                    ) : (
                      <Form.Control
                        name="city"
                        size="sm"
                        type="text"
                        defaultValue={user?.city}
                        autoComplete="off"
                        placeholder="Enter city"
                        onKeyPress={(e) => charText(e)}
                        required
                      />
                    )}
                    <Form.Control.Feedback type="invalid">
                      Please enter city
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Pincode</Form.Label>
                    {selectedCountry === 101 &&
                    states.length !== 0 &&
                    cities.length !== 0 &&
                    postCodes.length !== 0 ? (
                      <Select
                        ref={selectInputRefPostCode}
                        className="basic-single tele-drop"
                        classNamePrefix="select"
                        name="pincode"
                        closeMenuOnSelect={true}
                        placeholder={"Enter pincode"}
                        value={postCodes.filter(
                          (value) => value.id === selectedPostCode
                        )}
                        isSearchable={true}
                        getOptionLabel={(option) => option.text}
                        getOptionValue={(option) => option.id}
                        formatOptionLabel={formatOptionLabel1}
                        options={postCodes}
                        onChange={handlepostcode}
                      />
                    ) : (
                      <Form.Control
                        name="pincode"
                        size="sm"
                        id="date"
                        type="text"
                        defaultValue={user?.pincode}
                        autoComplete="off"
                        placeholder="Enter pincode"
                        onKeyPress={(e) => alphaNumeric(e)}
                        minLength="5"
                        maxLength="10"
                      />
                    )}
                    <Form.Control.Feedback type="invalid">
                      Please enter postcode
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">Social Links Information</Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                      name="facebook"
                      defaultValue={user?.facebook}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter facebook url"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter facebook url
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Twitter</Form.Label>
                    <Form.Control
                      name="twitter"
                      defaultValue={user?.twitter}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter twitter url"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter twitter url
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control
                      name="instagram"
                      defaultValue={user?.instagram}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter instagram url"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter instagram url
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      name="website"
                      defaultValue={user?.website}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter website url"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter website url
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="row">
            <div className="col-md-12">
              <Button
                size="sm"
                variant="primary"
                className="rk-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading.." : "SAVE"}
              </Button>
              &nbsp;
              <Link to="/profile" className="btn btn-danger btn-sm">
                CANCEL
              </Link>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(null, auth.actions)(UpdateProfile);
