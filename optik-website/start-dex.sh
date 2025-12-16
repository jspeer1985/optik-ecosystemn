#!/bin/bash

# OptiK DEX - Quick Start Script
# This script helps you get started quickly with the DEX

set -e

echo "🚀 OptiK DEX Quick Start"
echo "========================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  No .env.local found. Creating from template...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo ""
    echo -e "${YELLOW}📝 Please edit .env.local and add your configuration:${NC}"
    echo "   - Supabase URL and keys"
    echo "   - Solana program IDs (after deployment)"
    echo "   - Other API keys as needed"
    echo ""
    read -p "Press Enter when you've configured .env.local..."
fi

# Check Node.js
echo "🔍 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Check if Supabase is configured
echo ""
echo "🔍 Checking Supabase configuration..."
if grep -q "your_supabase_project_url" .env.local; then
    echo -e "${YELLOW}⚠️  Supabase not configured in .env.local${NC}"
    echo ""
    echo "To set up Supabase:"
    echo "1. Go to https://supabase.com and create a project"
    echo "2. Run the SQL schema: cat supabase_dex_schema.sql"
    echo "3. Update .env.local with your Supabase credentials"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Supabase configured${NC}"
fi

# Ask about deployment
echo ""
echo "🤔 Have you deployed the Solana programs yet?"
echo "   (Required for full functionality)"
read -p "Deploy now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v anchor &> /dev/null && command -v solana &> /dev/null; then
        echo ""
        echo "🚀 Starting deployment..."
        ./deploy-dex.sh devnet
    else
        echo -e "${YELLOW}⚠️  Anchor or Solana CLI not found${NC}"
        echo "Please install them first:"
        echo "  - Solana: https://docs.solana.com/cli/install-solana-cli-tools"
        echo "  - Anchor: https://www.anchor-lang.com/docs/installation"
        echo ""
        echo "You can still run the DEX with mock data for now."
    fi
fi

# Start the development server
echo ""
echo "🎯 Starting development server..."
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ OptiK DEX is starting!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📍 Access the DEX at:"
echo "   http://localhost:3000/DEX"
echo ""
echo "📚 Features available:"
echo "   ✅ Wallet connection"
echo "   ✅ Perpetuals trading interface"
echo "   ✅ Position management"
echo "   ✅ Competitions"
echo "   ✅ Leaderboard"
echo "   ✅ Revenue sharing"
echo ""
echo "📖 For full setup instructions, see:"
echo "   DEX_SETUP_GUIDE.md"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev
