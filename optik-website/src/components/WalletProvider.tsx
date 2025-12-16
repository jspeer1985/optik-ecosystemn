'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, ReactNode } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
    children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;

    const endpoint = useMemo(() => {
        return process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(network);
    }, [network]);

    // ONLY Phantom - reduces errors
    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
    ], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider
                wallets={wallets}
                autoConnect={false}
                onError={() => { }} // Empty function = ignore ALL errors
            >
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
}
