'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectWallet } from './ConnectWallet';
import { useNFTMint, usePioneerToken } from '@/lib/web3/hooks/useNFTMint';
import { getOpenSeaUrl, getBaseScanUrl } from '@/lib/web3/contracts';

interface ClaimNFTProps {
  personId: string;
  personName: string;
  cardImageUrl: string;
}

export function ClaimNFT({ personId, personName, cardImageUrl }: ClaimNFTProps) {
  const { address, isConnected } = useAccount();
  const { tokenId, editionCount, hasMinted, isLoading: isLoadingToken } = usePioneerToken(personId);
  const { mintEdition, hash, isPending, isConfirming, isSuccess, error } = useNFTMint();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClaim = async () => {
    if (!tokenId || tokenId === BigInt(0)) {
      console.error('No token ID found for this pioneer');
      return;
    }
    await mintEdition(tokenId);
  };

  // Calculate what edition number this would be
  const nextEdition = editionCount + BigInt(1);

  if (isLoadingToken) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="animate-pulse">Loading card status...</div>
      </div>
    );
  }

  if (!hasMinted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <p className="text-gray-600">This pioneer's card hasn't been minted yet.</p>
        <p className="text-sm text-gray-400 mt-2">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Card Preview */}
      <div className="aspect-[3/4] relative bg-gray-100">
        <img
          src={cardImageUrl}
          alt={`${personName} Pioneer Card`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Edition #{nextEdition.toString()} of ∞
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">{personName}</h2>
        <p className="text-gray-600 text-center text-sm">
          Silicon Alley Pioneer Card
        </p>

        {/* Wallet Connection */}
        <div className="flex justify-center">
          <ConnectWallet />
        </div>

        {/* Claim Button */}
        {isConnected && !isSuccess && (
          <button
            onClick={handleClaim}
            disabled={isPending || isConfirming}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
              isPending || isConfirming
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
            }`}
          >
            {isPending && 'Confirm in Wallet...'}
            {isConfirming && 'Minting...'}
            {!isPending && !isConfirming && 'Claim Your Card (Free)'}
          </button>
        )}

        {/* Success State */}
        {isSuccess && hash && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-semibold">Card Claimed!</p>
              <p className="text-green-600 text-sm mt-1">
                Edition #{nextEdition.toString()} is yours
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={getOpenSeaUrl(tokenId || BigInt(0))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center text-sm font-medium"
              >
                View on OpenSea
              </a>
              <a
                href={getBaseScanUrl(hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-center text-sm font-medium"
              >
                View Transaction
              </a>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 text-sm">
              {error.message || 'Failed to mint. Please try again.'}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Total Editions Minted</span>
            <span className="font-medium">{editionCount.toString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
