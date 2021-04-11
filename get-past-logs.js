const fs = require('fs');
const Web3 = require("web3");

const INFURA_URL =
    "http://localhost:8545";

const web3 = new Web3(INFURA_URL);

// Address of Registry
const address = "0xa9D3C0FDcAAb552838cAcBf1a64E8a69c24B72b2"; // addresss of the Registry
const abi = JSON.parse(fs.readFileSync('./_user_registry.abi'));
const registry_contract = new web3.eth.Contract(abi, address);

//Poll stuff
const pollAbi = JSON.parse(fs.readFileSync('./_poll2.abi'));
const pollBytecode = fs.readFileSync('./_poll2.bin');
const myContract = new web3.eth.Contract(pollAbi);


async function create_poll() {
    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[1]; // this address should be the real person, like the client?
    // suppose you want to call a function named myFunction of myContract
    
    var deployedPollAddress = await myContract.deploy({
        data: pollBytecode.toString(),
        arguments: ["Omg is this working?"]
    }).send({
        from: myWalletAddress,
        gas: 5000000
    }).then((deployment) => {
        console.log('Poll was successfully deployed!');
        console.log('Poll can be interfaced with at this address:');
        console.log(deployment.options.address);
        return deployment.options.address;
    }).catch((err) => {
        console.error(err);
    });

    //console.log(deployedPollAddress);

    try {
        await registry_contract.methods.addUserAsChairperson(deployedPollAddress).send( {
                // gas: 100000000000000,
                from: myWalletAddress,
            }
        )
    } catch (error) {
        console.log(error);
    }

    console.log("Poll successfully made and chaipreson is registered")
}
//create_poll();

async function get_user2chairperson() {
    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[1]; // this should be the chairman of that poll
    // suppose you want to call a function named myFunction of myContract

    var addresses = await registry_contract.methods.getUser2Chairperson().call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
    });

    console.log(addresses)
}
//get_user2chairperson();

async function addNewOption() {

    const p_contract = new web3.eth.Contract(pollAbi, "0x3FB04c1A26B334333006CcCf062b196a0Fa9d0De");

    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[1]; // this should be the chairman of that poll
    // suppose you want to call a function named myFunction of myContract

    // my wallet info
    await p_contract.methods.addNewOption("Yes this is working!").send(
        {
            // gas: 100000000000000,
            from: myWalletAddress,   // one valid voter who can add option
        }
    )
}
//addNewOption();

async function invalidVote() {

    const p_contract = new web3.eth.Contract(pollAbi, "0x3FB04c1A26B334333006CcCf062b196a0Fa9d0De");

    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[2]; // this should be the chairman of that poll
    // suppose you want to call a function named myFunction of myContract
    
    // then this voter will vote it and at the same time the Registry should log it
    var output = await p_contract.methods.vote("Yes this is working!", myWalletAddress).send(
        {
            // gas: 100000000000000,
            from: myWalletAddress,  // one, or another one valid voter who can add option
        }
    )

    console.log(output)
}
//invalidVote();

async function validVote() {

    const p_contract = new web3.eth.Contract(pollAbi, "0x3FB04c1A26B334333006CcCf062b196a0Fa9d0De");

    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[1]; // this should be the chairman of that poll
    // suppose you want to call a function named myFunction of myContract
    
    // then this voter will vote it and at the same time the Registry should log it
    var output = await p_contract.methods.vote("Yes this is working!", myWalletAddress).send(
        {
            gas: 1000000,
            from: myWalletAddress,  // one, or another one valid voter who can add option
        }
    )

    console.log(output)
}
//validVote();

//TODO: fix poll function to not pass addresses but instead use msg.sender.
//TODO: elegantly handle errors in these codes
//TODO: write all possible APIs for frontend

// async function add_voter() {
//     // Address of Contract
//     const address = "0x80285AC9a2dC128B12F0cE0e9396cb360eB95bb4"; // addresss of the Registry
//     const abi = JSON.parse(fs.readFileSync('./_Registry_sol_Registry.abi'));
//     const contract = new web3.eth.Contract(abi, address);


//     // my wallet info
//     const ganacheAccounts = await web3.eth.getAccounts();
//     const myWalletAddress = ganacheAccounts[0]; // this should be the chairman of that poll
//     // suppose you want to call a function named myFunction of myContract
//     try {
//         await contract.methods.addNewVoter(ganacheAccounts[9], "0x89063ae3e88783Fa2806a86e6181Fcc27F51f6be").send(
//             {
//                 // gas: 100000000000000,
//                 from: myWalletAddress,
//             }
//         )
//     } catch (error) {
//         console.log(error);
//     }


//     console.log("add_voter successfullly made!")
// }
// add_voter();

// async function vote() {
//     // Address of Contract
//     const address = "0x80285AC9a2dC128B12F0cE0e9396cb360eB95bb4"; // addresss of the Registry
//     const abi = JSON.parse(fs.readFileSync('./_Registry_sol_Registry.abi'));
//     const contract = new web3.eth.Contract(abi, address);


//     // my wallet info
//     const ganacheAccounts = await web3.eth.getAccounts();
//     const myWalletAddress = ganacheAccounts[9]; // this should be valid voter for that poll

//     // first the voter will add vote option to that poll
//     const p_address = "0x89063ae3e88783Fa2806a86e6181Fcc27F51f6be"; // addresss of the poll
//     const p_abi = JSON.parse(fs.readFileSync('./_Poll_sol_Poll.abi'));
//     const p_contract = new web3.eth.Contract(p_abi, p_address);

//     try {
//         await p_contract.methods.addNewOption("Yue[0] creates the poll.").send(
//             {
//                 // gas: 100000000000000,
//                 from: myWalletAddress,   // one valid voter who can add option
//             }
//         )
//     } catch (error) {
//         console.log(error);
//     }

//     console.log("Vote option successfully created!")
//     // then this voter will vote it and at the same time the Registry should log it
//     try {
//         await contract.methods.vote("0x89063ae3e88783Fa2806a86e6181Fcc27F51f6be", 0).send(
//             {
//                 // gas: 100000000000000,
//                 from: myWalletAddress,  // one, or another one valid voter who can add option
//             }
//         )
//     } catch (error) {
//         console.log(error);
//     }


//     console.log("a voter successfullly voted!")
// }
//vote();

// async function main() {
//     // web3.eth_sendTransaction()
//     const latest = await web3.eth.getBlockNumber();

//     console.log("Latest block:", latest);



//     const logs = await contract.getPastEvents("Record", {
//         fromBlock: latest - 100,
//         toBlock: latest,
//         // filter by sender
//         // filter: { sender: "0xF4F0F367Fe3B142fc9E643F3E328377f8F0a8301" }
//         filter: {
//             role: 2,
//             sender: "0xA5848ec73478813B2AB65e927D55aA30B3EAf25A"
//         }

//         //filter by receiver
//         // filter: { address: "0x56D3CF60317B5ad5d868323350b5DfaE20f90661" }
//     });

//     console.log("Logs", logs, `${logs.length} logs`);

//     // Print senders
//     console.log(
//         "Polls",
//         logs.map(log => log.returnValues.poll),
//         `${logs.length} logs`
//     );

// }
// main();