
const Web3 = require("web3");
// Dai Stablecoin ABI
const abi = [{ "inputs": [{ "internalType": "string", "name": "proposal", "type": "string" }, { "internalType": "address", "name": "chair", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "string", "name": "action", "type": "string" }], "name": "PollVoted", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "newOption", "type": "string" }], "name": "addNewOption", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "toAdd", "type": "address" }], "name": "addNewVoter", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getOptions", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getQuestion", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getTotalVoted", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalVoters", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "voteChoice", "type": "string" }], "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "winningProposal", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }];
const INFURA_URL =
    "http://localhost:8545";

const web3 = new Web3(INFURA_URL);

// Address of Contract
const address = "0xC8144877c3De09f7b7F2073d69CB39D2efec538c";

const contract = new web3.eth.Contract(abi, address);




async function make_transaction() {

    // my wallet info
    const ganacheAccounts = await web3.eth.getAccounts();
    const myWalletAddress = ganacheAccounts[1];
    // suppose you want to call a function named myFunction of myContract
    await contract.methods.getQuestion().send(
        {

            from: myWalletAddress,
        }
    )

    console.log("transaction successfullly made!")
}
// make_transaction();





async function main() {
    // web3.eth_sendTransaction()
    const latest = await web3.eth.getBlockNumber();

    console.log("Latest block:", latest);



    const logs = await contract.getPastEvents("PollVoted", {
        fromBlock: latest - 100,
        toBlock: latest,
        // filter by sender
        // filter: { src: "0x526af336D614adE5cc252A407062B8861aF998F5" }

        //filter by receiver
        filter: { address: "0xC8144877c3De09f7b7F2073d69CB39D2efec538c" }
    });

    console.log("Logs", logs, `${logs.length} logs`);

    // Print senders
    // console.log(
    //   "Senders",
    //   logs.map(log => log.returnValues.src),
    //   `${logs.length} logs`
    // );

    // Print receiver
    //   console.log(
    //     "Senders",
    //     logs.map(log => log.returnValues.dst),
    //     `${logs.length} logs`
    //   );
}

main();