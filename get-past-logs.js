const fs = require('fs');
const Web3 = require("web3");
// Dai Stablecoin ABI
const abi = JSON.parse(fs.readFileSync('./_user_registry.abi'));
const INFURA_URL =
    "http://localhost:8545";

const web3 = new Web3(INFURA_URL);

// Address of Contract
const address = "0x25446F25dD6287E23F7B34a18d2fC8C6f84Cca05";
const registry_contract = new web3.eth.Contract(abi, address);

async function make_transaction() {

    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[0];
    // suppose you want to call a function named myFunction of myContract
    contract.methods.createPoll("Is poll contract created?").send(
        {

            from: myWalletAddress,
        }
    )
    .on('transactionHash', function(hash){
        console.log("1")
    })
    .on('receipt', function(receipt){
        console.log("2")
    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log("3")
    })
    .on('error', function(error, receipt) {
        console.log("4")
    });  
}
make_transaction();

async function make_transaction_registry() {

    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[2];
    // suppose you want to call a function named myFunction of myContract
    await contract.methods.createNewRecord("0xdF0cc4221d7B2f716cc55e511A388BC74855A599", 2).send(
        {

            from: myWalletAddress,
        }
    )

    console.log("registry transaction successfullly made!")
}
// make_transaction_registry();





async function main() {
    // web3.eth_sendTransaction()
    const latest = await web3.eth.getBlockNumber();

    console.log("Latest block:", latest);



    const logs = await contract.getPastEvents("Record", {
        fromBlock: latest - 100,
        toBlock: latest,
        // filter by sender
        // filter: { sender: "0xF4F0F367Fe3B142fc9E643F3E328377f8F0a8301" }
        filter: {
            role: 2,
            sender: "0xA5848ec73478813B2AB65e927D55aA30B3EAf25A"
        }

        //filter by receiver
        // filter: { address: "0x56D3CF60317B5ad5d868323350b5DfaE20f90661" }
    });

    console.log("Logs", logs, `${logs.length} logs`);

    // Print senders
    console.log(
        "Polls",
        logs.map(log => log.returnValues.poll),
        `${logs.length} logs`
    );

}

// main();