/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useMemo } from "react";
import {
  Modal,
  Nav,
  Tab,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
// import Actions from "./Actions";

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

export function UserNotificationsDropdown({ announcements }) {
  const [key, setKey] = useState("Announcements");
  const bgImage = toAbsoluteUrl("/media/misc/bg-1.jpg");
  const uiService = useHtmlClassService();

  const [showAnnouncements, setShowAnnouncements] = React.useState(false);
  const [showNewAnnouncements, setShowNewAnnouncements] = React.useState(false);
  const [announcementsTitle, setAnnouncementsTitle] = React.useState("");

  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.notifications.layout") ===
        "offcanvas",
    };
  }, [uiService]);
  const dateTimeUtil = (date) => {
    let dateObj = date;
    const monthNames = [
      "Jan",
      "Fe",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
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
  };
  return (
    <>
      {layoutProps.offcanvas && (
        <div className="topbar-item">
          <div
            className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary"
            id="kt_quick_notifications_toggle"
          >
            <span className="svg-icon svg-icon-xl svg-icon-primary">
              <NotificationsActiveIcon />
            </span>
            <span className="pulse-ring"></span>
          </div>
        </div>
      )}
      {!layoutProps.offcanvas && (
        <Dropdown drop="down" alignRight>
          <Dropdown.Toggle
            as={DropdownTopbarItemToggler}
            id="kt_quick_notifications_toggle"
          >
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="user-notification-tooltip">Announcements</Tooltip>
              }
            >
              <div
                className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary"
                id="kt_quick_notifications_toggle"
              >
                <span className="svg-icon svg-icon-xl svg-icon-primary">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Code/Compiling.svg")}
                  />
                </span>
                <p>{announcements.length}</p>
                {/* <span className="pulse-ring"></span>
                <span className="pulse-ring" /> */}
              </div>
              {/* <div
                className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary"
                id="kt_quick_notifications_toggle"
              >
                <span className="svg-icon svg-icon-xl svg-icon-primary">
                  <NotificationsActiveIcon />
                </span>
                <span className="pulse-ring"></span>
                <span className="pulse-ring" />
              </div> */}
            </OverlayTrigger>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg">
            {/** Head */}
            <div
              className="d-flex flex-column pt-12 bgi-size-cover bgi-no-repeat rounded-top"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <h4 className="d-flex flex-center rounded-top">
                <span
                  className="btn btn-text btn-success btn-sm font-weight-bold btn-font-md ml-2"
                  onClick={() => {
                    if (announcements.length !== 0)
                      setShowNewAnnouncements(true);
                  }}
                >
                  {announcements.length} new
                </span>
              </h4>

              <Tab.Container defaultActiveKey={key}>
                <Nav
                  as="ul"
                  onSelect={(key) => {
                    setKey(key);
                  }}
                  className="nav nav-bold nav-tabs nav-tabs-line nav-tabs-line-3x nav-tabs-line-transparent-white nav-tabs-line-active-border-success mt-3 px-8"
                >
                  <Nav.Item className="nav-item" as="li">
                    <Nav.Link
                      onClick={(e) => e.preventDefault()}
                      eventKey="Announcements"
                      className={`nav-link show ${
                        key === "Announcements" ? "active" : ""
                      }`}
                    >
                      Announcements
                    </Nav.Link>
                  </Nav.Item>
                  {/* <Nav.Item as="li">
                      <Nav.Link
                        onClick={(e) => e.preventDefault()}
                        eventKey="Notice"
                        className={`nav-link show ${
                          key === "Notice" ? "active" : ""
                        }`}
                      >
                        Notice
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        onClick={(e) => e.preventDefault()}
                        eventKey="compNotice"
                        className={`nav-link show ${
                          key === "compNotice" ? "active" : ""
                        }`}
                      >
                        Company Notices
                      </Nav.Link>
                    </Nav.Item> */}
                </Nav>

                <Tab.Content className="tab-content">
                  <Tab.Pane eventKey="Announcements" className="p-8">
                    {announcements && announcements.length > 0 ? (
                      <PerfectScrollbar
                        options={perfectScrollbarOptions}
                        className="scroll pr-7 mr-n7"
                        style={{ maxHeight: "300px", position: "relative" }}
                      >
                        {announcements &&
                          announcements.length > 0 &&
                          announcements.map((item) => {
                            if (item.announcement) {
                              return (
                                <div className="d-flex align-items-center mb-6">
                                  <div className="symbol symbol-40 symbol-light-primary mr-5">
                                    <span className="symbol-label">
                                      <SVG
                                        src={toAbsoluteUrl(
                                          "/media/svg/icons/Home/Library.svg"
                                        )}
                                        className="svg-icon-lg svg-icon-primary"
                                      ></SVG>
                                    </span>
                                  </div>
                                  <div className="d-flex flex-column font-weight-bold">
                                    <a
                                      href="#"
                                      className="text-dark text-hover-primary mb-1 font-size-lg"
                                      onClick={() => {
                                        setAnnouncementsTitle(
                                          item.announcement
                                        );
                                        setShowAnnouncements(true);
                                      }}
                                    >
                                      {item.announcement}
                                    </a>
                                    <div className="text-muted">
                                      {dateTimeUtil(item.start_date_time)}
                                      &nbsp;-&nbsp;
                                      {dateTimeUtil(item.end_date_time)}
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                        <div className="text-muted">
                          <Link
                            to="/notifications/announcements"
                            className="rk-btn1 rk-btn-icon btn btn-primary btn-sm"
                          >
                            Show Older Announcements
                          </Link>
                        </div>
                      </PerfectScrollbar>
                    ) : (
                      <div className="text-muted">No New Announcements</div>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      )}

      <Modal
        show={showAnnouncements}
        onMouseLeave={() => {
          setShowAnnouncements(!showAnnouncements);
          setAnnouncementsTitle("");
        }}
      >
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>Announcements Info</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <h3>{announcementsTitle}</h3>
        </Modal.Body>
        <Modal.Footer className="p-3">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setShowAnnouncements(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showNewAnnouncements}
        onMouseLeave={() => {
          setShowNewAnnouncements(!showNewAnnouncements);
        }}
      >
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>New Announcements</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <PerfectScrollbar
            options={perfectScrollbarOptions}
            className="scroll pr-7 mr-n7"
            style={{ maxHeight: "300px", position: "relative" }}
          >
            {announcements.map((item) => {
              if (item.announcement) {
                return (
                  <>
                    <div className="d-flex align-items-center mb-6">
                      <div className="symbol symbol-40 symbol-light-primary mr-5">
                        <span className="symbol-label">
                          <SVG
                            src={toAbsoluteUrl(
                              "/media/svg/icons/Home/Library.svg"
                            )}
                            className="svg-icon-lg svg-icon-primary"
                          ></SVG>
                        </span>
                      </div>
                      <div className="d-flex flex-column font-weight-bold">
                        <a
                          href="#"
                          className="text-dark text-hover-primary mb-1 font-size-lg"
                          onClick={() => {
                            setAnnouncementsTitle(item.announcement);
                            setShowNewAnnouncements(false);
                            setShowAnnouncements(true);
                          }}
                        >
                          {item.announcement}
                        </a>
                      </div>
                    </div>
                  </>
                );
              } else {
                return null;
              }
            })}
          </PerfectScrollbar>
        </Modal.Body>
        <Modal.Footer className="p-3">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setShowNewAnnouncements(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
