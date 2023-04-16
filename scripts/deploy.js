// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.


// const hre = require("hardhat");

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//   const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//   const lockedAmount = hre.ethers.utils.parseEther("1");

//   const Lock = await hre.ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log(
//     `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


const { task } = require("hardhat/config");
const hardhat = require("hardhat");
const { ethers } = hardhat;

// TODO: define getAccount() function
const getAccount = () => { return "0x534Db4d2f6715D9c7023Bd938b0f62D72eE871eF"; }; // copilot generated...

task("deploy", "Deploys the cfrac.sol contract").setAction(async function (taskArguments, hre) {
  const nftContractFactory = await hre.ethers.getContractFactory("SigMint", getAccount());

  /* 
    constructor(
        string memory collectionName,
        string memory tokenSymbol,
        address[] memory _payees,
        uint256[] memory _shares,
        string memory _baseUri_,
        Tier[] memory _signedTiers,
        Tier memory _publicTier,
        address signer
    )
  */


  let _payees = ["0x534Db4d2f6715D9c7023Bd938b0f62D72eE871eF", "0xDd386096048683378E87FA626C75C2b548fd5e7e"];
  let _shares = [1,1];
  let baseUri = "https://hivemint.xyz/testtoken/"; // TODO: update this to the actual base URI
  [owner, hivemint, signer, generic_user] = await ethers.getSigners(); // TODO: update this to the actual signer
  const nft = await nftContractFactory.deploy(
    "TestCollection",
    "TSTCOL",
    [owner.address, hivemint.address], // payees
    [95, 5], // shares
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
  console.log(`Contract deployed to address: ${nft.address} UPDATE CONTRACT ADDRESS IN .env, run verify-contract`);
});