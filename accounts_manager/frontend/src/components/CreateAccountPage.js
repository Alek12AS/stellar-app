import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { CreateAccount } from "./tools";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import ReactLoading from "react-loading";

export default class CreateAccountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [
        { username: "Alex18", weight: 1 },
        { username: "alexandru23", weight: 1 },
      ],
      userToAdd: "",
      userToAddWeight: 0,
      low_threshold: 0,
      medium_threshold: 0,
      high_threshold: 0,
      creator_weight: 0,
      creator_publicKey:
        "GAXE7L52WAU5JLZZN5D4GBREPPICYOWZRZW7IEQCOUSW7DJL2H53GV7U",
      creator_username: "Mihaela32",
      UsernameError: "",
      account_name: "",
      loading: false,
    };

    this.renderRow = this.renderRow.bind(this);
    this.handleRemoveButtonPressed = this.handleRemoveButtonPressed.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleAddButtonPressed = this.handleAddButtonPressed.bind(this);
    this.handleNumberInput = this.handleNumberInput.bind(this);
    this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
  }

  renderRow() {
    this.state.users.map(function (user, index) {
      return (
        <ListItem button key={index}>
          <ListItemText primary={user.username} />
        </ListItem>
      );
    });
  }

  handleRemoveButtonPressed(i) {
    var self = this;

    return function handleButton(e) {
      var newList = self.state.users;
      newList.splice(i, 1);
      self.setState({
        users: newList,
      });
    };
  }

  userisAdded() {
    var index = this.state.users.findIndex(
      (user) => user.username == this.state.userToAdd
    );

    return index;
  }

  FindUser() {
    fetch("/api/check-username" + "?username=" + this.state.userToAdd).then(
      (response) => {
        console.log(this.userisAdded(this.state.userToAdd));

        if (response.status == 200 && this.userisAdded() == -1) {
          var newUserList = this.state.users;
          newUserList.push({
            username: this.state.userToAdd,
            weight: this.state.userToAddWeight,
          });

          this.setState({
            users: newUserList,
            UsernameError: "",
          });
        } else if (response.status == 200 && this.userisAdded() != -1) {
          newUserList = this.state.users;

          const index = this.userisAdded();
          newUserList[index].weight = this.state.userToAddWeight;

          this.setState({
            users: newUserList,
            UsernameError: "",
          });
        } else if (response.status == 404) {
          this.setState({
            UsernameError: "User not found!",
          });
        } else if (response.status == 400) {
          this.setState({
            UsernameError: "Missing username",
          });
        }
      }
    );
  }

  handleAddButtonPressed(e) {
    this.FindUser();
  }

  handleTextInput(e) {
    if (e.target.id == "username") {
      this.setState({
        userToAdd: e.target.value,
      });
    }
    if (e.target.id == "account-name") {
      this.setState({
        account_name: e.target.value,
      });
    }
  }

  handleNumberInput(e) {
    const maxValue = 255;
    const minValue = 0;

    const newValue = Math.min(Math.max(e.target.value, minValue), maxValue);

    if (e.target.id == "user-weight") {
      this.setState({
        userToAddWeight: newValue,
      });
    } else if (e.target.id == "low_threshold") {
      this.setState({
        low_threshold: newValue,
      });
    } else if (e.target.id == "medium_threshold") {
      this.setState({
        medium_threshold: newValue,
      });
    } else if (e.target.id == "high_threshold") {
      this.setState({
        high_threshold: newValue,
      });
    } else if (e.target.id == "creator-weight") {
      this.setState({
        creator_weight: newValue,
      });
    }
  }

  handleCreateButtonPressed(e) {
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
      this.state.medium_threshold,
      this.state.high_threshold,
      this.state.account_name
    )
      .then((public_key) => this.props.history.push("/account/" + public_key))
      .catch((e) => console.log(e));
  }

  render() {
    if (!this.state.loading) {
      return (
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12} align="center">
              <Typography component="h4" variant="h4">
                Create Account
              </Typography>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={6} align="center">
              <TableContainer component={Paper}>
                <Table aria-label="usersTable">
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell align="right">Weight</TableCell>
                      <TableCell align="right"> </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableCell component="th">
                      <TextField
                        id="username"
                        label="e.g. user123"
                        helperText={this.state.UsernameError}
                        error={this.state.UsernameError}
                        onChange={this.handleTextInput}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        id="user-weight"
                        label="Weight"
                        type="number"
                        onChange={this.handleNumberInput}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={this.handleAddButtonPressed}
                      >
                        <AddIcon />
                      </IconButton>
                    </TableCell>
                    {this.state.users.map((user, index) => (
                      <TableRow key={user.username}>
                        <TableCell component="th" scope="user">
                          {user.username}
                        </TableCell>
                        <TableCell align="right">{user.weight}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={this.handleRemoveButtonPressed(index)}
                          >
                            <ClearIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item container spacing={1} xs={6} direction="column">
              <Grid item container spacing={1} direction="row">
                <Grid item xs={4}>
                  <TextField
                    id="low_threshold"
                    label="Low Threshold"
                    type="number"
                    onChange={this.handleNumberInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} align="left">
                  <TextField
                    id="medium_threshold"
                    label="Medium Threshold"
                    type="number"
                    onChange={this.handleNumberInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} align="left">
                  <TextField
                    id="high_threshold"
                    label="High Threshold"
                    type="number"
                    onChange={this.handleNumberInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    id="creator-weight"
                    label="Your Weight"
                    type="number"
                    onChange={this.handleNumberInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="account-name"
                    label="Account Name"
                    placeholder="e.g. Business Account"
                    onChange={this.handleTextInput}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={this.handleCreateButtonPressed}
                >
                  Create Account
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return (
        <div class="center">
        <ReactLoading type={"cylon"} color={"#f50057"} height={334} width={188} />
        </div>
      );
    }
  }
}
