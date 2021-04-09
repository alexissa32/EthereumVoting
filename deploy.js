const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
const bytecode = fs.readFileSync('./build/ballot_sol_Poll.bin',);
const abi = JSON.parse(fs.readFileSync('./build/ballot_sol_Poll.abi'));

(async function () {
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[0];

    const myContract = new web3.eth.Contract(abi);

    myContract.deploy({
        data: bytecode.toString(),
        arguments: ["is event working?", "0xaE848774D572d5d823e86268b5d5Bd3361A3cA1F"]
    }).send({
        from: myWalletAddress,
        gas: 5000000
    }).then((deployment) => {
        console.log('Voting app was successfully deployed!');
        console.log('Voting app can be interfaced with at this address:');
        console.log(deployment.options.address);
    }).catch((err) => {
        console.error(err);
    });
})();