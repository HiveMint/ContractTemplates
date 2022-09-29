const { expect } = require("chai");
const hardhat = require("hardhat");
const { ethers } = hardhat;
const { SigMinter } = require("../lib/SigMinter");
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
    let now = await time.latest();
    hardhatToken = await Token.deploy(
      "TestCollection",
      "TSTCOL",
      [owner.address, hivemint.address],
      [95, 5],
      "https://hivemint.xyz/testtoken/", //TODO: staging base uri
      [
        {
          price: ethers.utils.parseEther("0.01"),
          supply: 100,
          startTime: now,
          maxPerWallet: 5,
        },
        {
          price: ethers.utils.parseEther("0.02"),
          supply: 100,
          startTime: now,
          maxPerWallet: 5,
        },
        {
          price: ethers.utils.parseEther("0.03"),
          supply: 100,
          startTime: now,
          maxPerWallet: 5,
        },
      ], // tiers
      {
        price: ethers.utils.parseEther("0.04"),
        supply: 100,
        startTime: now,
        maxPerWallet: 5,
      }, // publicTier
      signer.address
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
    it("First sig tier should have a supply of 100", async function () {
      const sTier = await hardhatToken.signedTiers(0);
      expect(100).to.equal(sTier.supply.toNumber());
    });
    it("Public tier should have a supply of 100", async function () {
      const pTier = await hardhatToken.publicTier();
      expect(100).to.equal(pTier.supply.toNumber());
    });
  });

  describe("Signed Mint", () => {
    it("Should redeem an NFT from a signed mintpass", async function () {
      const lazyMinter = new SigMinter({
        contract: hardhatToken,
        signer: signer,
      });
      const pass = await lazyMinter.createMintPass(0, generic_user.address);

      await hardhatToken.connect(generic_user).sigMint(0, pass.signature, 1, {
        value: ethers.utils.parseEther("0.01"),
      });
      expect(await hardhatToken.balanceOf(generic_user.address)).to.equal(1);
    });
    it("Should not redeem an NFT from a mis-signed mintpass", async function () {
      const lazyMinter = new SigMinter({
        contract: hardhatToken,
        signer: signer,
      });
      const pass = await lazyMinter.createMintPass(0, owner.address);

      await expect(
        hardhatToken.connect(generic_user).sigMint(0, pass.signature, 1, {
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("Signer address mismatch");
    });
  });
});
