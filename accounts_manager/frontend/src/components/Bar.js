import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link, Redirect } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function (props) {
  const classes = useStyles();
  const { current } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loggedin, setLoggedin] = React.useState(sessionStorage.getItem("stellar_keypair"));
  const [logout, setLogout] = React.useState(false);
  

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setLogout(true);
  };

  const checkLogin = () => {

      if (loggedin) {
        return(
          <Button color="inherit" onClick={handleLogout}>Sign Out</Button>
        );
      } else {
        return(
          <Button color="inherit" component={Link} to="/sign-in/">Sign In</Button>
        );
      }
      
  
  }



  if (logout) {
    return <Redirect to='/'  />
  }

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={(event) => setAnchorEl(event.currentTarget)}
            disabled={!loggedin}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {current}
          </Typography>
          {checkLogin()}
        </Toolbar>
      </AppBar>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/">Home</MenuItem>
        <MenuItem component={Link} to="/user/">Dashboard</MenuItem>
        <MenuItem component={Link} to="/create-account/">Create Stellar Account</MenuItem>
      </Menu>
    </React.Fragment>
  );
}
