import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import List from "./pages/List";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import Show from "./pages/Show";
import Role from "./pages/Role";
export default function() {
  return (
    <Switch>
      <ContentRoute exact={true} path="/employees" component={List} />
      <ContentRoute path="/employees/add" component={Add} />
      <ContentRoute path="/employees/:id/edit" component={Edit} />
      <ContentRoute path="/employees/:id/show" component={Show} /> 
       <ContentRoute path="/employees/:id/permission" component={Role} />

    </Switch>
  ); 
}
