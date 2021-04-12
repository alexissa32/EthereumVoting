//imports
const fs = require('fs');
const Web3 = require("web3");

//connect to ethereum node
const INFURA_URL = "http://localhost:8545";
const web3 = new Web3(INFURA_URL);

//Useful User Registry information
const address = "0x70f3A39C29ACAc78882beB585e969ae609D35F91"; // addresss of the Registry
const abi = JSON.parse(fs.readFileSync('./_user_registry.abi'));
const registry_contract = new web3.eth.Contract(abi, address);

//Useful global Poll stuff
const pollAbi = JSON.parse(fs.readFileSync('./_poll2.abi'));
const pollBytecode = fs.readFileSync('./_poll2.bin');

//TO DELETE
var myWalletAddress1 = "0xD5d006B8A3Da2A33d94F789d4b7E142D30913c10";
var myWalletAddress2 = "0x0b201DE91268800B113e7EC2Bec5fea4b45b752a";
var myWalletAddress3 = "0x158F92B1E77e0Eff1261c1cF93CCDf64Bd5861A3";
var testPoll = "0xc9af8e08Af45573711023b018B4A08af88c8Ae48";

//---------------------------Create a Poll-----------------------------------
async function createPoll(myWalletAddress, pollQuestion) {
    // my wallet info
    //const ganacheAccounts = await web3.eth.getAccounts();
    //const myWalletAddress = ganacheAccounts[1]; // this address should be the real person, like the client?
    // suppose you want to call a function named myFunction of myContract
    
    const myContract = new web3.eth.Contract(pollAbi);

    var deployedPollAddress = await myContract.deploy({
        data: pollBytecode.toString(),
        arguments: [pollQuestion]
    }).send({
        from: myWalletAddress,
        gas: 5000000
    }).then((deployment) => {
        console.log('Poll was successfully deployed!');
        console.log('Poll can be interfaced with at this address:');
        console.log(deployment.options.address);
        return deployment.options.address;
    }).catch((err) => {
        //console.error(err);
        return err;
    });

    var result = await registry_contract.methods.addUserAsChairperson(deployedPollAddress).send( {
        // gas: 100000000000000,
        from: myWalletAddress,
    }).then((res) => {
        return res;
    }).catch((err) => {
        //console.error(err);
        return err;
    });

    console.log("Poll successfully made and chaipreson is registered");

    return [deployedPollAddress, result];
}
//var ret = createPoll(myWalletAddress1, "Does this work?");
//setTimeout(() => { console.log(ret); }, 1000);

//---------------------------Interact with User Registry---------------------
async function getUser2Voter(myWalletAddress) {
    var addresses = await registry_contract.methods.getUser2Poll().call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(addresses)
    return addresses;
}
// var ret = getUser2Voter(myWalletAddress3);
// setTimeout(() => { console.log(ret); }, 1000); //should work

async function getUser2Chairperson(myWalletAddress) {
    // my wallet info
    //const ganacheAccounts = await web3.eth.getAccounts();
    //const myWalletAddress = ganacheAccounts[1]; // this should be the chairman of that poll
    // suppose you want to call a function named myFunction of myContract

    var addresses = await registry_contract.methods.getUser2Chairperson().call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(addresses)
    return addresses;
}
// var ret = getUser2Chairperson(myWalletAddress1);
// setTimeout(() => { console.log(ret); }, 1000); //should work

//--------------------------Interact with a Poll----------------------------
async function isVoter(myWalletAddress, pollAddress, checkAddress) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var result = await p_contract.methods.isVoter(checkAddress).call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,   // one valid voter who can add option
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(result)
    return result;
}
// var ret = isVoter(myWalletAddress1, testPoll, myWalletAddress3);
// setTimeout(() => { console.log(ret); }, 1000); //should work

async function isChairperson(myWalletAddress, pollAddress, checkAddress) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var result = await p_contract.methods.isChairperson(checkAddress).call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,   // one valid voter who can add option
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(result)
    return result;
}
// var ret = isChairperson(myWalletAddress1, testPoll, myWalletAddress1);
// setTimeout(() => { console.log(ret); }, 1000); //should work

async function getQuestion(myWalletAddress, pollAddress) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var question = await p_contract.methods.getQuestion().call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,
        }
    ).catch((err) => {
        //console.error(err);
        return err;
    });
    //console.log(question)
    return question;
}
// var ret = getQuestion(myWalletAddress1, testPoll);
// setTimeout(() => { console.log(ret); }, 1000); //should work

async function getOptions(myWalletAddress, pollAddress) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var options = await p_contract.methods.getOptions().call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(options)
    return options;
}
// var ret = getOptions(myWalletAddress1, testPoll);
// setTimeout(() => { console.log(ret); }, 1000); //should work

async function getTotalVoters(myWalletAddress, pollAddress) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var voters = await p_contract.methods.getTotalVoters().call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(voters)
    return voters;
}
// var ret = getTotalVoters(myWalletAddress1, testPoll);
// setTimeout(() => { console.log(ret); }, 1000); //should work

async function getTotalVoted(myWalletAddress, pollAddress) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var voted = await p_contract.methods.getTotalVoted().call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(voted)
    return voted;
}
// var ret = getTotalVoted(myWalletAddress1, testPoll);
// setTimeout(() => { console.log(ret); }, 1000); //should work

async function addNewOption(myWalletAddress, pollAddress, voteOption) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var result = await p_contract.methods.addNewOption(voteOption).send(
        {
            // gas: 100000000000000,
            from: myWalletAddress,   // one valid voter who can add option
        }
    ).then((res) => {
        return res;
    }).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(result)
    return result;
}
// var ret1 = addNewOption(myWalletAddress1, testPoll, "Yes");
// setTimeout(() => { console.log(ret1); }, 5000); //should work
// var ret2 = addNewOption(myWalletAddress2, testPoll, "No");
// setTimeout(() => { console.log(ret2); }, 5000); //should work
// var ret3 = addNewOption(myWalletAddress3, testPoll, "Maybe");
// setTimeout(() => { console.log(ret3); }, 5000); //should work
// var ret4 = addNewOption(myWalletAddress1, testPoll, "Maybe");
// setTimeout(() => { console.log(ret4); }, 5000); //should NOT work
// var ret4 = addNewOption("0x1885dC6f4d9Ba1Be44a847B4EC06eAe52D4d8a56", testPoll, "Option 4");
// setTimeout(() => { console.log(ret4); }, 5000); //should NOT work

async function addNewVoter(chairpersonWalletAddress, pollAddress, newVoterAddress) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var keepGoing = true;

    var pollResult = await p_contract.methods.addNewVoter(newVoterAddress).send(
        {
            // gas: 100000000000000,
            from: chairpersonWalletAddress,   // one valid voter who can add option
        }
    ).then((res) => {
        return res;
    }).catch((err) => {
        //console.error(err);
        keepGoing = false;
        return err;
    });
    //console.log(pollResult);

    if(!keepGoing) {
        return pollResult;
    }

    var registryResult = await registry_contract.methods.addUserAsVoter(pollAddress, newVoterAddress).send( {
        // gas: 100000000000000,
        from: chairpersonWalletAddress,
    }).then((res) => {
        return res;
    }).catch((err) => {
        //console.error(err);
        return err;
    });
    //console.log(registryResult)

    return [pollResult, registryResult];
}
// var ret1 = addNewVoter(myWalletAddress1, testPoll, myWalletAddress2);
// setTimeout(() => { console.log(ret1); }, 5000); //should work
// var ret2 = addNewVoter(myWalletAddress2, testPoll, myWalletAddress3);
// setTimeout(() => { console.log(ret2); }, 5000); //error not chairperson
// var ret3 = addNewVoter(myWalletAddress1, testPoll, myWalletAddress2);
// setTimeout(() => { console.log(ret3); }, 5000); //error already added
// var ret4 = addNewVoter(myWalletAddress1, testPoll, myWalletAddress3);
// setTimeout(() => { console.log(ret4); }, 5000); //should work

// var ret1 = addNewVoter(myWalletAddress1, testPoll, "0x7A3Ff6d6Ee04579c3A3d49096Cd30708Ed0B181b");
// setTimeout(() => { console.log(ret1); }, 5000); //should work
// var ret2 = addNewVoter(myWalletAddress1, testPoll, "0x7A3Ff6d6Ee04579c3A3d49096Cd30708Ed0B181b");
// setTimeout(() => { console.log(ret2); }, 5000); //error not chairperson

async function vote(myWalletAddress, pollAddress, voteOption) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var result = await p_contract.methods.vote(voteOption).send(
        {
            gas: 1000000,
            from: myWalletAddress, 
        }
    ).then((res) => {
        return res;
    }).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(result)
    return result;
}
// var ret1 = vote(myWalletAddress1, testPoll, "Maybe");
// setTimeout(() => { console.log(ret1); }, 5000); //should work
// var ret2 = vote(myWalletAddress2, testPoll, "No");
// setTimeout(() => { console.log(ret2); }, 5000); //should work
// var ret3 = vote(myWalletAddress3, testPoll, "Yes");
// setTimeout(() => { console.log(ret3); }, 5000); //should work
// var ret4 = vote(myWalletAddress1, testPoll, "Maybe");
// setTimeout(() => { console.log(ret4); }, 5000); //should NOT work
// var ret5 = vote("0x1885dC6f4d9Ba1Be44a847B4EC06eAe52D4d8a56", testPoll, "Option 4");
// setTimeout(() => { console.log(ret5); }, 5000); //should NOT work

async function winningProposal(myWalletAddress, pollAddress) {
    const p_contract = new web3.eth.Contract(pollAbi, pollAddress);

    var result = await p_contract.methods.winningProposal().call(
        {
            // gas: 100000000000000,
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    console.log(result)
    return result;
}
// var ret = winningProposal(myWalletAddress1, testPoll);
// setTimeout(() => { console.log(ret); }, 1000); //should work