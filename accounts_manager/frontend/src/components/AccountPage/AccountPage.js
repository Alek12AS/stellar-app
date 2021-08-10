import React, { Component } from "react";
import { Server } from "stellar-sdk";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import { RequestToSign, RejectTransaction, CreateTransaction } from "./tools";
import ReactLoading from "react-loading";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Balances from "./Balances";
import PaymentRequests from "./PaymentRequests";
import RequestPayment from "./RequestPayment";
import PendingPayments from "./PendingPayments";
import HistoricalPayments from "./HistoricalPayments";
import Bar from "../Bar.js";

export default class AccountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: [],
      server: "https://horizon-testnet.stellar.org",
      account_id: "",
      account_name: "",
      user_publicKey: "",
      user_weight: 0,
      window: 0,
      account_details: {},
      verified_user: false,
      AccountDataReturned: false,
      TransactionDataReturned: false,
      loading: true,
    };

    this.state.account_id = this.props.match.params.public_key;

    this.GetAccountDetails();

    RequestPayment = RequestPayment.bind(this);
    PaymentRequests = PaymentRequests.bind(this);
  }

  // interval id to reference later to stop setInterval from updating page
  intervalID;

  componentDidMount() {
    // Fetch details every 5 seconds to keep page updated
    this.intervalID = setInterval(this.GetAccountDetails.bind(this), 10000);
  }

  componentWillUnmount() {
    //stop fetching data after unmounting component
    clearInterval(this.intervalID);
  }

  verifySigner() {
    // Find out which public key is in the localstorage in order to display appropriate content for this user
    if (sessionStorage.getItem("stellar_keypair")) {
      const kp = JSON.parse(sessionStorage.getItem("stellar_keypair"));

      const found = this.state.account_details.signers.filter(
        (signer) => signer.key == kp.public_key
      );
      if (found.length != 0) {
        this.setState({
          user_publicKey: kp.public_key,
          user_weight: found[0].weight,
          verified_user: true,
        });
      }
    }
    return false;
  }

  async GetAccountDetails() {
    const server = new Server(this.state.server);
    await server.loadAccount(this.state.account_id).then((account) => {
      this.setState(
        {
          account_details: account,
          DataIsReturned: true,
        },
        () => this.verifySigner()
      );
    });

    fetch("/api/get-transactions" + "?account_id=" + this.state.account_id)
      .then((response) => response.json())
      .then((data) => {
        const new_data = data;
        // check if this user has signed it already
        for (let i = 0; i < new_data.length; i++) {
          if (
            new_data[i].signers.filter((s) => s == this.state.user_publicKey)
              .length != 0
          ) {
            new_data[i].signed = true;
          }
        }
        // check if the user has rejected it already
        for (let i = 0; i < new_data.length; i++) {
          if (
            new_data[i].rejecters.filter((s) => s == this.state.user_publicKey)
              .length != 0
          ) {
            new_data[i].rejected = true;
          }
        }

        this.setState({
          transactions: new_data,
          TransactionDataReturned: true,
        });
      });

    fetch("/api/get-account" + "?account_id=" + this.state.account_id)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.account_id)
        this.setState({
          account_name: data.name,
          AccountDataReturned: true,
        });
      });

    if (
      this.state.verified_user &&
      this.state.TransactionDataReturned &&
      this.state.AccountDataReturned
    ) {
      this.setState({
        loading: false,
      });
    }
  }

  handleTabChange = (event, newValue) => {
    this.setState({
      window: newValue,
    });
  };

  updateRequests = (new_trans) => {
    this.setState({
      transactions: new_trans,
    });
  };

  renderWindow = () => {
    switch (this.state.window) {
      case 0:
        return <Balances balances={this.state.account_details.balances} />;
      case 1:
        var details = {
          account_id: this.state.account_id,
          user_publicKey: this.state.user_publicKey,
          user_weight: this.state.user_weight,
          med_threshold: this.state.account_details.thresholds.med_threshold,
        };
        return (
          <RequestPayment
            details={details}
            GetAccountDetails={this.GetAccountDetails}
          />
        );
      case 2:
        var details = {
          user_publicKey: this.state.user_publicKey,
          user_weight: this.state.user_weight,
          med_threshold: this.state.account_details.thresholds.med_threshold,
        };
        return (
          <PaymentRequests
            requests={this.state.transactions}
            details={details}
            updateRequests={this.updateRequests}
          />
        );
      case 3:
        var details = {
          user_publicKey: this.state.user_publicKey,
          user_weight: this.state.user_weight,
          med_threshold: this.state.account_details.thresholds.med_threshold,
        };
        return (
          <PendingPayments
            requests={this.state.transactions}
            details={details}
          />
        );
      case 4:
        var details = {
          user_publicKey: this.state.user_publicKey,
          user_weight: this.state.user_weight,
          med_threshold: this.state.account_details.thresholds.med_threshold,
        };
        return (
          <HistoricalPayments
            requests={this.state.transactions}
            details={details}
          />
        );
    }
  };

  render() {
    if (!this.state.loading) {
      return (
        <div>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12}>
              <Bar current="Stellar Account" />
            </Grid>
            <Grid item xs={12} align="left">
              <Typography component="h3" variant="h3">
                {this.state.account_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper style={{ flexGrow: 1 }}>
                <Tabs
                  value={this.state.window}
                  onChange={this.handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="Balances" />
                  <Tab label="Create Payment Request" />
                  <Tab label="Payment Requests" />
                  <Tab label="Pending Payments" />
                  <Tab label="Payment History" />
                </Tabs>
              </Paper>
            </Grid>
            {this.renderWindow()}
          </Grid>
        </div>
      );
    } else
      return (
        <div class="center">
          <ReactLoading
            type={"cylon"}
            color={"#f50057"}
            height={334}
            width={188}
          />
        </div>
      );
  }
}
