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
            right: "46px",
          }}
        >
          {" "}
          <Button
            onClick={() => {
              setShow(!show);
            }}
            className="rk-add-btn mb-4"
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
                margin: "-9px 0px",
                textAlign: "left",
                maxHeight: "60vh",
                overflowY: "auto",
                width: "200px",
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

  return (
    <div>
      <ToolkitProvider
        keyField="id"
        data={data}
        columns={columns}
        columnToggle
        exportCSV={{ onlyExportFiltered: true, exportAll: false }}
        //pagination={paginationFactory()}
      >
        {(props) => (
          <div className="row ">
            <div className="col-md-10">
              {/*    {user.permission.Contact && user.permission.Contact.map((item) => {
                return (
                  item.name === "Create" && ( */}
              <Link to="/contacts/add" className="rk-add-btn">
                <AddIcon />
                Add Contact
              </Link>
              {/*                   )
                  );
                })} */}
              &nbsp;
              <Link to="/contacts/import" className="rk-add-btn">
                <CloudUploadIcon />
                &nbsp;Import Contacts
              </Link>
              &nbsp;
              <Link>
                <ExportCSVButton
                  {...props.csvProps}
                  className="rk-add-btn text-white ml-2 mr-2"
                  style={{ marginBottom: "17px" }}
                >
                  <CloudDownloadIcon />
                  &nbsp;Export CSV
                </ExportCSVButton>
              </Link>
            </div>
            {/* <div className="col">
              <ExportCSVButton
                {...props.csvProps}
                className="rk-add-btn text-white mb-4 ml-2 mr-2 "
              >
                Export CSV
              </ExportCSVButton>
            </div> */}
            <div className="col">
              <CustomToggleList {...props.columnToggleProps} />
            </div>

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
