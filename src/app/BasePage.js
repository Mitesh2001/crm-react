import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { DashboardPage } from "./pages/DashboardPage";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";

const LeadModule = lazy(() => import("./modules/Leads/Leads"));
const Contacts = lazy(() => import("./modules/Contacts/index"));
const Contactform = lazy(() => import("./modules/Contactform/index"));
const IndustryModule = lazy(() => import("./modules/Industries/index"));
const CompanyTypes = lazy(() => import("./modules/CompanyTypes/index"));
const Countries = lazy(() => import("./modules/Countries/index"));
const States = lazy(() => import("./modules/States/index"));
const Permissions = lazy(() => import("./modules/Permissions/index"));
const Roles = lazy(() => import("./modules/Roles/index"));
const Employees = lazy(() => import("./modules/Employees/index"));
const Products = lazy(() => import("./modules/Products/index"));
const Email = lazy(() => import("./modules/Email/index"));
const SMS = lazy(() => import("./modules/SMS/index"));
const Requisitionform = lazy(() => import("./modules/Requisitionform/index"));
const EmailSmsLog=lazy(() => import("./modules/EmailSmsLog/index"));
//const Telecallingmanagement = lazy(() => import("./modules/Telecallingmanagement/index"));
const Addassign = lazy(() => import("./modules/Addassign/index"));
const Leadassign = lazy(() => import("./modules/Leadassign/index"));
const Leadfollowupassign = lazy(() =>
  import("./modules/Leadfollowupassign/index")
);
const Contactfollowupassign = lazy(() =>
  import("./modules/Contactfollowupassign/index")
);

const QueryBuilder = lazy(() => import("./modules/QueryBuilder/index"));
const Events = lazy(() => import("./modules/Events/index"));
const Notices = lazy(() =>
  import("./modules/Notices/index")
);
const Announcements = lazy(() =>
  import("./modules/Announcements/index")
);

export default function BasePage() {
 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/change-password" component={ChangePassword} />
        {/* <ContentRoute path="/reset-password/:user_token" component={ResetPassword} /> */}
        <ContentRoute path="/profile" component={Profile} />
        <ContentRoute path="/update-profile" component={UpdateProfile} />

        <Route path="/leads" component={LeadModule} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/contactform" component={Contactform} />
        <Route path="/master/industries" component={IndustryModule} />
        <Route path="/master/company-types" component={CompanyTypes} />
        <Route path="/master/countries" component={Countries} />
        <Route path="/master/states" component={States} />
        <Route path="/rp/permissions" component={Permissions} />
        <Route path="/rp/roles" component={Roles} />
        <Route path="/employees" component={Employees} />
        <Route path="/products" component={Products} />
        {/* <Route path="/services" component={Products} /> */}
        <Route path="/email" component={Email} />
        <Route path="/sms" component={SMS} />
        <Route path="/requisitionform" component={Requisitionform} />
        <Route path="/SMS" component={SMS} />
        {/* <Route path="/telecaller/Addassign" component={Addassign} />
        <Route path="/telecaller/Viewassign" component={Viewassign} />
         */}
        <Route path="/telecaller/Addassign" component={Addassign} />
        <Route path="/lead/Addassign" component={Leadassign} />
        <Route
          path="/assign/leadfollowupassign"
          component={Leadfollowupassign}
        />
        <Route
          path="/assign/contactfollowupassign"
          component={Contactfollowupassign}
        />
        <Route
          path="/email-and-sms-log"
          component={EmailSmsLog}
        />

        <Route path="/report-builder" component={QueryBuilder} />
        <Route path="/calendar" component={Events} />
        <Route
          path="/notifications/notices"
          component={Notices}
        />
        <Route
          path="/notifications/announcements"
          component={Announcements}
        />
        <Redirect to="error/error-v6" />
      </Switch>
    </Suspense>
  );
}
