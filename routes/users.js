var express = require('express');
var router = express.Router();
var path = require('path');
var Web3 = require('web3');
var web3 = new Web3("https://ropsten.infura.io/v3/5af13ab72a694c969925427f54a7598b");
// var web3 = new Web3("http://localhost:30303");

const sampleContract = require('fs').readFileSync(path.resolve('./contracts/Bank.sol'));
const contractABI = require('../contracts/ABI');
const contractAddress = '0x34289e9cCCfe6C70b305611F788109Eec3E63e25';
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/createWallet', (req, res) => {
			let address = web3.eth.accounts.create(web3.utils.randomHex(32));
			res.status(200).send(address);
});

router.post('/loginWallet', (req, res) => {
  console.log(req.body);
			let address = web3.eth.accounts.privateKeyToAccount(req.body.privateKey);
			res.status(200).send(address);
});

router.get('/getBalance', (req, res) => {
    console.log(req.query);
    web3.eth.getBalance(req.query.address)
  .then(balance => {
    	res.status(200).send({balance: web3.utils.fromWei(balance, 'ether')})
  })
})

router.post('/sendEther', (req, res) => {
  var txData = {
      "to": req.body.toAddress,
      "value": web3.utils.toWei(req.body.amount, 'ether'),
      "gas": 100000
  }

  web3.eth.accounts.signTransaction(txData, req.body.privateKey).then(result => {
      console.log("signed: ", result)
      web3.eth.sendSignedTransaction(result.rawTransaction)
      .on('receipt',  (receipt) => {console.log("receipt send ether:", receipt); res.status(200).send({
        receipt: receipt.transactionHash
      })})
      .on('error',  (error) => {console.log("error send ether:", error); })
  })

})

router.post('/depositEther', (req, res) => {
  var txData = {
      "to": contractAddress,
      "value": web3.utils.toWei(req.body.amount, 'ether'),
      "data": contractInstance.methods.deposit(web3.utils.toWei(req.body.amount, 'ether')).encodeABI(),
      "gas": 100000
  }

  web3.eth.accounts.signTransaction(txData, req.body.privateKey).then(result => {
      console.log("signed: ", result)
      web3.eth.sendSignedTransaction(result.rawTransaction)
      .on('receipt',  (receipt) => {console.log("receipt deposit ether:", receipt); res.status(200).send({
        receipt: receipt.transactionHash
      })})
      .on('error',  (error) => {console.log("error deposit ether:", error); })
  })

})

router.post('/withdrawEther', (req, res) => {
  var txData = {
      "to": contractAddress,
      "data": contractInstance.methods.withdraw(web3.utils.toWei(req.body.amount, 'ether')).encodeABI(),
      "gas": 100000
  }

  web3.eth.accounts.signTransaction(txData, req.body.privateKey).then(result => {
      console.log("signed: ", result)
      web3.eth.sendSignedTransaction(result.rawTransaction)
      .on('receipt',  (receipt) => {console.log("receipt withdraw ether:", receipt); res.status(200).send({
        receipt: receipt.transactionHash
      })})
      .on('error',  (error) => {console.log("error withdraw ether:", error); })
  })

})

router.post('/compileContract', (req, res) => {
  solc.compile(projectData.contractCode).contracts[':MySampleContract'];
})

router.get('/getBankBalance', (req, res) => {
  console.log(req.query);
  contractInstance.methods.getBalance().call({
    from: req.query.address
  }).then(balance => {
    res.status(200).send({balance: web3.utils.fromWei(balance, 'ether')})
  })
})


module.exports = router;
