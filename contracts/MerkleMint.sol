pragma solidity ^0.8.9;

// import "hardhat/console.sol"; // — uncomment when needed

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

/*
 *  MerkleMint NFT Contract Template by Y4000 for HiveMint
 */
contract MerkleMint is ERC721, Pausable, Ownable, PaymentSplitter {
    struct MerkleTier {
        bytes32 root;
        uint256 price;
        uint256 supply;
        uint256 startTime;
        uint256 maxPerWallet;
    }

    mapping(uint256 => mapping(address => uint256)) merkleMinted;

    string public baseUri;
    MerkleTier[] public tiers;
    uint256 public publicPrice;
    uint256 public totalSupply;
    uint256 public publicStartTime;

    constructor(
        string memory collectionName,
        string memory tokenSymbol,
        address[] memory _payees,
        uint256[] memory _shares,
        string memory _baseUri,
        MerkleTier[] memory _tiers,
        uint256 memory _publicPrice,
        uint256 memory _totalSupply,
        uint256 memory _publicStartTime
    ) ERC721(collectionName, tokenSymbol) PaymentSplitter(_payees, _shares) {
        // initialize base variables
        baseURI = _baseUri;
        tiers = _tiers;
        publicPrice = _publicPrice;
        totalSupply = _totalSupply;
        publicStartTime = _publicStartTime;
    }
}
