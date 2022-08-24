import React from "react";
import {
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Button,
  Modal,
  Collapse,
  Form,
  ListGroup,
} from "react-bootstrap";
import Actions from "../Actions";
import { Link, useParams } from "react-router-dom";

function Activities({ lead }) {
  const { id } = useParams();
  const [info, setInfo] = React.useState([]);
  const getData = React.useCallback(() => {
    Actions.loginfo({ assign_id: id, type: 1 }).then((response) => {
      if (response.status === "SUCCESS") {
        setInfo(response.data.assignLog);
      }
    });
  }, []);

  const timeUtil = (val) => {
    var month = [
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
    let dateObj = val;
    if (typeof val !== "object") {
      dateObj = new Date(val);
    }
    return `${("0" + dateObj.getDate()).slice(-2)} ${
      month[dateObj.getMonth()]
    }-${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
  };

  React.useEffect(getData, []);

  return (
    <>
      <span>Recent Acitivites</span>
      <ListGroup>
        {/* <ListGroup.Item>
          1. Lead created at 20 October 2020 12:00 PM By{" "}
          {info && info[0].get_created_by.name}
        </ListGroup.Item> */}
        {info.map((log, index) => {
          return (
            <>
              {index === 0 ? (
                <ListGroup.Item>
                  {log.lead_created_by && (
                    <>
                      {" "}
                      &#8226; Lead created at {timeUtil(log.created_at)} PM By{" "}
                      {log.lead_created_by.name}
                    </>
                  )}
                </ListGroup.Item>
              ) : null}
              {log.get_user_data && (
                <>
                  {" "}
                  <ListGroup.Item>
                    &#8226; Lead Assigned to {log.get_user_data.name}
                    {log.get_created_by && <> by {log.get_created_by.name}</>}
                    {index === 0 ? (
                      <strong> [Currently Assigned to this user]</strong>
                    ) : null}
                  </ListGroup.Item>
                </>
              )}
            </>
          );
        })}
        {/* <ListGroup.Item>
          1. Lead Assigned to Anish parish by Admin
        </ListGroup.Item> */}
      </ListGroup>
    </>
  );
}

export default React.memo(Activities);
