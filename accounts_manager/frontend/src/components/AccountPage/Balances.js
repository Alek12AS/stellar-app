import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

export default function (props) {
  const { balances } = props;

  return (
    <React.Fragment>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
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
                {balances.map((b) => (
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
    </React.Fragment>
  );
}
