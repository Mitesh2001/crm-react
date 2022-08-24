import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import List from './pages/List';
import Add from './pages/Add';
import Show from './pages/Show';
import Edit from './pages/Edit';

export default function () {
    return (
        <Switch>
            <ContentRoute exact={true} path="/leads" component={List} />
            <ContentRoute path="/leads/add" component={Add} />
            <ContentRoute path="/leads/:id/edit" component={Edit} />
            <ContentRoute path="/leads/:id/show" component={Show} />
        </Switch>
    );
};
