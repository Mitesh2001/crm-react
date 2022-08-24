import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useSelector } from "react-redux";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import filterFactory, {
  textFilter,
  numberFilter,
  Comparator,
} from "react-bootstrap-table2-filter";
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

export default function Table(props) {
  const { ExportCSVButton } = CSVExport;
  const columns = props.columns;
  const data = props.data;
  const { SearchBar } = Search;
  const [queryParams, setQueryParams] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const { user } = useSelector((state) => state.auth);


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
            right: "14px",
          }}
        >
          {" "}
          <Button
            onClick={() => {
              setShow(!show);
            }}
            className="rk-btn2 rk-btn-icon btn btn-primary btn-sm ml-1"
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
          placeholder="Search Role"
          onChange={handleClick}
        />
      </div>
    );
  };

  //   const Search =()=>{

  //     <InputGroup className="mb-0">
  //     <FormControl
  //         name="name"
  //         size="sm"
  //         type="text"
  //         onKeyDown={handleKeyDown}
  //         placeholder="Search.."
  //         onChange={(e) => setQueryParams({ ...queryParams, searchTxt: e.target.value })}
  //         required
  //     />
  //     <InputGroup.Append>
  //         <Button size="sm" onClick={getData} variant="outline-secondary">Search</Button>
  //     </InputGroup.Append>
  // </InputGroup>
  //   }
  const checkValidity=(date)=>{
    return new Date(date).getTime() > new Date(new Date()).getTime();
  }
  return (
    <div>
      <ToolkitProvider
        keyField="email_template_id"
        data={data}
        columns={columns}
        columnToggle
        exportCSV={{ onlyExportFiltered: true, exportAll: false }}
        search
      >
        {(props) => (
          <div className="row">
            <div className="col-md-5 ml-2">
              <MySearch {...props.searchProps} />
            </div>
            <div className="col-md-5 ml-11">
              {checkValidity(user.company_details.expiry_date) && user.user_permission &&
                user.user_permission.Roles &&
                user.user_permission.Roles.map((item) => {
                  return (
                    item.name === "Add" && (
                      <Link
                        to="/rp/roles/add"
                        className="rk-btn1 rk-btn-icon btn btn-primary btn-sm"
                      >
                        <AddIcon />
                        Add Role
                      </Link>
                    )
                  );
                })}
              &nbsp;
              <Link>
                <ExportCSVButton
                  {...props.csvProps}
                  className="rk-btn3 rk-btn-icon btn btn-primary btn-sm mr-2"
                >
                  <CloudDownloadIcon />
                  &nbsp;Export CSV
                </ExportCSVButton>
              </Link>
            </div>
            <div className="row">
              {" "}
              <CustomToggleList {...props.columnToggleProps} />
            </div>

            <BootstrapTable
              filter={filterFactory()}
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
