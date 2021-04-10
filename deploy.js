const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

// var Registry = artifacts.require("./Registry.sol");
const bytecode = fs.readFileSync('./_Combine_sol_Registry.bin',);
const abi = JSON.parse(fs.readFileSync('./_Combine_sol_Registry.abi'));
// const res_contract = new web3.eth.Contract(res_abi, "0x6407EB6C89B912196F7003F613997860E32f8836");

// const bytecode = fs.readFileSync('./_ballot_sol_Poll.bin',);
// const abi = JSON.parse(fs.readFileSync('./_ballot_sol_Poll.abi'));

(async function () {
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[0];

    const myContract = new web3.eth.Contract(abi);

    await myContract.deploy({
        data: bytecode.toString(),
        // arguments: ["is Registry the owner?", "0xaE848774D572d5d823e86268b5d5Bd3361A3cA1F", "0x6407eb6c89b912196f7003f613997860e32f8836"]  //deployer.deploy(Registry)
    }).send({
        from: myWalletAddress,
        gas: 5000000
    }).then((deployment) => {
        console.log('Resitry app was successfully deployed!');
        console.log('Resitry app can be interfaced with at this address:');
        // console.log('Poll app was successfully deployed!');
        // console.log('Poll app can be interfaced with at this address:');
        console.log(deployment.options.address);
    }).catch((err) => {
        console.error(err);
    });
})();