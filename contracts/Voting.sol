//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Voting{
  
    address[] private candidates;
    address private Winner;
    address public owner;
    constructor(){
        owner = msg.sender; 
    }
    mapping(address => uint) private votes;

    function addCandidate(address candidate) public {
        require(msg.sender == owner , "Only owner can add candidates");
        candidates.push(candidate);
    }
    function getLength() public view returns (uint256){
        return candidates.length;
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
    function getWinner() public view returns (address){
        require(msg.sender == owner , "Only owner can declare winner");
        require(candidates.length > 0 , "No candidates added yet");
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
        return winner;
    }
}
