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
            <ContentRoute exact={true} path="/sms" component={List} />
            <ContentRoute path="/sms/add" component={Add} />
            <ContentRoute path="/sms/:id/edit" component={Edit} />
            <ContentRoute path="/sms/:id/listcontact" component={Listcontact} />
            {/* <ContentRoute path="/sms/:id/contactList" component={ContactList} /> */}
            <ContentRoute path="/sms/:id/show" component={Show} />
        </Switch>
    );
};
