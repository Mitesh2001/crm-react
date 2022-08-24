import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import List from "./pages/List";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import Show from "./pages/Show";
export default function() {
  return (
    <Switch>
      <ContentRoute exact={true} path="/products" component={List} />
      <ContentRoute path="/products/add" component={Add} />
      <ContentRoute path="/products/:id/edit" component={Edit} />
      <ContentRoute path="/products/:id/show" component={Show} />
      {/* <ContentRoute exact={true} path="/services" component={List} />
      <ContentRoute path="/services/add" component={Add} />
      <ContentRoute path="/services/:id/edit" component={Edit} />
      <ContentRoute path="/services/:id/show" component={Show} /> */}
    </Switch>
  );
}
