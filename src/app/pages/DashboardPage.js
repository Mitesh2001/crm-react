import React from "react";
//import { Dashboard } from "../../_metronic/_partials";
import { Link } from "react-router-dom";
import {
  Card,
  OverlayTrigger,
  Tooltip,
  Button,
  Modal,
  Collapse,
  Form,
} from "react-bootstrap";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PlayArrowOutlined from "@material-ui/icons/PlayArrowOutlined";
import DownloadIcon from "@material-ui/icons/GetApp";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import BallotIcon from "@material-ui/icons/Ballot";
import ControlPointDuplicateIcon from "@material-ui/icons/ControlPointDuplicate";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Actions from "./Actions";
import { ListsWidget3, ListsWidget4 } from "../../_metronic/_partials/widgets";
import Chart from "./Chart";
import Pie from "./Pie";
import Pie1 from "./Pie1";
import Table from "./Table";

export function DashboardPage() {
  const [leadData, setLeadData] = React.useState([]);
  const [data, setData] = React.useState({});
  const [monthData, setMonthData] = React.useState([]);
  const [followUp, setFollowUp] = React.useState([]);
  const base64toPDF = (data) => {};
  const base64ToArrayBuffer = (data) => {
    var bString = window.atob(data);
    var bLength = bString.length;
    var bytes = new Uint8Array(bLength);
    for (var i = 0; i < bLength; i++) {
      var ascii = bString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  };
  const handleClick = (id, uid) => {
    Actions.invoice(id).then((response) => {
      var bufferArray = base64ToArrayBuffer(response.data);
      var blobStore = new Blob([bufferArray], { type: "application/pdf" });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobStore);
        return;
      }
      var data = window.URL.createObjectURL(blobStore);
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.href = data;
      link.download = "INVOICE_" + uid + ".pdf";
      link.click();
      window.URL.revokeObjectURL(data);
      link.remove();
    });
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "subscriptions_uid",
      text: "Reference ID",
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "payment_mode",
      text: "Mode of Payment",
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "final_amount",
      text: "Final Amount",
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      dataField: "is_payment_pending",
      text: "Pending",
      classes: "text-left ml-0",
      headerAlign: "left",
    },
    {
      text: "Action",
      formatter: (rowContent, row) => {
        return (
          <div className="actions-btns">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Download Invoice</Tooltip>}
            >
              <Link
                to="#"
                className="abtn text-primary"
                onClick={() => handleClick(row.id, row.subscriptions_uid)}
              >
                <DownloadIcon />
              </Link>
            </OverlayTrigger>
          </div>
        );
      },
      csvExport: false,
      classes: "text-left ml-0",
      headerStyle: (colum, colIndex) => {
        return { width: "120px", textAlign: "left" };
      },
      headerClasses: "pr-3",
      style: {
        minWidth: "120px",
      },
    },
  ];

  const getInfo = React.useCallback(() => {
    Actions.dashboard().then((response) => {
      if (response.status === "SUCCESS") {
        setLeadData(response.data.leadData);
        setData(response.data);
        setFollowUp(response.data.followUpData);
        if (response.data.monthWiseLead) {
          setMonthData(
            Object.values(Object.entries(response.data.monthWiseLead)).map(
              ([i, j]) => {
                return j;
              }
            )
          );
        }
        setTimeout(getInfo, 15000);
      }
    });
  }, []);
  React.useEffect(getInfo, []);

  return (
    <div className="dashboard">
      <div className="row">
        {data && leadData && (
          <div className="col-lg-3 dashboard-data">
            <Card className="widget">
              <Card.Body
                className="p-2"
                style={{ border: "2px solid #C0C0C0", borderRadius: "5px" }}
              >
                <div className="row">
                  <div className="col-lg-4 pr-0">
                    <div className="icon kesri">
                      <GroupAddIcon />
                    </div>
                  </div>
                  <div className="col-lg-8 info pt-3">
                    <Link to={"/contacts"} className="abtn text-info ">
                      <h6>New Customers</h6>
                      <h1>{data.contactCount ? data.contactCount : 0}</h1>
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
        {data && leadData && (
          <div className="col-lg-3 dashboard-data">
            <Card className="widget">
              <Card.Body
                className="p-2"
                style={{ border: "2px solid #C0C0C0", borderRadius: "5px" }}
              >
                <div className="row">
                  <div className="col-lg-4 pr-0">
                    <div className="icon cyan">
                      <BallotIcon />
                    </div>
                  </div>
                  <div className="col-lg-8 info pt-3">
                    <Link to={"/leads"} className="abtn text-info ">
                      <h6>Total Leads</h6>
                      <h1>{leadData.length ? leadData.length : 0}</h1>
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
        {/* {data&&<div className="col-lg-4 dashboard-data">
          <Card className="widget">
            <Card.Body className="p-2">
              <div className="row">
                <div className="col-lg-4 pr-0">
                  <div className="icon cyan">
                    <BallotIcon />
                  </div>
                </div>
                <div className="col-lg-8 info pt-3">
                  <h6>Lead Conversion Ratio</h6>
                  <h1>{data.leadConversionRatio}</h1>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>} */}
        {/* {data&&<div className="col-lg-4 dashboard-data">
          <Card className="widget">
            <Card.Body className="p-2">
              <div className="row">
                <div className="col-lg-4 pr-0">
                  <div className="icon green">
                    <ControlPointDuplicateIcon />
                  </div>
                </div>
                <div className="col-lg-8 info pt-3">
                  <h6>Telecalling Assign Ratio</h6>
                  <h1>{data?.telecallingAssignRatio}</h1>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>} */}
        {data && (
          <div className="col-lg-3 dashboard-data">
            <Card className="widget">
              <Card.Body
                className="p-2"
                style={{ border: "2px solid #C0C0C0", borderRadius: "5px" }}
              >
                <div className="row">
                  <div className="col-lg-4 pr-0">
                    <div className="icon purple">
                      <GroupAddIcon />
                    </div>
                  </div>
                  <div className="col-lg-8 info pt-3">
                  <Link
                      to={"/leads"}
                      className="abtn text-info "
                    >
                    <h6>New Leads</h6>
                    <h1>{data.newLead ? data.newLead : 0}</h1>
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
        {data && (
          <div className="col-lg-3 dashboard-data">
            <Card className="widget">
              <Card.Body
                className="p-2"
                style={{ border: "2px solid #C0C0C0", borderRadius: "5px" }}
              >
                <div className="row">
                  <div className="col-lg-4 pr-0">
                    <div className="icon green">
                      <NotificationsIcon />
                    </div>
                  </div>
                  <div className="col-lg-8 info pt-3">
                    <Link
                      to={"/notifications/announcements"}
                      className="abtn text-info "
                    >
                      <h6>Announcements</h6>
                      <h1>
                        {data?.announcement ? data.announcement.length : 0}
                      </h1>
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
      <br />
      <div className="row">
        {followUp && followUp.length > 0 && (
          <div className="col-md-6 col-xxl-4 order-1 order-xxl-2">
            <ListsWidget4 className="card-stretch gutter-b" data={followUp} />
          </div>
        )}
        {leadData && leadData.length > 0 && (
          <div className="col-md-6 col-xxl-4 order-1 order-xxl-2">
            <ListsWidget3 className="card-stretch gutter-b" data={leadData} />
          </div>
        )}
      </div>
      <br />
      <div className="row">
        {data.runningSubscriptionList && (
          <div className="col-md-12">
            <Table columns={columns} data={data.runningSubscriptionList} />
          </div>
        )}
      </div>
      <div className="row">
        {data &&
          data.leadConversionRatio &&
          data.leadConversionRatio.length !== 0 && (
            <div className="col-md-3">
              <Pie
                className="card-stretch gutter-b"
                data1={data.leadConversionRatio.totalLead}
                data2={data.leadConversionRatio.totalConvertedLead}
                title="Lead Conversion Ratio"
              />
            </div>
          )}
        {data &&
          data.telecallingAssignRatio &&
          data.telecallingAssignRatio.length !== 0 && (
            <div className="col-md-3">
              <Pie
                className="card-stretch gutter-b"
                data1={data.telecallingAssignRatio.totalLead}
                data2={data.telecallingAssignRatio.leadAssignTotal}
                title="Tele Calling Assign Ratio"
              />
            </div>
          )}
        {data && data.email && data.email.length !== 0 && (
          <div className="col-md-3">
            <Pie1
              className="card-stretch gutter-b"
              data1={data.email.total}
              data2={data.email.balance}
              title="Email Subscription"
            />
          </div>
        )}
        {data && data.sms && data.sms.length !== 0 && (
          <div className="col-md-3">
            <Pie1
              className="card-stretch gutter-b"
              data1={data.sms.total}
              data2={data.sms.balance}
              title="Sms Subcription"
            />
          </div>
        )}
        {monthData && monthData.length >= 0 && (
          <div className="col-md-6 col-xxl-4 order-1 order-xxl-2">
            <Chart className="card-stretch gutter-b" data1={monthData} />
          </div>
        )}
      </div>
    </div>
  );
}
