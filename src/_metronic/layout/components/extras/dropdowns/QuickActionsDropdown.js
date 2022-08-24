/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import {
  Tooltip,
  Nav,
  Tab,
  OverlayTrigger,
  Button,
  Modal,
} from "react-bootstrap";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";

// import ListAltIcon from "@material-ui/icons/ListAlt";
import NotificationsActive from "@material-ui/icons/NotificationsActive";

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

export function QuickActionsDropdown({ notices, companyNotices }) {
  const [key, setKey] = React.useState("Notices");
  const [showNotice, setShowNotice] = React.useState(false);
  const [showNewNotice, setShowNewNotice] = React.useState(false);
  const [noticeTitle, setNoticeTitle] = React.useState("");
  const [noticeInfo, setNoticeInfo] = React.useState("");
  const bgImage = toAbsoluteUrl("/media/misc/bg-2.jpg");
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.quick-actions.layout") ===
        "offcanvas",
    };
  }, [uiService]);

  return (
    <>
      {layoutProps.offcanvas && (
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip id="quick-actions-tooltip">Notice</Tooltip>}
        >
          <div className="topbar-item">
            {/* <div
              className="btn btn-icon btn-clean btn-dropdown btn-lg mr-1"
              id="kt_quick_actions_toggle"
            > */}
            <div
              className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary"
              id="kt_quick_actions_toggle"
            >
              <span className="svg-icon svg-icon-xl svg-icon-primary">
                <NotificationsActive />
              </span>
            </div>
          </div>
        </OverlayTrigger>
      )}
      {!layoutProps.offcanvas && (
        <Dropdown drop="down" alignRight>
          <Dropdown.Toggle
            as={DropdownTopbarItemToggler}
            id="kt_quick_actions_panel_toggle"
          >
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="quick-actions-tooltip">Notice</Tooltip>}
            >
              <div
                className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary"
                id="kt_quick_actions_toggle"
              >
                <span className="svg-icon svg-icon-xl svg-icon-primary">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/General/Notifications1.svg"
                    )}
                  />
                </span>
                <p>{notices.length}</p>
                {/* <span className="pulse-ring"></span>
                <span className="pulse-ring" /> */}
              </div>

              {/* <div
                className="btn btn-icon btn-clean btn-lg mr-1 pulse pulse-primary"
                id="kt_quick_actions_toggle"
              >

                <span className="svg-icon svg-icon-xl svg-icon-primary">
                  <NotificationsActive />
                </span>
              </div> */}
            </OverlayTrigger>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg">
            <div
              className="d-flex flex-column pt-12 bgi-size-cover bgi-no-repeat rounded-top"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <h4 className="d-flex flex-center rounded-top">
                <span
                  className="btn btn-text btn-success btn-sm font-weight-bold btn-font-md ml-2"
                  onClick={() => {
                    if (notices.length !== 0) setShowNewNotice(true);
                  }}
                >
                  {notices.length + companyNotices.length} new
                </span>
              </h4>
              <Tab.Container defaultActiveKey={key}>
                <Nav
                  as="ul"
                  className="nav nav-bold nav-tabs nav-tabs-line nav-tabs-line-3x nav-tabs-line-transparent-white nav-tabs-line-active-border-success mt-3 px-8"
                >
                  <Nav.Item className="nav-item" as="li">
                    <Nav.Link
                      onClick={(e) => e.preventDefault()}
                      eventKey="Notices"
                      className="nav-link show active"
                    >
                      Notices
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content className="tab-content">
                  <Tab.Pane eventKey="Notices" className="p-8">
                    {((notices && notices.length > 0) ||
                      (companyNotices && companyNotices.length > 0)) && (
                      <PerfectScrollbar
                        options={perfectScrollbarOptions}
                        className="scroll pr-7 mr-n7"
                        style={{ maxHeight: "300px", position: "relative" }}
                      >
                        {companyNotices &&
                          companyNotices.map((item) => {
                            if (item.notice) {
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
                                        setNoticeTitle(item.notice);
                                        setNoticeInfo(item.description);
                                        setShowNotice(true);
                                      }}
                                    >
                                      {item.notice}
                                      <div className="text-muted">
                                        company notice
                                      </div>
                                    </a>
                                    {/* <span className="text-muted">
                                PHP, SQLite, Artisan CLIмм
                              </span> */}
                                  </div>
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                        {notices &&
                          notices.length > 0 &&
                          notices.map((item) => {
                            if (item.notice) {
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
                                        setNoticeTitle(item.notice);
                                        setNoticeInfo(item.description);
                                        setShowNotice(true);
                                      }}
                                    >
                                      {item.notice}
                                    </a>
                                    {/* <span className="text-muted">
                                PHP, SQLite, Artisan CLIмм
                              </span> */}
                                  </div>
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                      </PerfectScrollbar>
                    )}
                    {(companyNotices && companyNotices.length) +
                      (notices && notices.length) <=
                    0 ? (
                      <div className="text-muted">No New Notices</div>
                    ) : (
                      <div className="text-muted">
                        <Link
                          to="/notifications/notices"
                          className="rk-btn1 rk-btn-icon btn btn-primary btn-sm"
                        >
                          Show Older Notices
                        </Link>
                      </div>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      )}
      <Modal
        show={showNotice}
        onMouseLeave={() => {
          setShowNotice(!showNotice);
          setNoticeTitle("");
          setNoticeInfo("");
        }}
      >
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>Notice Info</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <h3>{noticeTitle}</h3>
          <p>{noticeInfo}</p>
        </Modal.Body>
        <Modal.Footer className="p-3">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setShowNotice(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showNewNotice}
        onMouseLeave={() => {
          setShowNewNotice(!showNewNotice);
        }}
      >
        <Modal.Header className="p-3" closeButton>
          <Modal.Title>New Notices</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <PerfectScrollbar
            options={perfectScrollbarOptions}
            className="scroll pr-7 mr-n7"
            style={{ maxHeight: "300px", position: "relative" }}
          >
            {notices &&
              notices.length > 0 &&
              notices.map((item) => {
                if (item.notice) {
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
                              setNoticeTitle(item.notice);
                              setNoticeInfo(item.description);
                              setShowNewNotice(false);
                              setShowNotice(true);
                            }}
                          >
                            {item.notice}
                          </a>
                          {/* <span className="text-muted">
                        PHP, SQLite, Artisan CLIмм
                      </span> */}
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
              setShowNewNotice(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
