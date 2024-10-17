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
            "dsadsa",
            312331,
            "dsadsadas",
            2,
            address(nft)
        );
        vm.stopBroadcast();

        // deploy more contracts here
        // DeployMyContract deployMyContract = new DeployMyContract();
        // deployMyContract.run();
    }
}
