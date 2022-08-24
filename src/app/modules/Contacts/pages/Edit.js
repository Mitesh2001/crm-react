import React from "react";
import {
  Link,
  useLocation,
  useParams,
  Redirect,
  useHistory,
} from "react-router-dom";
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
import App from "../../../Configs/app";
import { Multiselect } from "multiselect-react-dropdown";
import jQuery from "jquery";
import Select from "react-select";

function Edit() {
  let history = useHistory();
  let location = useLocation();
  const { id } = useParams();
  const { addToast } = useToasts();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Edit Contact");

  const selectInputRefCity = React.useRef();
  const selectInputRefPostCode = React.useRef();
  const selectInputRefState = React.useRef();
  const [info, setInfo] = React.useState(location.item ? location.item : {});
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [industries, setIndustries] = React.useState([]);
  const [companyTypes, setCompanyTypes] = React.useState([]);
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [postCodes, setPostCodes] = React.useState([]);
  const [redirect, setRedirect] = React.useState(false);
  const [companyLogo, setCompanyLogo] = React.useState(null);
  const [picture, setPicture] = React.useState(null);
  const [dynamicItem, setInfo1] = React.useState([]);
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
  const [selectedPostCode, setSelectedPostCode] = React.useState(0);
  const { user } = useSelector((state) => state.auth);
  const [notAllowed, setNotAllowed] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [validateEmail, setValidateEmail] = React.useState("");
  const [weburl, setWeburl] = React.useState("");
  const [validateWebUrl, setValidateWebUrl] = React.useState("");
  const [preDynamicVal, setPreDynamicVal] = React.useState({});
  const [validatePara, setValidatePara] = React.useState({});
  const [para, setPara] = React.useState({});
  const [gst, setGst] = React.useState("");
  const [validateGst, setValidateGst] = React.useState(true);

  const checkPermission = React.useCallback(() => {
    let allowed = false;
    user.user_permission &&
      user.user_permission.Contact &&
      user.user_permission.Contact.map((item) => {
        if (item.name === "Edit") {
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

  const titles = [
    "Primary Information",
    "Primary Contact Information",
    "Company Information",
  ];

  const onSelect = (event) => {
    setOption(event);
  };
  const getProducts = React.useCallback((cid) => {
    Actions.listProducts().then((data) => {
      if (data.status === "SUCCESS") {
        setProduct(data.data.products);
      }
    });
  }, []);
  React.useEffect(getProducts, []);

  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          setEmail(response.data.contact.email);
          setWeburl(response.data.contact.website);
          setInfo(response.data.contact);
          setSelectedIndustry(response.data.contact.industry_id);
          if (response.data.contact && response.data.contact.country) {
            setSelectedCountry(response.data.contact.country.country_id);
          }
          setSelectedState(response.data.contact.state_id);
          setSelectedCity(response.data.contact.city);
          setSelectedPostCode(response.data.contact.postcode);
          getStates(response.data.contact.country.country_id);
          getCities(response.data.contact.state_id);
          getPostCodes(response.data.contact.city);
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

  const getInfo1 = React.useCallback(() => {
    Actions.dynamiccontact().then((response) => {
      if (response.status === "SUCCESS") {
        setInfo1(response.data);
      }
    });
  }, []);

  React.useEffect(getCountries, []);
  React.useEffect(getCompanyTypes, []);
  React.useEffect(getIndustries, []);
  React.useEffect(getInfo, []);

  React.useEffect(getInfo1, []);

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
      validateEmail &&
      val &&
      checkboxReq &&
      validateWebUrl &&
      validateGst
    ) {
      formDataObj.company_logo = companyLogo;
      formDataObj.picture = picture;
      for (const sec in preDynamicVal) {
        for (const lab in preDynamicVal[sec]) {
          formDataObj[lab] = preDynamicVal[sec][lab];
        }
      }

      for (const pa in para) {
        formDataObj[pa] = para[pa];
      }
      Actions.update({ ...formDataObj, id }).then((response) => {
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

  const changePhoto = (event, type) => {
    let files = event.target.files;
    if (files.length > 0 && isValidImage(files[0].type)) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        const image = {
          name: files[0].name,
          type: files[0].type,
          size: files[0].size,
          base64: e.target.result,
        };
        type === "C" ? setCompanyLogo(image) : setPicture(image);
      };
    } else {
      addToast("Please select proper image.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const tmpPicture =
    info?.picture && info.picture !== ""
      ? App.assetUrl + "images/" + info.picture
      : false;
  const tmpCompanyPicture =
    info?.company_logo && info.company_logo !== ""
      ? App.assetUrl + "images/" + info.company_logo
      : false;

  /*       const getList = (value) => {
        var val = value;
        if (value !== "101") {
          jQuery("#date").attr("type","text");
        } else if (value === "101") {
          jQuery("#date").attr("type","number");
        }
      };

 */

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

  // if(notAllowed){
  //   addToast("You are not allowed to edit Contacts", {
  //     appearance:"error",
  //     autoDismiss: true,
  //   });
  //   return <Redirect to="/contacts" />;
  // }

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

  React.useEffect(() => {
    let websiteformat = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (websiteformat.test(weburl)) {
      setValidateWebUrl(true);
      if (document.getElementById("strong_pass")) {
        document.getElementById("strong_pass").remove();
      }
    } else {
      setValidateWebUrl(false);
      if (!document.getElementById("strong_pass")) {
        let tag = document.createElement("p");
        tag.setAttribute("id", "strong_pass");
        let text = document.createTextNode("Please enter valid Website url");
        tag.appendChild(text);
        let element = document.querySelector("#web_validate");
        element.appendChild(tag);
        document.getElementById("strong_pass").style.color = "red";
      }
    }
    if (!weburl && document.getElementById("strong_pass")) {
      document.getElementById("strong_pass").remove();
    }
  }, [weburl]);

  React.useEffect(() => {
    var gstinformat = new RegExp(
      "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
    );
    if (gstinformat.test(gst)) {
      setValidateGst(true);
      if (document.getElementById("gst")) {
        document.getElementById("gst").remove();
      }
    } else {
      setValidateGst(false);
      if (!document.getElementById("gst")) {
        let tag = document.createElement("p");
        tag.setAttribute("id", "gst");
        let text = document.createTextNode("Please enter valid GST Number");
        tag.appendChild(text);
        let element = document.querySelector("#gst_validate");
        element.appendChild(tag);
        document.getElementById("gst").style.color = "red";
      }
    }
    if (!gst && document.getElementById("gst")) {
      document.getElementById("gst").remove();
    }
    if (!gst) {
      setValidateGst(true);
    }
  }, [gst]);

  React.useEffect(() => {
    Actions.info(id).then((r) => {
      if (r.status === "SUCCESS") {
        Actions.dynamiccontact().then((res) => {
          if (res.status === "SUCCESS") {
            const inf = r.data.contact;
            const obj1 = {};
            res.data.forEach((item) => {
              const section_title = item["section_title"];
              item.field_data.forEach((ite) => {
                const label_name = ite["label_name"];
                if (inf[label_name] != null) {
                  const obj2 = { [label_name]: inf[label_name] };
                  if (Object.keys(obj1).length == 0) {
                    obj1[section_title] = obj2;
                  } else {
                    if (!obj1.hasOwnProperty(section_title)) {
                      obj1[section_title] = obj2;
                    } else {
                      obj1[section_title][label_name] = inf[label_name];
                    }
                  }
                }
              });
            });
            setPreDynamicVal(obj1);
          }
        });
      }
    });
  }, []);

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
    return <Redirect to={"/contacts/" + id + "/show"} />;
  } else {
    return (
      <div className="add-edit-lead">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Card className="rkcrm-card mb-5">
            <Card.Header className="p-3">Primary Information</Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>
                      Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="name"
                      defaultValue={info?.name}
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
                      Primary email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="email"
                      defaultValue={info?.email}
                      size="sm"
                      type="email"
                      autoComplete="off"
                      placeholder="Enter primary email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter customer email
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Secondary email</Form.Label>
                    <Form.Control
                      name="secondary_email"
                      defaultValue={info?.secondary_email}
                      size="sm"
                      type="email"
                      autoComplete="off"
                      placeholder="Enter primary secondary email"
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
                      defaultValue={info?.mobile_no}
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
                      Please enter primary mobile no
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Secondary Mobile</Form.Label>
                    <Form.Control
                      name="secondary_mobile_no"
                      defaultValue={info?.secondary_mobile_no}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter secondary mobile no"
                      onKeyPress={validatePhoneOnPress}
                      onKeyDown={disableUpDownArrow}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter secondary mobile no
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3" style={{ display: "flex" }}>
                  <Form.Group>
                    <Form.Label>Change Profile Picture</Form.Label>
                    <Form.File id="formcheck-api-custom">
                      <Form.File.Input
                        onChange={(e) => changePhoto(e, "P")}
                        isValid
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select proper image
                      </Form.Control.Feedback>
                    </Form.File>
                  </Form.Group>
                  {(picture?.base64 || tmpPicture) && (
                    <div className="col-md-1">
                      <Image
                        style={{ height: "60px", marginLeft: "-40px" }}
                        src={picture?.base64 || tmpPicture}
                      />
                    </div>
                  )}
                </div>
                {dynamicItem.map((data) =>
                  data.section_title === "Primary Information" ? (
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
                                  <Form.Group id="form_feedback">
                                    <Form.Label>
                                      {sub.label_name}
                                      {sub.is_required ? (
                                        <span className="text-danger">*</span>
                                      ) : null}
                                    </Form.Label>
                                    <Form.Control
                                      size="sm"
                                      defaultValue={info[sub.label_name]}
                                      autoComplete="off"
                                      maxLength={sub.maxlength}
                                      minLength={sub.minlength}
                                      pattern={sub.pattern}
                                      required={sub.is_required}
                                      placeholder={sub.label_name}
                                      as={sub.input_type}
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
                                      Please Enter{" "}
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
                                      defaultValue={info[sub.label_name]}
                                      type={sub.input_type}
                                      autoComplete="off"
                                      placeholder={sub.label_name}
                                      maxLength={sub.maxlength}
                                      minLength={sub.minlength}
                                      pattern={sub.pattern}
                                      required={sub.is_required}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      Please Enter{" "}
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
                                      defaultValue={sub.values.filter(
                                        (value) =>
                                          value.value === info[sub.label_name]
                                      )}
                                      getOptionLabel={(option) => option.value}
                                      getOptionValue={(option) => option.value}
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
                                      defaultValue={info[sub.label_name]}
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
                                        defaultValue={info[sub.label_name]}
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
                                            defaultChecked={info[
                                              sub.label_name
                                            ]?.includes(value.value)}
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
                                            defaultChecked={
                                              value.value ==
                                              info[sub.label_name]
                                            }
                                          />
                                        );
                                      })
                                    )}

                                    <Form.Control.Feedback type="invalid">
                                      Please Enter {sub.label_name}
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
                      defaultValue={info?.address_line_1}
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
                      defaultValue={info?.address_line_2}
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
                        defaultValue={info?.state_id}
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
                    {states.length !== 0 && cities.length != 0 ? (
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
                        defaultValue={info?.city}
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
                        name="postcode"
                        size="sm"
                        id="date"
                        type="text"
                        defaultValue={info?.postcode}
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
                  data.section_title === "Primary Contact Information" ? (
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
                                  <Form.Group id="form_feedback">
                                    <Form.Label>
                                      {sub.label_name}
                                      {sub.is_required ? (
                                        <span className="text-danger">*</span>
                                      ) : null}
                                    </Form.Label>
                                    <Form.Control
                                      size="sm"
                                      defaultValue={info[sub.label_name]}
                                      autoComplete="off"
                                      maxLength={sub.maxlength}
                                      minLength={sub.minlength}
                                      pattern={sub.pattern}
                                      required={sub.is_required}
                                      placeholder={sub.label_name}
                                      as={sub.input_type}
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
                                      Please Enter{" "}
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
                                      defaultValue={info[sub.label_name]}
                                      type={sub.input_type}
                                      autoComplete="off"
                                      placeholder={sub.label_name}
                                      maxLength={sub.maxlength}
                                      minLength={sub.minlength}
                                      pattern={sub.pattern}
                                      required={sub.is_required}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      Please Enter{" "}
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
                                      defaultValue={sub.values.filter(
                                        (value) =>
                                          value.value === info[sub.label_name]
                                      )}
                                      getOptionLabel={(option) => option.value}
                                      getOptionValue={(option) => option.value}
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
                                      defaultValue={info[sub.label_name]}
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
                                        defaultValue={info[sub.label_name]}
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
                                            defaultChecked={info[
                                              sub.label_name
                                            ]?.includes(value.value)}
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
                                            defaultChecked={
                                              value.value ==
                                              info[sub.label_name]
                                            }
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
            <Card.Header className="p-3">Company Information</Card.Header>
            <Card.Body className="p-3">
              <div className="row">
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>
                      Company Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="company_name"
                      defaultValue={info?.company_name}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter company name"
                      required
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
                      placeholder="Select company type"
                    >
                      <option value="">Select company type</option>
                      {companyTypes.map((i) => (
                        <option
                          value={i.id}
                          key={"i" + i.id}
                          selected={info?.company_type_id === i.id}
                        >
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
                      value={industries.filter(
                        (value) => value.id === selectedIndustry
                      )}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      formatOptionLabel={formatOptionLabel}
                      options={industries}
                      onChange={handleindustry}
                      // selected={info?.industry_id === i.id}
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
                      <option
                        value={i.id}
                        key={"i" + i.id}
                        selected={info?.industry_id === i.id}
                      >
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
                      defaultValue={info?.established_in}
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
                      defaultValue={info?.turnover}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter annual turnover"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter annual turnover
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group id="gst_validate">
                    <Form.Label>GST Number</Form.Label>
                    <Form.Control
                      name="gst_no"
                      defaultValue={info?.gst_no}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter GST number"
                      minLength="15"
                      onChange={(e) => setGst(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter GST number
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control
                      name="pan_no"
                      defaultValue={info?.pan_no}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter PAN number"
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
                      defaultValue={info?.no_of_employees}
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
                  <Form.Group id="web_validate">
                    <Form.Label>
                      Website<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="website"
                      defaultValue={info?.website}
                      size="sm"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter website"
                      required
                      onChange={(e) => setWeburl(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter website
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Sticky Note</Form.Label>
                    <Form.Control
                      name="sticky_note"
                      defaultValue={info?.sticky_note}
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
                <div className="col-md-3" style={{ display: "flex" }}>
                  <Form.Group>
                    <Form.Label>Company Logo</Form.Label>
                    <Form.File id="formcheck-api-custom">
                      <Form.File.Input
                        onChange={(e) => changePhoto(e, "C")}
                        isValid
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select proper image
                      </Form.Control.Feedback>
                    </Form.File>
                  </Form.Group>
                  {(companyLogo?.base64 || tmpCompanyPicture) && (
                    <div className="col-md-1">
                      <Image
                        style={{ height: "60px", marginLeft: "-40px" }}
                        src={companyLogo?.base64 || tmpCompanyPicture}
                      />
                    </div>
                  )}
                </div>

                {dynamicItem.map((data) =>
                  data.section_title === "Company Information" ? (
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
                                  <Form.Group id="form_feedback">
                                    <Form.Label>
                                      {sub.label_name}
                                      {sub.is_required ? (
                                        <span className="text-danger">*</span>
                                      ) : null}
                                    </Form.Label>
                                    <Form.Control
                                      size="sm"
                                      defaultValue={info[sub.label_name]}
                                      autoComplete="off"
                                      maxLength={sub.maxlength}
                                      minLength={sub.minlength}
                                      pattern={sub.pattern}
                                      required={sub.is_required}
                                      placeholder={sub.label_name}
                                      as={sub.input_type}
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
                                      Please Enter{" "}
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
                                      defaultValue={info[sub.label_name]}
                                      type={sub.input_type}
                                      autoComplete="off"
                                      placeholder={sub.label_name}
                                      maxLength={sub.maxlength}
                                      minLength={sub.minlength}
                                      pattern={sub.pattern}
                                      required={sub.is_required}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      Please Enter{" "}
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
                                      defaultValue={sub.values.filter(
                                        (value) =>
                                          value.value === info[sub.label_name]
                                      )}
                                      getOptionLabel={(option) => option.value}
                                      getOptionValue={(option) => option.value}
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
                                      defaultValue={info[sub.label_name]}
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
                                        defaultValue={info[sub.label_name]}
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
                                            defaultChecked={info[
                                              sub.label_name
                                            ]?.includes(value.value)}
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
                                            defaultChecked={
                                              value.value ==
                                              info[sub.label_name]
                                            }
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
                <Card.Header className="p-3">{data.section_title}</Card.Header>
                {!data.field_data && <Card.Body className="p-5"></Card.Body>}
                {data.field_data &&
                  data.field_data.map((sub) => {
                    switch (sub.input_type) {
                      case "textarea":
                        return (
                          <Card.Body className="p-3">
                            <div className="row">
                              <div className="col-md-4">
                                <Form.Group id="form_feedback">
                                  <Form.Label>
                                    {sub.label_name}
                                    {sub.is_required ? (
                                      <span className="text-danger">*</span>
                                    ) : null}
                                  </Form.Label>
                                  <Form.Control
                                    size="sm"
                                    defaultValue={info[sub.label_name]}
                                    autoComplete="off"
                                    maxLength={sub.maxlength}
                                    minLength={sub.minlength}
                                    required={sub.is_required}
                                    placeholder={sub.label_name}
                                    as={sub.input_type}
                                    type={sub.input_type}
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
                                    Please Enter{" "}
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
                                    defaultValue={info[sub.label_name]}
                                    type={sub.input_type}
                                    autoComplete="off"
                                    placeholder={sub.label_name}
                                    maxLength={sub.maxlength}
                                    minLength={sub.minlength}
                                    pattern={sub.pattern}
                                    required={sub.is_required}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    Please Enter{" "}
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
                                    defaultValue={sub.values.filter(
                                      (value) =>
                                        value.value === info[sub.label_name]
                                    )}
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
                                    defaultValue={info[sub.label_name]}
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
                                      defaultValue={info[sub.label_name]}
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
                                          defaultChecked={info[
                                            sub.label_name
                                          ]?.includes(value.value)}
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
                                          defaultChecked={
                                            value.value == info[sub.label_name]
                                          }
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
              <Link
                to={"/contacts/" + id + "/show"}
                className="btn btn-danger btn-sm"
              >
                CANCEL
              </Link>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default React.memo(Edit);
