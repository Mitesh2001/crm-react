/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
// import SVG from "react-inlinesvg";
import { /* toAbsoluteUrl, */ checkIsActive } from "../../../../_helpers";
import DashboardIcon from '@material-ui/icons/Dashboard';
//import AutorenewIcon from '@material-ui/icons/Autorenew';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import BusinessIcon from '@material-ui/icons/Business';
//import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import PublicIcon from '@material-ui/icons/Public';
//import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ContactMailIcon from '@material-ui/icons/ContactMail';
//import RecentActorsIcon from '@material-ui/icons/RecentActors';
//import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DnsIcon from '@material-ui/icons/Dns';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import LanguageIcon from '@material-ui/icons/Language';
import PeopleIcon from '@material-ui/icons/People';
import LocalMallIcon from '@material-ui/icons/LocalMall';

export function AsideMenuList({ layoutProps }) {
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
        <li className={`menu-item ${getMenuItemActive("/leads", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/leads">
            <span className="svg-icon menu-icon"><ViewDayIcon /></span>
            <span className="menu-text">Leads</span>
          </NavLink>
        </li>

        <li className={`menu-item ${getMenuItemActive("/contacts", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/contacts">
            <span className="svg-icon menu-icon"><ContactMailIcon /></span>
            <span className="menu-text">Contacts</span>
          </NavLink>
        </li>
		
		<li className={`menu-item ${getMenuItemActive("/contactform", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/contactform">
            <span className="svg-icon menu-icon"><ContactMailIcon /></span>
            <span className="menu-text">Contact Form</span>
          </NavLink>
        </li>
        
        <li className={`menu-item ${getMenuItemActive("/employees", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/employees">
            <span className="svg-icon menu-icon"><PeopleIcon /></span>
            <span className="menu-text">Employees</span>
          </NavLink>
        </li>
        
        <li className={`menu-item ${getMenuItemActive("/products", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/products">
            <span className="svg-icon menu-icon"><LocalMallIcon /></span>
            <span className="menu-text">Products</span>
          </NavLink>
        </li>
		<li className={`menu-item ${getMenuItemActive("/telecaller/Viewassign", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/telecaller/Viewassign">
            <span className="svg-icon menu-icon"><LocalMallIcon /></span>
            <span className="menu-text">View Assigned Telecaller</span>
          </NavLink>
        </li>
		<li className={`menu-item ${getMenuItemActive("/telecaller/Addassign", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/telecaller/Addassign">
            <span className="svg-icon menu-icon"><LocalMallIcon /></span>
            <span className="menu-text">Assign Telecaller</span>
          </NavLink>
        </li>
		{/*
        <li className={`menu-item ${getMenuItemActive("/telecallingmanagement", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/telecallingmanagement">
            <span className="svg-icon menu-icon"><LocalMallIcon /></span>
            <span className="menu-text">Telecallingmanagement</span>
          </NavLink>
        </li>
		*/}

        {/*
        <li
          className={`menu-item ${getMenuItemActive("/customers", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/customers">
            <span className="svg-icon menu-icon">
              <PeopleAltIcon />
            </span>
            <span className="menu-text">Customers</span>
          </NavLink>
        </li>
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

        <li
          className={`menu-item ${getMenuItemActive("/dealers", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dealers">
            <span className="svg-icon menu-icon">
              <RecentActorsIcon />
            </span>
            <span className="menu-text">Dealers</span>
          </NavLink>
        </li>
        */}

        {/*end::1 Level*/}

        {/* begin::section */}
        {/* 
        <li className="menu-section ">
          <h4 className="menu-text">Account Information</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        */}
        {/* 
        <li
          className={`menu-item ${getMenuItemActive("/profile", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/profile">
            <span className="svg-icon menu-icon">
              <PermContactCalendarIcon />
            </span>
            <span className="menu-text">Profile</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/change-password", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/change-password">
            <span className="svg-icon menu-icon">
              <AutorenewIcon />
            </span>
            <span className="menu-text">Change Password</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/logout", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/logout">
            <span className="svg-icon menu-icon">
              <ExitToAppIcon />
            </span>
            <span className="menu-text">Logout</span>
          </NavLink>
        </li>
        */}

        <li className={`menu-item menu-item-submenu ${getMenuItemActive("/master", true)}`} aria-haspopup="true" data-menu-toggle="hover">
          <NavLink className="menu-link menu-toggle" to="/master">
            <span className="svg-icon menu-icon">
              <span className="svg-icon menu-icon"><DnsIcon /></span>
            </span>
            <span className="menu-text">Master Modules</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className={`menu-item ${getMenuItemActive("/master/industries", false)}`} aria-haspopup="true">
                <NavLink className="menu-link" to="/master/industries">
                  <span className="svg-icon menu-icon"><AccountBalanceIcon /></span>
                  <span className="menu-text">Industry Types</span>
                </NavLink>
              </li>
              <li className={`menu-item ${getMenuItemActive("/master/company-types", false)}`} aria-haspopup="true">
                <NavLink className="menu-link" to="/master/company-types">
                  <span className="svg-icon menu-icon"><BusinessIcon /></span>
                  <span className="menu-text">Company Types</span>
                </NavLink>
              </li>
              <li className={`menu-item ${getMenuItemActive("/master/countries", false)}`} aria-haspopup="true">
                <NavLink className="menu-link" to="/master/countries">
                  <span className="svg-icon menu-icon"><PublicIcon /></span>
                  <span className="menu-text">Countries</span>
                </NavLink>
              </li>
              <li className={`menu-item ${getMenuItemActive("/master/states", false)}`} aria-haspopup="true">
                <NavLink className="menu-link" to="/master/states">
                  <span className="svg-icon menu-icon"><LanguageIcon /></span>
                  <span className="menu-text">States</span>
                </NavLink>
              </li>
			<li className={`menu-item ${getMenuItemActive("/email", false)}`} aria-haspopup="true" >
			  <NavLink className="menu-link" to="/email">
				<span className="svg-icon menu-icon"><ViewDayIcon /></span>
				<span className="menu-text">Email</span>
			  </NavLink>
			</li>

			<li className={`menu-item ${getMenuItemActive("/SMS", false)}`} aria-haspopup="true" >
			  <NavLink className="menu-link" to="/SMS">
				<span className="svg-icon menu-icon"><ViewDayIcon /></span>
				<span className="menu-text">SMS</span>
			  </NavLink>
			</li>
			<li className={`menu-item ${getMenuItemActive("/requisitionform", false)}`} aria-haspopup="true" >
			  <NavLink className="menu-link" to="/requisitionform">
				<span className="svg-icon menu-icon"><ViewDayIcon /></span>
				<span className="menu-text">Requisitionform</span>
			  </NavLink>
			</li>
            </ul>
          </div>
        </li>

        <li className={`menu-item menu-item-submenu ${getMenuItemActive("/rp", true)}`} aria-haspopup="true" data-menu-toggle="hover">
          <NavLink className="menu-link menu-toggle" to="/rp">
            <span className="svg-icon menu-icon">
              <span className="svg-icon menu-icon"><PlaylistAddCheckIcon /></span>
            </span>
            <span className="menu-text">Roles & Permissions</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className={`menu-item ${getMenuItemActive("/rp/permissions", false)}`} aria-haspopup="true">
                <NavLink className="menu-link" to="/rp/permissions">
                  <span className="svg-icon menu-icon"><ListAltIcon /></span>
                  <span className="menu-text">Permissions</span>
                </NavLink>
              </li>
              <li className={`menu-item ${getMenuItemActive("/rp/roles", false)}`} aria-haspopup="true">
                <NavLink className="menu-link" to="/rp/roles">
                  <span className="svg-icon menu-icon"><ListAltIcon /></span>
                  <span className="menu-text">roles</span>
                </NavLink>
              </li>

			  <li className={`menu-item ${getMenuItemActive("/email", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/email">
            <span className="svg-icon menu-icon"><ViewDayIcon /></span>
            <span className="menu-text">Email</span>
          </NavLink>
        </li>

        <li className={`menu-item ${getMenuItemActive("/SMS", false)}`} aria-haspopup="true" >
          <NavLink className="menu-link" to="/SMS">
            <span className="svg-icon menu-icon"><ViewDayIcon /></span>
            <span className="menu-text">SMS</span>
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
