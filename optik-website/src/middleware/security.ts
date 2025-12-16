import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

// Rate limiting storage
const rateLimitMap = new Map<string, number[]>();

export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  
  // Remove old requests
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  return true;
}

export async function verifyWallet(walletAddress: string): Promise<boolean> {
  try {
    const pubkey = new PublicKey(walletAddress);
    return PublicKey.isOnCurve(pubkey.toBuffer());
  } catch {
    return false;
  }
}

export async function verifyTransaction(signature: string, expectedAmount: number): Promise<boolean> {
  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com');
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });
    
    if (!tx || tx.meta?.err) return false;
    
    // Verify amount (simplified - in production verify exact token transfer)
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim().slice(0, 1000);
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  // In production, check against database
  return apiKey === process.env.INTERNAL_API_KEY;
}
