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
        if (ownerOf(tokenId) == address(0)) revert TokenIdDoesNotExist();
        _;
    }

    function mint(address to) external returns (uint256) {
        if (balanceOf(to) > 0) revert NFTAlreadyMinted();
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function addEventResult(
        uint256 tokenId,
        uint256 eventId,
        string memory result
    ) public onlyExistingTokenId(tokenId) {
        AthleteData storage data = _athleteData[tokenId];
        data.eventIds.push(eventId);
        data.eventResults[eventId] = result;
    }

    function getAthleteEvents(
        uint256 tokenId
    ) public view onlyExistingTokenId(tokenId) returns (uint256[] memory) {
        return _athleteData[tokenId].eventIds;
    }

    function getEventResult(
        uint256 tokenId,
        uint256 eventId
    ) public view onlyExistingTokenId(tokenId) returns (string memory) {
        return _athleteData[tokenId].eventResults[eventId];
    }

    // Override transfer functions to make the NFT soulbound
}
