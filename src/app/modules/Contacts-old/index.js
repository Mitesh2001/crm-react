import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import List from './pages/List';
import Add from './pages/Add';
import Show from './pages/Show';
import Edit from './pages/Edit';
import Import from './pages/Import';

export default function () {
    return (
        <Switch>
            <ContentRoute exact={true} path="/contacts" component={List} />
            <ContentRoute path="/contacts/add" component={Add} />
            <ContentRoute path="/contacts/import" component={Import} />
            <ContentRoute path="/contacts/:id/edit" component={Edit} />
            <ContentRoute path="/contacts/:id/show" component={Show} />
        </Switch>
    );
};
