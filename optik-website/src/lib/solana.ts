import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';

// Solana connection
export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

// Network endpoints
export const NETWORKS = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
};

// Common Solana addresses
export const ADDRESSES = {
  TOKEN_PROGRAM: TOKEN_PROGRAM_ID,
  SYSTEM_PROGRAM: new PublicKey('11111111111111111111111111111112'),
  RENT_PROGRAM: new PublicKey('SysvarRent111111111111111111111111111111111'),
};

// Utility functions
export async function getAccountBalance(publicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
}

export async function getTokenAccounts(walletAddress: string) {
  try {
    const publicKey = new PublicKey(walletAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    
    return tokenAccounts.value.map(account => ({
      pubkey: account.pubkey.toString(),
      mint: account.account.data.parsed.info.mint,
      amount: account.account.data.parsed.info.tokenAmount.uiAmount,
      decimals: account.account.data.parsed.info.tokenAmount.decimals,
    }));
  } catch (error) {
    console.error('Error fetching token accounts:', error);
    return [];
  }
}

export async function confirmTransaction(signature: string, commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed') {
  try {
    const latestBlockhash = await connection.getLatestBlockhash();
    
    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      commitment
    );
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
    }
    
    return confirmation;
  } catch (error) {
    console.error('Error confirming transaction:', error);
    throw error;
  }
}

export function validateSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getRecentBlockhash() {
  try {
    const { blockhash } = await connection.getLatestBlockhash();
    return blockhash;
  } catch (error) {
    console.error('Error fetching recent blockhash:', error);
    throw error;
  }
}

export async function sendAndConfirmTransactionWrapper(
  transaction: Transaction,
  signers: any[]
): Promise<string> {
  try {
    const signature = await connection.sendTransaction(transaction, signers, {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });

    await confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

// Token creation helpers
export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  decimals: number;
  supply: number;
}

export function createTokenMetadata(data: TokenMetadata) {
  return {
    name: data.name,
    symbol: data.symbol,
    description: data.description,
    image: data.image,
    external_url: process.env.NEXT_PUBLIC_APP_URL || 'https://optik-ecosystem.com',
    attributes: [
      {
        trait_type: 'Decimals',
        value: data.decimals.toString(),
      },
      {
        trait_type: 'Total Supply',
        value: data.supply.toLocaleString(),
      },
      {
        trait_type: 'Platform',
        value: 'Optik Ecosystem',
      },
    ],
    properties: {
      files: [
        {
          uri: data.image,
          type: 'image/png',
        },
      ],
      category: 'image',
    },
  };
}