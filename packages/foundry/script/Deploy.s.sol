//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import {EventFactory} from "../contracts/EventFactory.sol";
import {SoulboundNFT} from "../contracts/SoulboundNFT.sol";
import {Event} from "../contracts/Event.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        vm.startBroadcast();
        SoulboundNFT nft = new SoulboundNFT();
        EventFactory eventFactory = new EventFactory(address(nft));
        Event firstEvent = new Event(
            "Sofia Marathon",
            2024,
            "Sofia",
            50,
            address(nft)
        );
        vm.stopBroadcast();

        deployments.push(Deployment("SoulboundNFT", address(nft)));
        deployments.push(Deployment("EventFactory", address(eventFactory)));
        deployments.push(Deployment("Event", address(firstEvent)));

        // deploy more contracts here
        // DeployMyContract deployMyContract = new DeployMyContract();
        // deployMyContract.run();
    }
}
