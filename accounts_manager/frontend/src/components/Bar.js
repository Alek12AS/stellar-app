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
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from "@material-ui/icons/Home";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AddCircleIcon from "@material-ui/icons/AddCircle";

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
  list: {
    width: 250,
  },
}));

export default function (props) {
  const classes = useStyles();
  const { current } = props;

  const [loggedin, setLoggedin] = React.useState(
    sessionStorage.getItem("stellar_keypair")
  );
  const [logout, setLogout] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);


  const handleLogout = () => {
    sessionStorage.clear();
    setLogout(true);
    setLoggedin(false);
  };

  const checkLogin = () => {
    if (loggedin) {
      return (
        <Button color="inherit" onClick={handleLogout}>
          Sign Out
        </Button>
      );
    } else {
      return (
        <Button color="inherit" component={Link} to="/sign-in/">
          Sign In
        </Button>
      );
    }
  };


  const list = () => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={() => setDrawer(false)}
      onKeyDown={() => setDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to="/user/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={"Dashboard"} />
        </ListItem>
        <ListItem button component={Link} to="/create-account/">
          <ListItemIcon>
            <AddCircleIcon />
          </ListItemIcon>
          <ListItemText primary={"Create Stellar Account"} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <React.Fragment>
      {logout && <Redirect to="/" />}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => setDrawer(true)}
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
      <Drawer anchor={"left"} open={drawer} onClose={() => setDrawer(false)}>
        {list()}
      </Drawer>
    </React.Fragment>
  );
}
