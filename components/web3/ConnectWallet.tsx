'use client';

import {
  ConnectWallet as OnchainConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();

  return (
    <Wallet>
      <OnchainConnectWallet>
        <Avatar className="h-6 w-6" />
        <Name />
      </OnchainConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
        </Identity>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}

export function WalletStatus() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-sm text-gray-500">
        Connect wallet to claim your card
      </div>
    );
  }

  return (
    <div className="text-sm text-green-600 flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full" />
      Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
    </div>
  );
}
