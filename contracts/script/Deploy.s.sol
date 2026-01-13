// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SiliconAlleyPioneers.sol";
import "../src/AlleyToken.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("ADMIN_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy NFT contract
        SiliconAlleyPioneers nft = new SiliconAlleyPioneers();
        console.log("SiliconAlleyPioneers deployed to:", address(nft));

        // Deploy token contract
        AlleyToken token = new AlleyToken();
        console.log("AlleyToken deployed to:", address(token));

        vm.stopBroadcast();

        // Log deployment info
        console.log("\n=== Deployment Complete ===");
        console.log("NFT Contract:", address(nft));
        console.log("Token Contract:", address(token));
        console.log("\nAdd these to your .env.local:");
        console.log("NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=", address(nft));
        console.log("NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=", address(token));
    }
}
