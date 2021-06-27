import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import {Card} from "@material-ui/core";
import {Box} from '@material-ui/core';

function App() {

  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [balance, setBalance] = useState('');
  const [bankBalance, setBankBalance] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [depositMessage, setDepositMessage] = useState('');
  const [withdrawMessage, setWithdrawMessage] = useState('');
  
  const login = () => {
    axios.post('http://localhost:8080/users/loginWallet', {privateKey: privateKey}).then(res => {
      console.log(res);
      setAddress(res.data.address);
      setPrivateKey(res.data.privateKey)
    })
  }

  const createNewWallet = () => {
    axios.get('http://localhost:8080/users/createWallet').then(res => {
      console.log(res);
      setAddress(res.data.address);
      setPrivateKey(res.data.privateKey)
    })
  }

  const checkBalance = () => {
    axios.get('http://localhost:8080/users/getBalance?address='+address).then(res => {
      console.log(res);
      setBalance(res.data.balance)
    })
  }

  const checkBankBalance = () => {
    axios.get('http://localhost:8080/users/getBankBalance?address='+address).then(res => {
      console.log(res);
      setBankBalance(res.data.balance)
    })
  }

  const transfer = () => {
    axios.post('http://localhost:8080/users/sendEther', {privateKey: privateKey, amount: amount, toAddress: toAddress}).then(res => {
      setMessage(res.data.receipt)
    })
  }
  const deposit = () => {
    axios.post('http://localhost:8080/users/depositEther', {privateKey: privateKey, amount: amount}).then(res => {
      setDepositMessage(res.data.receipt)
    })
  }

  const withdraw = () => {
    axios.post('http://localhost:8080/users/withdrawEther', {privateKey: privateKey, amount: amount}).then(res => {
      setWithdrawMessage(res.data.receipt)
    })
  }
  return (
    <Container>
    <br/>
        <Grid container spacing={3} direction="row">
        <Grid item spacing={3} xs={6}>
          <Grid item spacing={3} xs={12}>
            <Paper>
              <Box p={1}>
                <div style={{textAlign: "center"}}><h3>Demo Wallet</h3></div>
                <Button color="primary" variant="contained" onClick={createNewWallet}>Create new account </Button><br/><br/>
                {"Address: "+ address}<br/><br/>
                {"Private Key: "+privateKey}<br/><br/>
                {address && <Button color="primary" variant="contained" onClick={checkBalance}>Check Balance</Button>}<br/><br/>
                {balance && <>{'Your wallet balance is: '}<b>{balance}{' Ethers'}</b></>}<br/>
              </Box>
            </Paper>
            </Grid>
          <br/><br/>
          <Grid item xs={12}>
              <Paper>
                <Box p={1}>
                  {'Transfer'}<br/><br/>
                  <TextField
                          required
                          id="outlined-required"
                          label="To Address"
                          placeholder="0xABC..."
                          onChange={(e) => setToAddress(e.target.value)}
                          variant="outlined"
                  /><br/><br/>
                  <TextField
                          required
                          id="outlined-required"
                          label="Amount"
                          placeholder="0"
                          onChange={(e) => setAmount(e.target.value)}
                          variant="outlined"
                  /><br/><br/>
                  <Button color="primary" variant="contained" onClick={transfer}>Transfer </Button><br/><br/>
                  {message && <>Transfer done. Receipt is:{message}</>}
                </Box>
              </Paper>
            </Grid>
          <br/><br/>
          <Grid item xs={12}>
            <Paper>
              <Box p={1}>
                {'Login using Private Key:'}<br/><br/>
                <TextField
                        required
                        id="outlined-required"
                        label="PrivateKey"
                        placeholder="0xABC..."
                        onChange={(e) => setPrivateKey(e.target.value)}
                        variant="outlined"
                /><br/><br/>
                <Button color="primary" variant="contained" onClick={login}>Login </Button><br/>
              </Box>
             </Paper>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12}>

              <Paper>
                <Box p={1}>
                  <div style={{textAlign: "center"}}><h3>Demo Bank</h3></div>
                  <br/><br/>
                  {"Address: " + address}<br/><br/>
                  {"Private Key: " + privateKey}<br/><br/>
                  {address && <Button color="primary" variant="contained" onClick={checkBankBalance}>Check Bank Balance</Button>}<br/><br/>
  
                  {bankBalance && <>{'Your Bank Balance is: '}<b>{bankBalance?bankBalance: '0'}{' Ethers'}</b></>}<br/>
                </Box>
              </Paper>
          </Grid>
          <br/><br/>
          <Grid item xs={12}>
              <Paper>
	              <Box p={1}>
                    {'Deposit in Bank'}<br/><br/>
                    <TextField
                            required
                            id="outlined-required"
                            label="Amount"
                            placeholder="0"
                            onChange={(e) => setAmount(e.target.value)}
                            variant="outlined"
                    /><br/><br/>
                    <Button color="primary" variant="contained" onClick={deposit}>Deposit </Button><br/><br/>
                    {depositMessage && <>Deposit done. Receipt is: {depositMessage}</>}
                  </Box>
              </Paper>
	          <br/><br/>
              <Paper>
                <Box p={1}>
                  {'Withdraw from Bank'}<br/><br/>
                  <TextField
                          required
                          id="outlined-required"
                          label="Amount"
                          placeholder="0"
                          onChange={(e) => setAmount(e.target.value)}
                          variant="outlined"
                  /><br/><br/>
                  <Button color="primary" variant="contained" onClick={withdraw}>Withdraw </Button><br/><br/>
                  {withdrawMessage && <>Withdrawal done. Receipt is: {withdrawMessage}</>}
                </Box>
              </Paper>
            </Grid>
        </Grid>
        
        
        </Grid>
        
    </Container>
  );
}

export default App;
