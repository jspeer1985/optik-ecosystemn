import { NextRequest, NextResponse } from 'next/server';
import { Connection, Transaction, Keypair } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const {
      signedTransaction,
      mintKeypair,
      metadata,
      creatorWallet,
      tokenData
    } = await request.json();

    if (!signedTransaction || !mintKeypair || !metadata || !creatorWallet) {
      return NextResponse.json(
        { error: 'Missing required fields for deployment' },
        { status: 400 }
      );
    }

    // Deserialize and send transaction
    const transaction = Transaction.from(
      Buffer.from(signedTransaction, 'base64')
    );

    // Recreate mint keypair from provided data
    const mint = Keypair.fromSecretKey(new Uint8Array(mintKeypair.secretKey));

    try {
      // Send transaction to Solana network
      const signature = await connection.sendTransaction(transaction, [mint], {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      });

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      // Store token data in Supabase
      const tokenRecord = {
        mint_address: mint.publicKey.toString(),
        creator_wallet: creatorWallet,
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        image_url: metadata.image,
        decimals: metadata.decimals,
        supply: metadata.supply,
        transaction_signature: signature,
        metadata: metadata,
        status: 'deployed',
        created_at: new Date().toISOString(),
        ...tokenData
      };

      const { data, error } = await supabase
        .from('tokens')
        .insert(tokenRecord)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        // Continue even if database save fails
      }

      return NextResponse.json({
        success: true,
        mintAddress: mint.publicKey.toString(),
        transactionSignature: signature,
        explorerUrl: `https://explorer.solana.com/tx/${signature}`,
        tokenRecord: data,
        message: 'Token successfully deployed to Solana!'
      });

    } catch (txError) {
      console.error('Transaction error:', txError);
      return NextResponse.json(
        { error: 'Failed to deploy transaction to Solana network' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { error: 'Failed to deploy token' },
      { status: 500 }
    );
  }
}