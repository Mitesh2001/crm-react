import React from "react";
import { Link, useLocation, useParams, Redirect } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { Card, Form, Button, Modal, Image } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Actions from "../Actions";
import {
  isValidImage,
  validatePhoneOnPress,
  disableUpDownArrow,
} from "../../../helpers/Helper";
import App from "../../../Configs/app";
import jQuery from "jquery";
import AddIcon from "@material-ui/icons/Add";
export default React.memo(function() {
  let location = useLocation();
  const { id } = useParams();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Edit Employee");
  const { addToast } = useToasts();
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState(location.item ? location.item : {});
  const [redirect, setRedirect] = React.useState(false);
  const [photo, setPhoto] = React.useState(null);
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [casts, setCast] = React.useState([{ casts: "" }]);
  const [roleslist, setRoles] = React.useState([]);
  const [sendCastt, setCastRecord] = React.useState(false);
  const [CastConfirm, setCastConfirm] = React.useState(false);
  const [sendLoading, setSendLoading] = React.useState(false);
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
  const [selectedRole, setRoleSelected] = React.useState(null);
  const [selectedMarital, setMaritalSelected] = React.useState(null);
  const [selectedGender, setGenderSelected] = React.useState(null);
  const [selectedBlood, setBloodSelected] = React.useState(null);
  const [dynamicItem, setInfo] = React.useState([]);
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

  const getInfo1 = React.useCallback(() => {
    Actions.dynamiccontact().then((response) => {
      if (response.status === "SUCCESS") {
        setInfo(response.data);
      }
    });
  }, []);

  React.useEffect(getInfo1, []);

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
  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          setUser(response.data.employee);
          setRoleSelected(response.data.employee.role_id);
          setMaritalSelected(response.data.employee.marital_status);
          setGenderSelected(response.data.employee.gender);
          if (
            response.data.employee.family_details != null &&
            response.data.employee.family_details != ""
          )
            setFamilymember(response.data.employee.family_details);
          if (
            response.data.employee.previous_employer_details != null &&
            response.data.employee.previous_employer_details != ""
          )
            setEmployer(response.data.employee.previous_employer_details);
          if (
            response.data.employee.job_details != null &&
            response.data.employee.job_details != ""
          )
            setJobDetail(response.data.employee.job_details);
          if (
            response.data.employee.education_details != null &&
            response.data.employee.education_details != ""
          )
            setEducation(response.data.employee.education_details);
          if (
            response.data.employee.bank_details != null &&
            response.data.employee.bank_details != ""
          )
            setBank(response.data.employee.bank_details);
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
  const getCast = React.useCallback(() => {
    Actions.cast().then((data) => {
      if (data.status === "SUCCESS") {
        setCast(data.data.casts);
      }
    });
  }, []);
  const getRoles = React.useCallback(() => {
    Actions.roles().then((data) => {
      if (data.status === "SUCCESS") {
        setRoles(data.data.roles);
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
  const getStates = React.useCallback(
    (cid) => {
      let country_id =
        cid === undefined
          ? user.country_id === null ||
            user.country_id === undefined ||
            user.country_id === 0
            ? 101
            : user.country_id
          : cid;
      Actions.states(country_id).then((data) => {
        if (data.status === "SUCCESS") {
          setStates(data.states);
        }
      });
    },
    [user]
  );
  React.useEffect(getCast, []);
  React.useEffect(getRoles, []);
  React.useEffect(getCountries, []);
  // React.useEffect(getStates, []);
  React.useEffect(getInfo, []);
  const handleSubmit = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.education_data = [...educationState];
      formDataObj.family_detail = [...familyState];
      formDataObj.previous_employer = [...employerState];
      formDataObj.job_data = [...jobState];
      formDataObj.bank_data = [...bankState];
      formDataObj.picture = photo;
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
  const picture =
    user.picture && user.picture !== "" ? App.assetUrl + user.picture : false;
  const changeCountry = (e) => getStates(e.target.value);

  const checkValue = (event) => {
    var value = event.target.value;
    if (value != "1") {
      jQuery("#adate").attr("disabled", "disabled");
    } else if (value == "1") {
      jQuery("#adate").removeAttr("disabled");
    }
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
                      <p>{user?.name}</p>{" "}
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>
                        Email<span className="text-danger">*</span>
                      </Form.Label>
                      <p>{user?.email}</p>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>
                        Mobile No<span className="text-danger">*</span>
                      </Form.Label>
                      <p>{user?.mobileno}</p>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Additional Contact No</Form.Label>
                      <p>{user?.alt_mobileno}</p>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Designation</Form.Label>
                      <p>{user?.designation}</p>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <p>
                        {user?.gender === "M"
                          ? "Male"
                          : user?.gender === "F"
                          ? "Female"
                          : "Other"}
                      </p>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Cast</Form.Label>
                      <p>{user?.cast_id}</p>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Date Of Birth</Form.Label>
                      <h4>{user?.dob}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Martial Status</Form.Label>
                      <h4>
                        {user?.marital_status == "1"
                          ? "Married"
                          : user?.marital_status == "2"
                          ? "Unmarried"
                          : null}
                      </h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Marriage Anniversary Date</Form.Label>
                      <h4>{user?.marriage_anniversary_date}</h4>
                      {/* disabled={user?.marital_status == '1' || selectedMarital == '1'} */}
                    </Form.Group>
                  </div>

                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Blood Group</Form.Label>
                      <h4>
                        {/* {user?.blood_group == "1"
                          ? "A+"
                          : user?.blood_group == "2"
                          ? "A-"
                          : user?.blood_group == "3"
                          ? "B+"
                          : user?.blood_group == "4"
                          ? "B-"
                          : user?.blood_group == "5"
                          ? "O+"
                          : user?.blood_group == "6"
                          ? "O-"
                          : user?.blood_group == "7"
                          ? "AB+"
                          : user?.blood_group == "8"
                          ? "AB-"
                          : null} */}
                        {user?.blood_group}
                      </h4>
                    </Form.Group>
                  </div>

                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Critical Illness</Form.Label>
                      <h4>{user?.critical_illness}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Legal issue</Form.Label>
                      <h4>{user?.legal_issue}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Other Activity</Form.Label>
                      <h4>{user?.other_activity}</h4>{" "}
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Driving Licence No</Form.Label>
                      <h4>{user?.driving_licence_no}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Aadhar No</Form.Label>
                      <h4>{user?.aadhar_no}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>PAN No</Form.Label>
                      <h4>{user?.pan_no}</h4>
                    </Form.Group>
                  </div>
                  {(photo?.base64 || picture) && (
                    <div className="col-md-4">
                      <Form.Group>
                        <p>Employee Profile Picture</p>
                        <Image
                          style={{ height: "60px" }}
                          src={photo?.base64 || picture}
                        />
                      </Form.Group>
                    </div>
                  )}
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Emergency Contact Number</Form.Label>
                      <h4>{user?.emergency_no}</h4>
                    </Form.Group>
                  </div>
                  {dynamicItem.map((data) =>
                    data.section_title === "Personal Information" ? (
                      <>
                        {" "}
                        {data &&
                          data.field_data.map((sub) => {
                            switch (sub.input_type) {
                              case "textarea":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <h4>{user[sub.label_name]}</h4>
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
                                      <h4>{user[sub.label_name]}</h4>
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
                                      <h4>{user[sub.label_name]}</h4>
                                      <Form.Control.Feedback type="invalid">
                                        Please Select {sub.label_name}
                                      </Form.Control.Feedback>
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
                                      <h4>{user[sub.label_name]}</h4>
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
                                      <h4>{user[sub.label_name]}</h4>
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
                      <h4>{user?.address_line_1}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Address Line 2</Form.Label>
                      <h4>{user?.address_line_2}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Landmark</Form.Label>

                      <h4>{user?.landmark}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label>Country</Form.Label>
                      {countries.map((i) => {
                        return user?.country_id === i.country_id ? (
                          <h4>{i.name}</h4>
                        ) : null;
                      })}
                    </Form.Group>
                  </div>
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label>State</Form.Label>
                      <h4>{user?.state_id}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <h4>{user?.city}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-3">
                    <Form.Group>
                      <Form.Label>Pincode</Form.Label>
                      <h4>{user?.pincode}</h4>
                    </Form.Group>
                  </div>
                  {dynamicItem.map((data) =>
                    data.section_title === "Contact Information" ? (
                      <>
                        {" "}
                        {data &&
                          data.field_data.map((sub) => {
                            switch (sub.input_type) {
                              case "textarea":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <h4>{user[sub.label_name]}</h4>
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
                                      <h4>{user[sub.label_name]}</h4>{" "}
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
                                      <h4>{user[sub.label_name]}</h4>
                                      <Form.Control.Feedback type="invalid">
                                        Please Select {sub.label_name}
                                      </Form.Control.Feedback>
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
                                      <h4>{user[sub.label_name]}</h4>
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
                                      <h4>{user[sub.label_name]}</h4>
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
                      {roleslist.map((i) => {
                        return user?.role_id === i.id ? (
                          <h4>{i.name}</h4>
                        ) : null;
                      })}
                    </Form.Group>
                  </div>
                  {dynamicItem.map((data) =>
                    data.section_title === "Role Information" ? (
                      <>
                        {" "}
                        {data &&
                          data.field_data.map((sub) => {
                            switch (sub.input_type) {
                              case "textarea":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <h4>{user[sub.label_name]}</h4>
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
                                      <h4>{user[sub.label_name]}</h4>{" "}
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
                                      <h4>{user[sub.label_name]}</h4>
                                      <Form.Control.Feedback type="invalid">
                                        Please Select {sub.label_name}
                                      </Form.Control.Feedback>
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
                                      <h4>{user[sub.label_name]}</h4>
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
                                      <h4>{user[sub.label_name]}</h4>
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
                          <h4>{educationState[0].highschool}</h4>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Gradute</Form.Label>
                          <h4>{educationState[0].gradute}</h4>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Post Gradute</Form.Label>
                          <h4>{educationState[0].postgradute}</h4>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Other</Form.Label>
                          <h4>{educationState[0].other}</h4>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Special Skills & Training</Form.Label>
                          <h4>{educationState[0].specialskill}</h4>
                        </Form.Group>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Education Details" ? (
                          <>
                            {" "}
                            {data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
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
                                          <h4>{education[sub.label_name]}</h4>
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
                                          <h4>{education[sub.label_name]}</h4>
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

                                          {sub &&
                                            sub.values.map((gender) => {
                                              return gender?.id ===
                                                education[sub.label_name] ? (
                                                <h4>{gender.value}</h4>
                                              ) : null;
                                            })}
                                          <Form.Control.Feedback type="invalid">
                                            Please Select {sub.label_name}
                                          </Form.Control.Feedback>
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
                                          <h4>{education[sub.label_name]}</h4>
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
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <h4>{education[sub.label_name]}</h4>
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
              <Card.Header className="p-3">Family Details </Card.Header>
              <Card.Body className="p-3">
                {familyState.map((familymem, i) => {
                  //familyState && familyState != null &&

                  return (
                    <div>
                      {i !== 0 && <hr style={{ marginBottom: "2rem" }} />}
                      <div className="row">
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Family Member Name</Form.Label>
                            <h4>{familymem.family_member_name}</h4>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Relation</Form.Label>
                            <h4>
                              {familymem.relation === "F"
                                ? "Father"
                                : familymem.relation === "M"
                                ? "Mother"
                                : familymem.relation === "H"
                                ? "Husband"
                                : familymem.relation === "W"
                                ? "Wife"
                                : familymem.relation === "D"
                                ? "Daughter"
                                : familymem.relation === "S"
                                ? "Son"
                                : familymem.relation === "Si"
                                ? "Sister"
                                : familymem.relation === "B"
                                ? "Brother"
                                : null}
                            </h4>
                          </Form.Group>
                        </div>
                        <div className="col-md-3">
                          <Form.Group>
                            <Form.Label>Date of Birth</Form.Label>
                            <h4>{familymem.memberdob}</h4>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Education</Form.Label>
                            <h4>{familymem.education}</h4>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Occupation</Form.Label>
                            <h4>{familymem.occupation}</h4>
                          </Form.Group>
                        </div>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Family Details" ? (
                          <>
                            {" "}
                            {data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
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
                                          <h4>{familymem[sub.label_name]}</h4>
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
                                          <h4>{familymem[sub.label_name]}</h4>
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
                                          {sub &&
                                            sub.values.map((gender) => {
                                              return gender?.id ===
                                                familymem[sub.label_name] ? (
                                                <h4>{gender.value}</h4>
                                              ) : null;
                                            })}
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
                                          <h4>{familymem[sub.label_name]}</h4>
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
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <h4>{familymem[sub.label_name]}</h4>
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
                Previous Employer Details{" "}
              </Card.Header>
              <Card.Body className="p-3">
                {employerState.map((employeemem, i) => {
                  // && employerState && employerState != null
                  return (
                    <div>
                      {i !== 0 && <hr style={{ marginBottom: "2rem" }} />}
                      <div className="row">
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Employer</Form.Label>
                            <h4>{employeemem.employer}</h4>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>City</Form.Label>
                            <h4>{employeemem.employercity}</h4>
                          </Form.Group>
                        </div>
                        <div className="col-md-2">
                          <Form.Group>
                            <Form.Label>Contact Name</Form.Label>
                            <h4>{employeemem.contactname}</h4>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Contact Number</Form.Label>
                            <h4>{employeemem.contactnumber}</h4>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Employment Period</Form.Label>
                            <h4>{employeemem.employmentperiod}</h4>
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Group>
                            <Form.Label>Reason For Leaving</Form.Label>
                            <h4>{employeemem.reasonleave}</h4>
                          </Form.Group>
                        </div>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Previous Employer Details" ? (
                          <>
                            {" "}
                            {data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
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
                                          <h4>{employeemem[sub.label_name]}</h4>
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
                                          <h4>{employeemem[sub.label_name]}</h4>
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
                                          {sub &&
                                            sub.values.map((gender) => {
                                              return gender?.id ===
                                                employeemem[sub.label_name] ? (
                                                <h4>{gender.value}</h4>
                                              ) : null;
                                            })}
                                          <Form.Control.Feedback type="invalid">
                                            Please Select {sub.label_name}
                                          </Form.Control.Feedback>
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
                                          <h4>{employeemem[sub.label_name]}</h4>
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
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <h4>{employeemem[sub.label_name]}</h4>
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
                  //&& jobState && jobState != null
                  return (
                    <div className="row">
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Joining Date</Form.Label>
                          <h4>{jobhistory.date}</h4>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Position</Form.Label>
                          <h4>{jobhistory.position}</h4>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Level</Form.Label>
                          <h4>{jobhistory.level}</h4>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label>Reporting To</Form.Label>
                          <h4>{jobhistory.reporting}</h4>
                        </Form.Group>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Job Detail" ? (
                          <>
                            {" "}
                            {data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
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
                                          <h4>{jobhistory[sub.label_name]}</h4>
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
                                          <h4>{jobhistory[sub.label_name]}</h4>
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
                                          {sub &&
                                            sub.values.map((gender) => {
                                              return gender?.id ===
                                                jobhistory[sub.label_name] ? (
                                                <h4>{gender.value}</h4>
                                              ) : null;
                                            })}
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
                                          <h4>{jobhistory[sub.label_name]}</h4>
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
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <h4>{jobhistory[sub.label_name]}</h4>
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
                          <h4>{bank.bank_name}</h4>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Account Number</Form.Label>
                          <h4>{bank.accountnumber}</h4>
                        </Form.Group>
                      </div>
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>IFSC Code</Form.Label>
                          <h4>{bank.ifsc}</h4>
                        </Form.Group>
                      </div>
                      {dynamicItem.map((data) =>
                        data.section_title === "Bank Details" ? (
                          <>
                            {" "}
                            {data &&
                              data.field_data.map((sub) => {
                                switch (sub.input_type) {
                                  case "textarea":
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
                                          <h4>{bank[sub.label_name]}</h4>
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
                                          <h4>{bank[sub.label_name]}</h4>
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
                                          {sub &&
                                            sub.values.map((gender) => {
                                              return gender?.id ===
                                                bank[sub.label_name] ? (
                                                <h4>{gender.value}</h4>
                                              ) : null;
                                            })}
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
                                          <h4>{bank[sub.label_name]}</h4>
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
                                              <span className="text-danger">
                                                *
                                              </span>
                                            ) : null}
                                          </Form.Label>
                                          <h4>{bank[sub.label_name]}</h4>
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
                      <Form.Label>twitter</Form.Label>
                      <h4>{user?.facebook}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Twitter</Form.Label>
                      <h4>{user?.twitter}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Instagram</Form.Label>
                      <h4>{user?.instagram}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Website</Form.Label>
                      <h4>{user?.website}</h4>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Youtube</Form.Label>
                      <h4>{user?.youtube}</h4>
                    </Form.Group>
                  </div>
                  {dynamicItem.map((data) =>
                    data.section_title === "Social Links Information" ? (
                      <>
                        {" "}
                        {data &&
                          data.field_data.map((sub) => {
                            switch (sub.input_type) {
                              case "textarea":
                                return (
                                  <div className="col-md-4">
                                    <Form.Group>
                                      <Form.Label>
                                        {sub.label_name}
                                        {sub.is_required ? (
                                          <span className="text-danger">*</span>
                                        ) : null}
                                      </Form.Label>
                                      <h4>{user[sub.label_name]}</h4>
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
                                      <h4>{user[sub.label_name]}</h4>
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
                                      {sub &&
                                        sub.values.map((gender) => {
                                          return gender?.id ===
                                            user[sub.label_name] ? (
                                            <h4>{gender.value}</h4>
                                          ) : null;
                                        })}
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
                                      <h4>{user[sub.label_name]}</h4>
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
                                      <h4>{user[sub.label_name]}</h4>
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
                  {data &&
                    data.field_data.map((sub) => {
                      switch (sub.input_type) {
                        case "textarea":
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
                                    <h4>{user[sub.label_name]}</h4>
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
                                    <h4>{user[sub.label_name]}</h4>
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
                                    {sub &&
                                      sub.values.map((gender) => {
                                        return gender?.id ===
                                          user[sub.label_name] ? (
                                          <h4>{gender.value}</h4>
                                        ) : null;
                                      })}
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
                                    <h4>{user[sub.label_name]}</h4>
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
                                    <Form.Label>
                                      {sub.label_name}
                                      {sub.is_required ? (
                                        <span className="text-danger">*</span>
                                      ) : null}
                                    </Form.Label>
                                    <h4>{user[sub.label_name]}</h4>{" "}
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
          </Form>
        </div>
      </>
    );
  }
});
