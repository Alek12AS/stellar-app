import React, { Component } from "react";
import UserPage from "./UserPage";
import CreateAccountPage from "./CreateAccountPage";
import AccountPage from "./AccountPage";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <p>This is the home page</p>
          </Route>
          <Route path="/sign-up/" component={SignUpPage} />
          <Route path="/sign-in/" component={SignInPage} />
          <Route path="/user/" component={UserPage} />
          <Route path="/create-account/" component={CreateAccountPage} />
          <Route path="/account/:public_key" component={AccountPage} />
        </Switch>
      </Router>
    );
  }
}
