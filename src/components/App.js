import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Navbar from './Navbar';
import Main from './Main';
import registry_abi from './../abis/_user_registry.abi'
import poll_abi from './../abis/_poll2.abi'
import poll_bin from './../abis/_poll2.bin'

class App extends Component {

  async componentWillMount() {
    //Useful User Registry information
    const address = "0x3Dca1fD11082861BB5897f626746ED76DA537A11"; // addresss of the Registry
    const response = await fetch(registry_abi);
    const abi = await response.json();

    await this.loadWeb3()
    await this.loadBlockchainData(address, abi)
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData(address, abi) {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    //Connect
    const registry = await web3.eth.Contract(abi, address)
    this.setState({ registry })

    // Load polls as voter
    this.getUser2Voter(this.state.address)
    // const voterArray = await this.getUser2Voter(this.state.account)
    // if(voterArray != null) {
    //   for (var i = 0; i < voterArray.length; i++) {
    //     const pollAddress = voterArray[i]
    //     await this.setState({
    //       pollsAsVoter: [...this.state.pollsAsVoter, { 
    //         "question":this.getQuestion(this.state.account, pollAddress), 
    //         "options":this.getOptions(this.state.account, pollAddress),
    //         "voters":this.getTotalVoters(this.state.account, pollAddress),
    //         "voted":this.getTotalVoted(this.state.account, pollAddress) }]
    //     })
    //   }
    // }

    // Load polls as chairperson
    this.getUser2Chairperson(this.state.address)
    // const chairArray = await this.getUser2Chairperson(this.state.account)
    // if(chairArray != null) {
    //   for (var j = 0; j < chairArray.length; j++) {
    //     const pollAddress = chairArray[j]
    //     await this.setState({
    //       pollsAsChair: [...this.state.pollsAsChair, { 
    //         "question":this.getQuestion(this.state.account, pollAddress), 
    //         "options":this.getOptions(this.state.account, pollAddress),
    //         "voters":this.getTotalVoters(this.state.account, pollAddress),
    //         "voted":this.getTotalVoted(this.state.account, pollAddress) }]
    //     })
    //   }
    // }

    this.setState({ loading: false })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      pollsAsVoter: [],
      pollsAsChair: [],
      loading: true
    }

    this.createPoll = this.createPoll.bind(this)
    this.votePoll = this.votePoll.bind(this)
  }

  async createPoll(myWalletAddress, pollQuestion) {
    this.setState({ loading: true })
    const response = await fetch(poll_abi);
    const pollAbi = await response.json();
    const myContract = await window.web3.eth.Contract(pollAbi);

    const response2 = await fetch(poll_bin);
    const pollBytecode = await response2.text();
    var deployedPollAddress = await myContract.deploy({
        data: '0x'+pollBytecode,
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
        console.error(err);
        return err;
    });

    var result = await this.state.registry.methods.addUserAsChairperson(deployedPollAddress).send( {
        from: myWalletAddress,
    }).then((res) => {
        return res;
    }).catch((err) => {
        console.error(err);
        return err;
    });

    console.log("Poll successfully made and chaipreson is registered");
    console.log(deployedPollAddress)
    console.log(result)

    this.setState({ loading: false })

    return [deployedPollAddress, result];
  }

  async getUser2Voter(myWalletAddress) {
    var addresses = await this.state.registry.methods.getUser2Poll().call(
        {
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });

    //const voterArray = await this.getUser2Voter(this.state.account)
    if(addresses != null) {
      for (var i = 0; i < addresses.length; i++) {
        const pollAddress = addresses[i]
        await this.setState({
          pollsAsVoter: [...this.state.pollsAsVoter, { 
            "question":this.getQuestion(this.state.account, pollAddress), 
            "options":this.getOptions(this.state.account, pollAddress),
            "voters":this.getTotalVoters(this.state.account, pollAddress),
            "voted":this.getTotalVoted(this.state.account, pollAddress) }]
        })
      }
    }

    return addresses;
  }

  async getUser2Chairperson(myWalletAddress) {
    var addresses = await this.state.registry.methods.getUser2Chairperson().call(
        {
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });

    //const chairArray = await this.getUser2Chairperson(this.state.account)
    if(addresses != null) {
      for (var j = 0; j < addresses.length; j++) {
        const pollAddress = addresses[j]
        await this.setState({
          pollsAsChair: [...this.state.pollsAsChair, { 
            "question":this.getQuestion(this.state.account, pollAddress), 
            "options":this.getOptions(this.state.account, pollAddress),
            "voters":this.getTotalVoters(this.state.account, pollAddress),
            "voted":this.getTotalVoted(this.state.account, pollAddress) }]
        })
      }
    }
    return addresses;
  }

  async getQuestion(myWalletAddress, pollAddress) {
    const response = await fetch(poll_abi);
    const pollAbi = await response.json();
    const p_contract = await window.web3.eth.Contract(pollAbi, pollAddress);

    var question = await p_contract.methods.getQuestion().call(
        {
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    return question;
  }

  async getOptions(myWalletAddress, pollAddress) {
    const response = await fetch(poll_abi);
    const pollAbi = await response.json();
    const p_contract = await window.web3.eth.Contract(pollAbi, pollAddress);

    var options = await p_contract.methods.getOptions().call(
        {
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    return options;
  }

  async getTotalVoters(myWalletAddress, pollAddress) {
    const response = await fetch(poll_abi);
    const pollAbi = await response.json();
    const p_contract = await window.web3.eth.Contract(pollAbi, pollAddress);

    var voters = await p_contract.methods.getTotalVoters().call(
        {
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    return voters;
  }

  async getTotalVoted(myWalletAddress, pollAddress) {
    const response = await fetch(poll_abi);
    const pollAbi = await response.json();
    const p_contract = await window.web3.eth.Contract(pollAbi, pollAddress);

    var voted = await p_contract.methods.getTotalVoted().call(
        {
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    return voted;
  }

  async addNewOption(myWalletAddress, pollAddress, voteOption) {
    const response = await fetch(poll_abi);
    const pollAbi = await response.json();
    const p_contract = await window.web3.eth.Contract(pollAbi, pollAddress);

    var result = await p_contract.methods.addNewOption(voteOption).send(
        {
            from: myWalletAddress,
        }
    ).then((res) => {
        return res;
    }).catch((err) => {
        console.error(err);
        return err;
    });
    return result;
  }

  async addNewVoter(chairpersonWalletAddress, pollAddress, newVoterAddress) {
    const response = await fetch(poll_abi);
    const pollAbi = await response.json();
    const p_contract = await window.web3.eth.Contract(pollAbi, pollAddress);

    var keepGoing = true;

    var pollResult = await p_contract.methods.addNewVoter(newVoterAddress).send(
        {
            from: chairpersonWalletAddress,
        }
    ).then((res) => {
        return res;
    }).catch((err) => {
        console.error(err);
        keepGoing = false;
        return err;
    });

    if(!keepGoing) {
        return pollResult;
    }

    var registryResult = await this.state.registry.methods.addUserAsVoter(pollAddress, newVoterAddress).send( 
    {
        from: chairpersonWalletAddress,
    }).then((res) => {
        return res;
    }).catch((err) => {
        console.error(err);
        return err;
    });

    return [pollResult, registryResult];
  }

  async votePoll(myWalletAddress, pollAddress, voteOption) {
    this.setState({ loading: true })

    const response = await fetch(poll_abi);
    const pollAbi = await response.json();
    const p_contract = await window.web3.eth.Contract(pollAbi, pollAddress);

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

    this.setState({ loading: false })

    return result;
  }

  async winningProposal(myWalletAddress, pollAddress) {
    const response = await fetch(poll_abi);
    const pollAbi = await response.json();
    const p_contract = await window.web3.eth.Contract(pollAbi, pollAddress);

    var result = await p_contract.methods.winningProposal().call(
        {
            from: myWalletAddress,
        }
    ).catch((err) => {
        console.error(err);
        return err;
    });
    return result;
  }

  //TODO add code to refresh pollsAsChair state, did I double implement this?
  // createPoll(myWalletAddress, pollQuestion) { 
  //   this.setState({ loading: true })
  //   this.generatePoll(myWalletAddress, pollQuestion)
  //   .once('receipt', (receipt) => {
  //     this.setState({ loading: false })
  //   })
  // }

  //TODO add code to refresh pollsAsVoter state, did I double implement this?
  // votePoll(myWalletAddress, pollAddress, voteOption) {
  //   this.setState({ loading: true })
  //   this.vote(myWalletAddress, pollAddress, voteOption)
  //   .once('receipt', (receipt) => {
  //     this.setState({ loading: false })
  //   })
  // }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  account={this.state.account}
                  pollsAsVoter={this.state.pollsAsVoter}
                  pollsAsChair={this.state.pollsAsChair}
                  createPoll={this.createPoll}
                  votePoll={this.votePoll} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
