import React, { useState } from "react";
//import styles from "./styles.modules.scss";
//import "bootstrap/dist/css/bootstrap.css";
//import "font-awesome/css/font-awesome.min.css";
import { useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
//import filterFactory from "react-bootstrap-table2-filter";
import filterFactory, {
  textFilter,
  numberFilter,
  Comparator,
} from "react-bootstrap-table2-filter";
import { Form, Container, Button } from "react-bootstrap";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
export default function Table(props) {
  const { ExportCSVButton } = CSVExport;
  const columns = props.columns;
  const data = props.data;
  const { SearchBar } = Search;
  const CustomToggleList = ({ columns, onColumnToggle, toggles }) => {
    const [show, setShow] = React.useState(false);
    return (
      <div style={{ textAlign: "right" }}>
        <nav
          onMouseLeave={() => {
            if (show) {
              setShow(!show);
            }
          }}
          style={{
            position: "absolute",
            zIndex: "2",
            right: "4px",
          }}
        >
          {" "}
          <Button
            onClick={() => {
              setShow(!show);
            }}
            className="rk-btn2 rk-btn-icon btn btn-primary btn-sm mr-12"
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
          style={{ size: "10px" }}
          ref={(n) => (input = n)}
          size="sm"
          type="text"
          placeholder="Search"
          onChange={handleClick}
        />
      </div>
    );
  };

  return (
    <div>
      <ToolkitProvider
        keyField="id"
        data={data}
        columns={columns}
        columnToggle
        exportCSV={{ onlyExportFiltered: true, exportAll: false }}
        search
        //pagination={paginationFactory()}
      >
        {(props) => (
          <div className="row ">
            <div className="col-md-5 ml-2 mr-4">
              <MySearch {...props.searchProps} />
            </div>
            <div className="row">
              <CustomToggleList {...props.columnToggleProps} />
            </div>

            {/*             <div className="row">
              <CustomToggleList {...props.columnToggleProps} />
            </div>
 */}
            <BootstrapTable
              //pagination={paginationFactory()}
              {...props.baseProps}
              filter={filterFactory()}
              //wrapperClasses="table-responsive "
              classes="table table-head-custom table-vertical-center"
              bootstrap4
              hover
            />
            <PleaseWaitMessage entities={data} />
            <NoRecordsFoundMessage entities={data} />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
}
