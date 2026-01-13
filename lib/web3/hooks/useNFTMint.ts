'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { NFT_CONTRACT_ADDRESS, PIONEERS_ABI } from '../contracts';

export function useNFTMint() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mintEdition = async (originalTokenId: bigint) => {
    writeContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: PIONEERS_ABI,
      functionName: 'mintEdition',
      args: [originalTokenId],
    });
  };

  return {
    mintEdition,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function usePioneerToken(personId: string) {
  const { data: tokenId, isLoading } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: PIONEERS_ABI,
    functionName: 'getTokenIdForPioneer',
    args: [personId],
  });

  const { data: editionCount } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: PIONEERS_ABI,
    functionName: 'editionCount',
    args: [tokenId || BigInt(0)],
    query: { enabled: !!tokenId && tokenId > BigInt(0) },
  });

  return {
    tokenId,
    editionCount: editionCount || BigInt(0),
    isLoading,
    hasMinted: tokenId && tokenId > BigInt(0),
  };
}

export function useTokenBalance(address: `0x${string}` | undefined) {
  const { data: balance, isLoading } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: PIONEERS_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    balance: balance || BigInt(0),
    isLoading,
  };
}
