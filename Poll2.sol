// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
pragma abicoder v2; //Needed to return string array

/**
 * @title Poll
 * @dev Implements the ability to have anonymous voting for people in a meeting
 */
contract Poll {
    string private question; //the question the vote is addressing
    address private chairperson; //the person that started the vote

    mapping(address => bool) private voters; //has the voter voted or not
    mapping(address => bool) private voterAddresses; //track voter addresses IN this poll

    mapping(string => uint256) private optionsVote; //how many votes for a given option
    mapping(string => bool) private optionsExist; //what options exist
    string[] private optionsTally; //list form of what options exist

    uint256 private votedSize; //number of people who have voted
    uint256 private voterSize; //number of people who are voters
    string[] private winningOption;
    uint256 private mostVotesSoFar;

    //TODO 1. implement ability to change vote? (impossible in current implemtation)
    //TODO 2. Implement ability to lock/close a poll?
    
    /**
     * @dev Constructs Poll object
     * @param proposal the question we are posing
     */
    constructor(string memory proposal) {
        question = proposal;
        chairperson = msg.sender;
        voterAddresses[chairperson] = true;
        voterSize = 1;
        votedSize = 0;
        mostVotesSoFar = 0;
    }
    
    function isVoter(address user) external view returns (bool) {
        return voterAddresses[user];
    } 

    function isChairperson(address thisChairperson) external view returns (bool) {
        return chairperson == thisChairperson;
    } 

    /**
     * @dev Getter function for question
     * @return string the question
     */
    function getQuestion() external view returns (string memory) {
        address thisAddress = msg.sender;
        require(
            voterAddresses[thisAddress] == true,
            "You must be a voter to participate in this vote."
        ); //sender must be in voters
        return question;
    }

    /**
     * @dev Getter function for voting options
     * @return string[] possible voting options
     */
    function getOptions() external view returns (string[] memory) {
        address thisAddress = msg.sender;
        require(
            voterAddresses[thisAddress] == true,
            "You must be a voter to participate in this vote."
        ); //sender must be in voters
        return optionsTally;
    }

    /**
     * @dev Getter function for total voters
     * @return uint total number of voters for this Poll
     */
    function getTotalVoters() external view returns (uint256) {
        address thisAddress = msg.sender;
        require(
            voterAddresses[thisAddress] == true,
            "You must be a voter to participate in this vote."
        ); //sender must be in voters
        return voterSize;
    }

    /**
     * @dev Getter function for total people that have voted so far
     * @return uint total number of voters who have voted so far
     */
    function getTotalVoted() external view returns (uint256) {
        address thisAddress = msg.sender;
        require(
            voterAddresses[thisAddress] == true,
            "You must be a voter to participate in this vote."
        ); //sender must be in voters
        return votedSize;
    }

    /**
     * @dev Allows voters to add new voting options
     * @param newOption the string for the new voting option
     */
    function addNewOption(string memory newOption) external {
        address thisAddress = msg.sender;
        require(
            voterAddresses[thisAddress] == true,
            "You must be a voter to participate in this vote."
        ); //sender must be in voters
        require(
            optionsExist[newOption] == false,
            "This voting option already exists in the proposal."
        ); //option doesn't already exist
        optionsExist[newOption] = true;
        optionsVote[newOption] = 0;
        optionsTally.push(newOption);
    }

    /**
     * @dev Allows chairman to add new voters
     * @param toAdd the address of the voter being added
     */
    function addNewVoter(address toAdd, address chair) external {
        require(
            chair == chairperson,
            "Only the chairperson can add new voters."
        ); //address must be chairperson
        require(
            voterAddresses[toAdd] == false,
            "This voter has already been added."
        );
        voters[toAdd] = false;
        voterAddresses[toAdd] = true;
        voterSize += 1;
    }

    /**
     * @dev Allows voters to cast their vote
     * @param voteChoice the string representing the voting choice of the current voter
     */
    function vote(string memory voteChoice, address voter) external {
        require(
            voterAddresses[voter] == true,
            "You do not have the right to vote on this proposal."
        );
        require(voters[voter] == false, "You have already voted.");
        require(
            optionsExist[voteChoice] == true,
            "This vote option does not exist."
        );

        voters[voter] = true;
        optionsVote[voteChoice] += 1;
        votedSize += 1;

        if (optionsVote[voteChoice] > mostVotesSoFar) {
            delete winningOption;
            mostVotesSoFar = optionsVote[voteChoice];
            winningOption.push(voteChoice);
        } else if (optionsVote[voteChoice] == mostVotesSoFar) {
            winningOption.push(voteChoice);
        }
    }

    /**
     * @dev Calculates which proposal has won
     * @return winningOption the string array of winning option(s). Plural because of potential ties in votes
     */
    function winningProposal() external view returns (string[] memory) {
        address thisAddress = msg.sender;
        require(
            voterAddresses[thisAddress] == true,
            "You must be a voter to participate in this vote."
        ); //sender must be in voters
        require(
            votedSize == voterSize,
            "The voting session is still ongoing, not everyone has voted."
        );

        return winningOption;
    }
}
