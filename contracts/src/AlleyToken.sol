// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AlleyToken
 * @dev ERC-20 token for Silicon Alley community rewards
 *
 * Tokenomics:
 * - Total Supply: 30,000,000 $ALLEY
 * - Story Submission: 100 $ALLEY
 * - Referral Bonus: 50 $ALLEY
 * - Pioneer Card Mint: 10 $ALLEY
 */
contract AlleyToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 30_000_000 * 10**18;
    uint256 public constant STORY_REWARD = 100 * 10**18;
    uint256 public constant REFERRAL_REWARD = 50 * 10**18;
    uint256 public constant MINT_REWARD = 10 * 10**18;

    // Track rewards given
    mapping(address => uint256) public totalRewardsReceived;

    // Events
    event StoryReward(address indexed recipient, uint256 amount);
    event ReferralReward(address indexed referrer, address indexed referred, uint256 amount);
    event MintReward(address indexed recipient, uint256 amount);
    event AdminMint(address indexed recipient, uint256 amount, string reason);

    constructor() ERC20("Silicon Alley Token", "ALLEY") Ownable(msg.sender) {
        // Mint initial supply to owner for distribution
        _mint(msg.sender, 10_000_000 * 10**18); // 10M for initial distribution
    }

    /**
     * @dev Reward for story submission (admin only)
     * @param recipient Address to receive tokens
     */
    function rewardStorySubmission(address recipient) external onlyOwner {
        require(totalSupply() + STORY_REWARD <= MAX_SUPPLY, "Max supply exceeded");
        _mint(recipient, STORY_REWARD);
        totalRewardsReceived[recipient] += STORY_REWARD;
        emit StoryReward(recipient, STORY_REWARD);
    }

    /**
     * @dev Reward for referral (admin only)
     * @param referrer Address of the referrer
     * @param referred Address of the new user
     */
    function rewardReferral(address referrer, address referred) external onlyOwner {
        require(totalSupply() + REFERRAL_REWARD <= MAX_SUPPLY, "Max supply exceeded");
        _mint(referrer, REFERRAL_REWARD);
        totalRewardsReceived[referrer] += REFERRAL_REWARD;
        emit ReferralReward(referrer, referred, REFERRAL_REWARD);
    }

    /**
     * @dev Reward for minting an edition (admin only)
     * @param recipient Address to receive tokens
     */
    function rewardMint(address recipient) external onlyOwner {
        require(totalSupply() + MINT_REWARD <= MAX_SUPPLY, "Max supply exceeded");
        _mint(recipient, MINT_REWARD);
        totalRewardsReceived[recipient] += MINT_REWARD;
        emit MintReward(recipient, MINT_REWARD);
    }

    /**
     * @dev Admin mint for airdrops and special distributions
     * @param recipient Address to receive tokens
     * @param amount Amount to mint
     * @param reason Reason for the mint (for records)
     */
    function adminMint(address recipient, uint256 amount, string calldata reason) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(recipient, amount);
        emit AdminMint(recipient, amount, reason);
    }

    /**
     * @dev Get remaining mintable supply
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}
