// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
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
    
    mapping(string => uint) private optionsVote; //how many votes for a given option
    mapping(string => bool) private optionsExist; //what options exist
    string[] private optionsTally; //list form of what options exist
    
    uint private votedSize; //number of people who have voted
    uint private voterSize; //number of people who are voters
    string[] private winningOption;

    //TODO 1. implement ability to change vote? (impossible in current implemtation)
    //TODO 2. Implement ability to lock/close a poll?
    //TODO 3. can we change winningProposal to be a getter so that it doesn't cost gas to run it
    //TODO To solve 2 and 3, we change the winning calculation to occur within vote function

    /** 
     * @dev Constructs Poll object
     * @param proposal the question we are posing
     * @param chair the person running the poll
     */
    constructor(string memory proposal, address chair) {
        question = proposal;
        chairperson = chair;
        voterAddresses[chairperson] = true;
        voterSize = 1;
        votedSize = 0;
    }
    
    /** 
     * @dev Getter function for question
     * @return string the question
     */
    function getQuestion() view external returns (string memory) {
        return question;
    }
    
    /** 
     * @dev Getter function for voting options
     * @return string[] possible voting options
     */
    function getOptions() view external returns (string[] memory) {
        return optionsTally;
    }
    
    /** 
     * @dev Getter function for total voters
     * @return uint total number of voters for this Poll
     */
    function getTotalVoters() view external returns (uint) {
        return voterSize;
    }
    
    /** 
     * @dev Getter function for total people that have voted so far
     * @return uint total number of voters who have voted so far
     */
    function getTotalVoted() view external returns (uint) {
        return votedSize;
    }
    
    /** 
     * @dev Allows voters to add new voting options
     * @param newOption the string for the new voting option
     */
    function addNewOption(string memory newOption) external {
        address thisAddress = msg.sender;
        require(voterAddresses[thisAddress] == true, "You must be a voter to participate in this vote."); //sender must be in voters
        require(optionsExist[newOption] == false, "This voting option already exists in the proposal."); //option doesn't already exist
        optionsExist[newOption] = true;
        optionsVote[newOption] = 0;
        optionsTally.push(newOption);
    }
    
    /** 
     * @dev Allows chairman to add new voters
     * @param toAdd the address of the voter being added
     */
    function addNewVoter(address toAdd) external {
        address thisAddress = msg.sender;
        require(thisAddress == chairperson, "Only the chairperson can add new voters."); //address must be chairperson
        require(voterAddresses[toAdd] == false, "This voter has already been added.");
        voters[toAdd] = false;
        voterAddresses[toAdd] = true;
        voterSize += 1;
    }

    /**
     * @dev Allows voters to cast their vote
     * @param voteChoice the string representing the voting choice of the current voter
     */
    function vote(string memory voteChoice) external {
        address thisAddress = msg.sender;
        require(voterAddresses[thisAddress] == true, "You do not have the right to vote on this proposal.");
        require(voters[thisAddress] == false, "You have already voted.");
        require(optionsExist[voteChoice] == true, "This vote option does not exist.");
        
        voters[thisAddress] = true;
        optionsVote[voteChoice] += 1;
        votedSize += 1;
    }

    /** 
     * @dev Calculates which proposal has won
     * @return winningOption the string array of winning option(s). Plural because of potential ties in votes
     */
    function winningProposal() external returns (string[] memory) {
        require(votedSize == voterSize, "The voting session is still ongoing, not everyone has voted.");
        uint mostVotesSoFar = 0;
        for(uint i = 0; i < optionsTally.length; i++) {
            if(optionsVote[optionsTally[i]] > mostVotesSoFar) {
                mostVotesSoFar = optionsVote[optionsTally[i]];
                delete winningOption; //clear array
                winningOption.push(optionsTally[i]);
            }    
            else if(optionsVote[optionsTally[i]] == mostVotesSoFar) {
                winningOption.push(optionsTally[i]);
            }
        }
        return winningOption;
    }
}
