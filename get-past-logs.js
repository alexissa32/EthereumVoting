const fs = require('fs');
const Web3 = require("web3");


const INFURA_URL =
    "http://localhost:8545";

const web3 = new Web3(INFURA_URL);



async function create_couter() {
    // Address of Contract
    const address = "0x9ef8cbcc2a40403461bbf3028cce942c8c8f13b8"; // addresss of the factory
    const abi = JSON.parse(fs.readFileSync('./_CouterCombine_sol_CounterFactory.abi'));
    const contract = new web3.eth.Contract(abi, address);


    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[0];   // initial owner of the Poll, who deployed it

    try {
        await contract.methods.createCounter().send(
            {
                // gas: 100000000000000,
                from: myWalletAddress,
            }
        )
    } catch (error) {
        console.log(error);
    }


    console.log("counter successfullly made!")
}

create_couter();



async function increament() {
    // Address of Contract
    const address = "0x9ef8cbcc2a40403461bbf3028cce942c8c8f13b8"; // addresss of the factory
    const abi = JSON.parse(fs.readFileSync('./_Poll_sol_Poll.abi'));
    const contract = new web3.eth.Contract(abi, address);


    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[0];   // initial owner of the Poll, who deployed it

    try {
        await contract.methods.increament().send(
            {
                // gas: 100000000000000,
                from: myWalletAddress,
            }
        )
    } catch (error) {
        console.log(error);
    }


    console.log("increament successfullly made!")
}

// increament();


async function transfer_ownaship() {
    // Address of Contract
    const address = "0xfd626Cf6Bef80B916a07885F70340cBCa0Bb4B68"; // addresss of the Poll
    const abi = JSON.parse(fs.readFileSync('./_Poll_sol_Poll.abi'));
    const contract = new web3.eth.Contract(abi, address);


    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[0];   // initial owner of the Poll, who deployed it

    try {
        await contract.methods.transferOwnership("0x0E4FE72Fd63c4d1DFBfBE4a3a65eeF8E2EBAfC13").send(
            {
                // gas: 100000000000000,
                from: myWalletAddress,
            }
        )
    } catch (error) {
        console.log(error);
    }


    console.log("owner transfer successfullly made!")
}

// transfer_ownaship();

async function create_poll() {
    // Address of Contract
    const address = "0x0E4FE72Fd63c4d1DFBfBE4a3a65eeF8E2EBAfC13"; // addresss of the Registry
    const abi = JSON.parse(fs.readFileSync('./_Registry_sol_Registry.abi'));
    const contract = new web3.eth.Contract(abi, address);


    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[0]; // this address should be the real person, like the client?
    // suppose you want to call a function named myFunction of myContract
    try {
        await contract.methods.createPoll("0xfd626Cf6Bef80B916a07885F70340cBCa0Bb4B68").send(
            {
                // gas: 100000000000000,
                from: myWalletAddress,
            }
        )
    } catch (error) {
        console.log(error);
    }


    console.log("create poll event successfullly made!")
}
// create_poll();


async function add_voter() {
    // Address of Contract
    const address = "0x0E4FE72Fd63c4d1DFBfBE4a3a65eeF8E2EBAfC13"; // addresss of the Registry
    const abi = JSON.parse(fs.readFileSync('./_Registry_sol_Registry.abi'));
    const contract = new web3.eth.Contract(abi, address);


    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[0]; // this should be the chairman of that poll
    // suppose you want to call a function named myFunction of myContract
    try {
        await contract.methods.addNewVoter(ganacheAccounts[9], "0xfd626Cf6Bef80B916a07885F70340cBCa0Bb4B68").send(
            {
                // gas: 100000000000000,
                from: myWalletAddress,
            }
        )
    } catch (error) {
        console.log(error);
    }


    console.log("add_voter successfullly made!")
}
// add_voter();


async function vote() {
    // Address of Contract
    const address = "0x0E4FE72Fd63c4d1DFBfBE4a3a65eeF8E2EBAfC13"; // addresss of the Registry
    const abi = JSON.parse(fs.readFileSync('./_Registry_sol_Registry.abi'));
    const contract = new web3.eth.Contract(abi, address);


    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[9]; // this should be valid voter for that poll

    // first the voter will add vote option to that poll
    const p_address = "0xfd626Cf6Bef80B916a07885F70340cBCa0Bb4B68"; // addresss of the poll
    const p_abi = JSON.parse(fs.readFileSync('./_Poll_sol_Poll.abi'));
    const p_contract = new web3.eth.Contract(p_abi, p_address);

    try {
        await p_contract.methods.addNewOption("Yue[0] creates the poll.").send(
            {
                // gas: 100000000000000,
                from: myWalletAddress,   // one valid voter who can add option
            }
        )
    } catch (error) {
        console.log(error);
    }

    console.log("Vote option successfully created!")
    // then this voter will vote it and at the same time the Registry should log it
    try {
        await contract.methods.vote("0xfd626Cf6Bef80B916a07885F70340cBCa0Bb4B68", 0).send(
            {
                // gas: 100000000000000,
                from: myWalletAddress,  // one, or another one valid voter who can add option
            }
        )
    } catch (error) {
        console.log(error);
    }


    console.log("a voter successfullly voted!")
}
// vote();






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