import  React, { useState } from "react";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ReactLoading from "react-loading";
import { CreateTransaction } from "./tools";

export default function (props) {
  const { details, GetAccountDetails } = props;
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState(0);
  const [asset_type, setAssetType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    return (
      destination.length == 56 &&
      amount >= 0.0000001 &&
      asset_type.length > 0
    );
  }

  const handleSubmitButtonPressed = () => {
    var completed = false;
    if (
      details.user_weight ==
      details.med_threshold
    ) {
      completed = true;
    }

    setLoading(true)

    CreateTransaction(
      details.account_id,
      details.user_publicKey,
      details.user_weight,
      destination,
      amount,
      asset_type,
      notes,
      completed
    ).then((r) => {
      if (r) {
        setLoading(false);
      }
    });
  }

  if(!loading) {
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
          onChange={e => setDestination(e.target.value)}
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
          onChange={e => setAmount(e.target.value)}
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
          onChange={e => setAssetType(e.target.value)}
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
          onChange={e => setNotes(e.target.value)}
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
    </React.Fragment>
  ); 
  }
  else {
    return (
        <Grid item xs={12} align="center">
          <ReactLoading
            type={"cylon"}
            color={"#f50057"}
            height={334}
            width={188}
          />
      </Grid>
    );
  }
}
