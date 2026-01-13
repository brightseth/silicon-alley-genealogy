import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

// Use testnet for development, mainnet for production
const chain = process.env.NODE_ENV === 'production' ? base : baseSepolia;

export const wagmiConfig = createConfig({
  chains: [chain],
  connectors: [
    coinbaseWallet({
      appName: 'Silicon Alley Genealogy',
      preference: 'smartWalletOnly', // Force Smart Wallet for gasless
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export const CHAIN_ID = chain.id;
export const CHAIN_NAME = chain.name;
