const { task } = require("hardhat/config");
const hardhat = require("hardhat");
const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();

  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  const nowTimestamp = blockBefore.timestamp;

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log('now timestamp:', nowTimestamp);
  const day = 60 * 60 * 24; // public mint starts in 1 day later...

  const nftContractFactory = await ethers.getContractFactory("SigMint", deployer);

  let _payees = [
    "0xec74CAD9B01DBb00fFEcFCE528b46ee9844A0fa5", // HiveMint
    "0xDd386096048683378E87FA626C75C2b548fd5e7e", // People DAO
    "0x824E20A0e6ca696E655049dB755fB1fe1D422396" // Afro Piece
  ];
  let _shares = [4, 48, 48];
  let baseUri = "ipfs://bafybeid3arksryzfkrkcwvmhe6r5ix7pj2tsb2ofx56n5ky4gha3how74q"
  let signer = "0x6dDAc982cc6e6591BfbB60E502C548671E6881C4" // HiveMint Signer
  let tiers = [
    { // free tier
      price: ethers.utils.parseEther("0"),
      supply: 200,
      startTime: nowTimestamp,
      maxPerWallet: 1,
    },
    { // whitelist tier
      price: ethers.utils.parseEther("0.02"),
      supply: 350,
      startTime: nowTimestamp,
      maxPerWallet: 5,
    }
  ]
  let publicTier = { // public tier
    price: ethers.utils.parseEther("0.025"),
    supply: 2023,
    startTime: nowTimestamp + day,
    maxPerWallet: 5,
  }

  const token = await nftContractFactory.deploy(
    "AfroPiece",
    "AFRO",
    _payees,
    _shares,
    baseUri,
    tiers,
    publicTier,
    signer
  );

  console.log(`Contract deployed to address: ${token.address} UPDATE CONTRACT ADDRESS IN .env, run verify-contract`);
  // npx hardhat verify --constructor-args arguments.js --network sepolia 0x4a248508C62A544A7f6a16BBDb2DFE240Bebc576
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
