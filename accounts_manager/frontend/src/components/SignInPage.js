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
    this.validateForm = this.validateForm.bind(this);
  }

  handleTextInput(e) {
    if (e.target.id == "Name-Input") {
      this.setState({
        name: e.target.value,
        UsernameError: "",
      });
    }

    if (e.target.id == "Password-Input") {
      this.setState({
        pass: e.target.value,
        PasswordError: "",
      });
    }
  }

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
      }

      var plain_secret;

      try {
        plain_secret = sjcl.decrypt(this.state.pass, encry_secret);
      } catch (err) {
        if ((err.message = "ccm: tag doesn't match")) {
          this.setState({
            PasswordError: "Wrong Password!",
          });
        }
      }

      const sessionStorage_content = JSON.stringify({
        public_key: data.public_key,
        secret: plain_secret,
      });

      sessionStorage.setItem("stellar_keypair", sessionStorage_content);

      if (!this.state.UsernameError && !this.state.PasswordError) {
        this.setState({
          redirect: true,
        });
      }
    }
  }

  validateForm() {
    return (
      this.state.pass.length > 0 &&
      this.state.pass == this.state.confirmPass &&
      this.state.name.length > 0
    );
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
