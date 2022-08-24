import React from "react";
import { Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import Add from './pages/Add';
import List from './pages/List';
import Show from './pages/Show';
import Edit from './pages/Edit';
// import ContactList from './pages/ContactList';
import Listcontact from './pages/Listcontact';

export default function () {
    return (
        <Switch>    
            <ContentRoute exact={true} path="/email" component={List} />
            <ContentRoute path="/email/add" component={Add} />
            <ContentRoute path="/email/:id/edit" component={Edit} />
            {/* <ContentRoute path="/email/:id/contactList" component={ContactList} /> */}
            <ContentRoute path="/email/:id/listcontact" component={Listcontact} />
            <ContentRoute path="/email/:id/show" component={Show} />
        </Switch>
    );
};
