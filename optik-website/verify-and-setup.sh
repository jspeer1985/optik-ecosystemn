#!/bin/bash
# verify-and-setup.sh

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         OPTIK Ecosystem - Final Setup & Verification     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check all tools
echo "📦 Installed Versions:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Node:    $(node --version)"
echo "✅ pnpm:    $(pnpm --version)"
echo "✅ Rust:    $(rustc --version | cut -d' ' -f2)"
echo "✅ Cargo:   $(cargo --version | cut -d' ' -f2)"
echo "✅ Solana:  $(solana --version | cut -d' ' -f2)"
echo "✅ Anchor:  $(anchor --version | cut -d' ' -f2)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Generate keypairs
echo "🔑 Generating Solana Keypairs..."
mkdir -p ~/.config/solana

if [ ! -f ~/.config/solana/id.json ]; then
    solana-keygen new --outfile ~/.config/solana/id.json --no-bip39-passphrase --force
    echo "✅ Main wallet created"
else
    echo "⚠️  Main wallet already exists"
fi

if [ ! -f ~/.config/solana/deploy-keypair.json ]; then
    solana-keygen new --outfile ~/.config/solana/deploy-keypair.json --no-bip39-passphrase --force
    echo "✅ Deploy keypair created"
else
    echo "⚠️  Deploy keypair already exists"
fi

# Configure Solana
solana config set --url devnet > /dev/null
solana config set --keypair ~/.config/solana/id.json > /dev/null

# Get addresses
MAIN_WALLET=$(solana-keygen pubkey ~/.config/solana/id.json)
DEPLOY_KEY=$(solana-keygen pubkey ~/.config/solana/deploy-keypair.json)

echo ""
echo "📋 Your Solana Addresses:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Main:   $MAIN_WALLET"
echo "Deploy: $DEPLOY_KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Request airdrop
echo ""
echo "💰 Requesting devnet airdrop..."
solana airdrop 2 || echo "⚠️  Airdrop failed - try again with: solana airdrop 2"

# Check balance
echo ""
echo "💵 Balance: $(solana balance)"
echo ""

# Update .env.local
cd ~/optik-website

if [ -f .env.local ]; then
    sed -i "s|NEXT_PUBLIC_MAIN_WALLET=.*|NEXT_PUBLIC_MAIN_WALLET=${MAIN_WALLET}|g" .env.local
    sed -i "s|NEXT_PUBLIC_TREASURY_WALLET=.*|NEXT_PUBLIC_TREASURY_WALLET=${MAIN_WALLET}|g" .env.local
    sed -i "s|NEXT_PUBLIC_DEPLOY_AUTHORITY=.*|NEXT_PUBLIC_DEPLOY_AUTHORITY=${DEPLOY_KEY}|g" .env.local
    
    echo "✅ .env.local updated with wallet addresses"
    echo ""
    echo "Updated values:"
    grep "WALLET\|AUTHORITY" .env.local | grep -v "^#"
else
    echo "⚠️  .env.local not found in ~/optik-website"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP COMPLETE! 🚀                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. cd ~/optik-website"
echo "2. pnpm dev              # Start development server"
echo "3. anchor build          # Build smart contracts"
echo "4. anchor deploy         # Deploy to devnet"
echo ""
echo "🌐 Dev server will run at: http://localhost:3000"
echo ""
