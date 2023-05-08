
const nowTimestamp = 1683514776;
const day = 60 * 60 * 24; // public mint starts in 1 day later...

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

  module.exports = [
    "AfroPiece",
    "AFRO",
    _payees,
    _shares,
    baseUri,
    tiers,
    publicTier,
    signer
  ]