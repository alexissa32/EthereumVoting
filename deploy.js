const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
const bytecode = fs.readFileSync('./_user_registry.bin');
const abi = JSON.parse(fs.readFileSync('./_user_registry.abi'));

(async function () {
  const ganacheAccounts = await web3.eth.getAccounts();
  const myWalletAddress = ganacheAccounts[0];

  const myContract = new web3.eth.Contract(abi);

  myContract.deploy({
    data: bytecode.toString(),
    //arguments: ["Omg is this working?","0xC7854Ff4CB030f6B0aC373abFF8937EeD08b83bC"]
  }).send({
    from: myWalletAddress,
    gas: 5000000
  }).then((deployment) => {
    console.log('FirstContract was successfully deployed!');
    console.log('FirstContract can be interfaced with at this address:');
    console.log(deployment.options.address);
  }).catch((err) => {
    console.error(err);
  });
})();