// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Event.sol";
import "./SoulboundNFT.sol";

contract EventFactory {
    Event[] public events;
    SoulboundNFT public nftContract;

    event EventCreated(address eventAddress, string name, uint256 date, string location, uint256 maxParticipants);

    error AddMoreParticipants();

    constructor(address _nftContractAddress) {
        nftContract = SoulboundNFT(_nftContractAddress);
    }

    function createEvent(
        string memory _name,
        uint256 _date,
        string memory _location,
        uint256 _maxParticipants
    ) public returns (address) {
        if(_maxParticipants == 0) revert AddMoreParticipants();
        Event newEvent = new Event(_name, _date, _location, _maxParticipants, address(nftContract));
        events.push(newEvent);
        newEvent.transferOwnership(msg.sender);

        emit EventCreated(address(newEvent), _name, _date, _location, _maxParticipants);
        return address(newEvent);
    }

    function getEvents() public view returns (Event[] memory) {
        return events;
    }

    function getEventAt(uint256 index) public view returns(Event memory) {
        return events[index];
    }
}