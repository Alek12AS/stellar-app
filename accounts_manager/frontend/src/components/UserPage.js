import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, { Component } from "react";
import { Link } from "react-router";
import ReactLoading from "react-loading";
import { Redirect } from "react-router-dom";
import { Server } from "stellar-sdk";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

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
          {row.name}
        </TableCell>
        <TableCell align="right">{row.last_modified_time}</TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="go-to"
            size="small"
            onClick={() => this.GoTo(row.account_id)}
          >
            <ChevronRightIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography>Balances</Typography>
              <Table size="small" aria-label="more-details">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Asset Type</TableCell>
                    <TableCell align="left">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.balances.map((asset, index) => (
                    <TableRow key={asset.asset_type}>
                      <TableCell component="th" scope="row">
                        {asset.asset_type}
                      </TableCell>
                      <TableCell>{asset.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server: "https://horizon-testnet.stellar.org",
      name: "",
      public_key: "",
      username: "",
      accounts: [],
      AccountDataReturned: false,
      redirect_link: ""
    };

    this.GetUserDetails();
    Row = Row.bind(this);
  }

  GoTo(account_id) {
      this.setState({
          redirect_link: "/account/" + account_id
      })
  }

  async GetUserDetails() {
    const pk = JSON.parse(sessionStorage.getItem("stellar_keypair")).public_key;

    console.log(this.state.public_key);

    const response = await fetch("/api/get-user-details" + "?public_key=" + pk);

    var data;
    const server = new Server(this.state.server);
    if (response.status == 200) {
      data = await response.json();

      const accounts = [];

      for (let a of data.accounts) {
        await server.loadAccount(a.public_key).then((account) => {
          let account_data = {
            name: a.name,
            account_id: a.public_key,
            balances: account.balances,
            last_modified_time: account.last_modified_time,
          };
          accounts.push(account_data);
        });
      }

      console.log(accounts)

      this.setState({
        name: data.user_details.name,
        public_key: pk,
        accounts: accounts,
        AccountDataReturned: true,
      });
    }
  }

  render() {
    if (this.state.redirect_link) {
        return <Redirect to= {this.state.redirect_link} />;
    }
    else if (this.state.AccountDataReturned) {
      return (
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12} align="left">
                <Typography variant="h3">
                    Dashboard
                </Typography>
            </Grid>
            <Grid item xs={12} align="left">
                <Typography variant="subtitle1">
                    Hello {this.state.name}!
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h4">
                    Accounts
                </Typography>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table aria-label="Requested-Transactions">
                  <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="right">Time Last Modified</TableCell>
                        <TableCell align="right">Go to</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.accounts.map((t) => (
                      <Row key={t.account_id} row={t} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      console.log("loading");
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
