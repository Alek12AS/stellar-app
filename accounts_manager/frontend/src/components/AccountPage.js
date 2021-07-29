import React, { Component } from "react";
import { Server } from "stellar-sdk";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import { Grid } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { RequestToSign, RejectTransaction, CreateTransaction } from "./tools";
import ReactLoading from "react-loading";

function SignCell(props) {
  const { code } = props;

  return (
    <React.Fragment>
      <TableCell align="right">
        <IconButton
          edge="start"
          aria-label="sign"
          onClick={() => this.sign(code)}
        >
          <CheckIcon />
        </IconButton>
      </TableCell>
      <TableCell align="left">
        <IconButton
          edge="start"
          aria-label="dont-sign"
          onClick={() => this.reject(code)}
        >
          <ClearIcon />
        </IconButton>
      </TableCell>
    </React.Fragment>
  );
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="left">
          {row.requestee_username}
        </TableCell>
        <TableCell align="right">
          {row.amount.toString() + row.asset_type}
        </TableCell>
        <TableCell align="right">{row.created_at}</TableCell>
        <SignCell code={row.code}></SignCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography>Details</Typography>
              <Table size="small" aria-label="more-details">
                <TableBody>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ fontWeight: "bold" }}
                    >
                      Destination Public Key:
                    </TableCell>
                    <TableCell>{row.destination}</TableCell>
                  </TableRow>
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ fontWeight: "bold" }}
                    >
                      Notes:
                    </TableCell>
                    <TableCell>{row.notes}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ fontWeight: "bold" }}
                    >
                      Signature Weight:
                    </TableCell>
                    <TableCell align="left">
                      {row.total_signature_weight.toString() +
                        "/" +
                        this.state.account_details.thresholds.med_threshold.toString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default class AccountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: [],
      server: "https://horizon-testnet.stellar.org",
      account_id: "",
      account_name: "",
      user_publicKey: "",
      account_details: {},
      user_weight: 0,
      verified_user: false,
      AccountDataReturned: false,
      TransactionDataReturned: false,
      destination: "",
      amount: "",
      asset_type: "",
      loading: true,
    };

    this.state.account_id = this.props.match.params.public_key;

    this.GetAccountDetails();

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmitButtonPressed = this.handleSubmitButtonPressed.bind(this);
    Row = Row.bind(this);
    SignCell = SignCell.bind(this);
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
    if (sessionStorage.getItem("stellar_keypairs")) {
      const keypairs = JSON.parse(sessionStorage.getItem("stellar_keypairs"));

      const found = this.state.account_details.signers.filter(
        (signer) => signer.key == keypairs.public_key
      );
      if (found.length != 0) {
        this.setState({
          user_weight: found[0].weight,
          user_publicKey: found[0].key,
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

  sign(code) {
    const t_index = this.state.transactions.findIndex((e) => e.code == code);
    const ts = this.state.transactions;
    ts[t_index].signed = true;
    this.setState({
      transactions: ts,
    });
    const resolved = RequestToSign(
      code,
      this.state.user_publicKey,
      this.state.account_details.thresholds.med_threshold,
      this.state.user_weight
    );
  }

  reject(code) {
    const resolved = RejectTransaction(code, this.state.user_publicKey);

    if (resolved) {
      const t_index = this.state.transactions.findIndex((e) => e.code == code);
      const ts = this.state.transactions;
      ts[index].complete = true;
      this.setState({
        transactions: ts,
      });
    }
  }

  handleInput(e) {
    if (e.target.id == "destination") {
      this.setState({
        destination: e.target.value,
      });
    }

    if (e.target.id == "amount") {
      this.setState({
        amount: e.target.value,
      });
    }

    if (e.target.id == "notes") {
      this.setState({
        notes: e.target.value,
      });
    }
  }

  handleSelect(value) {
    this.setState({
      asset_type: value,
    });
  }

  handleSubmitButtonPressed() {
    var completed = false;
    if (
      this.state.user_weight ==
      this.state.account_details.thresholds.med_threshold
    ) {
      completed = true;
    }

    this.setState({
      loading: true,
    });

    CreateTransaction(
      this.state.account_id,
      this.state.user_publicKey,
      this.state.user_weight,
      this.state.destination,
      this.state.amount,
      this.state.asset_type,
      this.state.notes,
      completed
    ).then((r) => {
      if (r) {
        console.log("Transaction Request Created");
        this.GetAccountDetails();
        this.setState({
          loading: false,
        });
      }
    });
  }

  render() {
    if (!this.state.loading) {
      return (
        <div>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} align="center">
              <Typography component="h4" variant="h4">
                Account: {this.state.account_name}
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography component="h6" variant="h6">
                Balances
              </Typography>
            </Grid>
            <Grid item container justifyContent="center">
              <Grid item xs={6} align="center">
                <TableContainer component={Paper}>
                  <Table aria-label="balances-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Asset Type</TableCell>
                        <TableCell align="right">Balance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.account_details.balances.map((b) => (
                        <TableRow>
                          <TableCell component="th" scope="asset">
                            {b.asset_type}
                          </TableCell>
                          <TableCell align="right">{b.balance}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography component="h6" variant="h6">
                Request a Payment
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography component="subtitle1" variant="subtitle1">
                Your signature weight: {this.state.user_weight}
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <TextField
                id="destination"
                label="Public Key"
                style={{ margin: 8 }}
                placeholder="e.g. GBAEFI4QDEP4IEGCYVKHNSIY65MYYJCQJSN2FTAPHJQEOJI4TZED3HOF"
                helperText="Destination Public Key"
                onChange={this.handleInput}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="amount"
                label="Amount"
                type="number"
                onChange={this.handleInput}
                margin="normal"
                style={{ marginLeft: 8 }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <Select
                labelId="asset"
                id="asset"
                onChange={(e) => this.handleSelect(e.target.value)}
                style={{ position: "relative", top: "12px" }}
                fullWidth
              >
                <MenuItem value={"XLM"}>XLM</MenuItem>
                <MenuItem value={"BTC"}>BTC</MenuItem>
                <MenuItem value={"DOGE"}>DOGE</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="notes"
                label="Notes"
                onChange={this.handleInput}
                multiline
                placeholder="Notes for other users to see"
                rows={5}
                fullWidth
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="secondary"
                variant="contained"
                onClick={this.handleSubmitButtonPressed}
                style={{ margin: 8 }}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={12} align="center">
              <Typography component="h6" variant="h6">
                Payment Requests
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table aria-label="Requested-Transactions">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell align="left">Requestee</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Time</TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.transactions
                      .filter((t) => !t.completed && !t.rejected && !t.signed)
                      .map((t) => (
                        <Row key={t.requestee + t.created_at} row={t} />
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
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
