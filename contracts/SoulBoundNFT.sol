// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundNFT is ERC721Enumerable {
    struct AthleteData {
        uint256[] eventIds;
        mapping(uint256 => string) eventResults; // eventId => result
    }

    mapping(uint256 => AthleteData) private _athleteData;
    uint256 private _tokenIdCounter;

    error TokenIdDoesNotExist();
    error SoulboundNFTTokenTransferNotAllowed();
    error NFTAlreadyMinted();

    constructor() ERC721("AthleteProof", "APROOF") {}

    modifier onlyExistingTokenId(uint256 tokenId) {
        if (!_exists(tokenId)) revert TokenIdDoesNotExist();
        _;
    }

    function mint(address to) external returns (uint256) {
        if (balanceOf(to) > 0) revert NFTAlreadyMinted();
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function addEventResult(uint256 tokenId, uint256 eventId, string memory result) public onlyOwner onlyExistingTokenId(tokenId){
        AthleteData storage data = _athleteData[tokenId];
        data.eventIds.push(eventId);
        data.eventResults[eventId] = result;
    }

    function getAthleteEvents(uint256 tokenId) public view onlyExistingTokenId(tokenId) returns (uint256[] memory) {
        return _athleteData[tokenId].eventIds;
    }

    function getEventResult(uint256 tokenId, uint256 eventId) public view onlyExistingTokenId(tokenId) returns (string memory) {
        return _athleteData[tokenId].eventResults[eventId];
    }

     // Override transfer functions to make the NFT soulbound
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721Enumerable)
    {
        if(from != address(0) || to != address(0)) revert SoulboundNFTTokenTransferNotAllowed();
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function approve(address to, uint256 tokenId) public virtual override {
        revert("SoulboundNFT: approvals are not allowed");
    }  

    function setApprovalForAll(address operator, bool approved) public virtual override {
        revert("SoulboundNFT: approvals are not allowed");
    }

    // Override required function
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}