require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require('hardhat-contract-sizer'); // npx hardhat size-contracts

const { INFURA_ID, SEPOLIA_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.13",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_ID}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};