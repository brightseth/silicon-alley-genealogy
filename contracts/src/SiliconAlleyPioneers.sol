// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SiliconAlleyPioneers
 * @dev ERC-721 NFT for Silicon Alley Pioneer Player Cards
 *
 * Features:
 * - Admin mints original cards for verified pioneers (free, gasless via Smart Wallet)
 * - Open editions: anyone can mint copies of existing cards
 * - Metadata stored on IPFS
 */
contract SiliconAlleyPioneers is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping from person UUID to their original token ID
    mapping(string => uint256) public personToTokenId;

    // Mapping from token ID to person UUID
    mapping(uint256 => string) public tokenToPersonId;

    // Mapping from token ID to edition count
    mapping(uint256 => uint256) public editionCount;

    // Edition tokens: originalTokenId => editionNumber => editionTokenId
    mapping(uint256 => mapping(uint256 => uint256)) public editions;

    // Events
    event PioneerMinted(string indexed personId, uint256 indexed tokenId, string uri);
    event EditionMinted(uint256 indexed originalTokenId, uint256 indexed editionTokenId, address minter, uint256 editionNumber);

    constructor() ERC721("Silicon Alley Pioneers", "ALLEY") Ownable(msg.sender) {}

    /**
     * @dev Mint a new pioneer card (admin only)
     * @param to Recipient address
     * @param personId UUID from database
     * @param uri IPFS metadata URI
     */
    function mintPioneer(
        address to,
        string calldata personId,
        string calldata uri
    ) external onlyOwner returns (uint256) {
        require(personToTokenId[personId] == 0, "Pioneer already minted");

        uint256 tokenId = ++_nextTokenId;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        personToTokenId[personId] = tokenId;
        tokenToPersonId[tokenId] = personId;

        emit PioneerMinted(personId, tokenId, uri);

        return tokenId;
    }

    /**
     * @dev Mint an edition of an existing pioneer card (anyone can call)
     * @param originalTokenId Token ID of the original card to copy
     */
    function mintEdition(uint256 originalTokenId) external returns (uint256) {
        require(_ownerOf(originalTokenId) != address(0), "Original does not exist");

        uint256 editionNumber = ++editionCount[originalTokenId];
        uint256 editionTokenId = ++_nextTokenId;

        _safeMint(msg.sender, editionTokenId);
        _setTokenURI(editionTokenId, tokenURI(originalTokenId));

        editions[originalTokenId][editionNumber] = editionTokenId;

        emit EditionMinted(originalTokenId, editionTokenId, msg.sender, editionNumber);

        return editionTokenId;
    }

    /**
     * @dev Check if a pioneer has been minted
     * @param personId UUID from database
     */
    function isPioneerMinted(string calldata personId) external view returns (bool) {
        return personToTokenId[personId] != 0;
    }

    /**
     * @dev Get the token ID for a pioneer
     * @param personId UUID from database
     */
    function getTokenIdForPioneer(string calldata personId) external view returns (uint256) {
        return personToTokenId[personId];
    }

    /**
     * @dev Get total supply of tokens
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
