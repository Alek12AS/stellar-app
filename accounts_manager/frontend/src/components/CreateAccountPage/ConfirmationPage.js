import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

export default function (props) {
  const { users, details } = props;

  return (
    <React.Fragment>
      <Grid item xs={12} align="center">
        <Typography component="subtitle1" variant="subtitle1">
          Account Name: {details.account_name}
        </Typography>
      </Grid>
      <Grid item xs={4} align="center">
        <Typography component="subtitle1" variant="subtitle1">
          Low Threshold: {details.low_threshold}
        </Typography>
      </Grid>
      <Grid item xs={4} align="center">
        <Typography component="subtitle1" variant="subtitle1">
          Medium Threshold: {details.med_threshold}
        </Typography>
      </Grid>
      <Grid item xs={4} align="center">
        <Typography component="subtitle1" variant="subtitle1">
          High Threshold: {details.high_threshold}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="subtitle1" variant="subtitle1">
          Your Weight: {details.creator_weight}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h6" variant="h6">
          Other Users
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TableContainer component={Paper}>
          <Table aria-label="usersTable">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="right">Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.username}>
                  <TableCell component="th" scope="user">
                    {user.username}
                  </TableCell>
                  <TableCell align="right">{user.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </React.Fragment>
  );
}
