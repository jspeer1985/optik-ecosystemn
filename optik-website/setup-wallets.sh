#!/bin/bash
# setup-wallets.sh

export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

MAIN_WALLET=$(solana-keygen pubkey ~/.config/solana/id.json)
DEPLOY_KEY=$(solana-keygen pubkey ~/.config/solana/deploy-keypair.json)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Your Solana Wallets:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Main:   $MAIN_WALLET"
echo "Deploy: $DEPLOY_KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd ~/optik-website

sed -i "s|NEXT_PUBLIC_MAIN_WALLET=.*|NEXT_PUBLIC_MAIN_WALLET=${MAIN_WALLET}|g" .env.local
sed -i "s|NEXT_PUBLIC_TREASURY_WALLET=.*|NEXT_PUBLIC_TREASURY_WALLET=${MAIN_WALLET}|g" .env.local
sed -i "s|NEXT_PUBLIC_DEPLOY_AUTHORITY=.*|NEXT_PUBLIC_DEPLOY_AUTHORITY=${DEPLOY_KEY}|g" .env.local

echo ""
echo "✅ .env.local updated!"
echo ""
grep "WALLET\|AUTHORITY" .env.local | grep -v "^#"

solana config set --url devnet
solana config set --keypair ~/.config/solana/id.json

echo ""
echo "💵 Balance:"
solana balance

echo ""
echo "💰 Requesting airdrop..."
solana airdrop 2

echo ""
echo "✅ Setup complete! Run: pnpm dev"
