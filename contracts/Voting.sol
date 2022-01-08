//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Voting{
  
    address[] private candidates;
    address private Winner;
    address public owner;
    enum State {
        inProgress,
        Ended
    }
    State public state;
    constructor(){
        owner = msg.sender; 
        Winner = address(0);
        state = State.inProgress;
    }
    mapping(address => uint) private votes;

    function addCandidate(address candidate) public {
        require(state == State.inProgress, "Voting is not in progress");
        require(msg.sender == owner , "Only owner can add candidates");
        require(candidate != address(0), "Candidate cannot be null");
        require(candidateExists(candidate) == false, "Candidate already exists");
        candidates.push(candidate);
    }
    function getLength() public view returns (uint256){
        return candidates.length;
    }
    function getCandidate(uint256 index) public view returns (address){
        return candidates[index];
    }
    function candidateExists(address candidate) internal view returns (bool){
        for(uint i = 0; i < candidates.length; i++){
            if(candidates[i] == candidate){
                return true;
            }
        }
        return false;
    }

    function voteForCandidate(address candidate) public{
        require(candidateExists(candidate) , "Candidate does not exist");
        votes[candidate]++;
    }
    function getVotes(address candidate) public view returns (uint256){
        return votes[candidate];
    }
    function calculateWinner() public {
        require(state == State.inProgress, "Voting has ended or is not in progress");
        require(msg.sender == owner , "Only owner can calculate winner");
        require(candidates.length > 0 , "No candidates added yet");
        state = State.Ended;
        address winner = candidates[0];
        uint winnerVotes = 0;
        for (uint i = 0; i < candidates.length; i++) {
            address candidate = candidates[i];
            uint count = votes[candidate];
            if (count > winnerVotes) {
                winner = candidate;
                winnerVotes = count;
            }
        }
        Winner = winner;
    }
    function getWinner() public view returns (address){
        require(state == State.Ended,"Winner not calculated yet");
        return Winner;
    }
    function reset() public{
        require(msg.sender == owner , "Only owner can reset");
        for(uint i = 0; i < candidates.length; i++){
            votes[candidates[i]] = 0;
        }
        while(candidates.length > 0){
            candidates.pop();
        }
        Winner = address(0);
        state = State.inProgress;
    }
}
