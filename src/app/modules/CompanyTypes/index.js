import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import List from "./pages/List";
import Add from "./pages/Add";
import Edit from "./pages/Edit";

export default function() {
  return (
    <Switch>
      <ContentRoute
        exact={true}
        path="/master/company-types"
        component={List}
      />
      <ContentRoute path="/master/company-types/add" component={Add} />
      <ContentRoute path="/master/company-types/:id/edit" component={Edit} />
    </Switch>
  );
}
