import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import Calendar from "./pages/Calendar";
export default function() {
  return (
    <Switch>
      <ContentRoute exact={true} path="/calendar" component={Calendar} />
    </Switch>
  );
}
