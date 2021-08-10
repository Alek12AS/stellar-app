import React from "react";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
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

function Row(props) {
    const { row, thresh } = props;
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
          <TableCell ></TableCell>
          <TableCell ></TableCell>
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
                          thresh.toString()}
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


export default function (props) {
    const { requests, details } = props;

    return (
        <React.Fragment>
          <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">
              Pending Payments
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
                  {requests.reverse()
                    .filter((t) => {return !t.completed && (t.signed || t.rejected)})
                    .map((t) => (
                      <Row key={t.code} row={t} thresh={details.med_threshold}/>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </React.Fragment>
      );
}