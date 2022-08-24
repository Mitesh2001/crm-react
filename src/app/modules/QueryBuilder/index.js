import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import List from "./pages/List";
import QueryBuilder from "./pages/QueryBuilder";
import Edit from "./pages/Edit";
import Show from "./pages/Show";

export default function() {
  return (
    <Switch>
      <ContentRoute exact={true} path="/report-builder" component={List} />
      <ContentRoute path="/report-builder/add" component={QueryBuilder} />
      <ContentRoute path="/report-builder/:id/edit" component={Edit} />
      <ContentRoute path="/report-builder/:id/show" component={Show} />
    </Switch>
  );
}
