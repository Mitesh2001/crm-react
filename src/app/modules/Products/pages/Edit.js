import React, { useState } from "react";
import {
  Link,
  useLocation,
  useParams,
  Redirect,
  useHistory,
} from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { useSelector } from "react-redux";
import { Card, Modal, Form, Button, Image } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Select from "react-select";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

// import Editor from '../../../Core/Editor';
import Actions from "../Actions";
import {
  isValidImage,
  validatePhoneOnPress,
  disableUpDownArrow,
  TinyEditorKey,
} from "../../../helpers/Helper";
import App from "../../../Configs/app";
import jQuery from "jquery";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CancelIcon from "@material-ui/icons/Cancel";
import { Editor } from "@tinymce/tinymce-react";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import sub from "date-fns/sub";

export default React.memo(function() {
  let history = useHistory();
  let location = useLocation();
  const imageRef = React.useRef();
  const docRef = React.useRef();
  const { id } = useParams();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Edit Product");
  const { addToast } = useToasts();
  const [validated, setValidated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [info, setInfo] = React.useState(location.item ? location.item : {});
  const [redirect, setRedirect] = React.useState(false);
  const [picture, setPicture] = React.useState(null);
  const [document, setDocument] = React.useState(null);
  const [descriptioncontent, setDescriptionContent] = React.useState(null);
  const [offerdescriptioncontent, setOfferDescriptionContent] = React.useState(
    ""
  );
  const [dynamicItem, setInfo1] = React.useState([]);
  const [sendLoading, setSendLoading] = React.useState(false);
  const [category, setCategory] = React.useState([{ category: "" }]);
  const [sendCategorys, setCategoryRecord] = React.useState(false);
  const [CategoryConfirm, setCategoryConfirm] = React.useState(false);
  const [selectedCategory, setcategorySelected] = React.useState(null);
  const [sdate, setSdate] = React.useState("");
  const [edate, setEdate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [dt, setDt] = useState(moment());
  const [dts, setDts] = useState(moment());
  const [type, setType] = useState("");
  const [start, setStart] = React.useState(new Date());
  const endDate = new Date();
  endDate.setMinutes(endDate.getMinutes() + 30);
  const [end, setEnd] = React.useState(endDate);
  const { user } = useSelector((state) => state.auth);
  const [removeDoc, setRemoveDoc] = useState(false);
  const [removePicture, setRemovePicture] = useState(false);
  const [image, setImage] = useState(false);
  const [doc, setDoc] = useState(false);
  const [unit, setUnit] = useState();
  const [preDynamicVal, setPreDynamicVal] = React.useState({});
  const [validatePara, setValidatePara] = React.useState({});
  const [para, setPara] = React.useState({});
  const [selectedVal, setSelectedVal] = React.useState({});

  const titles = [
    "Primary Information",
    "Primary Contact Information",
    "Company Information",
  ];

  const checkPermission = React.useCallback(() => {
    let allowed = false;
    user.user_permission &&
      user.user_permission.Product &&
      user.user_permission.Product.map((item) => {
        if (item.name === "Edit") {
          allowed = true;
        }
      });
    if (!allowed) {
      // setNotAllowed(true);
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

  const handleCategory = (event) => {
    setLoading(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      formDataObj.name = formDataObj.categoryname;
      Actions.categoryadd(formDataObj).then((response) => {
        setLoading(false);
        if (response.status === "SUCCESS") {
          handleCategoryClose();
          setRedirect(false);
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
  const sendCategory = () => {
    setCategoryRecord();
    setCategoryConfirm(true);
  };
  const handleCategoryClose = () => {
    setCategoryRecord(false);
    setCategoryConfirm(false);
  };
  const checkCategory = (event) => {
    var values = event.target.value;
    if (values == "other") {
      sendCategory();
    }
  };

  const getCategory = React.useCallback(() => {
    Actions.category().then((data) => {
      if (data.status === "SUCCESS") {
        setCategory(data.data.productsCategory);
      }
    });
  }, []);
  React.useEffect(getCategory, []);
  const getInfo = React.useCallback(() => {
    if (location.item === undefined) {
      Actions.info(id).then((response) => {
        if (response.status === "SUCCESS") {
          setDescriptionContent(response.data.product.description);
          setOfferDescriptionContent(response.data.product.offer_description);
          setUnit(response.data.product.unit);
          setType(response.data.product.product_type);
          setInfo(response.data.product);
          setEnd(response.data.product.offer_end_date_time);
          setStart(response.data.product.offer_start_date_time);
          setImage(
            response.data.product.image && response.data.product.image !== ""
              ? App.assetUrl + "images/" + response.data.product.image
              : false
          );
          setDoc(
            response.data.product.document &&
              response.data.product.document !== ""
              ? App.assetUrl + "doc/" + response.data.product.document
              : false
          );
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

  const getInfo1 = React.useCallback(() => {
    Actions.dynamiccontact().then((response) => {
      if (response.status === "SUCCESS") {
        setInfo1(response.data);
      }
    });
  }, []);

  React.useEffect(getInfo1, []);
  React.useEffect(getInfo, []);

  function handleDiscount(event) {
    var price = jQuery("#listprice").val();
    var dis_per = jQuery("#discount_percent").val();
    var discount = Number(dis_per) / 100;
    var resultDiscount = price - price * discount;
    jQuery("#totalAmount").val(resultDiscount);
  }

  const formatDate = (date) => {
    if (date) {
      let dateObj = date;
      if (typeof date !== "object") {
        dateObj = new Date(date);
      }
      return `${dateObj.getFullYear()}-${("0" + (dateObj.getMonth() + 1)).slice(
        -2
      )}-${("0" + dateObj.getDate()).slice(-2)}T${(
        "0" + dateObj.getHours()
      ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}`;
    }
    return "";
  };

  const handleSubmit = (event) => {
    setLoading(true);

    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.target);
    const formDataObj = Object.fromEntries(formData.entries());
    let dateStart = start;
    if (typeof date !== "object") {
      dateStart = new Date(start);
    }
    let dateEnd = start;
    if (typeof date !== "object") {
      dateEnd = new Date(end);
    }
    if (dateEnd.getTime() < dateStart.getTime()) {
      addToast("EndDate should be after Start date", {
        appearance: "error",
        autoDismiss: true,
      });
    } else {
      const form = event.currentTarget;

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

      if (form.checkValidity() === true && val && checkboxReq) {

        if (removeDoc) {
          formDataObj.document = "delete";
        }
        if (removePicture) {
          formDataObj.picture = "delete";
        }
        if (picture) {
          formDataObj.picture = picture;
        }
        if (document) {
          formDataObj.document = document;
        }
        formDataObj.description = descriptioncontent;
        formDataObj.offer_description = offerdescriptioncontent;

        formDataObj.offer_start_date_time = start;

        formDataObj.offer_end_date_time = end;
        formDataObj.product_type = type;
        formDataObj.unit = unit;

        for (const sec in preDynamicVal) {
          for (const lab in preDynamicVal[sec]) {
            formDataObj[lab] = preDynamicVal[sec][lab];
          }
        }
        Actions.update({
          ...formDataObj,
          id,
        }).then((response) => {
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
    }
    setLoading(false);
  };

  const changePhoto = (event, type) => {
    let files = event.target.files;
    if (files.length > 0 && isValidImage(files[0].type)) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        const image1 = {
          name: files[0].name,
          type: files[0].type,
          size: files[0].size,
          base64: e.target.result,
        };
        setPicture(image1);
        setRemovePicture(false);
      };
      setImage(false);
    } else {
      addToast("Please select proper image.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleUnit = (e) => {
    setUnit(e.target.value);
  };

  const changeDoc = (event, type) => {
    let files = event.target.files;
    //if (files.length > 0 && isValidImage(files[0].type)) {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e) => {
      const file = {
        name: files[0].name,
        type: files[0].type,
        size: files[0].size,
        base64: e.target.result,
      };
      setRemoveDoc(false);
      setDocument(file); //type === 'C' ? setCompanyLogo(image) : setPicture(image);
      setDoc(false);
    };
    /* } else {
            addToast('Please select proper image.', { appearance: 'error', autoDismiss: true });
        } */
  };

  const getType = (value) => {
    jQuery(".unit").show();
    if (value == "2") {
      jQuery(".unit").hide();
    }
  };

  const handleSdateChange = (sdate, val) => {
    setSdate(sdate);
    setDt(val);
  };
  const handleEdateChange = (edate, vals) => {
    setEdate(edate);
    setDts(vals);
  };

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  const handleEditorChange = (content, editor) => {
    setDescriptionContent(content);
  };
  const handleChange = (contents, editor) => {
    setOfferDescriptionContent(contents);
  };

  const handleDocDelete = () => {
    setDocument(null);
    setRemoveDoc(true);
    if (docRef.current) {
      docRef.current.value = "";
    }
    setDoc(false);
  };
  const handlePictureDelete = () => {
    setPicture(null);
    setRemovePicture(true);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    setImage(false);
  };

  // setting previous checked value in dynamic content
  React.useEffect(() => {
    Actions.info(id).then((r) => {
      if (r.status === "SUCCESS") {
        Actions.dynamiccontact().then((res) => {
          if (res.status === "SUCCESS") {
            const inf = r.data.product;
            const obj1 = {};
            const checkReq = {};
            const selected = {}
            res.data.forEach((item) => {
              const section_title = item["section_title"];
              item.field_data.forEach((ite) => {
                if(ite.input_type === "select" && inf.hasOwnProperty(ite.label_name)){
                  selected[ite.label_name] = inf[ite.label_name]
                }
                const label_name = ite["label_name"];
                if (ite.is_required == 0) {
                  checkReq[label_name] = false;
                } else {
                  checkReq[label_name] = true;
                }
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
            setSelectedVal(Object.assign({},selectedVal,selected));
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

  const handleSelect = (lab) => (e) => {
    setSelectedVal(Object.assign({},selectedVal,{ [lab]: e.value }));
  };


  if (redirect) {
    return <Redirect to="/products" />;
  } else {
    return (
      <>
        <Card className="add-edit-product">
          <Card.Body className="p-3">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Card className="rkcrm-card mb-5">
                <Card.Header
                  className="p-3"
                  style={{ background: "#33475b", color: "white" }}
                >
                  Primary Information
                </Card.Header>
                <Card.Body className="p-3">
                  <div className="row">
                    <div className="col-md-3">
                      <div>
                        <Form.Label>
                          Type<span className="text-danger">*</span>
                        </Form.Label>
                        <select
                          defaultValue={info?.product_type}
                          name="product_type"
                          required
                          className="browser-default custom-select"
                          onChange={(e) => {
                            setType(e.target.value);
                          }}
                        >
                          <option>Choose your option</option>
                          <option value="1" selected={info?.product_type === 1}>
                            Product
                          </option>
                          <option value="2" selected={info?.product_type === 2}>
                            Service
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>
                          Category<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="category_id"
                          id="category_id"
                          onChange={checkCategory}
                          as="select"
                          className="mycategory"
                        >
                          <option value="">Select Category</option>
                          {category &&
                            category.map((i) => (
                              <option
                                value={i.id}
                                selected={
                                  selectedCategory == i.id ||
                                  info?.category_id === i.id
                                }
                              >
                                {i.name}
                              </option>
                            ))}
                          <option value="other">Add category</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Please select category
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>SKU Code</Form.Label>
                        <Form.Control
                          name="skucode"
                          defaultValue={info?.skucode}
                          size="sm"
                          maxLength="100"
                          type="text"
                          autoComplete="off"
                          placeholder="Enter SKU code"
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>
                          Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="name"
                          defaultValue={info?.name}
                          size="sm"
                          type="text"
                          autoComplete="off"
                          placeholder="Enter name"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter name
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    {type == "1" && (
                      <div className="col-md-3 unit">
                        <Form.Group>
                          <Form.Label>Product Unit</Form.Label>
                          <Form.Control
                            type="number"
                            id="unit"
                            min={0}
                            rows="3"
                            className="form-control"
                            placeholder="Enter Product Unit"
                            defaultValue={info?.unit}
                            onChange={handleUnit}
                          />
                        </Form.Group>
                      </div>
                    )}
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>
                          Price<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="listprice"
                          rows="3"
                          defaultValue={info?.listprice}
                          id="listprice"
                          onChange={handleDiscount}
                          size="sm"
                          type="number"
                          autoComplete="off"
                          placeholder="Enter price"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter price
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    {/*                 <div className="col-md-3">
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Discount(%)</Form.Label>
                    <Form.Control
                      type="number"
                      defaultValue={info?.discount_percent}
                      id="discount_percent"
                      name="discount_percent"
                      onChange={handleDiscount}
                      rows="3"
                      className="form-control"
                      placeholder="Enter Discount"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Final Amount</Form.Label>
                    <Form.Control
                      type="number"
                      id="totalAmount"
                      defaultValue={info?.final_amount}
                      readOnly
                      name="final_amount"
                      rows="3"
                      className="form-control"
                      placeholder="Total"
                    />
                  </Form.Group>
                </div>
 */}{" "}
                    <div className="col-sm-3">
                      <Form.Group>
                        <Form.Label>Start Offer Date</Form.Label>
                        <input
                          style={{ width: "100%" }}
                          type="datetime-local"
                          value={formatDate(start)}
                          onChange={(e) => {
                            setStart(e.currentTarget.value);
                          }}
                        />

                        {/* <DatePicker
                        // isValidDate={disablePastDt}
                        // value={dt}
                        //value={date}
                        defaultValue={new Date()}
                        className="followup-datetime"
                        onChange={handleSdateChange}
                        dateFormat="YYYY-MM-DD"
                        timeFormat="hh:mm A"
                        //onChange={val => setDt(val)}
                        required
                      /> */}
                      </Form.Group>
                    </div>
                    <div className="col-sm-3">
                      <Form.Group>
                        <Form.Label>End offer Date</Form.Label>

                        <input
                          style={{ width: "100%" }}
                          type="datetime-local"
                          value={formatDate(end)}
                          min={formatDate(start)}
                          onChange={(e) => {
                            setEnd(e.currentTarget.value);
                          }}
                        />
                        {/* <DatePicker
                        // isValidDate={disablePastDt}
                        // value={dt}
                        //value={date}
                        defaultValue={new Date()}
                        className="followup-datetime"
                        onChange={handleEdateChange}
                        dateFormat="YYYY-MM-DD"
                        timeFormat="hh:mm A"
                        //onChange={val => setDt(val)}
                        required
                      /> */}
                      </Form.Group>
                    </div>
                    <br />
                    {(picture?.base64 || image) && (
                      <div
                        className="col-md-1"
                        style={{ position: "relative" }}
                      >
                        <div style={{ position: "absolute", right: "0px" }}>
                          <CancelIcon onClick={handlePictureDelete} />
                        </div>
                        <Image
                          style={{ height: "60px", maxWidth: "60px" }}
                          src={picture?.base64 || image}
                        />
                      </div>
                    )}
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Image</Form.Label>
                        <Form.File id="formcheck-api-custom">
                          <Form.File.Input
                            onChange={(e) => changePhoto(e, "P")}
                            ref={imageRef}
                            isValid
                          />
                          <Form.Control.Feedback type="invalid">
                            Please select proper image
                          </Form.Control.Feedback>
                        </Form.File>
                      </Form.Group>
                    </div>
                    {document?.base64 ? null : doc ? (
                      <div
                        className="col-md-2"
                        style={{ marginTop: "30px", position: "relative" }}
                      >
                        <div style={{ position: "absolute", top: "-10px" }}>
                          <CancelIcon onClick={handleDocDelete} />
                        </div>
                        <a
                          style={{ border: "2px solid black", padding: "10px" }}
                          href={doc}
                        >
                          <CloudDownloadIcon /> {info.document.substr(0, 25)}
                        </a>
                      </div>
                    ) : null}
                    <div className="col-md-3">
                      <Form.Group>
                        <Form.Label>Document</Form.Label>
                        <Form.File.Input
                          onChange={(e) => changeDoc(e, "P")}
                          ref={docRef}
                          isValid
                        />
                        <Form.Control.Feedback type="invalid">
                          Please select proper document
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    {dynamicItem.map((data) =>
                      data.section_title === "Primary Information" ? (
                        <>
                          {" "}
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
                                            <span className="text-danger">
                                              *
                                            </span>
                                          ) : null}
                                        </Form.Label>
                                        <Form.Control
                                          name={sub.label_name}
                                          size="sm"
                                          defaultValue={info[sub.label_name]}
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
                                          Please enter value{" "}
                                          {sub.maxlength && sub.minlength && (
                                            <span>
                                              between {sub.minlength} and{" "}
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
                                          defaultValue={info[sub.label_name]}
                                          type={sub.input_type}
                                          autoComplete="off"
                                          placeholder={sub.label_name}
                                          maxlength={sub.maxlength}
                                          minlength={sub.minlength}
                                          pattern={sub.pattern}
                                          required={sub.is_required}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          Please enter{" "}
                                          {sub.maxlength && sub.minlength && (
                                            <span>
                                              character between {sub.minlength}{" "}
                                              and {sub.maxlength}{" "}
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
                                          defaultValue={sub.values.filter(
                                            (value) =>
                                              value.value ===
                                              info[sub.label_name]
                                          )}
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
                    <br />
                    {/* <div className="col-md-3">
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" defaultValue={info?.description} name="description" rows="3" className="form-control" placeholder="Enter Description" />
                            </Form.Group>
                            </div> */}
                    <div className="col-md-3">
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={info?.comment}
                          name="comment"
                          rows="3"
                          className="form-control"
                          placeholder="Enter Comment"
                        />
                      </Form.Group>
                    </div>
                    <br />
                    <br />
                    <div className="col-md-6">
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Offer Description</Form.Label>
                        {/* <Form.Control as="textarea" rows="3" name="description" className="form-control" placeholder="Enter Description" /> */}
                        <Editor
                          initialValue={
                            info.offer_description == "<p>null</p>"
                              ? ""
                              : info.offer_description
                          }
                          init={{
                            selector: "textarea#myTextArea",
                            plugins: ["lists link image paste help wordcount"],
                            toolbar:
                              "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help",
                          }}
                          apiKey={TinyEditorKey}
                          onEditorChange={handleChange}
                          // value={info?.offer_description}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Editor
                          initialValue={
                            info.description == "<p>null</p>"
                              ? ""
                              : info.description
                          }
                          init={{
                            selector: "textarea#myTextArea",
                            plugins: ["lists link image paste help wordcount"],
                            toolbar:
                              "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help",
                          }}
                          apiKey={TinyEditorKey}
                          // value={info?.description}

                          onEditorChange={handleEditorChange}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              {dynamicItem.map((data) =>
                !titles.includes(data.section_title) ? (
                  <Card className="rkcrm-card mb-5">
                    <Card.Header className="p-3">
                      {data.section_title}
                    </Card.Header>
                    {!data.field_data && (
                      <Card.Body className="p-3"></Card.Body>
                    )}
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
                                        name={sub.label_name}
                                        size="sm"
                                        defaultValue={info[sub.label_name]}
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
                                        Please enter value{" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                            between {sub.minlength} and{" "}
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
                                        maxlength={sub.maxlength}
                                        minlength={sub.minlength}
                                        pattern={sub.pattern}
                                        required={sub.is_required}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please enter{" "}
                                        {sub.maxlength && sub.minlength && (
                                          <span>
                                            character between {sub.minlength}{" "}
                                            and {sub.maxlength}{" "}
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
                                        value={sub.values.filter(
                                          (value) =>
                                            value.value ===
                                            selectedVal[sub.label_name]
                                        )}
                                        getOptionLabel={(option) =>
                                          option.value
                                        }
                                        getOptionValue={(option) =>
                                          option.value
                                        }
                                        options={sub.values}
                                        onChange={handleSelect(sub.label_name)}
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
                                            // <input type="checkbox" />
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
                  <Link to="/Products" className="btn btn-danger btn-sm">
                    CANCEL
                  </Link>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
        <Modal
          show={CategoryConfirm}
          onHide={handleCategoryClose}
          onSubmit={handleCategory}
        >
          <Form noValidate validated={validated} onSubmit={handleCategory}>
            <Modal.Header className="p-3" closeButton>
              <Modal.Title>Add Category</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3">
              <div className="row">
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>New Category</Form.Label>
                    <Form.Control
                      name="categoryname"
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
                onClick={handleCategoryClose}
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
