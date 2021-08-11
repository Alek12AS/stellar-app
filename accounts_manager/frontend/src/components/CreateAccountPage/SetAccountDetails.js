/*
Author: A.Apetrei

Summary: 
Functional class component to handle the account related input, such as the name and thresholds.

*/

import React from "react";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

export default function (props) {
    const { numbersModified, nameModified } = props;

    const handleNameInput = (e) => {
        nameModified(e.target.value);
    }

    const handleNumberInput = (e) => {
        const maxValue = 255;
        const minValue = 0;
    
        const newValue = Math.min(Math.max(e.target.value, minValue), maxValue);

        numbersModified(e.target.id, newValue);

    }

  return (
    <React.Fragment>
        <Grid item xs={12}>
        <TextField
          id="account-name"
          label="Account Name"
          placeholder="e.g. Business Account"
          onChange={handleNameInput}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={4} align="center">
        <TextField
          id="low_threshold"
          label="Low Threshold"
          type="number"
          onChange={handleNumberInput}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={4} align="center">
        <TextField
          id="med_threshold"
          label="Medium Threshold"
          type="number"
          onChange={handleNumberInput}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={4} align="center">
        <TextField
          id="high_threshold"
          label="High Threshold"
          type="number"
          onChange={handleNumberInput}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          id="creator_weight"
          label="Your Weight"
          type="number"
          onChange={handleNumberInput}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </React.Fragment>
  );
}
