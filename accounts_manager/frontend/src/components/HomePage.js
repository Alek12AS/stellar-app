import React, { Component } from "react";
import CreateUserPage from "./CreateUserPage";
import UserPage from "./UserPage";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <Router>
            <Switch>
                <Route exact path="/"><p>This is the home page</p></Route>
                <Route path="/create/" component={CreateUserPage} />
                <Route path="/user/:public_key" component={UserPage} />
            </Switch>
        </Router>
        );
    }
}