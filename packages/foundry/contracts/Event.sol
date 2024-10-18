// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SoulboundNFT.sol";

contract Event is Ownable {
    string public name;
    uint256 public date;
    string public location;
    uint256 public maxParticipants;
    uint256 public registeredParticipants;
    bool public resultsUploaded;

    mapping(address => bool) public isRegistered;
    mapping(address => string) public results;

    SoulboundNFT public nftContract;

    event ParticipantRegistered(address participant);
    event ResultsUploaded(address organizer);
    event ResultAdded(uint256 tokenId, uint256 eventId, string result);

    error UserAlreadyRegistered();
    error MaxRegisteredParticipantsReached();
    error ResultsAlreadyUploaded();
    error MismatchInParticipansAndResults();
    error ResultsNotUploadedYet();
    error ParticipantNotRegistered();
    error NoSouldBoundNFT();
    error RegisterPeriodExpired();

    constructor(
        string memory _name,
        uint256 _date,
        string memory _location,
        uint256 _maxParticipants,
        address _nftContractAddress
    ) Ownable(msg.sender) {
        name = _name;
        date = _date;
        location = _location;
        maxParticipants = _maxParticipants;
        nftContract = SoulboundNFT(_nftContractAddress);
    }

    function register() public {
        if (isRegistered[msg.sender]) revert UserAlreadyRegistered();
        if (registeredParticipants >= maxParticipants)
            revert MaxRegisteredParticipantsReached();
        if (resultsUploaded) revert RegisterPeriodExpired();

        if (nftContract.balanceOf(msg.sender) == 0) revert NoSouldBoundNFT();
        isRegistered[msg.sender] = true;
        registeredParticipants++;

        emit ParticipantRegistered(msg.sender);
    }

    function uploadResults(
        address[] memory participants,
        string[] memory _results
    ) public onlyOwner {
        if (resultsUploaded) revert ResultsAlreadyUploaded();
        if (participants.length != _results.length)
            revert MismatchInParticipansAndResults();

        for (uint i = 0; i < participants.length; i++) {
            if (!isRegistered[participants[i]])
                revert ParticipantNotRegistered();
            results[participants[i]] = _results[i];

            uint256 tokenId = nftContract.tokenOfOwnerByIndex(
                participants[i],
                0
            );
            // that will be caught by an off-chain service to update the metadata
            emit ResultAdded(
                tokenId,
                uint256(uint160(address(this))),
                _results[i]
            );
        }

        resultsUploaded = true;
        emit ResultsUploaded(msg.sender);
    }

    function getResult(
        address participant
    ) public view returns (string memory) {
        if (!resultsUploaded) revert ResultsNotUploadedYet();
        if (!isRegistered[participant]) revert ParticipantNotRegistered();
        return results[participant];
    }

    function getParticipantResultBlobId(
        address participant
    ) public view returns (string memory) {
        if (!isRegistered[participant]) revert ParticipantNotRegistered();
        if (!resultsUploaded) revert ResultsNotUploadedYet();
        uint256 tokenId = nftContract.tokenOfOwnerByIndex(participant, 0);
        return nftContract.tokenURI(tokenId);
    }
}
