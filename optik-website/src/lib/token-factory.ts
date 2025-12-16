import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint
} from '@solana/spl-token';

const VAULT_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_VAULT_PROGRAM || '6iryZ3M8nWfZa6WPmeVuW9C3tA5X63LFFUSyVLboFs9t');

export interface TokenCreationParams {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  creatorWallet: PublicKey;
  liquiditySOL: number;
}

export async function createTokenWithVault(
  connection: Connection,
  params: TokenCreationParams
): Promise<{
  tokenMint: PublicKey;
  signature: string;
  vaultDepositSignature?: string;
}> {
  
  // Step 1: Create SPL token
  const mintKeypair = Keypair.generate();
  const lamports = await getMinimumBalanceForRentExemptMint(connection);
  
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: params.creatorWallet,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      params.decimals,
      params.creatorWallet,
      params.creatorWallet,
      TOKEN_PROGRAM_ID
    )
  );

  // Step 2: Create token account for creator
  const creatorTokenAccount = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    params.creatorWallet
  );

  transaction.add(
    createAssociatedTokenAccountInstruction(
      params.creatorWallet,
      creatorTokenAccount,
      params.creatorWallet,
      mintKeypair.publicKey
    )
  );

  // Step 3: Mint supply to creator
  transaction.add(
    createMintToInstruction(
      mintKeypair.publicKey,
      creatorTokenAccount,
      params.creatorWallet,
      params.totalSupply * Math.pow(10, params.decimals),
      [],
      TOKEN_PROGRAM_ID
    )
  );

  // NOTE: Steps 4-6 happen client-side:
  // 4. User creates DEX pool (Raydium/Orca)
  // 5. User supplies SOL + tokens
  // 6. LP tokens deposited into vault (separate transaction)

  return {
    tokenMint: mintKeypair.publicKey,
    signature: '', // Will be signed by user wallet
  };
}

export async function depositLPToVault(
  connection: Connection,
  userWallet: PublicKey,
  lpTokenAccount: PublicKey,
  amount: number
): Promise<string> {
  
  // This calls your deployed vault program
  // deposit_user_liquidity(amount)
  
  // In production, this builds the transaction to call:
  // programs/vault/src/lib.rs::deposit_user_liquidity()
  
  console.log('Depositing LP tokens to vault:', {
    vault: VAULT_PROGRAM_ID.toBase58(),
    user: userWallet.toBase58(),
    lpAccount: lpTokenAccount.toBase58(),
    amount,
  });

  // Return mock signature for now
  return 'vault_deposit_signature';
}

export function calculateLockExpiry(): Date {
  const now = new Date();
  now.setDate(now.getDate() + 90);
  return now;
}
