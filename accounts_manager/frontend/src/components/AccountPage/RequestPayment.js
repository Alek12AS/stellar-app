/*
Author: A.Apetrei

Summary: 
Functional components that render form for user to request a payment.

*/

import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { CreateTransaction } from "./tools";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function (props) {
  const { details, GetAccountDetails } = props;
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState(0);
  const [asset_type, setAssetType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [PKerror, setPKerror] = React.useState(false);

  const classes = useStyles();

  const validateForm = () => {
    return (
      destination.length == 56 && amount >= 0.0000001 && asset_type.length > 0
    );
  };

  async function handleSubmitButtonPressed() {
    var completed = false;
    if (details.user_weight == details.med_threshold) {
      completed = true;
    }

    setLoading(true);

    const response = await CreateTransaction(
      details.account_id,
      details.user_publicKey,
      details.user_weight,
      destination,
      amount,
      asset_type,
      notes,
      completed
    );

    setLoading(false);

    if (!response) {
      setFailed(true);
      setPKerror(true);
    } else {
      setSuccess(true);
    }
  }

  return (
    <React.Fragment>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Request a Payment
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="subtitle1" variant="subtitle1">
          Your signature weight: {details.user_weight}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          id="destination"
          label="Public Key"
          // style={{ padding: 8 }}
          placeholder="e.g. GBAEFI4QDEP4IEGCYVKHNSIY65MYYJCQJSN2FTAPHJQEOJI4TZED3HOF"
          helperText="Destination Public Key"
          onChange={(e) => setDestination(e.target.value)}
          error={PKerror}
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
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          // style={{ marginLeft: 8 }}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item xs={3}>
        <Select
          labelId="asset"
          id="asset"
          onChange={(e) => setAssetType(e.target.value)}
          style={{ position: "relative", top: "12px" }}
          required
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
          onChange={(e) => setNotes(e.target.value)}
          multiline
          placeholder="Notes for other users to see"
          rows={5}
          fullWidth
          // style={{ padding: 8 }}
          margin="normal"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleSubmitButtonPressed}
          disabled={!validateForm()}
          // style={{ margin: 8 }}
        >
          Submit
        </Button>
      </Grid>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Success!
        </Alert>
      </Snackbar>
      <Snackbar
        open={failed}
        autoHideDuration={6000}
        onClose={() => setFailed(false)}
      >
        <Alert onClose={() => setFailed(false)} severity="error">
          Failed to create Request. Please check destination address!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
