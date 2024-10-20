// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Event} from "./Event.sol";
import "./SoulboundNFT.sol";

contract EventFactory {
    Event[] public events;
    SoulboundNFT public nftContract;

    struct EventInfo {
        address eventAddress;
        string name;
        uint256 date;
        string location;
        uint256 maxParticipants;
        uint256 registeredParticipants;
    }

    EventInfo[] public eventDetails;

    event EventCreated(
        address eventAddress,
        string name,
        uint256 date,
        string location,
        uint256 maxParticipants
    );

    error AddMoreParticipants();

    constructor(address _nftContractAddress) {
        nftContract = SoulboundNFT(_nftContractAddress);
    }

    function createEvent(
        string memory _name,
        uint256 _date,
        string memory _location,
        uint256 _maxParticipants
    ) public returns (Event) {
        if (_maxParticipants == 0) revert AddMoreParticipants();
        Event newEvent = new Event(
            _name,
            _date,
            _location,
            _maxParticipants,
            address(nftContract)
        );
        events.push(newEvent);
        newEvent.transferOwnership(msg.sender);

        eventDetails.push(
            EventInfo({
                eventAddress: address(newEvent),
                name: _name,
                date: _date,
                location: _location,
                maxParticipants: _maxParticipants,
                registeredParticipants: 0
            })
        );

        emit EventCreated(
            address(newEvent),
            _name,
            _date,
            _location,
            _maxParticipants
        );
        return newEvent;
    }

    function getEvents() public view returns (EventInfo[] memory) {
        return eventDetails;
    }

    function getEventAt(uint256 index) public view returns (Event) {
        return events[index];
    }
}
