const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Voting', function () {
  before(async function () {
    this.Voting = await ethers.getContractFactory('Voting');
  });

  beforeEach(async function () {
    this.voting = await this.Voting.deploy();
    await this.voting.deployed();
  });


  it('add candidate', async function () {
    
    await this.voting.addCandidate("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(await this.voting.getLength()).to.equal(1);
  });

  it('vote for candidate without adding should fail' , async function () {
    expect(this.voting.voteForCandidate("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).to.be.revertedWith("Candidate does not exist");
    
  })

  it('test winning' , async function(){
    await this.voting.addCandidate("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await this.voting.addCandidate("0x782D8027c193c75f3DcC62A7bAe2D4C5a7ff71A2");
    await this.voting.voteForCandidate("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await this.voting.voteForCandidate("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await this.voting.voteForCandidate("0x782D8027c193c75f3DcC62A7bAe2D4C5a7ff71A2");
    await this.voting.voteForCandidate("0x782D8027c193c75f3DcC62A7bAe2D4C5a7ff71A2");
    await this.voting.voteForCandidate("0x782D8027c193c75f3DcC62A7bAe2D4C5a7ff71A2");
    expect(await this.voting.getWinner()).to.equal("0x782D8027c193c75f3DcC62A7bAe2D4C5a7ff71A2");
  })
});
