import React, {Component} from 'react';
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom"
import { FormControl } from '@material-ui/core';
import { Keypair } from "stellar-sdk";
import sjcl from 'sjcl';

export default class CreateUserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
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
        const pk = keypair.publicKey();

        console.log(keypair.secret());
        console.log(pk);

        localStorage.setItem(pk,sjcl.encrypt(this.state.pass,keypair.secret()));

        console.log(this.state.name);

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.name,
                public_key: pk,
            }),
        };
        
        fetch('/api/create-user', requestOptions)
        .then((response) => response.json())
        .then((data) => this.props.history.push('/user/' + data.public_key));


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
            <div class="center">
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Create a KeyPair
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
                
            </div>   );
            
    }
}