# HiveMint ContractTemplates
Blockchain Smart Contract Templates for the HiveMint platform

Hardhat, try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

```
npx hardhat clean
npx hardhat compile
```

# contract deployment
- npx hardhat run scripts/deploy.js --network sepolia --show-stack-traces

# contract verification
- npx hardhat verify --constructor-args scripts/arguments.js --network sepolia CONTRACT_ADDRESS