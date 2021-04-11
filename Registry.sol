// SPDX-License-Identifier: GPL-3.0

import "./Poll.sol";
pragma solidity ^0.8.0;

/**
 * @title Registry
 * @dev Implements the ability to have anonymous voting for people in a meeting
 */
contract Registry { 
    event Create(address indexed chairman, address indexed poll);
    event AddVoter(address indexed personAdded, address indexed poll);
    event Vote(address indexed voter, address indexed poll);
    
    function createPoll(string memory proposal) public {
        Poll poll = new Poll(proposal, msg.sender); //assume this deploys a poll and returns addresss of poll
        emit Create(msg.sender, address(poll)); //we know this is with role 1
    }
    
    function addNewVoter(Poll poll, address toAdd) public { //this has to be triggered by chairman
        poll.addNewVoter(toAdd, msg.sender);
        emit AddVoter(toAdd, address(poll)); //We know this is with role 0
    }
    
    function vote(Poll poll, string memory voteChoice) public {
        poll.vote(voteChoice, msg.sender);
        emit Vote(msg.sender, address(poll));
    }
}
