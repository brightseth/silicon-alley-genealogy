import { type Address } from 'viem';

// Contract addresses - updated after deployment
export const NFT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as Address;
export const TOKEN_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as Address;

// ABI for SiliconAlleyPioneers (ERC-721)
export const PIONEERS_ABI = [
  {
    name: 'mintEdition',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'originalTokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'isPioneerMinted',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'personId', type: 'string' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'getTokenIdForPioneer',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'personId', type: 'string' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'personToTokenId',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'string' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'editionCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'PioneerMinted',
    inputs: [
      { name: 'personId', type: 'string', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'uri', type: 'string', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'EditionMinted',
    inputs: [
      { name: 'originalTokenId', type: 'uint256', indexed: true },
      { name: 'editionTokenId', type: 'uint256', indexed: true },
      { name: 'minter', type: 'address', indexed: false },
      { name: 'editionNumber', type: 'uint256', indexed: false },
    ],
  },
] as const;

// ABI for AlleyToken (ERC-20)
export const TOKEN_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'totalRewardsReceived',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'remainingSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;

// OpenSea URL helpers
export const getOpenSeaUrl = (tokenId: bigint | number) => {
  const network = process.env.NODE_ENV === 'production' ? 'base' : 'base-sepolia';
  return `https://opensea.io/assets/${network}/${NFT_CONTRACT_ADDRESS}/${tokenId}`;
};

export const getBaseScanUrl = (txHash: string) => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://basescan.org'
    : 'https://sepolia.basescan.org';
  return `${baseUrl}/tx/${txHash}`;
};
