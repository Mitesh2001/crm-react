/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_helpers";
import CallIcon from "@material-ui/icons/Call"; // for the call icon
import EmailIcon from "@material-ui/icons/Email"; // for the mail icon
import PeopleIcon from "@material-ui/icons/People"; // for the meet icon
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined"; // for the task icon
import CheckRoundedIcon from "@material-ui/icons/CheckRounded"; // for the visit icon

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: true,
};

export function ListsWidget4({ className, data }) {
  if (data.length > 0) {
    return (
      <>
        <div
          className={`card card-custom ${className}`}
          style={{ border: "2px solid #C0C0C0", borderRadius: "5px" }}
        >
          {/* Head */}
          <div className="card-header border-0">
            <h3 className="card-title font-weight-bolder text-dark">
              Follow Ups
            </h3>
          </div>
          {/* Body */}
          <div className="card-body pt-2">
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="scroll pr-7 mr-n7"
              style={{ maxHeight: "50vh", position: "relative" }}
            >
              {data.map((item) => {
                if (item && item.get_follow_up) {
                  return (
                    <Link
                      to={
                        item.get_follow_up.type === 1
                          ? "/leads/" + item.get_follow_up.follow_up_id + "/show"
                          : "/contacts/" + item.get_follow_up.follow_up_id + "/show"
                      }
                      className="abtn text-info "
                    >
                      <div className="d-flex align-items-center mb-10">
                        <div className="symbol symbol-40 symbol-light-success mr-5">
                          <span className="symbol-label">
                            <SVG
                              className="h-75 align-self-end"
                              src={toAbsoluteUrl(
                                "/media/svg/avatars/009-boy-4.svg"
                              )}
                            ></SVG>
                          </span>
                        </div>

                        <div className="d-flex flex-column flex-grow-1 font-weight-bold">
                          {item.name && (
                            <p className="text-dark text-hover-primary mb-1 font-size-lg">
                              {item.name}
                            </p>
                          )}
                          <span className="text-muted font-weight-bold">
                            {item.get_follow_up.follow_up_type === 1 ? (
                              <CallIcon />
                            ) : item.get_follow_up.follow_up_type === 4 ? (
                              <EmailIcon />
                            ) : item.get_follow_up.follow_up_type === 3 ? (
                              <PeopleIcon />
                            ) : item.get_follow_up.follow_up_type === 5 ? (
                              <AssignmentOutlinedIcon />
                            ) : (
                              <CheckRoundedIcon />
                            )}
                            &nbsp;{item.get_follow_up.note.substr(0, 50)}
                          </span>
                        </div>
                        {/* <div style={{marginLeft: -20px}}>
                          <p>{item.type===1 ? 'Leads' : 'Contacts'}</p>
                        </div> */}
                        <VisibilityIcon />
                      </div>
                    </Link>
                  );
                } else {
                  return null;
                }
              })}
            </PerfectScrollbar>
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
}
