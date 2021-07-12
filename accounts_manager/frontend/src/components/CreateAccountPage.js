import React, {Component} from 'react';
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom"
import { FormControl } from '@material-ui/core';
import { Keypair } from "stellar-sdk";
import sjcl from 'sjcl';

export default class CreateAccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            public_key: "",
            pass:"",
            confirmPass:"",
        };

        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
        this.validateForm = this.validateForm.bind(this);
        
    }

    handleTextInput(e) {
        if (e.target.id == "Name-Input") {
           
            this.setState({
                name: e.target.value,
            });
        }
        
        if (e.target.id == "Password-Input1") {
            this.setState({
                pass: e.target.value,
            });
        }

        if (e.target.id == "Password-Input2") {
          
            this.setState({
                confirmPass: e.target.value,
            });
        }

    }

    handleCreateButtonPressed() {
        
        const keypair = Keypair.random();
        this.setState({
            public_key: keypair.publicKey(), 
        });

        localStorage.setItem(this.state.public_key,sjcl.encrypt(this.state.pass,keypair.secret()));

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.name,
                public_key: this.state.public_key,
            }),
        };
        
        fetch('/api/create-user', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

    };

    validateForm() {

        return(
            this.state.pass.length > 0 && 
            this.state.pass == this.state.confirmPass &&
            this.state.name.length > 0
        );
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
                                id="Name-Input" 
                                label="Name" 
                                onChange={this.handleTextInput}/>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                        id="Password-Input1"
                        label="Enter Password"
                        onChange={this.handleTextInput}
                        type="password"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                        id="Password-Input2"
                        label="Re-enter Password"
                        onChange={this.handleTextInput}
                        type="password"
                        />
                    </FormControl>
                </Grid>
        
                <Grid item xs={12} align="center">
                    <Button color="secondary" 
                    variant="contained"
                    onClick={this.handleCreateButtonPressed}
                    disabled={!this.validateForm()}>
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