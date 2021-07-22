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

function SignCell(props) {
    const { signed } = props;
    
    if (signed == true){
        return (
            <React.Fragment>
                <TableCell>
                <IconButton edge="start" aria-label="sign">
                <CheckIcon/>
                </IconButton>
                </TableCell>
                <TableCell>
                <IconButton edge="start" aria-label="dont-sign">
                <ClearIcon/>
                </IconButton>
                </TableCell>
            </React.Fragment>
        )
    } 
    else if (signed == false) {
        return (
            <React.Fragment>
                <TableCell span={2}>SIGNED</TableCell>
            </React.Fragment>
        )
    }
}

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
                <SignCell display={row.signed}></SignCell>
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
                                        <TableCell component="th" scope="row" style={{fontWeight: 'bold'}}>
                                            Signature Weight:
                                        </TableCell>
                                        <TableCell align="right">
                                        {row.total_signature_weight.toString() + "/" + row.med_thresh.toString()}
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

        this.state = {
            transactions: [],
            server: 'https://horizon-testnet.stellar.org',
            account_id: "",
            account_name: "",
            user_publicKey: "",
            account_details: {},
            user_weight: 0,
            verified: false,
            DataIsReturned: false,
        };

        this.state.account_id = this.props.match.params.public_key;
        
        this.GetAccountDetails();
        this.getTransactions();

    }

    verifySigner() {
        // Find out which public key is in the localstorage in order to display appropriate content for this user
        if (localStorage.getItem("stellar_keypairs")){
            const keypairs = JSON.parse(localStorage.getItem("stellar_keypairs"));

            for (const kp of keypairs) {
                const found = this.state.account_details.signers.filter((signer) => signer.key == kp.public_key)
                if (found.length != 0) {
                    this.setState({
                        user_weight:found[0].weight,
                        user_publicKey: found[0].key,
                        verified: true,
                    })
                    
                }
            }    
        }
        return false
    }


    getTransactions() {
        fetch('/api/get-transactions' + '?account_id=' + this.state.account_id).then((response) => response.json()
        ).then((data) => {
            const new_data = data;
            // check if this user has signed it already
            for (let i=0; i<new_data.length; i++) {
                if (new_data[i].signers.filter(s => s == this.state.user_publicKey).length !=  0) {
                    new_data.signed = true
                }
            }
            this.setState({
                transactions: new_data
            })
        });

    }

    async GetAccountDetails() {
        const server = new Server(this.state.server);
        await server.loadAccount(this.state.account_id)
        .then((account) => {
            this.setState({
                account_details: account,
                DataIsReturned: true
            },() => this.verifySigner())
        });

        fetch('/api/get-account' + '?account_id=' + this.state.account_id).then((response) => response.json()
        ).then((data) => {
            console.log(data.account_id)
            this.setState({
            account_name: data.name,
            DataIsReturned: true
        })})

    }

    handleApproveButtonPressed() {
        
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
        if (this.state.verified && this.state.DataIsReturned) {
        return( <div>
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Account: {this.state.account_name}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        Balances
                    </Typography>
                </Grid>
                <Grid item container justifyContent="center">
                <Grid item xs={6} align="center">
                    <TableContainer component={Paper}>
                        <Table aria-label="balances-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Asset Type</TableCell>
                                    <TableCell align="right">Balance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.account_details.balances.map((b) => (
                                    <TableRow>
                                        <TableCell component="th" scope="asset">
                                            {b.asset_type}
                                        </TableCell>
                                        <TableCell align="right">
                                            {b.balance}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                </Grid>
                <Grid item xs={12} align = "center">
                    <Typography component="h6" variant="h6">
                        Request a Payment
                    </Typography>
                </Grid>
                <Grid item xs={12} align = "center">
                    <Typography component='subtitle1' variant='subtitle1'>
                        Your signature weight: {this.state.user_weight}
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
                    id="select-AssetType"
                    label="Asset Type"
                    style={{ position: 'relative', top:'12px'}}
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
                            {this.state.transactions.filter(t => !t.completed).map((t) => (
                                <Row key={t.requestee + t.created_at} row={t}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
                
            </Grid>
        </div>);
        } else return <p>Loading...</p>
    }
}