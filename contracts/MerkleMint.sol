pragma solidity ^0.8.9;

// import "hardhat/console.sol"; // — uncomment when needed

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

/*
 *  MerkleMint NFT Contract Template by HiveMint
 */
contract MerkleMint is ERC721, Pausable, Ownable, PaymentSplitter {
    string public baseUri;
    bytes32[] public merkleRoots;
    uint256[] public merklePrices;
    uint256[] public merkleSupply;
    uint256[] public merkleStartTime;
    uint256 public publicPrice;
    uint256 public totalSupply;
    uint256 public publicStartTime;

    constructor(
        string memory collectionName,
        string memory tokenSymbol,
        address[] memory _payees,
        uint256[] memory _shares,
        string memory _baseUri,
        bytes32[] memory _merkleRoots,
        uint256[] memory _merklePrices,
        uint256[] memory _merkleSupply,
        uint256[] memory _merkleStartTime,
        uint256 memory _publicPrice,
        uint256 memory _totalSupply,
        uint256 memory _publicStartTime
    ) ERC721(collectionName, tokenSymbol) PaymentSplitter(_payees, _shares) {
        // initialize base variables
        baseURI = _baseUri;
        merkleRoots = _merkleRoots;
        merklePrices = _merklePrices;
        merkleSupply = _merkleSupply;
        merkleStartTime = _merkleStartTime;
        publicPrice = _publicPrice;
        totalSupply = _totalSupply;
        publicStartTime = _publicStartTime;
    }
}
