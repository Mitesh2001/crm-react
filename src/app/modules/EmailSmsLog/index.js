import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import List from './pages/List';

export default function () {
    return (
        <Switch>
            <ContentRoute exact={true} path="/email-and-sms-log" component={List} />
        </Switch>
    );
};
