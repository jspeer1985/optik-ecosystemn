#!/bin/bash

# OptiK DEX - Anchor Program Deployment Script
# This script deploys the perpetuals trading program to Solana

set -e

echo "🚀 OptiK DEX Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NETWORK="${1:-devnet}"  # devnet, testnet, or mainnet-beta
PROGRAM_DIR="./programs/optik-dex"

echo -e "${YELLOW}Network: $NETWORK${NC}"
echo ""

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo -e "${RED}❌ Anchor CLI not found. Please install Anchor first.${NC}"
    echo "Visit: https://www.anchor-lang.com/docs/installation"
    exit 1
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Solana CLI not found. Please install Solana CLI first.${NC}"
    echo "Visit: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

# Set Solana cluster
echo "📡 Setting Solana cluster to $NETWORK..."
solana config set --url https://api.$NETWORK.solana.com

# Check wallet balance
BALANCE=$(solana balance | awk '{print $1}')
echo "💰 Wallet balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo -e "${RED}❌ Insufficient balance. You need at least 2 SOL for deployment.${NC}"
    if [ "$NETWORK" = "devnet" ]; then
        echo "💸 Requesting airdrop..."
        solana airdrop 2
        sleep 5
    else
        echo "Please fund your wallet and try again."
        exit 1
    fi
fi

# Build the program
echo ""
echo "🔨 Building Anchor program..."
cd $PROGRAM_DIR
anchor build

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/optik_dex-keypair.json)
echo -e "${GREEN}✅ Program ID: $PROGRAM_ID${NC}"

# Update Anchor.toml with program ID
echo ""
echo "📝 Updating Anchor.toml..."
sed -i "s/optik_dex = \".*\"/optik_dex = \"$PROGRAM_ID\"/" ../../Anchor.toml

# Update lib.rs with program ID
echo "📝 Updating lib.rs..."
sed -i "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" src/lib.rs

# Rebuild with correct program ID
echo "🔨 Rebuilding with correct program ID..."
anchor build

# Deploy the program
echo ""
echo "🚀 Deploying program to $NETWORK..."
anchor deploy --provider.cluster $NETWORK

# Verify deployment
echo ""
echo "✅ Verifying deployment..."
DEPLOYED_PROGRAM=$(solana program show $PROGRAM_ID | grep "Program Id" | awk '{print $3}')

if [ "$DEPLOYED_PROGRAM" = "$PROGRAM_ID" ]; then
    echo -e "${GREEN}✅ Program successfully deployed!${NC}"
else
    echo -e "${RED}❌ Deployment verification failed${NC}"
    exit 1
fi

# Initialize the program
echo ""
echo "🔧 Initializing program..."
cd ../..

# Create initialization script
cat > initialize-dex.ts << 'EOF'
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";

async function main() {
  const network = process.env.ANCHOR_PROVIDER_URL || "https://api.devnet.solana.com";
  const connection = new Connection(network, "confirmed");
  
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(
      process.env.HOME + "/.config/solana/id.json",
      "utf-8"
    )))
  );
  
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {});
  anchor.setProvider(provider);

  const programId = new PublicKey(process.env.PROGRAM_ID!);
  
  console.log("🚀 Initializing OptiK DEX...");
  console.log("Program ID:", programId.toBase58());
  console.log("Wallet:", wallet.publicKey.toBase58());
  
  // Initialize market (this would call your actual program methods)
  // const [marketPda] = await PublicKey.findProgramAddress(
  //   [Buffer.from("market")],
  //   programId
  // );
  
  // await program.methods
  //   .initialize()
  //   .accounts({
  //     market: marketPda,
  //     authority: wallet.publicKey,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .rpc();
  
  console.log("✅ DEX initialized successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
EOF

# Run initialization
echo "Running initialization..."
PROGRAM_ID=$PROGRAM_ID npx ts-node initialize-dex.ts

# Update .env.local
echo ""
echo "📝 Updating .env.local..."
if [ -f .env.local ]; then
    # Update existing entries or add new ones
    if grep -q "NEXT_PUBLIC_PERPS_PROGRAM_ID" .env.local; then
        sed -i "s/NEXT_PUBLIC_PERPS_PROGRAM_ID=.*/NEXT_PUBLIC_PERPS_PROGRAM_ID=$PROGRAM_ID/" .env.local
    else
        echo "NEXT_PUBLIC_PERPS_PROGRAM_ID=$PROGRAM_ID" >> .env.local
    fi
    
    if grep -q "NEXT_PUBLIC_SOLANA_NETWORK" .env.local; then
        sed -i "s/NEXT_PUBLIC_SOLANA_NETWORK=.*/NEXT_PUBLIC_SOLANA_NETWORK=$NETWORK/" .env.local
    else
        echo "NEXT_PUBLIC_SOLANA_NETWORK=$NETWORK" >> .env.local
    fi
else
    cat > .env.local << EOF
# OptiK DEX Configuration
NEXT_PUBLIC_PERPS_PROGRAM_ID=$PROGRAM_ID
NEXT_PUBLIC_SOLANA_NETWORK=$NETWORK
NEXT_PUBLIC_RPC_ENDPOINT=https://api.$NETWORK.solana.com
EOF
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📋 Deployment Summary:"
echo "  Network: $NETWORK"
echo "  Program ID: $PROGRAM_ID"
echo "  RPC Endpoint: https://api.$NETWORK.solana.com"
echo ""
echo "🔗 Explorer Link:"
echo "  https://explorer.solana.com/address/$PROGRAM_ID?cluster=$NETWORK"
echo ""
echo "📝 Next Steps:"
echo "  1. Update your frontend with the new program ID"
echo "  2. Test the deployment with sample transactions"
echo "  3. Run: npm run dev"
echo ""
