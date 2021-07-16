import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { FormControl } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { FixedSizeList } from "react-window";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';

export default class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [
        { username: "user1", weight: 1 },
        { username: "user2", weight: 3 },
        { username: "user3", weight: 2 },
        { username: "user4", weight: 1 },
        { username: "user5", weight: 3 },
        { username: "user6", weight: 2 },
        { username: "user7", weight: 1 },
        { username: "user8", weight: 3 },
        { username: "user9", weight: 2 },
        { username: "user10", weight: 1 },
        { username: "user11", weight: 3 },
        { username: "user12", weight: 2 }
      ]
    };

    this.renderRow = this.renderRow.bind(this);
    this.handleRemoveButtonPressed = this.handleRemoveButtonPressed.bind(this);
  }

  // renderRow(props = this.props) {

  //     const { index } = props;

  //     return (
  //       <ListItem key={index}>
  //         <ListItemText primary={this.state.users[index].username} align="center" />
  //         <IconButton edge="end" aria-label="delete">
  //             <ClearIcon id={index.toString()} onClick={this.handleRemoveButtonPressed}/>
  //         </IconButton>
  //       </ListItem>
  //     );
  //   }

  renderRow() {
    this.state.users.map(function (user, index) {
      return (
        <ListItem button key={index}>
          <ListItemText primary={user.username} />
        </ListItem>
      );
    });
  }

  handleRemoveButtonPressed(i) {

    var self = this;

    return function handleButton(e) {
        var newList = self.state.users;
        newList.splice(i,1);
        self.setState({
            users: newList
    })
    }
    
  }

  renderRows = () => {
    const views = [];
    for (var i =0; i<this.state.users.length; i++){
     views.push(
        <ListItem key={i}>         
        <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={this.handleRemoveButtonPressed(i)}>
        <ClearIcon />
        </IconButton>
        </ListItemSecondaryAction>
        <ListItemText primary={this.state.users[i].username} />
        <ListItemText primary={this.state.users[i].weight} />

    </ListItem>);
    } 
    return views;
}
    

  handleAddButtonPressed(e) {

  }

  render() {
    return (
      <div >
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create Account
                </Typography>
            </Grid>
            <Grid item xs={6} align="left">
                <List component="nav" aria-label="main mailbox folders">
                
                
                {this.renderRows()}
                
                </List>
            </Grid>
                
            <Grid item container spacing={1} xs={6} direction="column">
                <Grid item container spacing={1} direction="row">
                    <Grid item  xs={4}>
                
                            <TextField
                            id="username"
                            label="Username"
                            onChange={this.handleTextInput}
                            />
                       
                    </Grid>
                    <Grid item  xs={4}>
                        <TextField
                            id="standard-number"
                            label="Weight"
                            type="number"
                            InputLabelProps={{
                            shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item  xs={4} >
                        <Button color="secondary" 
                        variant="contained"
                        onClick={this.handleAddButtonPressed}
                        >
                            <AddIcon/>
                        </Button>
                    </Grid>
                </Grid>
                <Grid item >
                <TextField
                    id="standard-number"
                    label="Low Threshold"
                    type="number"
                    InputLabelProps={{
                    shrink: true
                    }}
                />
                </Grid>
                <Grid item >
                <TextField
                    id="standard-number"
                    label="Medium Threshold"
                    type="number"
                    InputLabelProps={{
                    shrink: true
                    }}
                />
                </Grid>
                <Grid item>
                <TextField
                    id="standard-number"
                    label="High Threshold"
                    type="number"
                    InputLabelProps={{
                    shrink: true
                    }}
                />
                </Grid>
                <Grid item>
                <Button color="secondary" 
                        variant="contained"
                        onClick={this.handleCreateButtonPressed}
                        >
                            Create Account
                        </Button>
                </Grid>
            </Grid>
        </Grid>
      </div>
    );
  }
}