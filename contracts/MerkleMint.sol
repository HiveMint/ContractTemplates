// SPDX-License-Identifier: MIT

/*

  _    _ _           __  __ _       _   
 | |  | (_)         |  \/  (_)     | |  
 | |__| |___   _____| \  / |_ _ __ | |_ 
 |  __  | \ \ / / _ \ |\/| | | '_ \| __|
 | |  | | |\ V /  __/ |  | | | | | | |_ 
 |_|  |_|_| \_/ \___|_|  |_|_|_| |_|\__|

 MerkleMint NFT Contract Template by Y4000 for HiveMint

*/

pragma solidity ^0.8.9;

// import "hardhat/console.sol"; // — uncomment when needed

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import {CantBeEvil} from "@a16z/contracts/licenses/CantBeEvil.sol";

contract MerkleMint is ERC721Royalty, Pausable, Ownable, PaymentSplitter, CantBeEvil {

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

    uint256 private totalPayees;

    constructor(
        string memory collectionName,
        string memory tokenSymbol,
        address[] memory _payees,
        uint256[] memory _shares,
        string memory _baseUri_,
        Tier[] memory _merkleTiers,
        Tier memory _publicTier,
        address royaltyRecipient,
        uint96 royalty,
        uint8 _licenseVersion // corresponds to enum as defined by LicenseVersion
    ) 
    ERC721(collectionName, tokenSymbol) 
    PaymentSplitter(_payees, _shares) 
    CantBeEvil(_licenseVersion) 
    {
        // royalty info
        _setDefaultRoyalty(royaltyRecipient, royalty);        
        // initialize base variables
        baseUri = _baseUri_;
        merkleTiers = _merkleTiers;
        publicTier = _publicTier;
        totalPayees = _payees.length;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function withdraw() public onlyOwner {
        for (uint i=0; i<totalPayees; i++) {
            release(payable(payee(i)));
        }
    }

    function setDefaultRoyalty(address royaltyRecipient, uint96 royalty) public onlyOwner {
        _setDefaultRoyalty(royaltyRecipient, royalty);        
    }

    function setMerkleTiers(Tier[] memory _merkleTiers) public onlyOwner {
        merkleTiers = _merkleTiers;
    }

    function setPublicTier(Tier memory _publicTier) public onlyOwner {
        publicTier = _publicTier;
    }

    function setBaseUri(string memory uri) public onlyOwner {
        baseUri = uri;
    }

    function _baseUri() internal view override returns (string memory) {
        return baseUri;
    }

    function totalSupply() public view returns(uint256){
        return _mintCount.current();
    }

    /**
        airdrop - allows contract owner to gift NFTs to a list of addresses
     */
    function airdrop(address[] calldata _recipients) public onlyOwner {
        for (uint i=0; i<_recipients.length; i++) {
            mint(_recipients[i], 1);
        }
    }

    /**
        merkleMint - mint routine for registrants whom are on a allow list minting tier
     */
    function merkleMint(uint256 tierIdx, bytes32[] calldata _merkleProof, uint256 numTokens) public whenNotPaused {
        // check to make sure the tier mint time has started
        require(
            block.timestamp < merkleTiers[tierIdx].startTime,
            "This tier mint has not yet started"
        );
        // check to make sure the user passed enough funds to mint
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

    /**
        publicMint - mint routine for general public to mint once public mint is open
     */
    function publicMint(uint256 numTokens) public payable whenNotPaused {
        // check to make sure the public mint time has started
        require(
            block.timestamp < publicTier.startTime,
            "Public Mint has not yet started"
        );
        // check to make sure the user passed enough funds to mint
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
            _mintCount.current() + numTokens < publicTier.supply, 
            "Not enough supply remaining for the requested transaction"
        );
        for(uint256 i = 0; i < numTokens; i++) {
            // increment prior to mint allows #1 based vs #0 based token ids
            _mintCount.increment(); 
            _safeMint(addr, _mintCount.current());
        }
    }


}
