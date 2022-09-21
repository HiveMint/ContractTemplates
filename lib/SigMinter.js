const ethers = require('ethers')

// These constants must match the ones used in the smart contract.
const SIGNING_DOMAIN_NAME = "HiveMint"
const SIGNING_DOMAIN_VERSION = "1"

/**
 * JSDoc typedefs.
 * 
 * @typedef {object} MintPass
 * @property {ethers.BigNumber | number} idx the index of the tier
 * @property {string} minter address of the minter
 * @property {ethers.BytesLike} signature an EIP-712 signature of all fields in the MintPass, apart from signature itself.
 */

/**
 * SigMinter is a helper class that creates MintPass objects and signs them, to be redeemed later by the LazyNFT contract.
 */
class SigMinter {

  /**
   * Create a new SigMinter targeting a deployed instance of the LazyNFT contract.
   * 
   * @param {Object} options
   * @param {ethers.Contract} contract an ethers Contract that's wired up to the deployed contract
   * @param {ethers.Signer} signer a Signer whose account is authorized to mint NFTs on the deployed contract
   */
  constructor({ contract, signer }) {
    this.contract = contract
    this.signer = signer
  }

  /**
   * Creates a new MintPass object and signs it using this SigMinter's signing key.
   * 
   * @param {ethers.BigNumber | number} idx the index of the tier
   * @param {string} minter address of the minter
   * 
   * @returns {MintPass}
   */
  async createMintPass(idx, minter) {
    const pass = { idx, minter }
    const domain = await this._signingDomain()
    const types = {
      MintPass: [
        {name: "idx", type: "uint256"},
        {name: "minter", type: "address"},
      ]
    }
    const signature = await this.signer._signTypedData(domain, types, pass)
    return {
      ...pass,
      signature,
    }
  }

  /**
   * @private
   * @returns {object} the EIP-721 signing domain, tied to the chainId of the signer
   */
  async _signingDomain() {
    if (this._domain != null) {
      return this._domain
    }
    const chainId = await this.contract.getChainID()
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    }
    return this._domain
  }
}

module.exports = {
  SigMinter
}