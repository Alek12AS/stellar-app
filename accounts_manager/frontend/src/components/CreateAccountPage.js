import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { CreateAccount } from "./tools";
import TextField from "@material-ui/core/TextField";
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

export default class CreateAccountPage extends Component {
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
      low_threshold: 0,
      medium_threshold: 0,
      high_threshold: 0,
      creator_weight: 0,
      creator_publicKey: "GDCJVNCL4BD6WZJGKQFFRQUPHTE4FCDQ5X4P5Y2PNL3DCCIMFL47U6TR",
      UsernameError: ""
    };

    this.renderRow = this.renderRow.bind(this);
    this.handleRemoveButtonPressed = this.handleRemoveButtonPressed.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleAddButtonPressed = this.handleAddButtonPressed.bind(this);
    this.handleNumberInput = this.handleNumberInput.bind(this);
    this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
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
  }

  handleNumberInput(e) {
    const maxValue = 255;
    const minValue = 0;

    const newValue = Math.min(Math.max(e.target.value, minValue), maxValue);
    
    if (e.target.id == "user-weight") {
      this.setState({
        userToAddWeight: newValue
      })
    }
    else if (e.target.id == "low-weight") {
      this.setState({
        low_threshold: newValue
      })
    }
    else if (e.target.id == "medium-weight") {
      this.setState({
        medium_threshold: newValue
      })
    }
    else if (e.target.id == "high-weight") {
      this.setState({
        high_threshold: newValue
      })
    }
    else if (e.target.id == "creator-weight") {
      this.setState({
        creator_weight: newValue
      })
    }
  }

  handleCreateButtonPressed(e) {
    const creator = {publicKey: this.state.creator_publicKey,
    weight: this.state.creator_weight};

    // CreateAccount(creator, this.state.users, this.state.low_threshold, this.state.medium_threshold, this.state.high_threshold)
    // .then(() => console.log("Account Creation OK"))
    // .catch(e => console.log(e));
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
                            onChange={this.handleNumberInput}                            
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

                    <Grid item xs={4}>
                    <TextField
                    id="low-threshold"
                    label="Low Threshold"
                    type="number"
                    onChange={this.handleNumberInput}
                    InputLabelProps={{
                    shrink: true
                    }}
                    />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                    id="medium-threshold"
                    label="Medium Threshold"
                    type="number"
                    onChange={this.handleNumberInput}
                    InputLabelProps={{
                    shrink: true
                    }}
                    />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                    id="high-threshold"
                    label="High Threshold"
                    type="number"
                    onChange={this.handleNumberInput}
                    InputLabelProps={{
                    shrink: true
                    }}
                    />
                    </Grid>
                    <Grid item xs={4}>
                    <TextField
                    id="creator-weight"
                    label="Your Weight"
                    type="number"
                    onChange={this.handleNumberInput}
                    InputLabelProps={{
                    shrink: true
                    }}
                    />
                    </Grid>
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