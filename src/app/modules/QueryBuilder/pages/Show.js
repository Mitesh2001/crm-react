import React from "react";
import { Link, useLocation, useParams, Redirect } from "react-router-dom";
import {
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Button,
  Modal,
  Collapse,
  Form,
} from "react-bootstrap";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import Pagination from "@material-ui/lab/Pagination";
import { useToasts } from "react-toast-notifications";
import { useSubheader } from "../../../../_metronic/layout";
import Actions from "../Actions";
import Summary from "./Summary";
import { NoRecordsFoundMessage } from "../../../../_metronic/_helpers";

function Show() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Report Builder");
  const { id } = useParams();
  const { addToast } = useToasts();
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
  const [redirect, setRedirect] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [ruleName, setRuleName] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);
  const [records, setRecords] = React.useState(1);
  const [exportData, setExportData] = React.useState([]);
  const [groupBy, setGroupBy] = React.useState("");
  const [module, setModule] = React.useState(1);
  const [selectedColumn, setSelectedColumn] = React.useState("");
  const getData = React.useCallback(() => {
    Actions.info(id).then(async (response) => {
      if (response.status === "SUCCESS") {
        setRuleName(response.data.queryRule.rule_name);
        const module1 = response.data.queryRule.module;
        const group_by1 = response.data.queryRule.group_by.toString();
        const rule_query1 = response.data.queryRule.rule_query;
        const selected_column1 = response.data.queryRule.selected_column;
        setQuery(response.data.queryRule.rule_query);
        setGroupBy(response.data.queryRule.group_by.toString());
        setQuery(response.data.queryRule.rule_query);
        setSelectedColumn(response.data.queryRule.selected_column);
        Actions.summary({
          rule_query: rule_query1,
          group_by: group_by1,
          module: module1 == 1 ? "leads" : "contacts",
          selected_column: selected_column1,
          size: perPage,
          page: currentPage,
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
              const fromPage = (currentPage - 1) * perPage + 1;
              const toPage =
                (currentPage - 1) * perPage + response.data.results.length;
              setFrom(fromPage);
              setTo(toPage);
              setSummary(response.data.results);
              setColumn(columns);
              Actions.summary({
                rule_query: rule_query1,
                group_by: group_by1,
                module: module1 == 1 ? "leads" : "contacts",
                selected_column: selected_column1,
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
        addToast(response.message, { appearance: "error", autoDismiss: true });
        setRedirect(true);
      }
    });
  }, [id, addToast]);

  React.useEffect(getData, []);

  const getRecords = (perPageSize, currentPageNumber) => {
    Actions.summary({
      rule_query: query,
      group_by: groupBy,
      module: module == 1 ? "leads" : "contacts",
      selected_column: selectedColumn,
      size: perPageSize,
      page: currentPageNumber,
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
  };

  const checkValue = (e) => {
    setPerPage(e.target.value);
    setCurrentPage(1);
    getRecords(e.target.value, 1);
  };

  const totalPages = Math.ceil(records / perPage);

  return (
    <>
      <div className="col-md-12">
        {" "}
        <OverlayTrigger placement="top" overlay={<Tooltip>Back</Tooltip>}>
          <Link
            to="/report-builder"
            className="abtn1"
            style={{ marginLeft: "-13px" }}
          >
            <KeyboardBackspaceIcon />
          </Link>
        </OverlayTrigger>
      </div>

      <div className="rk-sub-header mb-5">{ruleName}</div>
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
                          getRecords(perPage, page);
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
    </>
  );
}

export default React.memo(Show);
