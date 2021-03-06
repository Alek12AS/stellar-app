/*
Author: A.Apetrei

Summary: 
Class component that renders the the sign in page.

*/

import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import { FormControl } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import sjcl from "sjcl";

export default class SignInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      pass: "",
      UsernameError: "",
      KeyError: "",
      PasswordError: "",
      redirect: false,
    };

    this.handleTextInput = this.handleTextInput.bind(this);
    this.SignInButtonPressed = this.SignInButtonPressed.bind(this);

  }

  handleTextInput(e) {
    if (e.target.id == "Name-Input") {
      this.setState({
        name: e.target.value,
        UsernameError: "",
        KeyError: ""
      });
    }

    if (e.target.id == "Password-Input") {
      this.setState({
        pass: e.target.value,
        PasswordError: "",
      });
    }
  }

  /*
  function SignInButtonPressed()

  Description: Checks if all the information required is valid, i.e. username, password and the presence of the keypair, and
  if all is good the user is signed in.

  */
  async SignInButtonPressed() {
    const response = await fetch(
      "/api/check-username" + "?username=" + this.state.name
    );

    if (response.status == 404) {
      this.setState({
        UsernameError: "Username not Found!",
      });
    } else if (response.status == 200) {
      const data = await response.json();

      //find secret key
      const kps = JSON.parse(localStorage.getItem("stellar_keypairs"));
      var encry_secret;
      var found = false;

      for (var kp of kps) {
        if (kp.public_key == data.public_key) {
          encry_secret = kp.secret;
          found = true;
        }
      }

      if (!found) {
        this.setState({
          KeyError: "Key is missing from browser!",
        });
      } else {
        var plain_secret;

        try {
          plain_secret = sjcl.decrypt(this.state.pass, encry_secret);

          let sessionStorage_content = JSON.stringify({
            username: this.state.name,
            public_key: data.public_key,
            secret: plain_secret
          });
  
          sessionStorage.setItem("stellar_keypair", sessionStorage_content);

          this.setState({
            redirect: true,
          });
        } catch (err) {
          if ((err.message = "ccm: tag doesn't match")) {
            this.setState({
              PasswordError: "Wrong Password!",
            });
          }
        }
      }
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/user/" />;
    }
    return (
      <div class="center">
        <Paper elevation={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <Typography component="h4" variant="h4">
                Sign In
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <FormControl>
                <TextField
                  required
                  id="Name-Input"
                  label="Username"
                  helperText={this.state.UsernameError}
                  error={this.state.UsernameError}
                  onChange={this.handleTextInput}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} align="center">
              <FormControl>
                <TextField
                  required
                  id="Password-Input"
                  label="Enter Password"
                  helperText={this.state.PasswordError}
                  error={this.state.PasswordError}
                  onChange={this.handleTextInput}
                  type="password"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                color="secondary"
                variant="contained"
                onClick={this.SignInButtonPressed}
              >
                Sign In
              </Button>
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                color="primary"
                variant="contained"
                to="/"
                component={Link}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography variant="subtitle1" component="subtitle1"> 
              <Link to="/sign-up/">Sign Up</Link>
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography variant='caption' style={{ color: "red" }}>
                {this.state.KeyError}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}
