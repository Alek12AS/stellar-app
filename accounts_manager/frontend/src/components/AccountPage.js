import React, {Component} from 'react';
import { Server } from 'stellar-sdk';
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from '@material-ui/icons/Check';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import { Grid } from "@material-ui/core";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    
    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.requestee}
                </TableCell>
                <TableCell align="right">{row.amount.toString() + row.token}</TableCell>
                <TableCell align="right">{row.created_at}</TableCell>
                <TableCell align="right">{row.total_signature_weight.toString() + "/" + row.med_thresh.toString()}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography>
                                Details
                            </Typography>
                            <Table size="small" aria-label="more-details">
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" style={{fontWeight: 'bold'}}>
                                            Destination Public Key:
                                        </TableCell>
                                        <TableCell>{row.destination}</TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row" style={{fontWeight: 'bold'}}>
                                            Notes:
                                        </TableCell>
                                        <TableCell>{row.notes}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell scope="row" >
                                        <IconButton edge="start" aria-label="delete">
                                        <CheckIcon/>
                                        </IconButton>
                                        </TableCell>
                                        <TableCell>
                                        <IconButton edge="start" aria-label="delete">
                                        <ClearIcon/>
                                        </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


export default class UserPage extends Component {
    constructor(props) {
        
        super(props);

        const t1 = {XDR: "AAAAAPewD+/6X8o0bx3bp49Wf+mUhG3o+TUrcjcst717...", requestee: "Mihaela32", amount: 500, token:"XLM", destination: "GAXE7L52WAU5JLZZN5D4GBREPPICYOWZRZW7IEQCOUSW7DJL2H53GV7U"
        , created_at: "20/07/2021 14:21:02", notes: "Notes", total_signature_weight: 2, med_thresh:3, completed: false};
        const t2 = {XDR: "TUrcjcst717DWJVAAAAyAFvzscADTkNAAAAAAAAAAAAA...", requestee: "Alex18", amount: 200, token:"XLM",destination: "GAXE7L52WAU5JLZZN5D4GBREPPICYOWZRZW7IEQCOUSW7DJL2H53GV7U"
        , created_at: "20/07/2021 14:23:05", notes: "Notes", total_signature_weight: 1, med_thresh:3,completed: false};
        const transactions = [t1, t2];
        this.state = {
            transaction_requests: transactions,
            public_key: "",
            balances: [],
            low_thresh: 0,
            med_thresh: 0,
            high_thresh: 0,
            open: false,
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

    handleSubmitButtonPressed() {
    }
    
    render() {
        return( <div>
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Account
                    </Typography>
                </Grid>
                <Grid item xs={12} align = "center">
                    <Typography component="h6" variant="h6">
                        Request a Payment
                    </Typography>
                </Grid>
                <Grid item xs={12} align = "center">
                    <TextField
                    id="destination-public-key"
                    label="Public Key"
                    style={{ margin: 8 }}
                    placeholder="e.g. GBAEFI4QDEP4IEGCYVKHNSIY65MYYJCQJSN2FTAPHJQEOJI4TZED3HOF"
                    helperText="Destination Public Key"
                    fullWidth
                    required
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                    id="standard-number"
                    label="Amount"
                    type="number"
                    margin="normal"
                    style={{ marginLeft: 8 }}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    />
                </Grid>

                <Grid item xs={3}>
                    <Select
                    labelId="token-select"
                    id="token-select"
                    label="Token"
                    style={{ marginRight: 8 }}
                    fullWidth
                    >
                    <MenuItem value={"XLM"}>XLM</MenuItem>
                    <MenuItem value={"BTC"}>BTC</MenuItem>
                    <MenuItem value={"DOGE"}>DOGE</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                    id="notes-field"
                    label="Notes"
                    multiline
                    placeholder="Notes for other users to see"
                    rows={5}
                    fullWidth
                    style={{ margin: 8 }}
                    margin="normal"
                    variant="outlined"
                />
                </Grid>
                <Grid item xs={12}>
                <Button color="secondary" 
                    variant="contained"
                    onClick={this.handleSubmitButtonPressed}
                    style={{ margin: 8 }}
                    >
                    Submit
                </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        Payment Requests
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="Requested-Transactions">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Requestee</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Time</TableCell>
                                <TableCell align="right">Current Signature Weight</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.transaction_requests.map((t) => (
                                <Row key={t.requestee + t.created_at} row={t}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
                
            </Grid>
        </div>);
    }
}