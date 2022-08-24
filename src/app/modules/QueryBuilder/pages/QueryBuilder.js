import React, { Component } from "react";
import {
  Query,
  Builder,
  BasicConfig,
  Utils as QbUtils,
  JsonTree,
} from "react-awesome-query-builder";
import {
  Card,
  Button,
  Form,
  Collapse,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link, useLocation, useParams, Redirect } from "react-router-dom";
import PlayArrowOutlined from "@material-ui/icons/PlayArrowOutlined";
import SaveSharp from "@material-ui/icons/SaveSharp";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import AntdConfig from "react-awesome-query-builder/lib/config/antd";
import MaterialConfig from "react-awesome-query-builder/lib/config/material";
import Pagination from "@material-ui/lab/Pagination";
import { useToasts } from "react-toast-notifications";
import { useSubheader } from "../../../../_metronic/layout";
import Summary from "./Summary";
import Select from "react-select";
import "antd/dist/antd.css";
import "react-awesome-query-builder/lib/css/styles.css";
import "react-awesome-query-builder/lib/css/compact_styles.css"; //optional, for more compact styles
import Actions from "../Actions";
import { NoRecordsFoundMessage } from "../../../../_metronic/_helpers";
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

export default function QueryBuilder() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Report Builder");
  const [tree, setTree] = React.useState(
    QbUtils.checkTree(QbUtils.loadTree(emptyInitValue), config1)
  );
  const [config, setConfig] = React.useState(config1);
  const [group, setGroup] = React.useState("");
  const [group1, setGroup1] = React.useState("");
  const [module, setModule] = React.useState("");
  const [ruleName, setRuleName] = React.useState("");
  const [showQuery, setShowQuery] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
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
  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedColumn(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const { addToast } = useToasts();
  const totalPages = Math.ceil(records / perPage);

  // fun = () => {
  //   this.setState({
  //     tree: loadTree(this.state.rules[0]),
  //   });
  // };
  const addValue = () => {
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
      Actions.add({
        rule_query: QbUtils.sqlFormat(tree, config),
        group_by: group_by,
        module: module,
        rule_name: ruleName,
        tree: JSON.stringify(QbUtils.getTree(tree)),
        selected_column: selectedColumn.toString(),
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

  const addShowValue = () => {
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
      Actions.add({
        rule_query: QbUtils.sqlFormat(tree, config),
        group_by: group_by,
        module: module,
        rule_name: ruleName,
        tree: JSON.stringify(QbUtils.getTree(tree)),
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
              required
              size="sm"
              type="text"
              value={ruleName}
              onChange={(e) => {
                setRuleName(e.currentTarget.value);
              }}
              style={{ width: "100%", borderRadius: "0px" }}
              placeholder="Enter Report Name"
            />
            <Form.Control.Feedback type="invalid">
                Please enter report name
            </Form.Control.Feedback>
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
                  required
                />
              <Form.Control.Feedback type="invalid">
                  Please Select Columns
              </Form.Control.Feedback>

              </Form.Group>
            </div>
          </div>
          {/* {selectedColumn && (
            <div style={{ marginTop: 20, lineHeight: "25px" }}>
              <div>
                <b>Selected Column: </b> {JSON.stringify(selectedColumn, null, 2)}
              </div>
            </div>
          )} */}
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
          <div style={{ margin: "0px -5px 10px" }}>
            <Button
              className="rk-add-btn"
              style={{ margin: "0 5px" }}
              onClick={addValue}
            >
              <SaveSharp />
              &nbsp;Save
            </Button>
            <Button
              className="rk-add-btn"
              style={{ margin: "0 5px" }}
              onClick={() => {
                showValue(perPage, currentPage);
              }}
            >
              <PlayArrowOutlined />
              &nbsp;Run Query
            </Button>
            <Button
              className="rk-add-btn"
              style={{ margin: "0 5px" }}
              onClick={addShowValue}
            >
              <PlayArrowOutlined />
              Save and Run
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
