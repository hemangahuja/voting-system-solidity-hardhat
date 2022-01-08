const { expect } = require("chai");
const { ethers } = require("hardhat");

const address1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const address2 = "0x782D8027c193c75f3DcC62A7bAe2D4C5a7ff71A2"



describe('Voting', function () {

  

  before(async function () {
    this.Voting = await ethers.getContractFactory('Voting');
  });

  beforeEach(async function () {
    this.voting = await this.Voting.deploy();
    await this.voting.deployed();
  });

  it('should return state to be in progress', async function () {
    const state = await this.voting.state();
    expect(state).to.equal(0);
  }
  )
  it('add candidate', async function () {
    
    await this.voting.addCandidate(address1);
    expect(await this.voting.getLength()).to.equal(1);
  });

  it('should return address of added candidate' , async function(){
    await this.voting.addCandidate(address1);
    await this.voting.addCandidate(address2);
    expect(await this.voting.getCandidate(1)).to.equal(address2);
  })
  it('vote for candidate without adding should fail' , async function () {
    await expect(this.voting.voteForCandidate(address1)).to.be.revertedWith("Candidate does not exist");
    
  })

  it('test winning' , async function(){
    await this.voting.addCandidate(address1);
    await this.voting.addCandidate(address2);
    await this.voting.voteForCandidate(address1);
    await this.voting.voteForCandidate(address1);
    await this.voting.voteForCandidate(address2);
    await this.voting.voteForCandidate(address2);
    await this.voting.voteForCandidate(address2);
    await this.voting.calculateWinner();
    expect(await this.voting.getWinner()).to.equal(address2);
  })
  it('test reset' , async function(){
    await this.voting.addCandidate(address1);
    await this.voting.addCandidate(address2);
    await this.voting.voteForCandidate(address1);
    await this.voting.voteForCandidate(address2);
    await this.voting.voteForCandidate(address2);
    await this.voting.calculateWinner();
    expect(await this.voting.getWinner()).to.equal(address2);
    await this.voting.reset();
    expect(await this.voting.getLength()).to.equal(0);
    await expect(this.voting.calculateWinner()).to.be.revertedWith('No candidates added yet');
  })
  it('test null winner' , async function(){
    await expect(this.voting.getWinner()).to.be.revertedWith('Winner not calculated yet');
  })
  it('should return state to be ended after calculating winner' , async function(){
    await this.voting.addCandidate(address1);
    await this.voting.addCandidate(address2);
    await this.voting.voteForCandidate(address1);
    await this.voting.voteForCandidate(address1);
    await this.voting.voteForCandidate(address2);
    await this.voting.voteForCandidate(address2);
    await this.voting.voteForCandidate(address2);
    await this.voting.calculateWinner();
    expect(await this.voting.state()).to.equal(1);
  })
  it('test non owner accessibility' , async function(){
    const [owner,other] = await ethers.getSigners();
    await expect(this.voting.connect(other).addCandidate(address1)).to.be.revertedWith("Only owner can add candidates");
    await expect(this.voting.connect(other).calculateWinner()).to.be.revertedWith("Only owner can calculate winner");
    await expect(this.voting.connect(other).reset()).to.be.revertedWith("Only owner can reset");
  })
});
