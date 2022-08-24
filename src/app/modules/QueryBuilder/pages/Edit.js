import React, { Component, useEffect } from "react";
import {
  Query,
  Builder,
  BasicConfig,
  Utils as QbUtils,
  JsonTree,
} from "react-awesome-query-builder";
import { Link, useLocation, useParams, Redirect } from "react-router-dom";
import {
  Card,
  Button,
  Form,
  Collapse,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import AntdConfig from "react-awesome-query-builder/lib/config/antd";
import MaterialConfig from "react-awesome-query-builder/lib/config/material";
import Pagination from "@material-ui/lab/Pagination";
import PlayArrowOutlined from "@material-ui/icons/PlayArrowOutlined";
import SaveOutlined from "@material-ui/icons/SaveOutlined";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useToasts } from "react-toast-notifications";
import { useSubheader } from "../../../../_metronic/layout";
import Summary from "./Summary";
import { NoRecordsFoundMessage } from "../../../../_metronic/_helpers";
import Select from "react-select";
import "antd/dist/antd.css";
import "react-awesome-query-builder/lib/css/styles.css";
import "react-awesome-query-builder/lib/css/compact_styles.css"; //optional, for more compact styles
import Actions from "../Actions";
const { loadTree, uuid } = QbUtils;

// Choose your skin (ant/material/vanilla):
const InitialConfig = MaterialConfig; // or MaterialConfig or BasicConfig

// You need to provide your own config. See below 'Config format'

const config1 = {
  ...InitialConfig,
  fields: {
    qty: {
      label: "Qty",
      type: "number",
      fieldSettings: {
        min: 0,
      },
      valueSources: ["value"],
      preferWidgets: ["number"],
    },
    price: {
      label: "Price",
      type: "number",
      valueSources: ["value"],
      fieldSettings: {
        min: 10,
        max: 100,
      },
      preferWidgets: ["slider", "rangeslider"],
    },
    color: {
      label: "Color",
      type: "select",
      valueSources: ["value"],
      fieldSettings: {
        listValues: [
          { value: "yellow", title: "Yellow" },
          { value: "green", title: "Green" },
          { value: "orange", title: "Orange" },
        ],
      },
    },
    is_promotion: {
      label: "Promo?",
      type: "boolean",
      operators: ["equal"],
      valueSources: ["value"],
    },
  },
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const emptyInitValue = { id: uuid(), type: "group" };

export default function Edit() {
  const { id } = useParams();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Report Builder");
  const [tree, setTree] = React.useState(
    QbUtils.checkTree(QbUtils.loadTree(emptyInitValue), config1)
  );
  const [config, setConfig] = React.useState(config1);
  const [data, setData] = React.useState({
    rule_query: "",
    group_by: "",
    module: "",
    rule_name: "",
  });
  const [group, setGroup] = React.useState("");
  const [group1, setGroup1] = React.useState("");
  const [module, setModule] = React.useState("");
  const [ruleName, setRuleName] = React.useState("");
  const [showQuery, setShowQuery] = React.useState(true);
  const [redirect, setRedirect] = React.useState(false);
  const [treeString, setTreeString] = React.useState("");
  const [call, setCall] = React.useState(true);
  const [showtable, setShowTable] = React.useState(false);
  const [column, setColumn] = React.useState([
    {
      dataField: "id",
      text: "ID",
      hidden: true,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
  ]);
  const [summaryData, setSummary] = React.useState([]);
  const [selectedColumn, setSelectedColumn] = React.useState([]);
  const [columnOptions, setColumnOptions] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);
  const [records, setRecords] = React.useState(1);
  const [exportData, setExportData] = React.useState([]);
  const [groupColumns, setGroupColumns] = React.useState([]);
  const { addToast } = useToasts();
  const totalPages = Math.ceil(records / perPage);

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedColumn(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const getInfo = React.useCallback(() => {
    Actions.info(id).then((response) => {
      if (response.status === "SUCCESS") {
        setRuleName(response.data.queryRule.rule_name);
        setModule(response.data.queryRule.module);
        if (response.data.queryRule.module == "1") {
          Actions.columnData("leads").then((response) => {
            if (response.status === "SUCCESS") {
              setColumnOptions(response.data.columnList);
            }
          });
          Actions.groupBy("leads").then((response) => {
            if (response.status === "SUCCESS") {
              setGroupColumns(response.data.columns);
            }
          });
        } else {
          Actions.columnData("contacts").then((response) => {
            if (response.status === "SUCCESS") {
              setColumnOptions(response.data.columnList);
            }
          });
          Actions.groupBy("contacts").then((response) => {
            if (response.status === "SUCCESS") {
              setGroupColumns(response.data.columns);
            }
          });
        }
        setGroup(response.data.queryRule.group_by);
        if (response.data.queryRule.group_by.length === 1) {
          setGroup(response.data.queryRule.group_by[0]);
        }
        if (response.data.queryRule.group_by.length === 2) {
          setGroup(response.data.queryRule.group_by[0]);
          setGroup1(response.data.queryRule.group_by[1]);
        }
        setTreeString(response.data.queryRule.tree);
        if (response.data.queryRule.selected_column) {
          setSelectedColumn(response.data.queryRule.selected_column.split(","));
        }
      } else {
        addToast(response.message, { appearance: "error", autoDismiss: true });
        setRedirect(true);
      }
    });
  }, [id, addToast]);
  const getColumn = () => {
    if (module === 1) {
      Actions.column("leads").then((response) => {
        if (response.status === "SUCCESS") {
          setConfig({ ...InitialConfig, fields: response.data.columns.fields, });
          setTree(loadTree(JSON.parse(treeString)));
          setCall(false);
        }
      });
    } else {
      Actions.column("contacts").then((response) => {
        if (response.status === "SUCCESS") {
          setConfig({ ...InitialConfig, fields: response.data.columns.fields, });
          setTree(loadTree(JSON.parse(treeString)));
          setCall(false);
        }
      });
    }
  };
  React.useEffect(getInfo, []);
  
  const updateValue = () => {
    if(selectedColumn.length===1){
      addToast("Select More than one Column", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    else{
    if (QbUtils.queryString(tree, config) && ruleName !== "" && module !== "") {
      var group_by = [];
      if (group !== "") {
        group_by.push(group);
      }
      if (group1 !== "") {
        group_by.push(group1);
      }
      group_by = group_by.toString();
      Actions.update({
        rule_query: QbUtils.sqlFormat(tree, config),
        group_by: group_by,
        module: module,
        rule_name: ruleName,
        tree: JSON.stringify(QbUtils.getTree(tree)),
        id,
        selected_column:
          selectedColumn.length !== 0
            ? selectedColumn.toString()
            : module == 1
            ? "lead_name,company_name,customer_name,email"
            : "name,company_name,cc_email,email",
      }).then((response) => {
        if (response.status === "SUCCESS") {
          addToast(response.message, {
            appearance: response.status === "SUCCESS" ? "success" : "error",
            autoDismiss: true,
          });
          setRedirect(true);
        }
      });
    } else {
      if(ruleName==""){
        addToast("Please Fill Name", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      else if(!QbUtils.queryString(tree, config)){
        addToast("Please Add Report Parameters", {
          appearance: "error",
          autoDismiss: true,
        });
      }

    }
  }
  };

  const updateShowValue = () => {
    if(selectedColumn.length===1){
      addToast("Select More than one Column", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    else{
    if (QbUtils.queryString(tree, config) && ruleName !== "" && module !== "") {
      var group_by = [];
      if (group !== "") {
        group_by.push(group);
      }
      if (group1 !== "") {
        group_by.push(group1);
      }
      group_by = group_by.toString();
      Actions.update({
        rule_query: QbUtils.sqlFormat(tree, config),
        group_by: group_by,
        module: module,
        rule_name: ruleName,
        tree: JSON.stringify(QbUtils.getTree(tree)),
        id,
        selected_column:
          selectedColumn.length !== 0
            ? selectedColumn.toString()
            : module == 1
            ? "lead_name,company_name,customer_name,email"
            : "name,company_name,cc_email,email",
      }).then((response) => {
        if (response.status === "SUCCESS") {
          addToast(response.message, {
            appearance: response.status === "SUCCESS" ? "success" : "error",
            autoDismiss: true,
          });
          showValue(perPage, currentPage);
        }
      });
    } else {
      if(ruleName==""){
        addToast("Please Fill Name", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      else if(!QbUtils.queryString(tree, config)){
        addToast("Please Add Report Parameters", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  }
  };
  const showValue = (perPageSize, currentPageNumber) => {
    if(selectedColumn.length===1){
      addToast("Select More than one Column", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    else{
    if (QbUtils.queryString(tree, config) && module !== "") {
      setShowTable(false);
      var group_by = [];
      if (group !== "") {
        group_by.push(group);
        currentPageNumber = 1;
        perPageSize = 100;
        setCurrentPage(1);
        setPerPage(100);
      }
      if (group1 !== "") {
        group_by.push(group1);
        currentPageNumber = 1;
        perPageSize = 100;
        setCurrentPage(1);
        setPerPage(100);
      }
      group_by = group_by.toString();

      Actions.summary({
        rule_query: QbUtils.sqlFormat(tree, config),
        group_by: group_by,
        module: module == 1 ? "leads" : "contacts",
        selected_column:
          selectedColumn.length !== 0
            ? selectedColumn.toString()
            : module == 1
            ? "lead_name,company_name,customer_name,email"
            : "name,company_name,cc_email,email",
        page: currentPageNumber,
        size: perPageSize,
      }).then((response) => {
        if (response.status === "SUCCESS") {
          if (response.data.results.length > 0) {
            const columns = Object.keys(response.data.results[0]).map(
              (key, id) => {
                return {
                  dataField: key,
                  text: key.toUpperCase(),
                  hidden: id > 7 ? true : false,
                  classes: "text-left ml-0",
                  headerAlign: "left",
                };
              }
            );
            setCurrentPage(response.data.current);
            setRecords(response.data.totalRecord);
            const fromPage = (currentPageNumber - 1) * perPageSize + 1;
            const toPage =
              (currentPageNumber - 1) * perPageSize +
              response.data.results.length;
            setFrom(fromPage);
            setTo(toPage);
            setSummary(response.data.results);
            setColumn(columns);
            Actions.summary({
              rule_query: QbUtils.sqlFormat(tree, config),
              group_by: group_by,
              module: module == 1 ? "leads" : "contacts",
              selected_column:
                selectedColumn.length !== 0
                  ? selectedColumn.toString()
                  : module == 1
                  ? "lead_name,company_name,customer_name,email"
                  : "name,company_name,cc_email,email",
            }).then((response) => {
              setExportData(response.data.results);
              setShowTable(true);
            });
          } else {
            setColumn([
              {
                dataField: "id",
                text: "ID",
                hidden: true,
                classes: "text-left ml-0",
                headerAlign: "left",
              },
            ]);
            setSummary(response.data.results);
            setShowTable(true);
          }
        }
      });
    } else {
      addToast("Query and module fields are required!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }
  };

  const checkValue = (e) => {
    setPerPage(e.target.value);
    setCurrentPage(1);
    showValue(e.target.value, 1);
  };

  const resetValue = () => {
    setTree(QbUtils.loadTree(emptyInitValue));
    setGroup("");
    setGroup1("");
    setShowTable(false);
    setSelectedColumn([]);
    addToast("reset successful!", {
      appearance: "success",
      autoDismiss: true,
    });
  };
  const renderBuilder = (props) => (
    <div
      className="query-builder-container"
      style={{ margin: "0px -18px 0px -12px" }}
    >
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  );

  const onChange = (immutableTree, configg) => {
    setTree(immutableTree);
    setConfig(configg);
  };

  if (redirect) {
    return <Redirect to="/report-builder" />;
  }
  const formatOptionLabel = ({ name }) => (
    <div style={{ display: "flex" }}>{name}</div>
  );
  

  return (
    <div>
      {module !== "" && call ? getColumn() : null}
      <div className="row">
        <div className="col-md-12">
          {" "}
          <OverlayTrigger placement="top" overlay={<Tooltip>Back</Tooltip>}>
            <Link to="/report-builder" className="abtn1">
              <KeyboardBackspaceIcon />
            </Link>
          </OverlayTrigger>
        </div>

        <div className="col-md-3">
          <Form.Group>
            <Form.Label>
              Module<span className="text-danger">*</span>
            </Form.Label>
            <select
              required
              value={module}
              onChange={(e) => {
                if (
                  e.currentTarget.value === "1" ||
                  e.currentTarget.value === "2"
                ) {
                  if (module !== e.currentTarget.value) {
                    setTree(loadTree(emptyInitValue));
                    setModule(e.currentTarget.value);
                    setSelectedColumn([]);
                    setGroup("");
                    setGroup1("");
                    setShowTable(false);
                    setSummary([]);
                  }
                  if (e.currentTarget.value === "1") {
                    // setConfig(config1);
                    Actions.column("leads").then((response) => {
                      if (response.status === "SUCCESS") {
                        setConfig({
                          ...InitialConfig,
                          fields: response.data.columns.fields,
                        });
                      }
                    });
                    Actions.columnData("leads").then((response) => {
                      if (response.status === "SUCCESS") {
                        setColumnOptions(response.data.columnList);
                      }
                    });
                    Actions.groupBy("leads").then((response) => {
                      if (response.status === "SUCCESS") {
                        setGroupColumns(response.data.columns);
                      }
                    });
                  }
                  if (e.currentTarget.value === "2") {
                    // setConfig(config1);
                    Actions.column("contacts").then((response) => {
                      if (response.status === "SUCCESS") {
                        setConfig({
                          ...InitialConfig,
                          fields: response.data.columns.fields,
                        });
                      }
                    });
                    Actions.columnData("contacts").then((response) => {
                      if (response.status === "SUCCESS") {
                        setColumnOptions(response.data.columnList);
                      }
                    });
                    Actions.groupBy("contacts").then((response) => {
                      if (response.status === "SUCCESS") {
                        setGroupColumns(response.data.columns);
                      }
                    });
                  }
                  if (showQuery === false) {
                    setShowQuery(!showQuery);
                  }
                } else {
                  if (e.currentTarget.value === "") {
                    setTree(loadTree(emptyInitValue));
                    setModule(e.currentTarget.value);
                    setShowQuery(false);
                    setSelectedColumn([]);
                  }
                }
              }}
              className="browser-default"
              style={{
                border: "1px solid #ebedf3",
                color: "#3f4254",
                padding: "5px",
                width: "100%",
              }}
            >
              <option value="">Select Module</option>
              <option value="1">Leads</option>
              <option value="2">Contact</option>
            </select>
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>
              Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              size="sm"
              type="text"
              value={ruleName}
              onChange={(e) => {
                setRuleName(e.currentTarget.value);
              }}
              style={{ width: "100%", borderRadius: "0px" }}
              placeholder="Enter Report Name"
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Group By </Form.Label>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>For Summary, Select Field</Tooltip>}
            >
              <select
                required
                value={group}
                onChange={(e) => {
                  setGroup(e.currentTarget.value);
                }}
                className="browser-default"
                style={{
                  border: "1px solid #ebedf3",
                  color: "#3f4254",
                  padding: "5px",
                  width: "100%",
                }}
              >
                <option value="">Select Column</option>
                {groupColumns.map(
                  (i) =>
                    i.value !== group1 && (
                      <option value={i.value} key={"ls" + i.value}>
                        {i.name}
                      </option>
                    )
                )}
              </select>
            </OverlayTrigger>
          </Form.Group>
        </div>
        <div className="col-md-3">
          <Form.Group>
            <Form.Label>Group By(Second field)</Form.Label>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>For Summary, Select Field</Tooltip>}
            >
              <select
                required
                value={group1}
                onChange={(e) => {
                  setGroup1(e.currentTarget.value);
                }}
                className="browser-default"
                style={{
                  border: "1px solid #ebedf3",
                  color: "#3f4254",
                  padding: "5px",
                  width: "100%",
                }}
              >
                <option value="">Select Column</option>
                {groupColumns.map(
                  (i) =>
                    i.value !== group && (
                      <option value={i.value} key={"ls" + i.value}>
                        {i.name}
                      </option>
                    )
                )}
              </select>
            </OverlayTrigger>
          </Form.Group>
        </div>
      </div>
      <Collapse in={showQuery}>
        <div>
          <div className="row">
            <div className="col-md-12">
              <Form.Group>
                <Form.Label>Select Columns</Form.Label>
                <Select
                  defaultValue={[columnOptions[2], columnOptions[3]]}
                  isMulti
                  name="colors"
                  width="100%"
                  options={columnOptions}
                  className="basic-multi-select tele-drop"
                  classNamePrefix="select"
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.value}
                  formatOptionLabel={formatOptionLabel}
                  value={columnOptions.filter((obj) =>
                    selectedColumn.includes(obj.value)
                  )} // set selected values
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>
          <div style={{ padding: "10px 0px", margin: "0px" }}>
            <Form.Label>
              Query Builder<span className="text-danger">*</span>
            </Form.Label>

            <Query
              {...config}
              value={tree}
              onChange={onChange}
              renderBuilder={renderBuilder}
            />
          </div>
          {/* {renderResult()} */}
          <div style={{ margin: "0px -5px  10px" }}>
            <Button
              className="rk-add-btn"
              style={{ margin: "0 5px" }}
              onClick={updateValue}
            >
              <SaveOutlined />
              &nbsp;Update
            </Button>
            <Button
              className="rk-add-btn"
              style={{ margin: "0 5px" }}
              onClick={() => {
                showValue(perPage, currentPage);
              }}
            >
              <PlayArrowOutlined />
              &nbsp; Run
            </Button>
            <Button
              className="rk-add-btn"
              style={{ margin: "0 5px" }}
              onClick={updateShowValue}
            >
              <PlayArrowOutlined />
              Update and Run
            </Button>
            <Button
              className="rk-add-btn"
              style={{ margin: "0 5px" }}
              onClick={resetValue}
            >
              Reset
            </Button>
          </div>
        </div>
      </Collapse>
      {summaryData.length > 0 && showtable && column.length > 1 && (
        <>
          <div className="rk-sub-header mb-5">Summary</div>
          <Card className="rkcrm-card mb-5">
            <Card.Body>
              <Collapse in={showtable}>
                <>
                  <Summary
                    columns={column}
                    data={summaryData}
                    exportData={exportData}
                  />
                  <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col">
                      <select
                        required
                        value={perPage}
                        onChange={checkValue}
                        className="browser-default page-selection"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                    <div className="col showing-records-line">
                      <span>
                        Showing {from} to {to} from {records}
                      </span>
                    </div>

                    <div className="col text-right">
                      <Pagination
                        siblingCount={0}
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, page) => {
                          setCurrentPage(page);
                          showValue(perPage, page);
                        }}
                        variant="outlined"
                      />
                    </div>
                  </div>
                </>
              </Collapse>
            </Card.Body>
          </Card>
        </>
      )}
      {showtable && summaryData.length === 0 && (
        <>
          <div className="rk-sub-header mb-5">Summary</div>
          <Card className="rkcrm-card mb-5">
            <Card.Body>
              <NoRecordsFoundMessage entities={summaryData} />
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}
