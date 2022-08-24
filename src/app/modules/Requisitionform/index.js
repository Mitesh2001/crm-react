import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import Add from './pages/Add';
import List from './pages/List';

export default function () {
    return (
        <Switch>
            <ContentRoute exact={true} path="/requisitionform" component={List} />
            <ContentRoute path="/requisitionform/add" component={Add} />

        </Switch>
    );
};
