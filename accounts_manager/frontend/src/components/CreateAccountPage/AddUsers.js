/*
Author: A.Apetrei

Summary: 
React functional component for adding users as signers to an account.

*/

import React from "react";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";

/*
default function

Description: Allows creator user to add existing users (along with their weights) as signers to the account being created.

*/
export default function (props) {
  const { modifyUserList, users } = props;
  const [usernameToAdd, setUsernameToAdd] = React.useState("");
  const [weightToAdd, setWeightToAdd] = React.useState(0);
  const [usernameError, setUsernameError] = React.useState("");

  /*
  function FindUser

  Description: Checks if the user that the account creator tries to add exists in the api database.

  */
  const FindUser = () => {
    fetch("/api/check-username" + "?username=" + usernameToAdd).then(
      (response) => {
        if (response.status == 200 && userisAdded() == -1) {
          let newUserList = users;
          newUserList.push({ username: usernameToAdd, weight: weightToAdd });

          modifyUserList(newUserList);

          setUsernameError("");
        } else if (response.status == 200 && userisAdded() != -1) {
          let newUserList = users;

          const index = userisAdded();
          newUserList[index].weight = weightToAdd;

          modifyUserList(newUserList);
          setUsernameError("");
        } else if (response.status == 404) {
          setUsernameError("User not found!");
        } else if (response.status == 400) {
          setUsernameError("Missing username");
        }
      }
    );
  };

  /*
  function userisAdded

  Description: If the user is already added to the list the function returns its index in the list otherwise it returns
  -1 to indicate that the user hasn't been added yet.

  */
  const userisAdded = () => {
    let index = users.findIndex((user) => user.username == usernameToAdd);

    return index;
  };

  const handleUsernameInput = (e) => {
    setUsernameToAdd(e.target.value);
  };

  const handleWeightInput = (e) => {
    const maxValue = 255;
    const minValue = 0;
    const newValue = Math.min(Math.max(e.target.value, minValue), maxValue);
    setWeightToAdd(newValue);
  };

  const handleAddButtonPressed = (e) => {
    FindUser();
  };

  const handleRemoveButtonPressed = (i) => {
    return function handleButton(e) {
      var newUserList = users;
      newUserList.splice(i, 1);

      modifyUserList(newUserList);
    };
  };

  return (
    <React.Fragment>
      <Grid item xs={12} align="center">
        <TableContainer component={Paper}>
          <Table aria-label="usersTable">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="right">Weight</TableCell>
                <TableCell align="right"> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableCell component="th">
                <TextField
                  id="username"
                  label="e.g. user123"
                  helperText={usernameError}
                  error={usernameError}
                  onChange={handleUsernameInput}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  id="user-weight"
                  label="Weight"
                  type="number"
                  onChange={handleWeightInput}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleAddButtonPressed}
                >
                  <AddIcon />
                </IconButton>
              </TableCell>
              {users.map((user, index) => (
                <TableRow key={user.username}>
                  <TableCell component="th" scope="user">
                    {user.username}
                  </TableCell>
                  <TableCell align="right">{user.weight}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={handleRemoveButtonPressed(index)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </React.Fragment>
  );
}
