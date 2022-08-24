import React from "react";
import { useSubheader } from "../../../../_metronic/layout";
import {
   Card,
} from "react-bootstrap";
import Pagination from "@material-ui/lab/Pagination";
import Actions from "../Actions";
import Table from "./Table";
import {
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";

export default React.memo(() => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Notice");
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [records, setRecords] = React.useState(1);
  const [items, setItems] = React.useState([]);
  const [perPage, setPerPage] = React.useState(10);
  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(10);
 const columns = [
    {
      dataField: "id",
      text: "ID",
      csvExport: true,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "notice",
      text: "Notice",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "start_date_time",
      text:
        "Start" /* product_type === 1 ? "Product Price" : "Service Price", */,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      formatter:(date)=>{
          if(date){
            let dateObj = date;
            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            if (typeof date !== "object") {
              dateObj = new Date(date);
            }
            if (dateObj.getHours() >= 12) {
              dateObj.setHours(dateObj.getHours() - 12);
              return `${("0" + dateObj.getDate()).slice(-2)}${" " +
                monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
                "0" + dateObj.getHours()
              ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}PM`;
            }
            return `${("0" + dateObj.getDate()).slice(-2)}${" " +
              monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
              "0" + dateObj.getHours()
            ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}AM`;
          }
        }
    },
    {
      dataField: "end_date_time",
      text:
        "End" /* product_type === 1 ? "Product Price" : "Service Price", */,
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left ml-0",
      headerAlign: "left",
      formatter:(date)=>{
          if(date){
            let dateObj = date;
            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            if (typeof date !== "object") {
              dateObj = new Date(date);
            }
            if (dateObj.getHours() >= 12) {
              dateObj.setHours(dateObj.getHours() - 12);
              return `${("0" + dateObj.getDate()).slice(-2)}${" " +
                monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
                "0" + dateObj.getHours()
              ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}PM`;
            }
            return `${("0" + dateObj.getDate()).slice(-2)}${" " +
              monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} ${(
              "0" + dateObj.getHours()
            ).slice(-2)}:${("0" + dateObj.getMinutes()).slice(-2)}AM`;
          }
        }
    },
  ];
  const getData = React.useCallback(() => {
    setLoading(true);
    Actions.info({
      page: currentPage,
      size: perPage,
      }).then((response) => {
      if (response.status === "SUCCESS") {
        setCurrentPage(response.data.current);
        setItems(response.data.notice);
        setRecords(response.data.totalRecord);
        const fromPage = (currentPage - 1) * perPage + 1;
        const toPage =
          (currentPage - 1) * perPage + response.data.notice.length;
        setFrom(fromPage);
        setTo(toPage);
      }
      setLoading(false);
    });
  }, [currentPage, perPage]);

  React.useEffect(getData, [currentPage, perPage]);

  const totalPages = Math.ceil(records / perPage);

  const checkValue = (e) => {
    setPerPage(e.target.value);
    setCurrentPage(1);
  };
  return (
    <>
      <Card className="rkcrm-card mb-5">
        <Card.Body>
            <div className="rk-table mb-0" size="md">
              {!loading && (
                <div className="text-right">
                  <Table columns={columns} data={items} />
                </div>
              )}
            </div>

            {!loading && records > 0 && (
              <>
                <div className="row" style={{ marginTop: "20px" }}>
                  <div className="col-md-1">
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
                  <div
                    className="col showing-records-line"
                    style={{ textAlign: "right" }}
                  >
                    <span>
                      Showing {from} to {to} from {records}
                    </span>
                  </div>

                  <div className="col text-right">
                    <Pagination
                      siblingCount={0}
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, page) => setCurrentPage(page)}
                      variant="outlined"
                    />
                  </div>
                </div>
              </>
            )}
         </Card.Body>
      </Card>
    </>
  );
});
