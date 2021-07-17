import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { FormControl } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
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
        { username: "userasfoapodfhasdpf11", weight: 3 },
        { username: "usersdfsdfads12", weight: 2 }
        
      ],
      userToAdd: "",
      userToAddWeight: 0,
      UsernameError: ""
    };

    this.renderRow = this.renderRow.bind(this);
    this.handleRemoveButtonPressed = this.handleRemoveButtonPressed.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleAddButtonPressed = this.handleAddButtonPressed.bind(this);
  }

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

  renderRows = (type) => {
    const views = [];
    if (type == "username") {
      for (var i =0; i<this.state.users.length; i++){
        views.push(
           <ListItem key={i}>         
           <ListItemText primary={this.state.users[i].username} />
   
       </ListItem>);
       } 
    } else if (type=="weight") {
      for (var i =0; i<this.state.users.length; i++){
      views.push(
        <ListItem key={i}>         
        <ListItemText primary={this.state.users[i].weight} />
        <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={this.handleRemoveButtonPressed(i)}>
        <ClearIcon />
        </IconButton>
        </ListItemSecondaryAction>
        </ListItem>
        ); }
    } 
    return views;
}

  userisAdded() {

    var index = this.state.users.findIndex((user) => user.username == this.state.userToAdd);

    return index
  }

  FindUser() {
    
  fetch('/api/check-username' + '?username=' + this.state.userToAdd)
  .then((response) => {

    console.log(this.userisAdded(this.state.userToAdd));

    if(response.status == 200 && this.userisAdded() == -1) {
      var newUserList = this.state.users;
      newUserList.push({
        username: this.state.userToAdd,
        weight: this.state.userToAddWeight
      })
      
      this.setState({
        users:newUserList,
        UsernameError: ""
      }) 
    } else if (response.status == 200 && this.userisAdded() != -1) {
      newUserList = this.state.users;

      const index = this.userisAdded();
      newUserList[index].weight = this.state.userToAddWeight;
      
      this.setState({
        users:newUserList,
        UsernameError: ""
      })

      } else if (response.status == 404) {
      this.setState({
        UsernameError:"User not found!"
      })
    } else if (response.status == 400) {
      this.setState({
        UsernameError:"Missing username"
      })
    }
  })
    
  }
    

  handleAddButtonPressed(e) {
    this.FindUser();
  }

  handleTextInput(e) {
    if (e.target.id == "username") {
      this.setState({
        userToAdd: e.target.value
      })
    }
    else if (e.target.id == "user-weight") {
      this.setState({
        userToAddWeight: e.target.value
      })
    }
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
            <Grid item xs={3} align="left">
                <Typography component="h6" variant="h6">
                    USERNAME
                </Typography>
            </Grid>
            <Grid item xs={9} align="left">
                <Typography component="h6" variant="h6">
                    WEIGHT
                </Typography>
            </Grid>
            <Grid item xs={3} align="left">
                <List component="nav" aria-label="list-username">
                
                {this.renderRows("username")}
                
                </List>
            </Grid>
            <Grid item xs={3} align="left">
                <List component="nav" aria-label="list-weight">
                
                {this.renderRows("weight")}
                
                </List>
            </Grid>
                
            <Grid item container spacing={1} xs={6} direction="column">
                <Grid item container spacing={1} direction="row">
                    <Grid item  xs={4}>
                
                            <TextField
                            id="username"
                            label="Username"
                            helperText={this.state.UsernameError}
                            error={this.state.UsernameError}
                            onChange={this.handleTextInput}
                            />
                       
                    </Grid>
                    <Grid item  xs={4}>
                        <TextField
                            id="user-weight"
                            label="Weight"
                            type="number"
                            onChange={this.handleTextInput}
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