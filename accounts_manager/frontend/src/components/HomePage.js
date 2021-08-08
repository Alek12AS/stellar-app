import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Bar from "./Bar.js"

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Bar current="Home"/>
          </Grid>
          <Grid item align="center" xs = {12}>
            <Typography variant="h3" component="h3">
              Stellar Shared Wallets
            </Typography>
          </Grid>
          <Grid item align="center" xs = {12}>
            <Typography variant="subtitle2" component="subtitle2">
              Web App for Shared Wallets
            </Typography>
          </Grid>
          <Grid item xs = {12}>
            <Typography variant="subtitle2" component="subtitle2">
              Description
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" component="body1">
              Start by creating an account as a user by signing up. You can then
              create as many wallets as you like using the create wallet page.
              You can add users that can sign transactions to the accounts and
              set their key weights, then you can set the stellar account
              thresholds. This allows you to set how many users you need to
              agree to a transaction and which users have more weight.
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}
