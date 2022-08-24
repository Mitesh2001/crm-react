import React from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { useSelector } from "react-redux";
import { Card, Form, Button, Image } from "react-bootstrap";
import Actions from "../Actions";
import { useToasts } from "react-toast-notifications";
import {
  isValidImage,
  validatePhoneOnPress,
  disableUpDownArrow,
} from "../../../helpers/Helper";
import DeleteIcon from "@material-ui/icons/Delete";
import MultiSelect from "react-multi-select-component";
import jQuery from "jquery";
//import {MDCSelect} from '@material/select';
import { Multiselect } from "multiselect-react-dropdown";
import Select from "react-select";

function Add() {
  let history = useHistory();
  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Add Lead");
  const selectInputRefCity = React.useRef();
  const selectInputRefPostCode = React.useRef();
  const selectInputRefState = React.useRef();
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [industries, setIndustries] = React.useState([]);
  const [companyTypes, setCompanyTypes] = React.useState([]);
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [postCodes, setPostCodes] = React.useState([]);
  const [leadStatusArray, setLeadStatus] = React.useState([]);
  const [redirect, setRedirect] = React.useState(false);
  const [companyLogo, setCompanyLogo] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [listproduct, setListProduct] = React.useState([]);
  const [product, setProduct] = React.useState([]);
  const [option, setOption] = React.useState([]);
  const [useroption, setUseroption] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIndustry, setSelectedIndustry] = React.useState(0);
  const [selectedCountry, setSelectedCountry] = React.useState(0);
  const [selectedState, setSelectedState] = React.useState(0);
  const [selectedCity, setSelectedCity] = React.useState(0);
  const { user } = useSelector((state) => state.auth);
  const [notAllowed, setNotAllowed] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [validateEmail, setValidateEmail] = React.useState("");

  const checkPermission = React.useCallback(() => {
    let allowed = false;
    user.user_permission &&
      user.user_permission.Lead &&
      user.user_permission.Lead.map((item) => {
        if (item.name === "Create") {
          allowed = true;
        }
      });
    if (!allowed) {
      // setNotAllowed(true)
      history.goBack();
    } else {
      if (
        user.company_details &&
        new Date(user.company_details.expiry_date).getTime() <
          new Date(new Date()).getTime()
      ) {
        history.goBack();
      }
    }
  }, []);

  React.useEffect(checkPermission, []);

  const postUsers = React.useCallback(() => {
    Actions.users().then((data) => {
      if (data.status === "SUCCESS") {
        setUsers(data.data.employees);
      }
    });
  }, []);
  React.useEffect(postUsers, []);

  const deleteItem = (id) => {
    const newOption = option.filter((item) => item.id !== id);
    setOption(newOption);
  };
  const deleteUserItem = (id) => {
    const newOption = useroption.filter((item) => item.id !== id);
    setUseroption(newOption);
  };
  const onSelect = (event) => {
    setOption(Array.isArray(event) ? event.map((x) => x) : []);
  };

  const onSelected = (event) => {
    setUseroption(Array.isArray(event) ? event.map((x) => x) : []);
  };

  const getProducts = React.useCallback((cid) => {
    Actions.listProducts().then((data) => {
      if (data.status === "SUCCESS") {
        setProduct(data.data.products);
      }
    });
  }, []);
  React.useEffect(getProducts, []);

  const getIndustries = React.useCallback(() => {
    Actions.industries().then((data) => {
      if (data.status === "SUCCESS") {
        setIndustries(data.data.itypes);
      }
    });
  }, []);

  const getLeadStatuses = React.useCallback(() => {
    Actions.leadStatuses().then((data) => {
      if (data.status === "SUCCESS") {
        setLeadStatus(data.data.statuses);
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

  React.useEffect(getCountries, []);
  React.useEffect(getLeadStatuses, []);
  React.useEffect(getCompanyTypes, []);
  React.useEffect(getIndustries, []);
  // React.useEffect(getStates, []);

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

    if (countryId == "") {
      addToast("Please select Country", {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (stateId == "") {
      addToast("Please select State", {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (cityId == "") {
      addToast("Please select City", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (
      form.checkValidity() === true &&
      countryId !== "" &&
      stateId !== "" &&
      cityId !== "" &&
      validateEmail 
    ) {
      formDataObj.company_logo = companyLogo;
      var res = [];
      res = useroption.map((x) => x.id);
      //res=res.toString();
      formDataObj.user_id = res;

      var result = [];
      result = option.map((x) => x.id);
      //result=result.toString();
      formDataObj.interested_products = result;
      Actions.add(formDataObj).then((response) => {
        setLoading(false);
        addToast(response.message, {
          appearance: response.status === "SUCCESS" ? "success" : "error",
          autoDismiss: true,
        });
        if (response.status === "SUCCESS") {
          setRedirect(true);
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
        setCompanyLogo({
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

  const getType = (value) => {
    var val = value;
    if (value !== "101") {
      jQuery("#date").attr("type", "text");
    } else if (value === "101") {
      jQuery("#date").attr("type", "number");
    }

    jQuery("#select").addClass("d-none");
    if (value === "101") {
      jQuery("#select").removeClass("d-none");
    }

    jQuery("#text").addClass("d-none");
    if (value !== "101") {
      jQuery("#text").removeClass("d-none");
    }
  };

  /*   const getList = (value) => {

    jQuery('#select').addClass("d-none");
    if (value === '101') {
      jQuery('#select').removeClass("d-none");
    }
    jQuery('#text').addClass("d-none");
    if (value !== '101') {
        jQuery('#text').removeClass("d-none");
    }
} */

  const handleindustry = (value) => {
    setSelectedIndustry(parseInt(value.id));
    setCurrentPage(1);
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
      getPostCodes(value.text);
    }
  };

  const formatOptionLabel = ({ name }) => (
    <div style={{ display: "flex" }}>{name}</div>
  );
  const formatOptionLabel1 = ({ text }) => (
    <div style={{ display: "flex" }}>{text}</div>
  );

  React.useEffect(() => {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) {
      setValidateEmail(true);
      if (document.getElementById("strong_pass")) {
        document.getElementById("strong_pass").remove();
      }
    } else {
      setValidateEmail(false);
      if (!document.getElementById("strong_pass")) {
        let tag = document.createElement("p");
        tag.setAttribute("id", "strong_pass");
        let text = document.createTextNode("Please enter valid email");
        tag.appendChild(text);
        let element = document.querySelector("#email_validate");
        element.appendChild(tag);
        document.getElementById("strong_pass").style.color = "red";
      }
    }
    if (!email && document.getElementById("strong_pass")) {
      document.getElementById("strong_pass").remove();
    }
  }, [email]);


  // if(notAllowed){
  //   addToast("You are not allowed to add lead", {
  //     appearance:"error",
  //     autoDismiss: true,
  //   });
  //   return <Redirect to="/leads" />;
  // }
  if (redirect) {
    return <Redirect to="/leads" />;
  } else {
    return (
      <div className="add-edit-lead">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">Lead Information</Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>
                      Lead Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="lead_name"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter lead name"
                      onKeyPress={(e) => charText(e)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter lead name
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Lead Source</Form.Label>
                    <Form.Control
                      name="lead_source"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter lead source"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter lead source
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>
                      Lead Status <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      name="lead_status"
                      as="select"
                      autoComplete="off"
                      placeholder="Select lead status"
                      required
                    >
                      <option value="">Select status</option>
                      {leadStatusArray.map((i) => (
                        <option value={i.id} key={"ls" + i.id}>
                          {i.title}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please select lead status
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                {/*
                              <div className="col-md-4">
                                  <Form.Group>
                                      <Form.Label>Assigned To</Form.Label>
                                      <Form.Control size="sm" name="user_id" as="select" autoComplete="off" placeholder="Select assign to." >
                                          <option value="">Select assign to</option>
                                          <option value="PENDING">Tansukh Rathod</option>
                                          <option value="INPROGRESS">Anish Parikh</option>
                                          <option value="COMPLETED">Bhavesh Kala</option>
                                      </Form.Control>
                                      <Form.Control.Feedback type="invalid">Please select assign to</Form.Control.Feedback>
                                  </Form.Group>
                              </div>
                              */}
              </div>
            </Card.Body>
          </Card>

          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">Company Information</Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      name="company_name"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter company name"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter company name
                    </Form.Control.Feedback>
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
                      placeholder="Select Company Type"
                    >
                      <option value="">Select company type</option>
                      {companyTypes.map((i) => (
                        <option value={i.id} key={"i" + i.id}>
                          {i.name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please select company type
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Industry</Form.Label>
                    <Select
                      className="basic-single tele-drop"
                      classNamePrefix="select"
                      name="industry_id"
                      closeMenuOnSelect={true}
                      placeholder={"Select industry"}
                      isSearchable={true}
                      // defaultValue={states[0]}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      formatOptionLabel={formatOptionLabel}
                      options={industries}
                      onChange={handleindustry}
                    />

                    {/* <Form.Control
                      size="sm"
                      name="industry_id"
                      as="select"
                      autoComplete="off"
                      placeholder="Select industry"
                    >
                      <option value="">Select industry</option>
                      {industries.map((i) => (
                        <option value={i.id} key={"i" + i.id}>
                          {i.name}
                        </option>
                      ))}
                    </Form.Control> */}
                    <Form.Control.Feedback type="invalid">
                      Please select industry
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Establish Year</Form.Label>
                    <Form.Control
                      name="established_in"
                      size="sm"
                      type="number"
                      autoComplete="off"
                      placeholder="Enter establish year"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter establish year
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Annual Turnover</Form.Label>
                    <Form.Control
                      name="turnover"
                      size="sm"
                      type="number"
                      autoComplete="off"
                      placeholder="Enter annual turnover"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter annual turnover
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>GST Number</Form.Label>
                    <Form.Control
                      name="gst_no"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter GST number"
                      pattern='^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter valid GST number
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control
                      name="pan_no"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter PAN number"
                      onKeyPress={(e) => alphaNumeric(e)}
                      minLength="10"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter PAN number
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Number of Employees</Form.Label>
                    <Form.Control
                      name="no_of_employees"
                      size="sm"
                      type="number"
                      autoComplete="off"
                      placeholder="Enter number of employees"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter number of employees
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      name="website"
                      size="sm"
                      type="url"
                      autoComplete="off"
                      placeholder="Enter website"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter website
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-3" style={{ display: "flex" }}>
                  <Form.Group>
                    <Form.Label>Company Logo</Form.Label>
                    <Form.File id="formcheck-api-custom">
                      <Form.File.Input onChange={changePhoto} isValid />
                      <Form.Control.Feedback type="invalid">
                        Please select proper image
                      </Form.Control.Feedback>
                    </Form.File>
                  </Form.Group>
                  {companyLogo?.base64 && (
                    <div className="col-md-1">
                      <Image
                        style={{ height: "60px", marginLeft: "-70px" }}
                        src={companyLogo?.base64}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">
              Primary Person Information
            </Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>
                      Name of Contact Person{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="customer_name"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter name of contact persorn"
                      onKeyPress={(e) => charText(e)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter name of contact persorn
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group id="email_validate">
                    <Form.Label>
                      Primary email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="email"
                      size="sm"
                      type="email"
                      autoComplete="off"
                      placeholder="Enter primary email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter primary email
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Secondary email</Form.Label>
                    <Form.Control
                      name="secondary_email"
                      size="sm"
                      type="email"
                      autoComplete="off"
                      placeholder="Enter secondary email"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter secondary email
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>
                      Primary Mobile <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="mobile_no"
                      size="sm"
                      type="text"
                      minLength="10"
                      autoComplete="off"
                      placeholder="Enter primary mobile no"
                      onKeyPress={validatePhoneOnPress}
                      onKeyDown={disableUpDownArrow}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter proper mobile no
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Secondary Mobile</Form.Label>
                    <Form.Control
                      name="secondary_mobile_no"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter secondary mobile no"
                      onKeyPress={validatePhoneOnPress}
                      onKeyDown={disableUpDownArrow}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter proper secondary mobile no
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">
              Primary Contact Information
            </Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                      name="address_line_1"
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
                        autoComplete="off"
                        placeholder="Enter state"
                        onKeyPress={(e) => charText(e)}
                        onChange={(e) => setSelectedState(e.target.value)}
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
                    {states.length !== 0 && cities.length != 0 ? (
                      <Select
                        ref={selectInputRefCity}
                        className="basic-single tele-drop"
                        classNamePrefix="select"
                        name="city"
                        closeMenuOnSelect={true}
                        placeholder={"Enter city"}
                        isSearchable={true}
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
                        autoComplete="off"
                        placeholder="Enter city"
                        onKeyPress={(e) => charText(e)}
                        onChange={(e) => setSelectedCity(e.target.value)}
                      />
                    )}

                    <Form.Control.Feedback type="invalid">
                      Please enter city
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
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
                        getOptionLabel={(option) => option.text}
                        getOptionValue={(option) => option.id}
                        formatOptionLabel={formatOptionLabel1}
                        options={postCodes}
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

                    <Form.Control.Feedback type="invalid">
                      Please enter postcode
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">Other Information</Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      name="description"
                      size="sm"
                      as="textarea"
                      autoComplete="off"
                      placeholder="Enter description"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter description
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      name="notes"
                      size="sm"
                      as="textarea"
                      autoComplete="off"
                      placeholder="Enter notes"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter notes
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Special Instructions</Form.Label>
                    <Form.Control
                      name="special_instructions"
                      size="sm"
                      as="textarea"
                      autoComplete="off"
                      placeholder="Enter special instructions"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter special instructions
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Sticky Note</Form.Label>
                    <Form.Control
                      name="sticky_note"
                      size="sm"
                      as="textarea"
                      autoComplete="off"
                      placeholder="Enter sticky note"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter sticky note
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>
                      Enquiry For<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="enquiry_for"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter Enquiry"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter Enquiry
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>
                      Reference<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="reference"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter Reference"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter Reference
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Assigned user</Form.Label>
                    <Select
                      name="name"
                      isMulti
                      width="100%"
                      options={users.filter(
                        (o1) => !useroption.some((o2) => o1.id === o2.id)
                      )}
                      className="basic-multi-select tele-drop"
                      classNamePrefix="select"
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      onChange={onSelected}
                      value={useroption}
                      // selectedValues={users.filter(o1 => info?.assign_user&&info?.assign_user.some(o2 => o1.id === o2.user_id))}
                      key={"e" + useroption.id}
                    />
                  </Form.Group>
                  {useroption &&
                    useroption.map((item) => {
                      return (
                        <div
                          className="row"
                          style={{
                            backgroundColor: "honeydew",
                            margin: "8px 5px",
                            padding: "8px 2px",
                          }}
                        >
                          <div className="col-md-6">{item.name} </div>
                          <div className="col-md-6" style={{ textAlign: "right" }}>
                            <Link to="#" className="abtn">
                              <DeleteIcon
                                onClick={() => deleteUserItem(item.id)}
                              />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Interested In Products/Service</Form.Label>
                    <Select
                      name="intrested_product"
                      isMulti
                      width="100%"
                      options={product.filter(
                        (o1) => !option.some((o2) => o1.id === o2.id)
                      )}
                      onChange={onSelect}
                      className="basic-multi-select tele-drop"
                      classNamePrefix="select"
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      // selectedValues={option}
                      value={option} // set selected values
                      // selectedValues={info?.intrested_product}
                      key={"e" + option.id}
                    />
                  </Form.Group>
                  {option &&
                    option.map((item) => {
                      return (
                        <div
                          className="row"
                          style={{
                            backgroundColor: "honeydew",
                            margin: "8px 5px",
                            padding: "8px 2px",
                          }}
                        >
                          <div className="col-md-6">{item.name} </div>
                          <div className="col-md-6" style={{ textAlign: "right" }}>
                            <Link to="#" className="abtn">
                              <DeleteIcon onClick={() => deleteItem(item.id)} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
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
              <Link to="/leads" className="btn btn-danger btn-sm">
                CANCEL
              </Link>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default React.memo(Add);
