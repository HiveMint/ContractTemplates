pragma solidity ^0.8.9;

// import "hardhat/console.sol"; // — uncomment when needed

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import {CantBeEvil} from "@a16z/contracts/licenses/CantBeEvil.sol";
/*
 *  MerkleMint NFT Contract Template by Y4000 for HiveMint
 */
contract MerkleMint is ERC721, Pausable, Ownable, PaymentSplitter, CantBeEvil {

    struct Tier {
        bytes32 root;
        uint256 price;
        uint256 supply;
        uint256 startTime;
        uint256 maxPerWallet;
    }

    mapping(uint256 => mapping(address => uint256)) tierMinted;
    mapping(uint256 => uint256) tierCounts;
    mapping(address => uint256) publicMinted;

    string public baseUri;
    Tier[] public merkleTiers;
    Tier public publicTier;

    using Counters for Counters.Counter;
    Counters.Counter private _mintCount;

    /**
        TODO: Royalties
     */
    constructor(
        string memory collectionName,
        string memory tokenSymbol,
        address[] memory _payees,
        uint256[] memory _shares,
        string memory _baseUri,
        Tier[] memory _merkleTiers,
        Tier memory _publicTier,
        uint8 memory _licenseVersion // corresponds to enum as defined by LicenseVersion
    ) 
    ERC721(collectionName, tokenSymbol) 
    PaymentSplitter(_payees, _shares) 
    CantBeEvil(_licenseVersion) 
    {
        // initialize base variables
        baseURI = _baseUri;
        merkleTiers = _merkleTiers;
        publicTier = _publicTier;
        // start counter at 1 so that the first NFT is #1
        _mintCount.increment();
    }

    function airdrop(address[] calldata _recipients) public onlyOwner {
        for (uint i=0; i<_recipients.length; i++) {
            mint(_recipients[i], 1);
        }
    }

    function merkleMint(uint256 tierIdx, bytes32[] calldata _merkleProof, uint256 numTokens) public whenNotPaused {
        require(
            block.timestamp < merkleTiers[tierIdx].startTime,
            "This tier mint has not yet started"
        );
        require(
            merkleTiers[tierIdx].price * numTokens <= msg.value, 
            "Insufficient funds for the requested transaction"
        );
        // check if max minted merkleTiers[tierIdx].maxPerWallet
        uint x = tierMinted[tierIdx][msg.sender];
        require(
            x + numTokens <= merkleTiers[tierIdx].maxPerWallet, 
            "Request exceeds maximum tokens per wallet"
        );
        // check tier supply
        uint y = tierCounts[tierIdx];
        require(
            y + numTokens <= merkleTiers[tierIdx].supply, 
            "Not enough supply remaining within this tier for the requested transaction"
        );
        // verify merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(
            MerkleProof.verify(_merkleProof, merkleTiers[tierIdx].root, leaf), 
            "Not authorized for minting at this tier"
        );
        mint(msg.sender, numTokens);
        // increment tier minted for this address
        tierMinted[tierIdx][msg.sender] = x+numTokens;
        // incremeint tier total minted count
        tierCounts[tierIdx] = y+numTokens;
    }

    function publicMint(uint256 numTokens) public payable whenNotPaused {
        require(
            block.timestamp < publicTier.startTime,
            "Public Mint has not yet started"
        );
        require(
            publicTier.price * numTokens <= msg.value, 
            "Insufficient funds for the requested transaction"
        );
        // check if max minted publicTier.maxPerWallet
        uint x = publicMinted[msg.sender];
        require(
            x + numTokens <= publicTier.maxPerWallet, 
            "Request exceeds maximum tokens per wallet"
        );
        mint(msg.sender, numTokens);
        // increment public minted for this address
        publicMinted[msg.sender] = x+numTokens;
    }

    function mint(address addr, uint256 numTokens) private {
        require(
            _mintCount.current() + numTokens <= publicTier.supply, 
            "Not enough supply remaining for the requested transaction"
        );
        for(uint256 i = 0; i < numTokens; i++) {
            _safeMint(addr, _mintCount.current());
            _mintCount.increment();
        }
    }


}
