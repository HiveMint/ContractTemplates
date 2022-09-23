const { expect } = require("chai");
const hardhat = require("hardhat");
const { ethers } = hardhat;
const { SigMinter } = require('../lib')

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
      hardhatToken = await Token.deploy(
        "TestCollection",
        "TSTCOL",
        [owner.address, hivemint.address], 
        [95,5], 
        "https://hivemint.xyz/testtoken/", //TODO: staging base uri
        [{}], // price, supply, startTime, maxPerWallet
        {}, // publicTier
        signer.address
        );
    });
    
});