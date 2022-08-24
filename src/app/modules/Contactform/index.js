import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import Add from './pages/Add';
import List from './pages/List';
import Edit from './pages/Edit';

export default function () {
    return (
        <Switch>
            <ContentRoute exact={true} path="/contactform" component={List} />
            <ContentRoute path="/contactform/add" component={Add} />
            <ContentRoute path="/contactform/:id/edit" component={Edit} />

        </Switch>
    );
};
