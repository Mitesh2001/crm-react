import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { useSelector } from "react-redux";
import { Card, Form, Button, Modal, Image } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

import {
  isValidImage,
  validatePhoneOnPress,
  disableUpDownArrow,
} from "../../../helpers/Helper";
import Actions from "../Actions";
import AddIcon from "@material-ui/icons/Add";
import jQuery from "jquery";
import DatePicker from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import Select from "react-select";

export default React.memo(function() {
  let history = useHistory();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Add Employee");
  const { addToast } = useToasts();
  const selectInputRefCity = React.useRef();
  const selectInputRefPostCode = React.useRef();
  const selectInputRefState = React.useRef();

  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  const [photo, setPhoto] = React.useState(null);
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [postCodes, setPostCodes] = React.useState([]);
  const [casts, setCast] = React.useState([{ casts: "" }]);
  const [roles, setRoles] = React.useState([]);
  const [sendCastt, setCastRecord] = React.useState(false);
  const [CastConfirm, setCastConfirm] = React.useState(false);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [dob, setDate] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIndustry, setSelectedIndustry] = React.useState(0);
  // const [selectedCasts, setSelectedCast] = React.useState(0);
  const [selectedCountry, setSelectedCountry] = React.useState(101);
  const [selectedState, setSelectedState] = React.useState(0);
  const [selectedCity, setSelectedCity] = React.useState(0);
  const [email, setEmail] = React.useState("");
  const [validateEmail, setValidateEmail] = React.useState("");
  const [preDynamicVal, setPreDynamicVal] = React.useState({});
  const [validatePara, setValidatePara] = React.useState({});
  const [para, setPara] = React.useState({});

  const [familyState, setFamilymember] = React.useState([
    {
      family_member_name: "",
      relation: "",
      memberdob: "",
      education: "",
      occupation: "",
    },
  ]);
  const [employerState, setEmployer] = React.useState([
    {
      employer: "",
      employercity: "",
      contactname: "",
      contactnumber: "",
      employmentperiod: "",
      reasonleave: "",
    },
  ]);
  const [jobState, setJobDetail] = React.useState([
    { date: "", position: "", level: "", reporting: "" },
  ]);
  const [educationState, setEducation] = React.useState([
    {
      highschool: "",
      gradute: "",
      postgradute: "",
      other: "",
      specialskill: "",
    },
  ]);
  const [bankState, setBank] = React.useState([
    { bank_name: "", accountnumber: "", ifsc: "" },
  ]);
  const [selectedCast, setCastSelected] = React.useState(null);
  const [dynamicItem, setInfo] = React.useState([]);
  const { user } = useSelector((state) => state.auth);
  const [notAllowed, setNotAllowed] = React.useState(true);
  const [val, setVal] = React.useState("");

  const checkPermission = React.useCallback(() => {
    let allowed = false;
    user.user_permission &&
      user.user_permission.Employees &&
      user.user_permission.Employees.map((item) => {
        if (item.name === "Create") {
          allowed = true;
        }
      });
    if (!allowed) {
      // setNotAllowed(true)
      history.goBack();
    } else {
      Actions.list().then((response) => {
        if (
          user.company_details &&
          new Date(user.company_details.expiry_date).getTime() <
            new Date(new Date()).getTime()
        ) {
          //removed ||response.data.totalRecord>=user.company_details.no_of_users
          history.goBack();
        }
      });
    }
    // else{
    //   setNotAllowed(false);
    // }
  }, []);
  React.useEffect(checkPermission, []);

  const titles = [
    "Personal Information",
    "Contact Information",
    "Role Information",
    "Education Details",
    "Family Details",
    "Previous Employer Details",
    "Job detail",
    "Bank Details",
    "Social Links Information",
  ];

  const getInfo = React.useCallback(() => {
    Actions.dynamiccontact().then((response) => {
      if (response.status === "SUCCESS") {
        setInfo(response.data);
      }
    });
  }, []);

  React.useEffect(getInfo, []);
  const handleDateChange = (date, val) => {
    setDate(date);
    setDt(val);
  };

  const [dt, setDt] = useState(moment());
  const today = moment();
  const disableFutureDt = (current) => {
    return current.isBefore(today);
  };

  const handleBank = (e, index) => {
    const { name, value } = e.target;
    const banklist = [...bankState];
    banklist[index][name] = value;
    setBank(banklist);
  };
  const handleEducation = (e, index) => {
    const { name, value } = e.target;
    const educationlist = [...educationState];
    educationlist[index][name] = value;
    setEducation(educationlist);
  };
  const handleJob = (e, index) => {
    const { name, value } = e.target;
    const joblist = [...jobState];
    joblist[index][name] = value;
    setJobDetail(joblist);
  };
  const handleEmplyee = (e, index) => {
    const { name, value } = e.target;
    const employeelist = [...employerState];
    employeelist[index][name] = value;
    setEmployer(employeelist);
  };
  const handleAddemployer = () => {
    setEmployer([
      ...employerState,
      {
        employer: "",
        employercity: "",
        contactname: "",
        contactnumber: "",
        employmentperiod: "",
        reasonleave: "",
      },
    ]); //index: Math.random(),
  };
  const handleRemoveemployer = (index) => {
    const removeemployeelist = [...employerState];
    removeemployeelist.splice(index, 1);
    setEmployer(removeemployeelist);
  };
  const handleFamily = (e, index) => {
    const { name, value } = e.target;
    const memberlist = [...familyState];
    memberlist[index][name] = value;
    setFamilymember(memberlist);
  };
  const handleAddMember = () => {
    setFamilymember([
      ...familyState,
      {
        family_member_name: "",
        relation: "",
        memberdob: "",
        education: "",
        occupation: "",
      },
    ]); //index: Math.random(),
  };
  const handleRemoveMember = (index) => {
    const removememberlist = [...familyState];
    removememberlist.splice(index, 1);
    setFamilymember(removememberlist);
  };
  const getRoles = React.useCallback(() => {
    Actions.roles().then((data) => {
      if (data.status === "SUCCESS") {
        setRoles(data.data.roles);
      }
    });
  }, []);
  const getCast = React.useCallback(() => {
    Actions.cast().then((data) => {
      if (data.status === "SUCCESS") {
        setCast(data.data.casts);
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

  React.useEffect(getCast, []);
  React.useEffect(getRoles, []);
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
    let val = true;
    if (
      Object.keys(validatePara).length !== 0 &&
      Object.keys(para).length !== 0
    ) {
      Object.keys(validatePara).forEach(function(key) {
        if (validatePara[key] == false) {
          val = false;
          addToast(`Please use given pattern in ${key}`, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      });
    } else {
      val = true;
    }
    let checkboxReq = true;
      dynamicItem.forEach((sec) => {
        sec.field_data.forEach((lab) => {
          if (lab.input_type == "checkbox" && lab.is_required == 1) {
            if (Object.keys(preDynamicVal).length == 0) {
              addToast(`Please select value in ${lab.label_name}`, {
                appearance: "error",
                autoDismiss: true,
              });
              checkboxReq = false;
            } else {
              for (const section in preDynamicVal) {
                for (const label in preDynamicVal[section]) {
                  if (
                    lab.label_name == label &&
                    preDynamicVal[section][label].length == 0
                  ) {
                    checkboxReq = false;
                    addToast(`Please select value in ${label}`, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                  }
                }
              }
            }
          }
        });
      });
    if (
      form.checkValidity() === true &&
      countryId !== "" &&
      stateId !== "" &&
      cityId !== "" &&
      val &&
      checkboxReq &&
      validateEmail
    ) {
      formDataObj.education_data = [...educationState];
      formDataObj.family_detail = [...familyState];
      formDataObj.previous_employer = [...employerState];
      formDataObj.job_data = [...jobState];
      formDataObj.bank_data = [...bankState];
      formDataObj.picture = photo;
      for (const sec in preDynamicVal) {
        for (const lab in preDynamicVal[sec]) {
          formDataObj[lab] = preDynamicVal[sec][lab];
        }
      }
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

  const checkValue = (event) => {
    var value = event.target.value;
    if (value != "1") {
      jQuery("#date").attr("disabled", "disabled");
    } else if (value == "1") {
      jQuery("#date").removeAttr("disabled");
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
  const formatDate = (date) => {
    let dateObj = date;
    if (typeof date !== "object") {
      dateObj = new Date(date);
    }
    return `${dateObj.getFullYear()}-${("0" + (dateObj.getMonth() + 1)).slice(
      -2
    )}-${("0" + dateObj.getDate()).slice(-2)}`;
  };

  React.useEffect(() => {
    if (
      val.match(/[a-z]/g) &&
      val.match(/[A-Z]/g) &&
      val.match(/[0-9]/g) &&
      val.match(/[^a-zA-Z\d]/g) &&
      val.length >= 8 
    ) {
      if (document.getElementById("strong_pass")) {
        document.getElementById("strong_pass").remove();
      }
    } else {
      if (!document.getElementById("strong_pass")) {
        let tag = document.createElement("p");
        tag.setAttribute("id", "strong_pass");
        let text = document.createTextNode(
          "At least 8 characters in length and should include at least 1 upper case letter, 1 number, and 1 special character."
        );
        tag.appendChild(text);
        let element = document.querySelector("#form_feedback");
        element.appendChild(tag);
        document.getElementById("strong_pass").style.color = "red";
      }
    }
    if (!val && document.getElementById("strong_pass")) {
      document.getElementById("strong_pass").remove();
    }
  }, [val]);

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

  const handlecheck = (section, label) => (e) => {
    const objSize = Object.keys(preDynamicVal).length;
    if (objSize == 0) {
      setPreDynamicVal({ [section]: { [label]: [e.target.value] } });
    } else {
      if (e.target.checked) {
        if (preDynamicVal.hasOwnProperty(section)) {
          if (preDynamicVal[section].hasOwnProperty(label)) {
            if (!preDynamicVal[section][label].includes(e.target.value)) {
              preDynamicVal[section][label].push(e.target.value);
              setPreDynamicVal(preDynamicVal);
            }
          } else {
            const o = { [section]: { [label]: [e.target.value] } };
            setPreDynamicVal((prev) => ({
              ...prev,
              [section]: Object.assign({}, preDynamicVal[section], o[section]),
            }));
          }
        } else {
          const k = { [section]: { [label]: [e.target.value] } };
          setPreDynamicVal(Object.assign({}, preDynamicVal, k));
        }
      } else {
        const arr = preDynamicVal[section][label].filter(
          (el) => el != e.target.value
        );
        preDynamicVal[section][label] = arr;
        setPreDynamicVal(preDynamicVal);
      }
    }
  };

  const obj5 = {};
  const handleTextArea = (pattern, label_name) => (e) => {
    const val = e.target.value;
    const obj1 = { [label_name]: val };

    if (Object.keys(para).length == 0) {
      setPara(Object.assign(para, obj1));
    } else {
      if (para.hasOwnProperty(label_name)) {
        para[label_name] = val;
        setPara(para);
      } else {
        setPara(Object.assign(para, obj1));
      }
    }

    if (pattern !== null && val) {
      if (val.match(pattern)) {
        obj5[label_name] = true;
      } else {
        obj5[label_name] = false;
      }
    } else {
      obj5[label_name] = true;
    }
    setValidatePara(Object.assign({}, validatePara, obj5));
  };

  if (redirect) {
    return <Redirect to="/employees" />;
  } else {
    return (
      <>
        <div className="update-profile">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3">Personal Information</Card.Header>
              <Card.Body className="p-3">
                <div className="row">
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>
                        Name<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="name"
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
                    <Form.Group id="email_validate">
                      <Form.Label>
                        Email<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="email"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        size="sm"
                        type="email"
                        autoComplete="off"
                        placeholder="Enter email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter email
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>
                        Mobile No<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="mobileno"
                        size="sm"
                        type="text"
                        min="1000000000"
                        max="99999999999999"
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
                      <Form.Label>Designation</Form.Label>
                      <Form.Control
                        name="designation"
                        size="sm"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter designation"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter designation
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        size="sm"
                        name="gender"
                        as="select"
                        autoComplete="off"
                        placeholder="Select gender"
                      >
                        <option value="">Select gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Please select gender
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group id="form_feedback">
                      <Form.Label>
                        Password<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="password"
                        size="sm"
                        type="password"
                        autoComplete="off"
                        placeholder="Enter password(Min 8 character with 1 UpperCase, 1 LowerCase, 1 Special Character)"
                        required
                        onChange={(e) => setVal(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter password
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
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
                            <option
                              value={i.id}
                              selected={selectedCast == i.id}
                            >
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
                  <div className="col-sm-4">
                    <Form.Group>
                      <Form.Label>
                        Birth Date<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="dob"
                        id="todate"
                        size="sm"
                        type="date"
                        placeholder="Please Select Date of Birth"
                        autoComplete="off"
                        onChange={handleDateChange}
                        max={formatDate(new Date())}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please Birth select date
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  {/*                 <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Date Of Birth</Form.Label>
                    <Form.Control
                      name="dob"
                      ID="todate"
                      size="sm"
                      type="date"
                      placeholder="Please Select Date of Birth"
                      autoComplete="off"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please Select Date of Birth
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
 */}{" "}
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Martial Status</Form.Label>
                      <Form.Control
                        size="sm"
                        name="marital_status"
                        className="mstatus"
                        as="select"
                        onChange={checkValue}
                        autoComplete="off"
                        placeholder="Select Martial Status"
                      >
                        <option value="">Select Martial Status</option>
                        <option value="1">Married</option>
                        <option value="2">Unmarried</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Please select Status
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Marriage Anniversary Date</Form.Label>
                      <Form.Control
                        name="marriage_anniversary_date"
                        id="date"
                        size="sm"
                        type="date"
                        autoComplete="off"
                        max={formatDate(new Date())}
                        placeholder="Enter Marriage Anniversary Date"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter Marriage Anniversary Date
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Blood Group</Form.Label>
                      <Form.Control
                        size="sm"
                        name="blood_group"
                        as="select"
                        autoComplete="off"
                        placeholder="Select Blood Group"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Please select gender
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Critical illness</Form.Label>
                      <Form.Control
                        name="critical_illness"
                        size="sm"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Critical illness"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter Critical illness
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Legal issue</Form.Label>
                      <Form.Control
                        name="legal_issue"
                        size="sm"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Legal issue"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter Legal issue
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Other Activity</Form.Label>
                      <Form.Control
                        name="other_activity"
                        size="sm"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Other Activity"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter Other Activity
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Driving Licence No</Form.Label>
                      <Form.Control
                        name="driving_licence_no"
                        size="sm"
                        pattern="[A-Z]{2}[0-9]{13}"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Driving Licence No"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter Driving Licence No
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Aadhar No</Form.Label>
                      <Form.Control
                        name="aadhar_no"
                        size="sm"
                        type="number"
                        pattern="[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"
                        autoComplete="off"
                        max="999999999999"
                        min="100000000000"
                        placeholder="Enter Aadhar No"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter Aadhar No
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>PAN No</Form.Label>
                      <Form.Control
                        name="pan_no"
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        size="sm"
                        type="text"
                        autoComplete="off"
                        minLength="10"
                        placeholder="Enter PAN No"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter PAN No
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
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
                  {photo?.base64 && (
                    <div className="col-md-4">
                      <Image style={{ height: "60px" }} src={photo?.base64} />
                    </div>
                  )}
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Emergency Contact Number</Form.Label>
                      <Form.Control
                        name="emergency_no"
                        size="sm"
                        type="text"
                        autoComplete="off"
                        onKeyPress={validatePhoneOnPress}
                        onKeyDown={disableUpDownArrow}
                        placeholder="Enter emergency contact number"
                        min="100000000"
                        max="99999999999999"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter emergency contact number
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  {dynamicItem.map((data) =>
                    data.section_title === "Personal Information" ? (
                      <>
                        {" "}
                        {!data.field_data && (
                          <Card.Body className="p-5"></Card.Body>
                        )}
                        {data.field_data &&
                          data.field_data.map((sub) => {
                            switch (sub.input_type) {
                              case "textarea":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group id= "form_feedback">
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        as={sub.input_type}
                                        autoComplete="off"
                                        maxlength={sub.maxlength}
                                        minlength={sub.minlength}
                                        pattern={sub.pattern}
                                        required={sub.is_required}
                                        placeholder={sub.label_name}
                                        onChange={handleTextArea(
                                          sub.pattern,
                                          sub.label_name
                                        )}
                                      />
                                      {sub.input_type == "textarea" &&
                                        sub.pattern && (
                                          <p style={{ color: "Blue" }}>
                                            use pattern {sub.pattern}
                                          </p>
                                        )}
                                      <Form.Control.Feedback type="invalid">
                                        Please enter{" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                           character between {sub.minlength} and{" "}
                                            {sub.maxlength}{" "}
                                          </span>
                                        )}
                                        {!sub.maxlength && sub.minlength && (
                                          <span>
                                            minimum {sub.minlength} character
                                          </span>
                                        )}
                                        {sub.maxlength && !sub.minlength && (
                                          <span>
                                            maximum {sub.maxlength} character
                                          </span>
                                        )}
                                        
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              case "text":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        type={sub.input_type}
                                        autoComplete="off"
                                        placeholder={sub.label_name}
                                        required={sub.is_required}
                                        maxLength={sub.maxlength}
                                        minLength={sub.minlength}
                                        pattern={sub.pattern}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please enter {" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                           character between {sub.minlength} and{" "}
                                            {sub.maxlength}{" "}
                                          </span>
                                        )}
                                        {!sub.maxlength && sub.minlength && (
                                          <span>
                                            minimum {sub.minlength} character
                                          </span>
                                        )}
                                        {sub.maxlength && !sub.minlength && (
                                          <span>
                                            maximum {sub.maxlength} character
                                          </span>
                                        )}
                                        {sub.pattern && (
                                          <span>
                                            with pattern {sub.pattern}
                                          </span>
                                        )}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              case "select":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Select
                                        className="basic-single tele-drop"
                                        classNamePrefix="select"
                                        name={sub.label_name}
                                        closeMenuOnSelect={true}
                                        placeholder={"select"}
                                        isSearchable={sub.is_searchable}
                                        getOptionLabel={(option) =>
                                          option.value
                                        }
                                        getOptionValue={(option) =>
                                          option.value
                                        }
                                        options={sub.values}
                                      />
                                    </Form.Group>
                                  </div>
                                );
                              case "number":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}{" "}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        type={sub.input_type}
                                        autoComplete="off"
                                        placeholder={sub.label_name}
                                        required={sub.is_required}
                                        max={sub.maxvalue}
                                        min={sub.minvalue}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please Enter value{" "}
                                        {sub.minvalue && sub.maxvalue && (
                                          <span>
                                            between: {sub.minvalue} and{" "}
                                            {sub.maxvalue}
                                          </span>
                                        )}
                                        {sub.minvalue && !sub.maxvalue && (
                                          <span>
                                            greater than {sub.minvalue}
                                          </span>
                                        )}
                                        {!sub.minvalue && sub.maxvalue && (
                                          <span>less than {sub.maxvalue}</span>
                                        )}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              default:
                                return (
                                  <div className="col-md-3">
                                    <Form.Group>
                                      <Form.Label style={{ display: "block" }}>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      {sub.input_type == "datepicker" ? (
                                        <Form.Control
                                          name={sub.label_name}
                                          size="sm"
                                          type="date"
                                          autoComplete="off"
                                          placeholder={sub.label_name}
                                          required={sub.is_required}
                                        />
                                      ) : sub.input_type == "checkbox" ? (
                                        sub.values.map((value) => {
                                          return (
                                            <Form.Check
                                              inline
                                              type="checkbox"
                                              label={value.value}
                                              value={value.value}
                                              onChange={handlecheck(
                                                data.section_title,
                                                sub.label_name
                                              )}
                                            />
                                          );
                                        })
                                      ) : (
                                        sub.values.map((value) => {
                                          return (
                                            <Form.Check
                                              inline
                                              name={sub.label_name}
                                              label={value.value}
                                              type={sub.input_type}
                                              required={sub.is_required}
                                              value={value.value}
                                            />
                                          );
                                        })
                                      )}

                                      <Form.Control.Feedback type="invalid">
                                        This is required field
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                            }
                          })}
                      </>
                    ) : null
                  )}
                </div>
              </Card.Body>
            </Card>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3">Contact Information</Card.Header>
              <Card.Body className="p-3">
                <div className="row">
                  <div className="col-md-4">
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
                  <div className="col-md-4">
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
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Landmark</Form.Label>
                      <Form.Control
                        name="landmark"
                        size="sm"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter landmark"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter landmark
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
                      <Form.Label>Pincode</Form.Label>
                      {selectedCountry === 101 &&
                      states.length !== 0 &&
                      cities.length != 0 &&
                      postCodes.length !== 0 ? (
                        <Select
                          ref={selectInputRefPostCode}
                          className="basic-single tele-drop"
                          classNamePrefix="select"
                          name="pincode"
                          closeMenuOnSelect={true}
                          placeholder={"Enter pincode"}
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

                  {dynamicItem.map((data) =>
                    data.section_title === "Contact Information" ? (
                      <>
                        {" "}
                        {!data.field_data && (
                          <Card.Body className="p-5"></Card.Body>
                        )}
                        {data.field_data &&
                          data.field_data.map((sub) => {
                            switch (sub.input_type) {
                              case "textarea":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group id= "form_feedback">
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        as={sub.input_type}
                                        autoComplete="off"
                                        maxlength={sub.maxlength}
                                        minlength={sub.minlength}
                                        pattern={sub.pattern}
                                        required={sub.is_required}
                                        placeholder={sub.label_name}
                                        onChange={handleTextArea(
                                          sub.pattern,
                                          sub.label_name
                                        )}
                                      />
                                      {sub.input_type == "textarea" &&
                                        sub.pattern && (
                                          <p style={{ color: "Blue" }}>
                                            use pattern {sub.pattern}
                                          </p>
                                        )}
                                      <Form.Control.Feedback type="invalid">
                                        Please enter{" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                            character between {sub.minlength} and{" "}
                                            {sub.maxlength}{" "}
                                          </span>
                                        )}
                                        {!sub.maxlength && sub.minlength && (
                                          <span>
                                            minimum {sub.minlength} character
                                          </span>
                                        )}
                                        {sub.maxlength && !sub.minlength && (
                                          <span>
                                            maximum {sub.maxlength} character
                                          </span>
                                        )}
                                        
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              case "text":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        type={sub.input_type}
                                        autoComplete="off"
                                        placeholder={sub.label_name}
                                        required={sub.is_required}
                                        maxLength={sub.maxlength}
                                        minLength={sub.minlength}
                                        pattern={sub.pattern}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please enter {" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                            character between {sub.minlength} and{" "}
                                            {sub.maxlength}{" "}
                                          </span>
                                        )}
                                        {!sub.maxlength && sub.minlength && (
                                          <span>
                                            minimum {sub.minlength} character
                                          </span>
                                        )}
                                        {sub.maxlength && !sub.minlength && (
                                          <span>
                                            maximum {sub.maxlength} character
                                          </span>
                                        )}
                                        {sub.pattern && (
                                          <span>
                                            with pattern {sub.pattern}
                                          </span>
                                        )}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              case "select":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Select
                                        className="basic-single tele-drop"
                                        classNamePrefix="select"
                                        name={sub.label_name}
                                        closeMenuOnSelect={true}
                                        placeholder={"select"}
                                        isSearchable={sub.is_searchable}
                                        getOptionLabel={(option) =>
                                          option.value
                                        }
                                        getOptionValue={(option) =>
                                          option.value
                                        }
                                        options={sub.values}
                                      />
                                    </Form.Group>
                                  </div>
                                );
                              case "number":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}{" "}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        type={sub.input_type}
                                        autoComplete="off"
                                        placeholder={sub.label_name}
                                        required={sub.is_required}
                                        max={sub.maxvalue}
                                        min={sub.minvalue}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please Enter value{" "}
                                        {sub.minvalue && sub.maxvalue && (
                                          <span>
                                            between: {sub.minvalue} and{" "}
                                            {sub.maxvalue}
                                          </span>
                                        )}
                                        {sub.minvalue && !sub.maxvalue && (
                                          <span>
                                            greater than {sub.minvalue}
                                          </span>
                                        )}
                                        {!sub.minvalue && sub.maxvalue && (
                                          <span>less than {sub.maxvalue}</span>
                                        )}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              default:
                                return (
                                  <div className="col-md-3">
                                    <Form.Group>
                                      <Form.Label style={{ display: "block" }}>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      {sub.input_type == "datepicker" ? (
                                        <Form.Control
                                          name={sub.label_name}
                                          size="sm"
                                          type="date"
                                          autoComplete="off"
                                          placeholder={sub.label_name}
                                          required={sub.is_required}
                                        />
                                      ) : sub.input_type == "checkbox" ? (
                                        sub.values.map((value) => {
                                          return (
                                            <Form.Check
                                              inline
                                              type="checkbox"
                                              label={value.value}
                                              value={value.value}
                                              onChange={handlecheck(
                                                data.section_title,
                                                sub.label_name
                                              )}
                                            />
                                          );
                                        })
                                      ) : (
                                        sub.values.map((value) => {
                                          return (
                                            <Form.Check
                                              inline
                                              name={sub.label_name}
                                              label={value.value}
                                              type={sub.input_type}
                                              required={sub.is_required}
                                              value={value.value}
                                            />
                                          );
                                        })
                                      )}

                                      <Form.Control.Feedback type="invalid">
                                        This is required field
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                            }
                          })}
                      </>
                    ) : null
                  )}
                </div>
              </Card.Body>
            </Card>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3">Role Information</Card.Header>
              <Card.Body className="p-3">
                <div className="row">
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>
                        Role<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        name="roles"
                        as="select"
                        autoComplete="off"
                        placeholder="Select Role"
                        required
                      >
                        <option value="">Select role</option>
                        {roles.map((i) => (
                          <option value={i.id} key={"r" + i.id}>
                            {i.name}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Please select role
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  {dynamicItem.map((data) =>
                    data.section_title === "Role Information" ? (
                      <>
                        {" "}
                        {!data.field_data && (
                          <Card.Body className="p-5"></Card.Body>
                        )}
                        {data.field_data &&
                          data.field_data.map((sub) => {
                            switch (sub.input_type) {
                              case "textarea":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group id= "form_feedback">
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        as={sub.input_type}
                                        autoComplete="off"
                                        maxlength={sub.maxlength}
                                        minlength={sub.minlength}
                                        pattern={sub.pattern}
                                        required={sub.is_required}
                                        placeholder={sub.label_name}
                                        onChange={handleTextArea(
                                          sub.pattern,
                                          sub.label_name
                                        )}
                                      />
                                      {sub.input_type == "textarea" &&
                                        sub.pattern && (
                                          <p style={{ color: "Blue" }}>
                                            use pattern {sub.pattern}
                                          </p>
                                        )}
                                      <Form.Control.Feedback type="invalid">
                                        Please enter{" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                           character between {sub.minlength} and{" "}
                                            {sub.maxlength}{" "}
                                          </span>
                                        )}
                                        {!sub.maxlength && sub.minlength && (
                                          <span>
                                            minimum {sub.minlength} character
                                          </span>
                                        )}
                                        {sub.maxlength && !sub.minlength && (
                                          <span>
                                            maximum {sub.maxlength} character
                                          </span>
                                        )}
                                        
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              case "text":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        type={sub.input_type}
                                        autoComplete="off"
                                        placeholder={sub.label_name}
                                        required={sub.is_required}
                                        maxLength={sub.maxlength}
                                        minLength={sub.minlength}
                                        pattern={sub.pattern}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please enter {" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                           character between {sub.minlength} and{" "}
                                            {sub.maxlength}{" "}
                                          </span>
                                        )}
                                        {!sub.maxlength && sub.minlength && (
                                          <span>
                                            minimum {sub.minlength} character
                                          </span>
                                        )}
                                        {sub.maxlength && !sub.minlength && (
                                          <span>
                                            maximum {sub.maxlength} character
                                          </span>
                                        )}
                                        {sub.pattern && (
                                          <span>
                                            with pattern {sub.pattern}
                                          </span>
                                        )}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              case "select":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Select
                                        className="basic-single tele-drop"
                                        classNamePrefix="select"
                                        name={sub.label_name}
                                        closeMenuOnSelect={true}
                                        placeholder={"select"}
                                        isSearchable={sub.is_searchable}
                                        getOptionLabel={(option) =>
                                          option.value
                                        }
                                        getOptionValue={(option) =>
                                          option.value
                                        }
                                        options={sub.values}
                                      />
                                    </Form.Group>
                                  </div>
                                );
                              case "number":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}{" "}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        type={sub.input_type}
                                        autoComplete="off"
                                        placeholder={sub.label_name}
                                        required={sub.is_required}
                                        max={sub.maxvalue}
                                        min={sub.minvalue}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please Enter value{" "}
                                        {sub.minvalue && sub.maxvalue && (
                                          <span>
                                            between: {sub.minvalue} and{" "}
                                            {sub.maxvalue}
                                          </span>
                                        )}
                                        {sub.minvalue && !sub.maxvalue && (
                                          <span>
                                            greater than {sub.minvalue}
                                          </span>
                                        )}
                                        {!sub.minvalue && sub.maxvalue && (
                                          <span>less than {sub.maxvalue}</span>
                                        )}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              default:
                                return (
                                  <div className="col-md-3">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      {sub.input_type == "datepicker" ? (
                                        <Form.Control
                                          name={sub.label_name}
                                          size="sm"
                                          type="date"
                                          autoComplete="off"
                                          placeholder={sub.label_name}
                                          required={sub.is_required}
                                        />
                                      ) : sub.input_type == "checkbox" ? (
                                        sub.values.map((value) => {
                                          return (
                                            <Form.Check
                                              inline
                                              type="checkbox"
                                              label={value.value}
                                              value={value.value}
                                              onChange={handlecheck(
                                                data.section_title,
                                                sub.label_name
                                              )}
                                            />
                                          );
                                        })
                                      ) : (
                                        sub.values.map((value) => {
                                          return (
                                            <Form.Check
                                              inline
                                              name={sub.label_name}
                                              label={value.value}
                                              type={sub.input_type}
                                              required={sub.is_required}
                                              value={value.value}
                                            />
                                          );
                                        })
                                      )}

                                      <Form.Control.Feedback type="invalid">
                                        This is required field
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                            }
                          })}
                      </>
                    ) : null
                  )}
                </div>
              </Card.Body>
            </Card>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3">Education Details</Card.Header>
              <Card.Body className="p-3">
                {educationState.map((education, i) => {
                  //educationState && educationState != null &&
                  return (
                    <div className="row">
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>High School</Form.Label>
                          <Form.Control
                            name="highschool"
                            value={education.highschool}
                            onChange={(e) => handleEducation(e, i)}
                            size="sm"
                            type="text"
                            placeholder="Please Enter High School"
                            autoComplete="off"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please Enter High School
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Gradute</Form.Label>
                          <Form.Control
                            name="gradute"
                            value={education.gradute}
                            onChange={(e) => handleEducation(e, i)}
                            size="sm"
                            type="text"
                            placeholder="Please Enter Gradute"
                            autoComplete="off"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please Enter Gradute
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Post Gradute</Form.Label>
                          <Form.Control
                            name="postgradute"
                            value={education.postgradute}
                            onChange={(e) => handleEducation(e, i)}
                            size="sm"
                            type="text"
                            placeholder="Please Enter Gradute"
                            autoComplete="off"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please Enter Gradute
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Other</Form.Label>
                          <Form.Control
                            name="other"
                            value={education.other}
                            onChange={(e) => handleEducation(e, i)}
                            size="sm"
                            type="text"
                            placeholder="Please Enter Other Details"
                            autoComplete="off"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please Enter Other Details
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Special Skills & Training</Form.Label>
                          <Form.Control
                            name="specialskill"
                            value={education.specialskill}
                            onChange={(e) => handleEducation(e, i)}
                            size="sm"
                            type="text"
                            placeholder="Please Enter Special Skills & Training"
                            autoComplete="off"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please Enter Special Skill & Training
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Education Details" ? (
                          <>
                            {" "}
                            {!data.field_data && (
                              <Card.Body className="p-5"></Card.Body>
                            )}
                            {data.field_data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group id= "form_feedback">
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            as={sub.input_type}
                                            autoComplete="off"
                                            maxlength={sub.maxlength}
                                            minlength={sub.minlength}
                                            pattern={sub.pattern}
                                            required={sub.is_required}
                                            placeholder={sub.label_name}
                                            onChange={handleTextArea(
                                              sub.pattern,
                                              sub.label_name
                                            )}
                                          />
                                          {sub.input_type == "textarea" &&
                                            sub.pattern && (
                                              <p style={{ color: "Blue" }}>
                                                use pattern {sub.pattern}
                                              </p>
                                            )}
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                                character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "text":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            maxLength={sub.maxlength}
                                            minLength={sub.minlength}
                                            pattern={sub.pattern}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                                character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.pattern && (
                                              <span>
                                                with pattern {sub.pattern}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "select":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Select
                                            className="basic-single tele-drop"
                                            classNamePrefix="select"
                                            name={sub.label_name}
                                            closeMenuOnSelect={true}
                                            placeholder={"select"}
                                            isSearchable={sub.is_searchable}
                                            getOptionLabel={(option) =>
                                              option.value
                                            }
                                            getOptionValue={(option) =>
                                              option.value
                                            }
                                            options={sub.values}
                                          />
                                        </Form.Group>
                                      </div>
                                    );
                                  case "number":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}{" "}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            max={sub.maxvalue}
                                            min={sub.minvalue}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please Enter value{" "}
                                            {sub.minvalue && sub.maxvalue && (
                                              <span>
                                                between: {sub.minvalue} and{" "}
                                                {sub.maxvalue}
                                              </span>
                                            )}
                                            {sub.minvalue && !sub.maxvalue && (
                                              <span>
                                                greater than {sub.minvalue}
                                              </span>
                                            )}
                                            {!sub.minvalue && sub.maxvalue && (
                                              <span>
                                                less than {sub.maxvalue}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  default:
                                    return (
                                      <div className="col-md-3">
                                        <Form.Group>
                                          <Form.Label
                                            style={{ display: "block" }}
                                          >
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          {sub.input_type == "datepicker" ? (
                                            <Form.Control
                                              name={sub.label_name}
                                              size="sm"
                                              type="date"
                                              autoComplete="off"
                                              placeholder={sub.label_name}
                                              required={sub.is_required}
                                            />
                                          ) : sub.input_type == "checkbox" ? (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  type="checkbox"
                                                  label={value.value}
                                                  value={value.value}
                                                  onChange={handlecheck(
                                                    data.section_title,
                                                    sub.label_name
                                                  )}
                                                />
                                              );
                                            })
                                          ) : (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  name={sub.label_name}
                                                  label={value.value}
                                                  type={sub.input_type}
                                                  required={sub.is_required}
                                                  value={value.value}
                                                />
                                              );
                                            })
                                          )}

                                          <Form.Control.Feedback type="invalid">
                                            This is required field
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                }
                              })}
                          </>
                        ) : null
                      )}
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3">
                Family Details
                <Button
                  style={{ float: "right" }}
                  onClick={handleAddMember}
                  className="rk-add-btn"
                >
                  <AddIcon />
                  Add Member
                </Button>
              </Card.Header>
              <Card.Body className="p-3">
                {familyState.map((familymem, i) => {
                  return (
                    <div>
                      {i !== 0 && <hr style={{ marginBottom: "2rem" }} />}
                      <div className="row" key="family_{k=i+1}">
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Family Member Name</Form.Label>
                            <Form.Control
                              value={familymem.family_member_name}
                              name="family_member_name"
                              onChange={(e) => handleFamily(e, i)}
                              size="sm"
                              type="text"
                              placeholder="Please Enter Family Member Name"
                              autoComplete="off"
                              onKeyPress={(e) => charText(e)}
                            />
                            <Form.Control.Feedback type="invalid">
                              Please Enter Family Member Name
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Relation</Form.Label>
                            <Form.Control
                              size="sm"
                              value={familymem.relation}
                              name="relation"
                              onChange={(e) => handleFamily(e, i)}
                              as="select"
                              autoComplete="off"
                              placeholder="Select Relation"
                            >
                              <option value="">Select Relation</option>
                              <option value="F">Father</option>
                              <option value="M">Mother</option>
                              <option value="H">Husband</option>
                              <option value="W">Wife</option>
                              <option value="D">Daughter</option>
                              <option value="S">Son</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              Please Select Relation
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>

                        <div className="col-md-3">
                          <Form.Group>
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                              name="memberdob"
                              value={familymem.memberdob}
                              onChange={(e) => handleFamily(e, i)}
                              size="sm"
                              type="date"
                              placeholder="Please Enter Date of Birth"
                              max={formatDate(new Date())}
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please Enter Date of Birth
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div className="col-md-1" style={{ marginTop: "26px" }}>
                          <Button
                            onClick={() => handleRemoveMember(i)}
                            className="rk-add-btn"
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Education</Form.Label>
                            <Form.Control
                              name="education"
                              value={familymem.education}
                              onChange={(e) => handleFamily(e, i)}
                              size="sm"
                              type="text"
                              placeholder="Please Enter Education"
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please Enter Education
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Occupation</Form.Label>
                            <Form.Control
                              name="occupation"
                              value={familymem.occupation}
                              onChange={(e) => handleFamily(e, i)}
                              size="sm"
                              type="text"
                              placeholder="Please Enter Occupation"
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please Enter Occupation
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Family Details" ? (
                          <>
                            {" "}
                            {!data.field_data && (
                              <Card.Body className="p-5"></Card.Body>
                            )}
                            {data.field_data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group id= "form_feedback">
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            as={sub.input_type}
                                            autoComplete="off"
                                            maxlength={sub.maxlength}
                                            minlength={sub.minlength}
                                            pattern={sub.pattern}
                                            required={sub.is_required}
                                            placeholder={sub.label_name}
                                            onChange={handleTextArea(
                                              sub.pattern,
                                              sub.label_name
                                            )}
                                          />
                                          {sub.input_type == "textarea" &&
                                            sub.pattern && (
                                              <p style={{ color: "Blue" }}>
                                                use pattern {sub.pattern}
                                              </p>
                                            )}
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                               character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "text":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            maxLength={sub.maxlength}
                                            minLength={sub.minlength}
                                            pattern={sub.pattern}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                                character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.pattern && (
                                              <span>
                                                with pattern {sub.pattern}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "select":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Select
                                            className="basic-single tele-drop"
                                            classNamePrefix="select"
                                            name={sub.label_name}
                                            closeMenuOnSelect={true}
                                            placeholder={"select"}
                                            isSearchable={sub.is_searchable}
                                            getOptionLabel={(option) =>
                                              option.value
                                            }
                                            getOptionValue={(option) =>
                                              option.value
                                            }
                                            options={sub.values}
                                          />
                                        </Form.Group>
                                      </div>
                                    );
                                  case "number":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}{" "}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            max={sub.maxvalue}
                                            min={sub.minvalue}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please Enter value{" "}
                                            {sub.minvalue && sub.maxvalue && (
                                              <span>
                                                between: {sub.minvalue} and{" "}
                                                {sub.maxvalue}
                                              </span>
                                            )}
                                            {sub.minvalue && !sub.maxvalue && (
                                              <span>
                                                greater than {sub.minvalue}
                                              </span>
                                            )}
                                            {!sub.minvalue && sub.maxvalue && (
                                              <span>
                                                less than {sub.maxvalue}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  default:
                                    return (
                                      <div className="col-md-3">
                                        <Form.Group>
                                          <Form.Label
                                            style={{ display: "block" }}
                                          >
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          {sub.input_type == "datepicker" ? (
                                            <Form.Control
                                              name={sub.label_name}
                                              size="sm"
                                              type="date"
                                              autoComplete="off"
                                              placeholder={sub.label_name}
                                              required={sub.is_required}
                                            />
                                          ) : sub.input_type == "checkbox" ? (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  type="checkbox"
                                                  label={value.value}
                                                  value={value.value}
                                                  onChange={handlecheck(
                                                    data.section_title,
                                                    sub.label_name
                                                  )}
                                                />
                                              );
                                            })
                                          ) : (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  name={sub.label_name}
                                                  label={value.value}
                                                  type={sub.input_type}
                                                  required={sub.is_required}
                                                  value={value.value}
                                                />
                                              );
                                            })
                                          )}

                                          <Form.Control.Feedback type="invalid">
                                            This is required field
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                }
                              })}
                          </>
                        ) : null
                      )}
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3">
                Previous Employer Details
                <Button
                  style={{ float: "right" }}
                  onClick={handleAddemployer}
                  className="rk-add-btn"
                >
                  <AddIcon />
                  Add More Employer Details
                </Button>
              </Card.Header>
              <Card.Body className="p-3">
                {employerState.map((employeemem, i) => {
                  return (
                    <div>
                      {i !== 0 && <hr style={{ marginBottom: "2rem" }} />}

                      <div className="row" key="employer_{i}">
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Employer</Form.Label>
                            <Form.Control
                              name="employer"
                              value={employeemem.employer}
                              onChange={(e) => handleEmplyee(e, i)}
                              size="sm"
                              type="text"
                              placeholder="Please Enter Employer"
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter Employer
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              name="employercity"
                              value={employeemem.employercity}
                              onChange={(e) => handleEmplyee(e, i)}
                              size="sm"
                              type="text"
                              placeholder="Please enter City"
                              onKeyPress={(e) => charText(e)}
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter city
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div className="col-md-2">
                          <Form.Group>
                            <Form.Label>Contact Name</Form.Label>
                            <Form.Control
                              name="contactname"
                              value={employeemem.contactname}
                              onChange={(e) => handleEmplyee(e, i)}
                              size="sm"
                              type="text"
                              placeholder="Please enter Contact Name"
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter Contact Name
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div className="col-md-1" style={{ marginTop: "26px" }}>
                          <Button
                            onClick={() => handleRemoveemployer(i)}
                            className="rk-add-btn"
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                              name="contactnumber"
                              value={employeemem.contactnumber}
                              onChange={(e) => handleEmplyee(e, i)}
                              size="sm"
                              type="number"
                              minLength="10"
                              onKeyPress={validatePhoneOnPress}
                              onKeyDown={disableUpDownArrow}
                              placeholder="Please enter Contact Number"
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter Contact Number
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Employment Period</Form.Label>
                            <Form.Control
                              name="employmentperiod"
                              value={employeemem.employmentperiod}
                              onChange={(e) => handleEmplyee(e, i)}
                              size="sm"
                              type="text"
                              placeholder="Please enter Employment Period"
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter Employment Period
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Reason For Leaving</Form.Label>
                            <Form.Control
                              name="reasonleave"
                              value={employeemem.reasonleave}
                              onChange={(e) => handleEmplyee(e, i)}
                              size="sm"
                              as="textarea"
                              type="text"
                              placeholder="Please enter Employment Period"
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter Employment Period
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Previous Employer Details" ? (
                          <>
                            {" "}
                            {!data.field_data && (
                              <Card.Body className="p-5"></Card.Body>
                            )}
                            {data.field_data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group id= "form_feedback">
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type="textarea"
                                            as={sub.input_type}
                                            autoComplete="off"
                                            maxlength={sub.maxlength}
                                            minlength={sub.minlength}
                                            pattern={sub.pattern}
                                            required={sub.is_required}
                                            placeholder={sub.label_name}
                                            onChange={handleTextArea(
                                              sub.pattern,
                                              sub.label_name
                                            )}
                                          />
                                          {sub.input_type == "textarea" &&
                                            sub.pattern && (
                                              <p style={{ color: "Blue" }}>
                                                use pattern {sub.pattern}
                                              </p>
                                            )}
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                               character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "text":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            maxLength={sub.maxlength}
                                            minLength={sub.minlength}
                                            pattern={sub.pattern}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                               character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.pattern && (
                                              <span>
                                                with pattern {sub.pattern}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "select":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Select
                                            className="basic-single tele-drop"
                                            classNamePrefix="select"
                                            name={sub.label_name}
                                            closeMenuOnSelect={true}
                                            placeholder={"select"}
                                            isSearchable={sub.is_searchable}
                                            getOptionLabel={(option) =>
                                              option.value
                                            }
                                            getOptionValue={(option) =>
                                              option.value
                                            }
                                            options={sub.values}
                                          />
                                        </Form.Group>
                                      </div>
                                    );
                                  case "number":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}{" "}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            max={sub.maxvalue}
                                            min={sub.minvalue}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please Enter value{" "}
                                            {sub.minvalue && sub.maxvalue && (
                                              <span>
                                                between: {sub.minvalue} and{" "}
                                                {sub.maxvalue}
                                              </span>
                                            )}
                                            {sub.minvalue && !sub.maxvalue && (
                                              <span>
                                                greater than {sub.minvalue}
                                              </span>
                                            )}
                                            {!sub.minvalue && sub.maxvalue && (
                                              <span>
                                                less than {sub.maxvalue}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  default:
                                    return (
                                      <div className="col-md-3">
                                        <Form.Group>
                                          <Form.Label
                                            style={{ display: "block" }}
                                          >
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          {sub.input_type == "datepicker" ? (
                                            <Form.Control
                                              name={sub.label_name}
                                              size="sm"
                                              type="date"
                                              autoComplete="off"
                                              placeholder={sub.label_name}
                                              required={sub.is_required}
                                            />
                                          ) : sub.input_type == "checkbox" ? (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  type="checkbox"
                                                  label={value.value}
                                                  value={value.value}
                                                  onChange={handlecheck(
                                                    data.section_title,
                                                    sub.label_name
                                                  )}
                                                />
                                              );
                                            })
                                          ) : (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  name={sub.label_name}
                                                  label={value.value}
                                                  type={sub.input_type}
                                                  required={sub.is_required}
                                                  value={value.value}
                                                />
                                              );
                                            })
                                          )}

                                          <Form.Control.Feedback type="invalid">
                                            This is required field
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                }
                              })}
                          </>
                        ) : null
                      )}
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3">Job Detail</Card.Header>
              <Card.Body className="p-3">
                {jobState.map((jobhistory, i) => {
                  return (
                    <div className="row" key="job_{k=i+1}">
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Joining Date</Form.Label>
                          <Form.Control
                            name="date"
                            value={jobhistory.date}
                            size="sm"
                            onChange={(e) => handleJob(e, i)}
                            type="date"
                            max={formatDate(new Date())}
                            autoComplete="off"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please enter joining date
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Position</Form.Label>
                          <Form.Control
                            name="position"
                            value={jobhistory.position}
                            onChange={(e) => handleJob(e, i)}
                            size="sm"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter Position"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please enter position
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Level</Form.Label>
                          <Form.Control
                            name="level"
                            value={jobhistory.level}
                            onChange={(e) => handleJob(e, i)}
                            size="sm"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter Level"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please enter level
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Reporting To</Form.Label>
                          <Form.Control
                            name="reporting"
                            value={jobhistory.reporting}
                            onChange={(e) => handleJob(e, i)}
                            size="sm"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter Reporting To"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please Reporting To
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Job detail" ? (
                          <>
                            {" "}
                            {!data.field_data && (
                              <Card.Body className="p-5"></Card.Body>
                            )}
                            {data.field_data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group id= "form_feedback">
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type="textarea"
                                            as={sub.input_type}
                                            autoComplete="off"
                                            maxlength={sub.maxlength}
                                            minlength={sub.minlength}
                                            pattern={sub.pattern}
                                            required={sub.is_required}
                                            placeholder={sub.label_name}
                                            onChange={handleTextArea(
                                              sub.pattern,
                                              sub.label_name
                                            )}
                                          />
                                          {sub.input_type == "textarea" &&
                                            sub.pattern && (
                                              <p style={{ color: "Blue" }}>
                                                use pattern {sub.pattern}
                                              </p>
                                            )}
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                               character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "text":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            maxLength={sub.maxlength}
                                            minLength={sub.minlength}
                                            pattern={sub.pattern}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                                character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.pattern && (
                                              <span>
                                                with pattern {sub.pattern}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "select":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Select
                                            className="basic-single tele-drop"
                                            classNamePrefix="select"
                                            name={sub.label_name}
                                            closeMenuOnSelect={true}
                                            placeholder={"select"}
                                            isSearchable={sub.is_searchable}
                                            getOptionLabel={(option) =>
                                              option.value
                                            }
                                            getOptionValue={(option) =>
                                              option.value
                                            }
                                            options={sub.values}
                                          />
                                        </Form.Group>
                                      </div>
                                    );
                                  case "number":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}{" "}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            max={sub.maxvalue}
                                            min={sub.minvalue}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please Enter value{" "}
                                            {sub.minvalue && sub.maxvalue && (
                                              <span>
                                                between: {sub.minvalue} and{" "}
                                                {sub.maxvalue}
                                              </span>
                                            )}
                                            {sub.minvalue && !sub.maxvalue && (
                                              <span>
                                                greater than {sub.minvalue}
                                              </span>
                                            )}
                                            {!sub.minvalue && sub.maxvalue && (
                                              <span>
                                                less than {sub.maxvalue}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  default:
                                    return (
                                      <div className="col-md-3">
                                        <Form.Group>
                                          <Form.Label
                                            style={{ display: "block" }}
                                          >
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          {sub.input_type == "datepicker" ? (
                                            <Form.Control
                                              name={sub.label_name}
                                              size="sm"
                                              type="date"
                                              autoComplete="off"
                                              placeholder={sub.label_name}
                                              required={sub.is_required}
                                            />
                                          ) : sub.input_type == "checkbox" ? (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  type="checkbox"
                                                  label={value.value}
                                                  value={value.value}
                                                  onChange={handlecheck(
                                                    data.section_title,
                                                    sub.label_name
                                                  )}
                                                />
                                              );
                                            })
                                          ) : (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  name={sub.label_name}
                                                  label={value.value}
                                                  type={sub.input_type}
                                                  required={sub.is_required}
                                                  value={value.value}
                                                />
                                              );
                                            })
                                          )}

                                          <Form.Control.Feedback type="invalid">
                                            This is required field
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                }
                              })}
                          </>
                        ) : null
                      )}
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3">Bank Details</Card.Header>
              <Card.Body className="p-3">
                {bankState.map((bank, i) => {
                  //bankState && bankState != null &&
                  return (
                    <div className="row">
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Bank Name</Form.Label>
                          <Form.Control
                            name="bank_name"
                            value={bank.bank_name}
                            onChange={(e) => handleBank(e, i)}
                            size="sm"
                            type="text"
                            autoComplete="off"
                            placeholder="Enter Bank Name"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please enter Bank Name
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Account Number</Form.Label>
                          <Form.Control
                            name="accountnumber"
                            value={bank.accountnumber}
                            onChange={(e) => handleBank(e, i)}
                            size="sm"
                            type="number"
                            autoComplete="off"
                            placeholder="Enter Account Number"
                            min="100000000"
                            max="999999999999999999"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please Enter Account Number
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>IFSC Code</Form.Label>
                          <Form.Control
                            name="ifsc"
                            value={bank.ifsc}
                            onChange={(e) => handleBank(e, i)}
                            size="sm"
                            type="text"
                            autoComplete="off"
                            minlength="11"
                            maxLength="11"
                            placeholder="Enter IFSC Code"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please Enter IFSC Code
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Bank Details" ? (
                          <>
                            {" "}
                            {!data.field_data && (
                              <Card.Body className="p-5"></Card.Body>
                            )}
                            {data.field_data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group id= "form_feedback">
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            as={sub.input_type}
                                            autoComplete="off"
                                            maxlength={sub.maxlength}
                                            minlength={sub.minlength}
                                            pattern={sub.pattern}
                                            required={sub.is_required}
                                            placeholder={sub.label_name}
                                            onChange={handleTextArea(
                                              sub.pattern,
                                              sub.label_name
                                            )}
                                          />
                                          {sub.input_type == "textarea" &&
                                            sub.pattern && (
                                              <p style={{ color: "Blue" }}>
                                                use pattern {sub.pattern}
                                              </p>
                                            )}
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                                character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "text":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            maxLength={sub.maxlength}
                                            minLength={sub.minlength}
                                            pattern={sub.pattern}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please enter{" "}
                                            {sub.maxlength && sub.minlength && (
                                              <span>
                                                character between {sub.minlength} and{" "}
                                                {sub.maxlength}{" "}
                                              </span>
                                            )}
                                            {!sub.maxlength &&
                                              sub.minlength && (
                                                <span>
                                                  minimum {sub.minlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.maxlength &&
                                              !sub.minlength && (
                                                <span>
                                                  maximum {sub.maxlength}{" "}
                                                  character
                                                </span>
                                              )}
                                            {sub.pattern && (
                                              <span>
                                                with pattern {sub.pattern}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  case "select":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <Select
                                            className="basic-single tele-drop"
                                            classNamePrefix="select"
                                            name={sub.label_name}
                                            closeMenuOnSelect={true}
                                            placeholder={"select"}
                                            isSearchable={sub.is_searchable}
                                            getOptionLabel={(option) =>
                                              option.value
                                            }
                                            getOptionValue={(option) =>
                                              option.value
                                            }
                                            options={sub.values}
                                          />
                                        </Form.Group>
                                      </div>
                                    );
                                  case "number":
                                    return (
                                      <div className="col-md-4">
                                        <Form.Group>
                                          <Form.Label>
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}{" "}
                                          </Form.Label>
                                          <Form.Control
                                            name={sub.label_name}
                                            size="sm"
                                            type={sub.input_type}
                                            autoComplete="off"
                                            placeholder={sub.label_name}
                                            required={sub.is_required}
                                            max={sub.maxvalue}
                                            min={sub.minvalue}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            Please Enter value{" "}
                                            {sub.minvalue && sub.maxvalue && (
                                              <span>
                                                between: {sub.minvalue} and{" "}
                                                {sub.maxvalue}
                                              </span>
                                            )}
                                            {sub.minvalue && !sub.maxvalue && (
                                              <span>
                                                greater than {sub.minvalue}
                                              </span>
                                            )}
                                            {!sub.minvalue && sub.maxvalue && (
                                              <span>
                                                less than {sub.maxvalue}
                                              </span>
                                            )}
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                  default:
                                    return (
                                      <div className="col-md-3">
                                        <Form.Group>
                                          <Form.Label
                                            style={{ display: "block" }}
                                          >
                                            {sub.label_name}
                                            {sub.is_required ? (
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          {sub.input_type == "datepicker" ? (
                                            <Form.Control
                                              name={sub.label_name}
                                              size="sm"
                                              type="date"
                                              autoComplete="off"
                                              placeholder={sub.label_name}
                                              required={sub.is_required}
                                            />
                                          ) : sub.input_type == "checkbox" ? (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  type="checkbox"
                                                  label={value.value}
                                                  value={value.value}
                                                  onChange={handlecheck(
                                                    data.section_title,
                                                    sub.label_name
                                                  )}
                                                />
                                              );
                                            })
                                          ) : (
                                            sub.values.map((value) => {
                                              return (
                                                <Form.Check
                                                  inline
                                                  name={sub.label_name}
                                                  label={value.value}
                                                  type={sub.input_type}
                                                  required={sub.is_required}
                                                  value={value.value}
                                                />
                                              );
                                            })
                                          )}

                                          <Form.Control.Feedback type="invalid">
                                            This is required field
                                          </Form.Control.Feedback>
                                        </Form.Group>
                                      </div>
                                    );
                                }
                              })}
                          </>
                        ) : null
                      )}
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
            <Card className="rkcrm-card mb-5">
              <Card.Header className="p-3">
                Social Links Information
              </Card.Header>
              <Card.Body className="p-3">
                <div className="row">
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Facebook</Form.Label>
                      <Form.Control
                        name="facebook"
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
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Youtube</Form.Label>
                      <Form.Control
                        name="youtube"
                        size="sm"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter youtube url"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter youtube url
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  {dynamicItem.map((data) =>
                    data.section_title === "Social Links Information" ? (
                      <>
                        {" "}
                        {!data.field_data && (
                          <Card.Body className="p-5"></Card.Body>
                        )}
                        {data.field_data &&
                          data.field_data.map((sub) => {
                            switch (sub.input_type) {
                              case "textarea":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group id= "form_feedback">
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        as={sub.input_type}
                                        autoComplete="off"
                                        maxlength={sub.maxlength}
                                        minlength={sub.minlength}
                                        pattern={sub.pattern}
                                        required={sub.is_required}
                                        placeholder={sub.label_name}
                                        onChange={handleTextArea(
                                          sub.pattern,
                                          sub.label_name
                                        )}
                                      />
                                      {sub.input_type == "textarea" &&
                                        sub.pattern && (
                                          <p style={{ color: "Blue" }}>
                                            use pattern {sub.pattern}
                                          </p>
                                        )}
                                      <Form.Control.Feedback type="invalid">
                                        Please enter{" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                            character between {sub.minlength} and{" "}
                                            {sub.maxlength}{" "}
                                          </span>
                                        )}
                                        {!sub.maxlength && sub.minlength && (
                                          <span>
                                            minimum {sub.minlength} character
                                          </span>
                                        )}
                                        {sub.maxlength && !sub.minlength && (
                                          <span>
                                            maximum {sub.maxlength} character
                                          </span>
                                        )}
                                        
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              case "text":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        type={sub.input_type}
                                        autoComplete="off"
                                        placeholder={sub.label_name}
                                        required={sub.is_required}
                                        maxLength={sub.maxlength}
                                        minLength={sub.minlength}
                                        pattern={sub.pattern}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please enter{" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                            character between {sub.minlength} and{" "}
                                            {sub.maxlength}{" "}
                                          </span>
                                        )}
                                        {!sub.maxlength && sub.minlength && (
                                          <span>
                                            minimum {sub.minlength} character
                                          </span>
                                        )}
                                        {sub.maxlength && !sub.minlength && (
                                          <span>
                                            maximum {sub.maxlength} character
                                          </span>
                                        )}
                                        {sub.pattern && (
                                          <span>
                                            with pattern {sub.pattern}
                                          </span>
                                        )}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              case "select":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>

                                      <Select
                                        className="basic-single tele-drop"
                                        classNamePrefix="select"
                                        name={sub.label_name}
                                        closeMenuOnSelect={true}
                                        placeholder={"select"}
                                        isSearchable={sub.is_searchable}
                                        getOptionLabel={(option) =>
                                          option.value
                                        }
                                        getOptionValue={(option) =>
                                          option.value
                                        }
                                        options={sub.values}
                                      />
                                    </Form.Group>
                                  </div>
                                );
                              case "number":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}{" "}
                                      </Form.Label>
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        type={sub.input_type}
                                        autoComplete="off"
                                        placeholder={sub.label_name}
                                        required={sub.is_required}
                                        max={sub.maxvalue}
                                        min={sub.minvalue}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please Enter value{" "}
                                        {sub.minvalue && sub.maxvalue && (
                                          <span>
                                            between: {sub.minvalue} and{" "}
                                            {sub.maxvalue}
                                          </span>
                                        )}
                                        {sub.minvalue && !sub.maxvalue && (
                                          <span>
                                            greater than {sub.minvalue}
                                          </span>
                                        )}
                                        {!sub.minvalue && sub.maxvalue && (
                                          <span>less than {sub.maxvalue}</span>
                                        )}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                              default:
                                return (
                                  <div className="col-md-3">
                                    <Form.Group>
                                      <Form.Label style={{ display: "block" }}>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      {sub.input_type == "datepicker" ? (
                                        <Form.Control
                                          name={sub.label_name}
                                          size="sm"
                                          type="date"
                                          autoComplete="off"
                                          placeholder={sub.label_name}
                                          required={sub.is_required}
                                        />
                                      ) : sub.input_type == "checkbox" ? (
                                        sub.values.map((value) => {
                                          return (
                                            <Form.Check
                                              inline
                                              type="checkbox"
                                              label={value.value}
                                              value={value.value}
                                              onChange={handlecheck(
                                                data.section_title,
                                                sub.label_name
                                              )}
                                            />
                                          );
                                        })
                                      ) : (
                                        sub.values.map((value) => {
                                          return (
                                            <Form.Check
                                              inline
                                              name={sub.label_name}
                                              label={value.value}
                                              type={sub.input_type}
                                              required={sub.is_required}
                                              value={value.value}
                                            />
                                          );
                                        })
                                      )}

                                      <Form.Control.Feedback type="invalid">
                                        This is required field
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </div>
                                );
                            }
                          })}
                      </>
                    ) : null
                  )}
                </div>
              </Card.Body>
            </Card>
            {dynamicItem.map((data) =>
              !titles.includes(data.section_title) ? (
                <Card className="rkcrm-card mb-5">
                  <Card.Header className="p-3">
                    {data.section_title}
                  </Card.Header>
                  {!data.field_data && <Card.Body className="p-5"></Card.Body>}
                  {data.field_data &&
                    data.field_data.map((sub) => {
                      switch (sub.input_type) {
                        case "textarea":
                          return (
                            <Card.Body className="p-3">
                              <div className="row">
                                <div className="col-md-4">
                                  <Form.Group id= "form_feedback">
                                    <Form.Label>
                                      {sub.label_name}
                                      {sub.is_required ? (
                                        <span className="text-danger">*</span>
                                      ) : null}
                                    </Form.Label>
                                    <Form.Control
                                      name={sub.label_name}
                                      size="sm"
                                      as={sub.input_type}
                                      autoComplete="off"
                                      maxlength={sub.maxlength}
                                      minlength={sub.minlength}
                                      pattern={sub.pattern}
                                      required={sub.is_required}
                                      placeholder={sub.label_name}
                                      onChange={handleTextArea(
                                        sub.pattern,
                                        sub.label_name
                                      )}
                                    />
                                    {sub.input_type == "textarea" &&
                                      sub.pattern && (
                                        <p style={{ color: "Blue" }}>
                                          use pattern {sub.pattern}
                                        </p>
                                      )}
                                    <Form.Control.Feedback type="invalid">
                                      Please enter{" "}
                                      {sub.maxlength && sub.minlength && (
                                        <span>
                                          character between {sub.minlength} and{" "}
                                          {sub.maxlength}{" "}
                                        </span>
                                      )}
                                      {!sub.maxlength && sub.minlength && (
                                        <span>
                                          minimum {sub.minlength} character
                                        </span>
                                      )}
                                      {sub.maxlength && !sub.minlength && (
                                        <span>
                                          maximum {sub.maxlength} character
                                        </span>
                                      )}
                                     
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </div>
                              </div>
                            </Card.Body>
                          );
                        case "text":
                          return (
                            <Card.Body className="p-3">
                              <div className="row">
                                <div className="col-md-4">
                                  <Form.Group>
                                    <Form.Label>
                                      {sub.label_name}
                                      {sub.is_required ? (
                                        <span className="text-danger">*</span>
                                      ) : null}
                                    </Form.Label>
                                    <Form.Control
                                      name={sub.label_name}
                                      size="sm"
                                      type={sub.input_type}
                                      autoComplete="off"
                                      placeholder={sub.label_name}
                                      required={sub.is_required}
                                      maxLength={sub.maxlength}
                                      minLength={sub.minlength}
                                      pattern={sub.pattern}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      Please enter{" "}
                                      {sub.maxlength && sub.minlength && (
                                        <span>
                                         character between {sub.minlength} and{" "}
                                          {sub.maxlength}{" "}
                                        </span>
                                      )}
                                      {!sub.maxlength && sub.minlength && (
                                        <span>
                                          minimum {sub.minlength} character
                                        </span>
                                      )}
                                      {sub.maxlength && !sub.minlength && (
                                        <span>
                                          maximum {sub.maxlength} character
                                        </span>
                                      )}
                                      {sub.pattern && (
                                        <span>with pattern {sub.pattern}</span>
                                      )}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </div>
                              </div>
                            </Card.Body>
                          );
                        case "select":
                          return (
                            <Card.Body className="p-3">
                              <div className="row">
                                <div className="col-md-4">
                                  <Form.Group>
                                    <Form.Label>
                                      {sub.label_name}
                                      {sub.is_required ? (
                                        <span className="text-danger">*</span>
                                      ) : null}
                                    </Form.Label>
                                    <Select
                                      className="basic-single tele-drop"
                                      classNamePrefix="select"
                                      name={sub.label_name}
                                      closeMenuOnSelect={true}
                                      placeholder={"select"}
                                      isSearchable={sub.is_searchable}
                                      getOptionLabel={(option) => option.value}
                                      getOptionValue={(option) => option.value}
                                      options={sub.values}
                                    />
                                  </Form.Group>
                                </div>
                              </div>
                            </Card.Body>
                          );
                        case "number":
                          return (
                            <Card.Body className="p-3">
                              <div className="row">
                                <div className="col-md-4">
                                  <Form.Group>
                                    <Form.Label>
                                      {sub.label_name}
                                      {sub.is_required ? (
                                        <span className="text-danger">*</span>
                                      ) : null}{" "}
                                    </Form.Label>
                                    <Form.Control
                                      name={sub.label_name}
                                      size="sm"
                                      type={sub.input_type}
                                      autoComplete="off"
                                      placeholder={sub.label_name}
                                      required={sub.is_required}
                                      max={sub.maxvalue}
                                      min={sub.minvalue}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      Please Enter value{" "}
                                      {sub.minvalue && sub.maxvalue && (
                                        <span>
                                          between: {sub.minvalue} and{" "}
                                          {sub.maxvalue}
                                        </span>
                                      )}
                                      {sub.minvalue && !sub.maxvalue && (
                                        <span>greater than {sub.minvalue}</span>
                                      )}
                                      {!sub.minvalue && sub.maxvalue && (
                                        <span>less than {sub.maxvalue}</span>
                                      )}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </div>
                              </div>
                            </Card.Body>
                          );
                        default:
                          return (
                            <Card.Body className="p-3">
                              <div className="row">
                                <div className="col-md-4">
                                  <Form.Group>
                                    <Form.Label style={{ display: "block" }}>
                                      {sub.label_name}
                                      {sub.is_required ? (
                                        <span className="text-danger">*</span>
                                      ) : null}
                                    </Form.Label>
                                    {sub.input_type == "datepicker" ? (
                                      <Form.Control
                                        name={sub.label_name}
                                        size="sm"
                                        type="date"
                                        autoComplete="off"
                                        placeholder={sub.label_name}
                                        required={sub.is_required}
                                      />
                                    ) : sub.input_type == "checkbox" ? (
                                      sub.values.map((value) => {
                                        return (
                                          <Form.Check
                                            inline
                                            type="checkbox"
                                            label={value.value}
                                            value={value.value}
                                            onChange={handlecheck(
                                              data.section_title,
                                              sub.label_name
                                            )}
                                          />
                                        );
                                      })
                                    ) : (
                                      sub.values.map((value) => {
                                        return (
                                          <Form.Check
                                            inline
                                            name={sub.label_name}
                                            label={value.value}
                                            type={sub.input_type}
                                            required={sub.is_required}
                                            value={value.value}
                                          />
                                        );
                                      })
                                    )}

                                    <Form.Control.Feedback type="invalid">
                                      This is required field
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                </div>
                              </div>
                            </Card.Body>
                          );
                      }
                    })}
                </Card>
              ) : null
            )}

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
                <Link to="/employees" className="btn btn-danger btn-sm">
                  CANCEL
                </Link>
              </div>
            </div>
          </Form>
        </div>
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
            <Modal.Footer className="p-3">
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
});
