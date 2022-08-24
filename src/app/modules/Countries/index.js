import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import List from './pages/List';
import Add from './pages/Add';
import Edit from './pages/Edit';

export default function () {
    return (
        <Switch>
            <ContentRoute exact={true} path="/master/countries" component={List} />
            <ContentRoute path="/master/countries/add" component={Add} />
            <ContentRoute path="/master/countries/:id/edit" component={Edit} />
        </Switch>
    );
};
