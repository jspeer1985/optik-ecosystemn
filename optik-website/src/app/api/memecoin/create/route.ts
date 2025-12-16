import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
);

interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  decimals: number;
  supply: number;
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      symbol,
      description,
      image,
      decimals = 9,
      supply = 1000000,
      creatorWallet
    }: TokenMetadata & { creatorWallet: string } = await request.json();

    // Validate input
    if (!name || !symbol || !description || !creatorWallet) {
      return NextResponse.json(
        { error: 'Name, symbol, description, and creator wallet are required' },
        { status: 400 }
      );
    }

    // Validate wallet address
    try {
      new PublicKey(creatorWallet);
    } catch {
      return NextResponse.json(
        { error: 'Invalid creator wallet address' },
        { status: 400 }
      );
    }

    // Create mint keypair
    const mintKeypair = Keypair.generate();

    // Generate metadata
    const metadata = {
      name,
      symbol,
      description,
      image: image || `https://via.placeholder.com/200?text=${symbol}`,
      attributes: [],
      properties: {
        files: [
          {
            uri: image || `https://via.placeholder.com/200?text=${symbol}`,
            type: "image/png"
          }
        ],
        category: "image"
      },
      external_url: "https://optik-ecosystem.com",
      decimals,
      supply: supply * Math.pow(10, decimals)
    };

    // Create token creation transaction template
    const instructions = [
      SystemProgram.createAccount({
        fromPubkey: new PublicKey(creatorWallet),
        newAccountPubkey: mintKeypair.publicKey,
        space: 82, // Mint account size
        lamports: await connection.getMinimumBalanceForRentExemption(82),
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // Token program ID
      })
    ];

    const transaction = new Transaction().add(...instructions);
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = new PublicKey(creatorWallet);

    // Serialize transaction for frontend signing
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    });

    return NextResponse.json({
      success: true,
      mintAddress: mintKeypair.publicKey.toString(),
      metadata,
      transaction: Buffer.from(serializedTransaction).toString('base64'),
      mintKeypair: {
        publicKey: mintKeypair.publicKey.toString(),
        secretKey: Array.from(mintKeypair.secretKey)
      }
    });

  } catch (error) {
    console.error('Token creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    );
  }
}