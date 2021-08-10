import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import UserPage from "./UserPage";
import CreateAccountPage from "./CreateAccountPage/CreateAccountPage";
import AccountPage from "./AccountPage/AccountPage";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/sign-up/" component={SignUpPage} />
            <Route path="/sign-in/" component={SignInPage} />
            <Route path="/user/" component={UserPage} />
            <Route path="/create-account/" component={CreateAccountPage} />
            <Route path="/account/:public_key" component={AccountPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
