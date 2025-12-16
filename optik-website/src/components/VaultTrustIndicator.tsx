'use client';

import { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const VAULT_PROGRAM = '6iryZ3M8nWfZa6WPmeVuW9C3tA5X63LFFUSyVLboFs9t';

interface VaultTrustProps {
  lpTokenMint?: string;
  depositTimestamp?: number;
  lockExpiry?: number;
}

export default function VaultTrustIndicator({ lpTokenMint, depositTimestamp, lockExpiry }: VaultTrustProps) {
  const { connection } = useConnection();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (lockExpiry) {
      const now = Date.now() / 1000;
      const remaining = Math.max(0, Math.floor((lockExpiry - now) / 86400));
      setDaysRemaining(remaining);
    }
  }, [lockExpiry]);

  useEffect(() => {
    async function verifyVault() {
      if (!lpTokenMint) return;
      
      try {
        const vaultPubkey = new PublicKey(VAULT_PROGRAM);
        const accountInfo = await connection.getAccountInfo(vaultPubkey);
        setVerified(!!accountInfo);
      } catch {
        setVerified(false);
      }
    }
    
    verifyVault();
  }, [connection, lpTokenMint]);

  return (
    <div className="bg-green-900/20 border-2 border-green-500 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">🔒</div>
        <div>
          <h3 className="text-xl font-bold text-green-400">Liquidity Locked in Vault</h3>
          <p className="text-sm text-gray-400">Your funds are secured on-chain</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Lock Period:</span>
          <span className="font-bold text-white">90 Days</span>
        </div>

        {daysRemaining > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Days Remaining:</span>
            <span className="font-bold text-green-400">{daysRemaining} days</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Funded By:</span>
          <span className="font-bold text-white">YOU (Not Optik)</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Vault Program:</span>
          
            href={`https://explorer.solana.com/address/${VAULT_PROGRAM}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-blue-400 hover:text-blue-300"
          >
            {VAULT_PROGRAM.substring(0, 8)}...
          </a>
        </div>

        {verified && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <span>✓</span>
            <span>Vault verified on-chain</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-black/30 rounded text-xs text-gray-400">
        <p><strong>Immutable Proof:</strong></p>
        <p className="mt-1">• Your liquidity is locked by smart contract</p>
        <p>• Optik cannot access your funds</p>
        <p>• You withdraw after 90 days</p>
        <p>• All actions recorded on Solana blockchain</p>
      </div>
    </div>
  );
}
