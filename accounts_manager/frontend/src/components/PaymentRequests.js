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
import { RequestToSign, RejectTransaction } from "./tools";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// For rendering the rows in the table of payment requests
function Row(props) {
  const { row, sign, thresh, reject } = props;
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
        <TableCell align="right">
        <IconButton
          edge="start"
          aria-label="sign"
          onClick={() => sign(row.code)}
        >
          <CheckIcon />
        </IconButton>
      </TableCell>
      <TableCell align="left">
        <IconButton
          edge="start"
          aria-label="dont-sign"
          onClick={() => reject(row.code)}
        >
          <ClearIcon />
        </IconButton>
      </TableCell>
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function (props) {
  const { requests, details, updateRequests } = props;
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [cannotSign, setCannotSign] = React.useState(false);

  const classes = useStyles();

  async function sign(code) {
    
    setLoading(true)
    
    const resolved = await RequestToSign(
      code,
      details.user_publicKey,
      details.med_threshold,
      details.user_weight
    );

    setLoading(false)

    if (!resolved) {
      setFailed(true);

    } else if (resolved == 'already_complete') {
      setCompleted(true);
      let t_index = requests.findIndex((e) => e.code == code);
      let new_trans = requests;
      new_trans[t_index].completed = true;
      updateRequests(new_trans)
    }
    else if (resolved == 'cannot_sign') {
      setCannotSign(true);
      let t_index = requests.findIndex((e) => e.code == code);
      let new_trans = requests;
      new_trans[t_index].rejected = true;
      updateRequests(new_trans)
    } else {
      setSuccess(true);
      let t_index = requests.findIndex((e) => e.code == code);
      let new_trans = requests;
      new_trans[t_index].signed = true;
      updateRequests(new_trans)
    }
  
  }

  const reject = (code) => {

    setLoading(true);

    const resolved = RejectTransaction(code, details.user_publicKey);

    setLoading(false);

    if (resolved) {
      const t_index = transactions.findIndex((e) => e.code == code);
      const new_trans = transactions;
      new_trans[index].complete = true;
      updateRequests(new_trans)
    }
  }

  return (
    <React.Fragment>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
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
              {requests
                .filter((t) => !t.completed && !t.rejected && !t.signed)
                .map((t) => (
                  <Row key={t.requestee + t.created_at} row={t} sign={sign}
                   reject={reject} thresh={details.med_threshold}/>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Success!
        </Alert>
      </Snackbar>
      <Snackbar open={failed} autoHideDuration={6000} onClose={() => setFailed(false)}>
        <Alert onClose={() => setFailed(false)} severity="error">
          Signature Failed!
        </Alert>
      </Snackbar>
      <Snackbar open={completed} autoHideDuration={6000} onClose={() => setCompleted(false)}>
        <Alert onClose={() => setCompleted(false)} severity="info">
          Transaction already completed!
        </Alert>
      </Snackbar>
      <Snackbar open={cannotSign} autoHideDuration={6000} onClose={() => setCannotSign(false)}>
        <Alert onClose={() => setCannotSign(false)} severity="warning">
          Cannot Sign!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
