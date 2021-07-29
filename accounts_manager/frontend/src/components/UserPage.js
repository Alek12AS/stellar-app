import { Grid } from '@material-ui/core';
import Button from "@material-ui/core/Button"
import React, {Component} from 'react';
import { Link } from 'react-router';

export default class UserPage extends Component {
    constructor(props) {
        
        super(props);
        this.state = {
            name: "",
            public_key: ""
        };


    }

    getUserDetails() {
        
    }
    
    render() {
        return( <div>
            <h3> Name: {this.state.name} </h3>
            <p> Public key: {this.public_key} </p>
        </div>);
    }
}