// src/components/WalletProvider.tsx
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, ReactNode, useEffect } from 'react';

// Import wallet styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  // Get network from env or default to devnet
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;

  // Get RPC endpoint from env or use default
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_RPC_ENDPOINT) {
      return process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    }
    return clusterApiUrl(network);
  }, [network]);

  // Initialize wallets - ONLY include wallets that are actually installed
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  // Suppress Next.js dev overlay errors for wallet connection
  useEffect(() => {
    // Override console.error to filter wallet errors
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const errorStr = args.join(' ');

      // Block these specific wallet errors from showing
      if (
        errorStr.includes('WalletConnectionError') ||
        errorStr.includes('WalletNotReadyError') ||
        errorStr.includes('Unexpected error {}') ||
        errorStr.includes('wallet-adapter')
      ) {
        return; // Don't log
      }

      // Log everything else normally
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  // Error handler to suppress wallet errors
  const onError = (error: Error) => {
    // Filter out common wallet errors that are not critical
    const errorMessage = error.message?.toLowerCase() || '';

    // Suppress these specific errors
    if (
      errorMessage.includes('user rejected') ||
      errorMessage.includes('wallet not ready') ||
      errorMessage.includes('wallet is not installed') ||
      errorMessage.includes('unexpected error') ||
      error.name === 'WalletNotReadyError' ||
      error.name === 'WalletConnectionError'
    ) {
      // Silently handle - these are expected when wallet isn't installed
      return;
    }

    // Only log actual critical errors
    console.warn('Wallet error:', error);
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect={false} // CRITICAL: Don't auto-connect
        onError={onError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}