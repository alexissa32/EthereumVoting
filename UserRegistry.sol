// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Poll2.sol";

/**
 * @title Registry
 * @dev Implements the ability to have anonymous voting for people in a meeting
 */
contract Registry { 
    
    mapping(address => address[]) private user2polls; //what polls is a wallet address allowed to participate in
    mapping(address => address[]) private user2chairperson; //what polls is a wallet address the chairman of
    
    function getUser2Poll() public view returns (address[] memory) {
        return user2polls[msg.sender];
    }
    
    function getUser2Chairperson() public view returns (address[] memory) {
        return user2chairperson[msg.sender];
    }
    
    function addUserAsVoter(Poll poll) public {
        require(poll.isVoter(msg.sender) == true, "This user is not a member of the specified poll.");
        require(poll.isChairperson(msg.sender) == false, "This user is the chairperson, not just a voter.");
        user2polls[msg.sender].push(address(poll));
    }
    
    function addUserAsChairperson(Poll poll) public {
        require(poll.isChairperson(msg.sender) == true, "This address specified is not the chairperson of this poll.");
        user2chairperson[msg.sender].push(address(poll));
    }
}
