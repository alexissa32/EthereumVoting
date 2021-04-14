// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Poll.sol";

/**
 * @title Registry
 * @dev Implements the ability to have anonymous voting for people in a meeting
 */
contract Registry {
    event Create(address indexed chairman, address indexed poll);
    event AddVoter(address indexed personAdded, address indexed poll); // only chairman can do that
    event Vote(address indexed voter, address indexed poll);

    function createPoll(string memory proposal) public {
        new Poll(proposal, msg.sender); //assume this deploys a Poll and returns addresss of Poll
        // emit Create(msg.sender, poll); //we know this is with role 1   --- this has to be changed!!!!
    }

    function addNewVoter(address toAdd, Poll poll) public {
        //this has to be triggered by chairman
        poll.addNewVoter(toAdd, msg.sender);
        emit AddVoter(toAdd, address(poll)); //We know this is with role 0
    }

    function vote(Poll poll, uint256 index) public {
        poll.vote(index, msg.sender);
        emit Vote(msg.sender, address(poll));
    }
}
