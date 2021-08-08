import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { CreateAccount } from "./tools";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ReactLoading from "react-loading";
import SetAccountDetails from "./SetAccountDetails";
import AddUsers from "./AddUsers";
import ConfirmationPage from "./ConfirmationPage";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Bar from "./Bar.js";

export default class CreateAccountPage extends Component {
  constructor(props) {
    super(props);

    const userInfo = JSON.parse(sessionStorage.getItem("stellar_keypair"));

    this.state = {
      users: [],
      low_threshold: 0,
      med_threshold: 0,
      high_threshold: 0,
      creator_weight: 0,
      creator_publicKey: userInfo.public_key,
      creator_username: userInfo.username,
      account_name: "",
      loading: false,
      steps: ["Set Account Details", "Add Users", "Confirm"],
      activeStep: 0,
    };

    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.modifyUserList = this.modifyUserList.bind(this);
    this.numbersModified = this.numbersModified.bind(this);
    this.nameModified = this.nameModified.bind(this);
  }

  modifyUserList(newUserList) {
    this.setState({
      users: newUserList,
    });
  }

  numbersModified(type, newValue) {
    if (type == "low_threshold") {
      this.setState({
        low_threshold: newValue,
      });
    } else if (type == "med_threshold") {
      this.setState({
        med_threshold: newValue,
      });
    } else if (type == "high_threshold") {
      this.setState({
        high_threshold: newValue,
      });
    } else if (type == "creator_weight") {
      this.setState({
        creator_weight: newValue,
      });
    }
  }

  CreateAccount() {
    this.setState({
      loading: true,
    });
    const creator = {
      publicKey: this.state.creator_publicKey,
      weight: this.state.creator_weight,
      username: this.state.creator_username,
    };

    CreateAccount(
      creator,
      this.state.users,
      this.state.low_threshold,
      this.state.med_threshold,
      this.state.high_threshold,
      this.state.account_name
    )
      .then((public_key) => this.props.history.push("/account/" + public_key))
      .catch((e) => console.log(e));
  }

  handleUserAdded(users) {
    this.setState({
      users: users,
    });
  }

  nameModified(newName) {
    this.setState({
      account_name: newName,
    });
  }

  validateForm() {
    return this.state.account_name.length > 0;
  }

  getStepContent() {
    switch (this.state.activeStep) {
      case 0:
        return (
          <SetAccountDetails
            numbersModified={this.numbersModified}
            nameModified={this.nameModified}
          />
        );
      case 1:
        return (
          <AddUsers
            modifyUserList={this.modifyUserList}
            users={this.state.users}
          />
        );
      case 2:
        let details = {
          account_name: this.state.account_name,
          low_threshold: this.state.low_threshold,
          med_threshold: this.state.med_threshold,
          high_threshold: this.state.high_threshold,
          creator_weight: this.state.creator_weight,
        };

        return <ConfirmationPage users={this.state.users} details={details} />;
    }
  }

  handleNext() {
    if (this.state.activeStep == this.state.steps.length - 1) {
      this.CreateAccount();
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1,
      });
    }
  }

  handleBack() {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  }

  render() {
    if (!this.state.loading) {
      return (
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Bar current="Create Stellar Account" />
            </Grid>
            <Grid item xs={12}>
              <Stepper activeStep={this.state.activeStep} alternativeLabel>
                {this.state.steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            <Grid item xs={6} align="left">
              <Button
                disabled={this.state.activeStep === 0}
                onClick={this.handleBack}
                color="primary"
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={6} align="right">
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleNext}
                disabled={!this.validateForm()}
              >
                {this.state.activeStep === this.state.steps.length - 1
                  ? "Create"
                  : "Next"}
              </Button>
            </Grid>
            {this.getStepContent()}
          </Grid>
        </div>
      );
    } else {
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
}
