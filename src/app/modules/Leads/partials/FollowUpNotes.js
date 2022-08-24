import React from "react";
import { Link, useLocation, useParams, Redirect } from "react-router-dom";
import { Image } from "react-bootstrap";
import { nl2br } from "../../../helpers/Helper";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import App from "../../../Configs/app";
import moment from "moment";
import CallIcon from "@material-ui/icons/Call"; // for the call icon
import EmailIcon from "@material-ui/icons/Email"; // for the mail icon
import PeopleIcon from "@material-ui/icons/People"; // for the meet icon
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined"; // for the task icon
import CheckRoundedIcon from "@material-ui/icons/CheckRounded"; // for the visit icon

function Comment({ followupNote }) {
  const { id } = useParams();

  //const picture = followupNote?.user && followupNote.user?.picture !== '' ? App.assetUrl + followupNote.user?.picture : toAbsoluteUrl("/media/users/default.jpg");
  return (
    <>
      <div className="row comment pt-5">
        {/* <div className="col-md-1 text-center">
                <Image className="avatar" src={picture} roundedCircle /> 
            </div> */}
        <div className="col-md-12">
          <ul className="pl-5">
            <li>
              <div className="row">
                <div className="col-md-9">
                  <h3>
                    {followupNote.follow_up_type === "call" ? (
                      <CallIcon />
                    ) : followupNote.follow_up_type === "email" ? (
                      <EmailIcon />
                    ) : followupNote.follow_up_type === "meeting" ? (
                      <PeopleIcon />
                    ) : followupNote.follow_up_type === "task" ? (
                      <AssignmentOutlinedIcon />
                    ) : (
                      <CheckRoundedIcon />
                    )}{" "}
                    {followupNote.get_created_by &&
                      followupNote.get_created_by.name}
                    {followupNote.assign_type === 2 ? (
                      <span className="ml-3">
                        assign to{" "}
                        {followupNote.get_assign_to_data &&
                          followupNote.get_assign_to_data.name}
                      </span>
                    ) : followupNote.assign_type === 3 ? (
                      <span className="ml-2">assign to Self</span>
                    ) : (
                      <span className="ml-2">
                        assign to{" "}
                        {typeof followupNote.get_role !== "undefind" &&
                        followupNote.get_role
                          ? followupNote.get_role.name
                          : ""}
                      </span>
                    )}
                  </h3>
                </div>
                <div className="col-md-3">
                  <span className="text-muted float-right1">
                    {moment(followupNote.dt).format("LLL")}
                  </span>
                </div>
              </div>
            </li>
            <li>
              <h5
              style={{ marginLeft: "25px" }}
                dangerouslySetInnerHTML={{ __html: nl2br(followupNote.note) }}
              ></h5>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default React.memo(Comment);
