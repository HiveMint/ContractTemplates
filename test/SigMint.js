const { expect } = require("chai");
const hardhat = require("hardhat");
const { ethers } = hardhat;
const { SigMinter } = require('../lib')
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("SigMint contract", function () {

    let Token;
    let hardhatToken;
    let owner;
    let hivemint;
    let signer;
    let generic_user;
  
    beforeEach(async () => {
      Token = await ethers.getContractFactory("SigMint");
      [owner, hivemint, signer, generic_user] = await ethers.getSigners();
      let now = (await time.latest())
      hardhatToken = await Token.deploy(
        "TestCollection",
        "TSTCOL",
        [owner.address, hivemint.address], 
        [95,5], 
        "https://hivemint.xyz/testtoken/", //TODO: staging base uri
        [
            {price: ethers.utils.parseEther('0.01'), supply: 100, startTime: now, maxPerWallet:5},
            {price: ethers.utils.parseEther('0.02'), supply: 100, startTime: now, maxPerWallet:5},
            {price: ethers.utils.parseEther('0.03'), supply: 100, startTime: now, maxPerWallet:5},
        ], // tiers
        {price: ethers.utils.parseEther('0.04'), supply: 100, startTime: now, maxPerWallet:5}, // publicTier
        signer.address
        );
    });
    
});