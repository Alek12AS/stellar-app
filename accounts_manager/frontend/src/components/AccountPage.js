import React, {Component} from 'react';
import { Server } from 'stellar-sdk';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import CreateIcon from '@material-ui/icons/Create';
import CheckIcon from '@material-ui/icons/Check';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

export default class UserPage extends Component {
    constructor(props) {
        
        super(props);

        const t1 = {XDR: "AAAAAPewD+/6X8o0bx3bp49Wf+mUhG3o+TUrcjcst717...", requestee: "Mihaela32", destination: "GAXE7L52WAU5JLZZN5D4GBREPPICYOWZRZW7IEQCOUSW7DJL2H53GV7U"
        , created_at: "20/07/2021 14:21:02", notes: "Notes", total_signature_weight: 2, completed: false};
        const t2 = {XDR: "TUrcjcst717DWJVAAAAyAFvzscADTkNAAAAAAAAAAAAA...", requestee: "Alex18", destination: "GAXE7L52WAU5JLZZN5D4GBREPPICYOWZRZW7IEQCOUSW7DJL2H53GV7U"
        , created_at: "20/07/2021 14:23:05", notes: "Notes", total_signature_weight: 1, completed: false};
        const transactions = [t1, t2];
        this.state = {
            transaction_requests: transactions,
            public_key: "",
            balances: [],
            low_thresh: 0,
            med_thresh: 0,
            high_thresh: 0
        };

        this.public_key = this.props.match.params.public_key;
        this.getAccountDetails();
    }

    getAccountDetails() {
        // const t1 = {XDR: "AAAAAPewD+/6X8o0bx3bp49Wf+mUhG3o+TUrcjcst717...", requestee: "Mihaela32", destination: "GAXE7L52WAU5JLZZN5D4GBREPPICYOWZRZW7IEQCOUSW7DJL2H53GV7U"
        // , created_at: "20/07/2021 14:21:02", notes: "Notes", total_signature_weight: 2, completed: false};
        // const t2 = {XDR: "TUrcjcst717DWJVAAAAyAFvzscADTkNAAAAAAAAAAAAA...", requestee: "Alex18", destination: "GBKBCM42UKA4D3LIJYFIU6YPBRUDVZAC4I42ONDQJ3AVXYEXWJL6N3UC"
        // , created_at: "20/07/2021 14:23:05", notes: "Notes", total_signature_weight: 1, completed: false};

        // const transactions = [t1, t2];

        // this.setState({
        //     transaction_requests: transactions
        // })


        // await Server
        // .loadAccount(this.state.public_key)
        // .then((account) => {
        //     this.state.balances = account.balances;
        //     this.state.low_thresh = account.thresholds.low_threshold;
        //     this.state.med_thresh = account.thresholds.med_threshold;
        //     this.state.high_thresh = account.thresholds.high_threshold;
        // })
        
        // fetch('/api/get-transactions' + '?public_key=' + this.public_key).then((response) => response.json()
        // ).then((data) => {
        //     this.setState({
        //         transactions: data.transactions,
        //     })
        // });

        }

    handleApproveButtonPressed() {
        // var self = this;

        // return function handleButton(e) {
        //     var newList = self.state.users;
        //     newList.splice(i,1);
        //     self.setState({
        //         users: newList
        // })
        // }
    }

    handleDisapproveButtonPressed() {
        // var self = this;

        // return function handleButton(e) {
        //     var newList = self.state.users;
        //     newList.splice(i,1);
        //     self.setState({
        //         users: newList
        // })
        // }
    }
    
    renderRow(type) {
    const views = [];
    for (var i=0; i<this.state.transaction_requests.length; i++) {
        if (type == "destination") {
            for (var i =0; i<this.state.transaction_requests.length; i++){
              views.push(  
                 <ListItem key={i}>         
                 <ListItemText style={{'overflowWrap': 'break-word'}} primary={this.state.transaction_requests[i].destination} />
             </ListItem>);
             } 
          } else if (type=="requestee") {
            for (var i =0; i<this.state.transaction_requests.length; i++){
            views.push(
              <ListItem key={i}>         
              <ListItemText primary={this.state.transaction_requests[i].requestee} />
              </ListItem>
              ); }} 
              else if (type=="date") {
                for (var i =0; i<this.state.transaction_requests.length; i++){
                views.push(
                    <ListItem key={i}>         
                    <ListItemText primary={this.state.transaction_requests[i].created_at} />
                    </ListItem>
                    ); }
                }
                else if (type=="signature_weight") {
                    for (var i =0; i<this.state.transaction_requests.length; i++){
                    views.push(
                        <ListItem key={i}>         
                        <ListItemText primary={this.state.transaction_requests[i].total_signature_weight} />
                        <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={this.handleApproveButtonPressed(i)}>
                        <CheckIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={this.handleDisapproveButtonPressed(i)}>
                        <ClearIcon />
                        </IconButton>
                        </ListItemSecondaryAction>
                        </ListItem>
                        ); }
                    }        
    }
    return views;
    }
    
    render() {
        return( <div>
            <h3> Name: {this.state.name} </h3>
            <p> Public key: {this.public_key} </p>

            <Grid container spacing={1}>
                
                <Grid item xs = {3}>
                    <List>
                        {this.renderRow("destination")}
                    </List>
                </Grid>
                <Grid item xs = {3}>
                    <List>
                        {this.renderRow("date")}
                    </List>
                </Grid>
                <Grid item xs = {3}>
                    <List>
                        {this.renderRow("requestee")}
                    </List>
                </Grid>
                <Grid item xs = {3}>
                    <List>
                        {this.renderRow("signature_weight")}
                    </List>
                </Grid>

            </Grid>
        </div>);
    }
}