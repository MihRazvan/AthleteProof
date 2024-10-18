// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract SoulboundNFT is ERC721Enumerable {
    // Mapping from token ID to Walrus blob ID
    mapping(uint256 => string) private _tokenBlobIds;

    uint256 private _tokenIdCounter;

    string public baseWalrusURI;

    error TokenIdDoesNotExist();
    error SoulboundNFTTokenTransferNotAllowed();
    error NFTAlreadyMinted();

    event MetadataUpdated(uint256 indexed tokenId, string blobId);

    constructor(string memory _baseWalrusURI) ERC721("AthleteProof", "APROOF") {
        baseWalrusURI = _baseWalrusURI;
    }

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

    function updateMetadata(
        uint256 tokenId,
        string memory newBlobId
    ) external onlyExistingTokenId(tokenId) {
        _tokenBlobIds[tokenId] = newBlobId;
        emit MetadataUpdated(tokenId, newBlobId);
    }

    function getTokenBlobId(
        uint256 tokenId
    ) public view onlyExistingTokenId(tokenId) returns (string memory) {
        return _tokenBlobIds[tokenId];
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override
        onlyExistingTokenId(tokenId)
        returns (string memory)
    {
        string memory blobId = _tokenBlobIds[tokenId];
        if (bytes(blobId).length == 0) {
            return "";
        }
        return string(abi.encodePacked(baseWalrusURI, blobId));
    }

    function getTokenIdByAddress(address user) public view returns (uint256) {
        return tokenOfOwnerByIndex(user, 0);
    }
}
