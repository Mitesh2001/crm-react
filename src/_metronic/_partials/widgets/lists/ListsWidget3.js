/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_helpers";
import PerfectScrollbar from "react-perfect-scrollbar";
import VisibilityIcon from "@material-ui/icons/Visibility";

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: true,
};

export function ListsWidget3({ className, data }) {
  if (data.length > 0) {
    return (
      <>
        <div
          className={`card card-custom ${className}`}
          style={{ border: "2px solid #C0C0C0", borderRadius: "5px" }}
        >
          {/* Head */}
          <div className="card-header border-0">
            <h3 className="card-title font-weight-bolder text-dark">Leads</h3>
          </div>
          <div className="card-body pt-2">
            <PerfectScrollbar
              options={perfectScrollbarOptions}
              className="scroll pr-7 mr-n7"
              style={{ maxHeight: "50vh", position: "relative" }}
            >
              {data.map((lead) => {
                if (lead) {
                  return (
                    <Link
                      to={"/leads/" + lead.id + "/show"}
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
                          {lead.lead_name && (
                            <a
                              href="#"
                              className="text-dark text-hover-primary mb-1 font-size-lg"
                            >
                              {lead.lead_name}
                            </a>
                          )}
                          {lead.mobile_no && (
                            <span className="text-muted">{lead.mobile_no}</span>
                          )}
                        </div>

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
