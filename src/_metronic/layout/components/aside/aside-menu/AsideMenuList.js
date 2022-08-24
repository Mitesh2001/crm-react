/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
// import SVG from "react-inlinesvg";
import { /* toAbsoluteUrl, */ checkIsActive } from "../../../../_helpers";
import DashboardIcon from "@material-ui/icons/Dashboard";
//import AutorenewIcon from '@material-ui/icons/Autorenew';
import ViewDayIcon from "@material-ui/icons/ViewDay";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import BusinessIcon from "@material-ui/icons/Business";
//import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import PublicIcon from "@material-ui/icons/Public";
//import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ContactMailIcon from "@material-ui/icons/ContactMail";
//import RecentActorsIcon from '@material-ui/icons/RecentActors';
//import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ListAltIcon from "@material-ui/icons/ListAlt";
import DnsIcon from "@material-ui/icons/Dns";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import LanguageIcon from "@material-ui/icons/Language";
import PeopleIcon from "@material-ui/icons/People";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EmailIcon from "@material-ui/icons/Email";
import SmsIcon from "@material-ui/icons/Sms";
import { useSelector } from "react-redux";

export function AsideMenuList({ layoutProps }) {
  const user = useSelector((state) => state.auth.user);
  const permission = user.user_permission;
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <DashboardIcon />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}

        <li
          className={`menu-item ${getMenuItemActive("/calendar", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/calendar">
            <span className="svg-icon menu-icon">
              <CalendarToday />
            </span>
            <span className="menu-text">Calendar</span>
          </NavLink>
        </li>
        {permission.hasOwnProperty("Contact") ? (
          <li
            className={`menu-item ${getMenuItemActive("/contacts", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/contacts">
              <span className="svg-icon menu-icon">
                <ContactMailIcon />
              </span>
              <span className="menu-text">Contacts</span>
            </NavLink>
          </li>
        ) : (
          ""
        )}
        {permission.hasOwnProperty("Telecaller") ? (
          <li
            className={`menu-item ${getMenuItemActive(
              "/telecaller/Addassign",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/telecaller/Addassign">
              <span className="svg-icon menu-icon">
                <LocalMallIcon />
              </span>
              <span className="menu-text">Assign Telecaller</span>
            </NavLink>
          </li>
        ) : (
          ""
        )}
        {permission.hasOwnProperty("ContactFollowup") &&
        permission.hasOwnProperty("LeadFollowup") ? (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/assign",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/assign">
              <span className="svg-icon menu-icon">
                <span className="svg-icon menu-icon">
                  <DnsIcon />
                </span>
              </span>
              <span className="menu-text">Followup Assign</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                {permission.hasOwnProperty("LeadFollowup") ? (
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/assign/leadfollowupassign",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink
                      className="menu-link"
                      to="/assign/leadfollowupassign"
                    >
                      <span className="svg-icon menu-icon">
                        <AccountBalanceIcon />
                      </span>
                      <span className="menu-text">Lead Followup Assign</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}

                {permission.hasOwnProperty("ContactFollowup") ? (
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/assign/contactfollowupassign",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink
                      className="menu-link"
                      to="/assign/contactfollowupassign"
                    >
                      <span className="svg-icon menu-icon">
                        <AccountBalanceIcon />
                      </span>
                      <span className="menu-text">Contact Followup Assign</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </li>
        ) : (
          ""
        )}

        {permission.hasOwnProperty("Lead") ? (
          <li
            className={`menu-item ${getMenuItemActive("/leads", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/leads">
              <span className="svg-icon menu-icon">
                <ViewDayIcon />
              </span>
              <span className="menu-text">Leads</span>
            </NavLink>
          </li>
        ) : (
          ""
        )}
        {permission.hasOwnProperty("Leadassign") ? (
          <li
            className={`menu-item ${getMenuItemActive(
              "/lead/Addassign",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/lead/Addassign">
              <span className="svg-icon menu-icon">
                <LocalMallIcon />
              </span>
              <span className="menu-text">Lead Assign</span>
            </NavLink>
          </li>
        ) : (
          ""
        )}
        {permission.hasOwnProperty("Product") ? (
          <li
            className={`menu-item ${getMenuItemActive("/products", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/products">
              <span className="svg-icon menu-icon">
                <LocalMallIcon />
              </span>
              <span className="menu-text">Products</span>
            </NavLink>
          </li>
        ) : (
          ""
        )}

        {permission.hasOwnProperty("Employees") ? (
          <li
            className={`menu-item ${getMenuItemActive("/employees", false)}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/employees">
              <span className="svg-icon menu-icon">
                <PeopleIcon />
              </span>
              <span className="menu-text">Employees</span>
            </NavLink>
          </li>
        ) : (
          ""
        )}
        {permission.hasOwnProperty("ReportBuilder") ? (
          <li
            className={`menu-item ${getMenuItemActive(
              "/report-builder",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/report-builder">
              <span className="svg-icon menu-icon">
                <LocalMallIcon />
              </span>
              <span className="menu-text">Report Builder</span>
            </NavLink>
          </li>
        ) : (
          ""
        )}
        {permission.hasOwnProperty("EmalSmsLog") ? (
          <li
            className={`menu-item ${getMenuItemActive(
              "/email-and-sms-log",
              false
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/email-and-sms-log">
              <span className="svg-icon menu-icon">
                <ListAltIcon />
              </span>
              <span className="menu-text">Email and Sms Log</span>
            </NavLink>
          </li>
        ) : (
          ""
        )}

        {permission.hasOwnProperty("Requisitionform") &&
        permission.hasOwnProperty("IndustryType") &&
        permission.hasOwnProperty("CompanyType") &&
        permission.hasOwnProperty("Country") &&
        permission.hasOwnProperty("State") &&
        permission.hasOwnProperty("Email") &&
        permission.hasOwnProperty("Sms") &&
        permission.hasOwnProperty("Requisitionform") ? (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/master",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/master">
              <span className="svg-icon menu-icon">
                <span className="svg-icon menu-icon">
                  <DnsIcon />
                </span>
              </span>
              <span className="menu-text">Master Modules</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                {permission.hasOwnProperty("IndustryType") ? (
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/master/industries",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/master/industries">
                      <span className="svg-icon menu-icon">
                        <AccountBalanceIcon />
                      </span>
                      <span className="menu-text">Industry Types</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
                {permission.hasOwnProperty("CompanyType") ? (
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/master/company-types",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/master/company-types">
                      <span className="svg-icon menu-icon">
                        <BusinessIcon />
                      </span>
                      <span className="menu-text">Company Types</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
                {permission.hasOwnProperty("Country") ? (
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/master/countries",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/master/countries">
                      <span className="svg-icon menu-icon">
                        <PublicIcon />
                      </span>
                      <span className="menu-text">Countries</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}

                {permission.hasOwnProperty("State") ? (
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/master/states",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/master/states">
                      <span className="svg-icon menu-icon">
                        <LanguageIcon />
                      </span>
                      <span className="menu-text">States</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
                {permission.hasOwnProperty("Email") ? (
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/email",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/email">
                      <span className="svg-icon menu-icon">
                        <EmailIcon />
                      </span>
                      <span className="menu-text">Email</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
                {permission.hasOwnProperty("Sms") ? (
                  <li
                    className={`menu-item ${getMenuItemActive("/SMS", false)}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/SMS">
                      <span className="svg-icon menu-icon">
                        <SmsIcon />
                      </span>
                      <span className="menu-text">SMS</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}

                {permission.hasOwnProperty("Requisitionform") ? (
                  <li
                    className={`menu-item ${getMenuItemActive(
                      "/requisitionform",
                      false
                    )}`}
                    aria-haspopup="true"
                  >
                    <NavLink className="menu-link" to="/requisitionform">
                      <span className="svg-icon menu-icon">
                        <ViewDayIcon />
                      </span>
                      <span className="menu-text">Requisitionform</span>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </li>
        ) : (
          ""
        )}

        {permission.hasOwnProperty("Roles") ? (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/rp",
              true
            )}`}
            aria-haspopup="true"
            data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/rp">
              <span className="svg-icon menu-icon">
                <span className="svg-icon menu-icon">
                  <PlaylistAddCheckIcon />
                </span>
              </span>
              <span className="menu-text">Roles</span>
              <i className="menu-arrow" />
            </NavLink>
            <div className="menu-submenu ">
              <i className="menu-arrow" />
              <ul className="menu-subnav">
                <li
                  className={`menu-item ${getMenuItemActive(
                    "/rp/roles",
                    false
                  )}`}
                  aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/rp/roles">
                    <span className="svg-icon menu-icon">
                      <ListAltIcon />
                    </span>
                    <span className="menu-text">Roles</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
        ) : (
          ""
        )}

        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/notifications",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/notifications">
            <span className="svg-icon menu-icon">
              <span className="svg-icon menu-icon">
                <DnsIcon />
              </span>
            </span>
            <span className="menu-text">Notifications</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive(
                  "/notifications/notices",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/notifications/notices">
                  <span className="svg-icon menu-icon">
                    <AccountBalanceIcon />
                  </span>
                  <span className="menu-text">Notices</span>
                </NavLink>
              </li>

              <li
                className={`menu-item ${getMenuItemActive(
                  "/notifications/announcements",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link"
                  to="/notifications/announcements"
                >
                  <span className="svg-icon menu-icon">
                    <AccountBalanceIcon />
                  </span>
                  <span className="menu-text">Announcements</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
