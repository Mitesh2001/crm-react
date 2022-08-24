import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import List from './pages/List';
import Add from './pages/Add';
import Edit from './pages/Edit';

export default function () {
    return (
        <Switch>
            <ContentRoute exact={true} path="/rp/roles" component={List} />
            <ContentRoute path="/rp/roles/add" component={Add} />
            <ContentRoute path="/rp/roles/:id/edit" component={Edit} />
        </Switch>
    );
};
