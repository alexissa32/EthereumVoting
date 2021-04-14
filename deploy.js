const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');



// const bytecode = fs.readFileSync('./_Registry_sol_Registry.bin',);
// const abi = JSON.parse(fs.readFileSync('./_Registry_sol_Registry.abi'));


// const bytecode = fs.readFileSync('./_Poll_sol_Poll.bin',);
// const abi = JSON.parse(fs.readFileSync('./_Poll_sol_Poll.abi'));

const bytecode = fs.readFileSync('./_CouterCombine_sol_CounterFactory.bin',);
const abi = JSON.parse(fs.readFileSync('./_CouterCombine_sol_CounterFactory.abi'));


(async function () {
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[0];

    const myContract = new web3.eth.Contract(abi);

    await myContract.deploy({
        data: bytecode.toString(),
        // arguments: ["Yue created a poll?", myWalletAddress]  //deployer.deploy(Registry)
    }).send({
        from: myWalletAddress,
        gas: 5000000
    }).then((deployment) => {
        // console.log('Registry app was successfully deployed!');
        // console.log('Registry app can be interfaced with at this address:');
        console.log('app was successfully deployed!');
        console.log('app can be interfaced with at this address:');
        console.log(deployment.options.address);
    }).catch((err) => {
        console.error(err);
    });
})();