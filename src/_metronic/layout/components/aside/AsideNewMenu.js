import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import objectPath from "object-path";
import { Brand } from "../brand/Brand";
import { AsideMenu } from "./aside-menu/AsideMenu";
import { useHtmlClassService } from "../../_core/MetronicLayout";

export function Aside() {
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      disableScroll:
        objectPath.get(uiService.config, "aside.menu.dropdown") === "true" ||
        false,
      asideClassesFromConfig: uiService.getClasses("aside", true),
      disableAsideSelfDisplay:
        objectPath.get(uiService.config, "aside.self.display") === false,
      headerLogo: uiService.getLogo()
    };
  }, [uiService]);

  return (
    <>
      <div id="mnwrp">
        <div className="toggle-menu fas fa-bars"></div>
        <div className="left-bar">
          <div className="sidebar">
            <div className="logo"> <a href="#">
              <img src="images/logo-sm-light.png" alt="" /></a> </div>
            <div className="sidebar-menu">
              <ul>
                <li><a className="fas fa-home active" target="1"></a></li>
                <li><a className="fas fa-pen-square" target="2"></a></li>
                <li><a className="fas fa-user-circle" target="3"></a></li>
                <li><a className="fas fa-lock-open" target="4"></a></li>
                <li><a className="fas fa-sign-out-alt" target="5"></a></li>
              </ul>
            </div>
          </div>
          <div className="sidebar-menu-child">
            <div className="brand-name"> Admin </div>
            <div className="sidebar-menu-links" id="div1" style={{ display: 'block' }}>
              <h4 className="menulinks-title">Dashboard</h4>
              <ul className="navbar-nav mr-auto sidenav" id="navAccordion">
                <li className="nav-item active"> <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 1</a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 5</a> </li>
              </ul>
            </div>
            <div className="sidebar-menu-links" id="div2" style={{ display: 'none' }}>
              <h4 className="menulinks-title">App</h4>
              <ul className="navbar-nav mr-auto sidenav" id="navAccordion">
                <li className="nav-item active"> <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 1</a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 3</a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 5</a> </li>
              </ul>
            </div>
            <div className="sidebar-menu-links" id="div3" style={{ display: 'none' }}>
              <h4 className="menulinks-title">Pages</h4>
              <ul className="navbar-nav mr-auto sidenav" id="navAccordion">
                <li className="nav-item active"> <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 1</a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 5</a> </li>
              </ul>
            </div>
            <div className="sidebar-menu-links" id="div4" style={{ display: 'none' }}>
              <h4 className="menulinks-title">Layouts</h4>
              <ul className="navbar-nav mr-auto sidenav" id="navAccordion">
                <li className="nav-item active"> <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 1</a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 3</a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 5</a> </li>
              </ul>
            </div>
            <div className="sidebar-menu-links" id="div5" style={{ display: 'none' }}>
              <h4 className="menulinks-title">Elements</h4>
              <ul className="navbar-nav mr-auto sidenav" id="navAccordion">
                <li className="nav-item active"> <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 1</a> </li>
                <li className="nav-item"> <a className="nav-link" href="#">Item 5</a> </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
