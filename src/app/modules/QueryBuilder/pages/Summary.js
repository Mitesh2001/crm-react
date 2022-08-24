import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import { Link, useParams } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";

import {
  Form,
  Container,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";

export default function Summary(props) {
  const { ExportCSVButton } = CSVExport;
  const { id } = useParams();
  const columns = props.columns;
  const data = props.data;
  const exportData = props.exportData;
  const { SearchBar } = Search;
  const [currentPage, setCurrentPage] = React.useState(1);

  const MyExportCSV = (props) => {
    const handleClick = () => {
      // passing my custom data
      props.onExport(exportData);
    };
    return (
      <div>
        <Link
          to="#"
          {...props.csvProps}
          className="rk-btn3 rk-btn-icon btn btn-primary btn-sm"
          onClick={handleClick}
        >
          <CloudDownloadIcon />
          Export CSV
        </Link>
      </div>
    );
  };

  const CustomToggleList = ({ columns, onColumnToggle, toggles }) => {
    const [show, setShow] = React.useState(false);

    return (
      <div style={{ textAlign: "left" }}>
        <nav
          onMouseLeave={() => {
            if (show) {
              setShow(!show);
            }
          }}
          style={{
            position: "absolute",
            zIndex: "2",
            left: "4px",
            // height:"45px"
          }}
        >
          {" "}
          <Button
            onClick={() => {
              setShow(!show);
            }}
            className="rk-btn2 rk-btn-icon btn btn-primary btn-sm"
          >
            <ArrowDropDownIcon />
            Select Columns
          </Button>
          {show && (
            <ul
              style={{
                backgroundColor: "#FFF",
                border: "2px solid black",
                padding: "0",
                margin: "2px 0px",
                textAlign: "left",
                maxHeight: "60vh",
                overflowY: "auto",
                width: "180px",
              }}
            >
              {columns
                .map((column) => ({
                  ...column,
                  toggle: toggles[column.dataField],
                }))

                .map((column, index) => (
                  <li
                    style={{
                      backgroundColor: "#FFF",
                      margin: "10px 12px",
                      listStyle: "none",
                    }}
                  >
                    {column.dataField && (
                      <Form.Check
                        id={index}
                        type="checkbox"
                        key={column.dataField}
                        inline
                        label={column.text}
                        checked={column.toggle}
                        aria-checked={column.toggle ? "true" : "false"}
                        onChange={() => {
                          onColumnToggle(column.dataField);
                        }}
                      />
                    )}
                  </li>
                ))}
            </ul>
          )}
        </nav>
      </div>
    );
  };

  const MySearch = (props) => {
    let input;
    const handleClick = () => {
      props.onSearch(input.value);
    };
    return (
      <div>
        <input
          className="form-control"
          style={{ size: "10px",display:"none"}}
          ref={(n) => (input = n)}
          size="sm"
          type="text"
          placeholder="Search.."
          onChange={handleClick}
        />
      </div>
    );
  };
  return (
    <div>
      <ToolkitProvider
        keyField="rule_name"
        data={data}
        columns={columns}
        columnToggle
        search
        exportCSV={{ onlyExportFiltered: true, exportAll: false }}
      >
        {(props) => (
          <div className="row">
            <div
              className="col-md-6 text-right"
              style={{
                paddingLeft: "20px",
                paddingRight: "0",
              }}
            >
              <MySearch {...props.searchProps} />
            </div>
            <div
              className="col-md-4 text-right"
              style={{ paddingRight: "0px" }}
            >
              <Link
                to={"/report-builder/" + id + "/edit"}
                className="rk-btn1 rk-btn-icon btn btn-primary btn-sm"
              >
                <EditIcon />
                &nbsp;Edit Report
              </Link>
              &nbsp;
              <Link
                onClick={() => {
                  props.csvProps.onExport(exportData);
                }}
              >
                <ExportCSVButton
                  {...props.csvProps}
                  className="rk-btn3 rk-btn-icon btn btn-primary btn-sm"
                >
                  <CloudDownloadIcon />
                  &nbsp;Export CSV
                </ExportCSVButton>
              </Link>
            </div>

            <div className="col">
              <CustomToggleList {...props.columnToggleProps} />
            </div>
            <BootstrapTable
              //wrapperClasses="table-responsive "
              classes="table table-head-custom table-vertical-center"
              bootstrap4
              hover
              {...props.baseProps}
            />
            <PleaseWaitMessage entities={data} />
            <NoRecordsFoundMessage entities={data} />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
}
