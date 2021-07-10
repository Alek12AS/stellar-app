import React, {Component} from 'react';
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from "@material-ui/core/FormHelperText";
import { Link } from "react-router-dom"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormControl } from '@material-ui/core';
import { Keypair } from "stellar-sdk";

export default class CreateAccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            public_key: ""
        };

        this.handleNameInput = this.handleNameInput.bind(this);
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
    }

    handleNameInput(e) {
        this.setState({
            name: e.target.value,
        });
    }

    handleCreateButtonPressed() {
        const keypair = Keypair.random();
        // this.setState({
        //     public_key: keypair.publicKey(), 
        // });
        console.log(keypair.publicKey());
    }

    render() {
        return ( 
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Create a key pair
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField required={true} 
                                id="standard-basic" 
                                label="Name" 
                                onChange={this.handleNameInput}/>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={this.handleCreateButtonPressed}>
                        Generate Keypair
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" 
                    variant="contained" 
                    to="/" 
                    component={Link}
                    >
                        Back
                    </Button>
                </Grid>
            </Grid> 
                
                );
            
    }
}