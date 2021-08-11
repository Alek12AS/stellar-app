/*
Author: A.Apetrei

Summary: 
Class component that renders the home page which informs the user about the app.

*/

import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Bar from "./Bar.js";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Bar current="Home" />
          </Grid>
          <Grid item align="center" xs={12}>
            <Typography variant="h3" component="h3">
              Stellar Shared Wallets
            </Typography>
          </Grid>
          <Grid item align="center" xs={12}>
            <Typography variant="subtitle2" component="subtitle2">
              Web App for Multi-Signature Transactions
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" component="subtitle2">
              Description
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" component="body1">
              Dapp built on the stellar network which allows for shared
              ownership accounts, making use of stellar multi-signature
              transactions. Users can register and create any number of accounts
              to which they can add users and their weights as well as the
              account's weight threshold values. A payment, for instance, comes
              under the medium weight threshold and in order to authenticate the
              transaction the weights of the users which sign the transaction
              should add up to the medium threshold value.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              To find out more about multi-signature please follow this link:&nbsp; 

              <Link href="https://developers.stellar.org/docs/glossary/multisig/">
                https://developers.stellar.org/docs/glossary/multisig/.
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}
