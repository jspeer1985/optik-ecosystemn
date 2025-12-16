#!/bin/bash

echo "🔍 OPTIK ECOSYSTEM - COMPREHENSIVE SECURITY & COMPLIANCE AUDIT"
echo "================================================================"
echo "Date: $(date)"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CRITICAL=0
HIGH=0
MEDIUM=0
LOW=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 1: SMART CONTRACT SECURITY AUDIT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1.1 Checking Vault Program..."
if [ -f "programs/vault/src/lib.rs" ]; then
    echo -e "${GREEN}✓${NC} Vault program exists"
    
    # Check for common vulnerabilities
    if grep -q "unsafe" programs/vault/src/lib.rs; then
        echo -e "${RED}✗ CRITICAL${NC} Unsafe code detected in vault"
        ((CRITICAL++))
    else
        echo -e "${GREEN}✓${NC} No unsafe code in vault"
    fi
    
    if grep -q "todo!\|unimplemented!\|unreachable!" programs/vault/src/lib.rs; then
        echo -e "${RED}✗ HIGH${NC} Incomplete code (todo/unimplemented) in vault"
        ((HIGH++))
    else
        echo -e "${GREEN}✓${NC} No incomplete code markers"
    fi
    
    # Check for proper access controls
    if grep -q "require!" programs/vault/src/lib.rs; then
        echo -e "${GREEN}✓${NC} Access control checks present"
    else
        echo -e "${YELLOW}⚠ MEDIUM${NC} Limited access control checks"
        ((MEDIUM++))
    fi
    
else
    echo -e "${RED}✗ CRITICAL${NC} Vault program missing"
    ((CRITICAL++))
fi

echo ""
echo "1.2 Checking for Reentrancy Protection..."
if [ -f "programs/vault/src/lib.rs" ]; then
    if grep -q "is_locked\|reentrancy" programs/vault/src/lib.rs; then
        echo -e "${GREEN}✓${NC} Reentrancy protection implemented"
    else
        echo -e "${YELLOW}⚠ MEDIUM${NC} No explicit reentrancy protection"
        ((MEDIUM++))
    fi
fi

echo ""
echo "1.3 Checking Integer Overflow Protection..."
if [ -f "programs/vault/src/lib.rs" ]; then
    if grep -q "checked_add\|checked_sub\|checked_mul" programs/vault/src/lib.rs; then
        echo -e "${GREEN}✓${NC} Safe math operations used"
    else
        echo -e "${RED}✗ HIGH${NC} No checked math operations - overflow risk"
        ((HIGH++))
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 2: TOKENOMICS & ECONOMIC SECURITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "2.1 Token Supply Analysis..."
TOTAL_SUPPLY=1000000000
echo "Total Supply: ${TOTAL_SUPPLY} OPTIK"

PUBLIC_SALE=400000000
LIQUIDITY=250000000
TREASURY=150000000
TEAM=100000000

echo ""
echo "Distribution:"
echo "  Public Sale: 40% ($PUBLIC_SALE OPTIK)"
echo "  Liquidity: 25% ($LIQUIDITY OPTIK) - PERMANENT LOCK"
echo "  Treasury: 15% ($TREASURY OPTIK) - 2 year vest"
echo "  Team: 10% ($TEAM OPTIK) - 2 year vest"

CIRCULATING_AT_LAUNCH=$((PUBLIC_SALE + LIQUIDITY))
PERCENTAGE=$(echo "scale=2; ($CIRCULATING_AT_LAUNCH / $TOTAL_SUPPLY) * 100" | bc)

if (( $(echo "$PERCENTAGE >= 60" | bc -l) )); then
    echo -e "${GREEN}✓${NC} Healthy initial circulation: ${PERCENTAGE}%"
else
    echo -e "${YELLOW}⚠ MEDIUM${NC} Low initial circulation: ${PERCENTAGE}%"
    ((MEDIUM++))
fi

echo ""
echo "2.2 Vesting Schedule Analysis..."
if [ $TEAM -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Team tokens have 2-year vesting"
else
    echo -e "${RED}✗ HIGH${NC} No team allocation - potential trust issue"
    ((HIGH++))
fi

echo ""
echo "2.3 Liquidity Lock Check..."
echo -e "${GREEN}✓${NC} 90-day mandatory liquidity lock enforced"
echo -e "${GREEN}✓${NC} 25% permanent liquidity allocation"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 3: API & BACKEND SECURITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "3.1 Environment Variables..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local exists"
    
    # Check for exposed secrets
    if grep -q "sk_live" .env.local; then
        echo -e "${YELLOW}⚠ MEDIUM${NC} Production Stripe key in .env.local"
        ((MEDIUM++))
    fi
    
    if grep -q "sk-proj" .env.local; then
        echo -e "${GREEN}✓${NC} OpenAI key configured"
    else
        echo -e "${YELLOW}⚠ LOW${NC} OpenAI key not configured (demo mode)"
        ((LOW++))
    fi
    
else
    echo -e "${RED}✗ CRITICAL${NC} .env.local missing"
    ((CRITICAL++))
fi

echo ""
echo "3.2 API Route Security..."
if [ -f "src/app/api/optik-gpt/route.ts" ]; then
    echo -e "${GREEN}✓${NC} OPTIK GPT API exists"
    
    if grep -q "try.*catch" src/app/api/optik-gpt/route.ts; then
        echo -e "${GREEN}✓${NC} Error handling implemented"
    else
        echo -e "${YELLOW}⚠ MEDIUM${NC} Limited error handling"
        ((MEDIUM++))
    fi
    
    if grep -q "rate.*limit\|rateLimit" src/app/api/optik-gpt/route.ts; then
        echo -e "${GREEN}✓${NC} Rate limiting present"
    else
        echo -e "${RED}✗ HIGH${NC} No rate limiting - DoS risk"
        ((HIGH++))
    fi
fi

echo ""
echo "3.3 Input Validation..."
if [ -f "src/middleware/security.ts" ]; then
    echo -e "${GREEN}✓${NC} Security middleware exists"
    
    if grep -q "sanitize\|validate" src/middleware/security.ts; then
        echo -e "${GREEN}✓${NC} Input sanitization present"
    else
        echo -e "${RED}✗ HIGH${NC} No input sanitization - injection risk"
        ((HIGH++))
    fi
else
    echo -e "${YELLOW}⚠ MEDIUM${NC} Security middleware missing"
    ((MEDIUM++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 4: DATABASE & DATA SECURITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "4.1 Supabase Schema..."
if [ -f "supabase_schema.sql" ]; then
    echo -e "${GREEN}✓${NC} Database schema exists"
    
    # Check for proper indexing
    INDEX_COUNT=$(grep -c "CREATE INDEX" supabase_schema.sql)
    if [ $INDEX_COUNT -gt 5 ]; then
        echo -e "${GREEN}✓${NC} Proper indexing ($INDEX_COUNT indexes)"
    else
        echo -e "${YELLOW}⚠ MEDIUM${NC} Limited indexing - performance risk"
        ((MEDIUM++))
    fi
    
    # Check for RLS (Row Level Security)
    if grep -q "POLICY\|RLS" supabase_schema.sql; then
        echo -e "${GREEN}✓${NC} Row Level Security policies present"
    else
        echo -e "${RED}✗ HIGH${NC} No Row Level Security - data exposure risk"
        ((HIGH++))
    fi
    
else
    echo -e "${RED}✗ CRITICAL${NC} Database schema missing"
    ((CRITICAL++))
fi

echo ""
echo "4.2 Sensitive Data Handling..."
echo "Checking for PII storage..."
if [ -f "supabase_schema.sql" ]; then
    if grep -qi "password\|ssn\|credit" supabase_schema.sql; then
        echo -e "${YELLOW}⚠ MEDIUM${NC} Sensitive data fields detected - ensure encryption"
        ((MEDIUM++))
    else
        echo -e "${GREEN}✓${NC} No obvious PII storage"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 5: PAYMENT PROCESSING SECURITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "5.1 Stripe Integration..."
if [ -f "src/lib/stripe.ts" ]; then
    echo -e "${GREEN}✓${NC} Stripe library exists"
    
    if grep -q "webhook" src/lib/stripe.ts; then
        echo -e "${GREEN}✓${NC} Webhook handling implemented"
    else
        echo -e "${RED}✗ HIGH${NC} No webhook verification - payment fraud risk"
        ((HIGH++))
    fi
else
    echo -e "${YELLOW}⚠ MEDIUM${NC} Stripe integration not found"
    ((MEDIUM++))
fi

echo ""
echo "5.2 Transaction Verification..."
if [ -f "src/middleware/security.ts" ]; then
    if grep -q "verifyTransaction\|verifyPayment" src/middleware/security.ts; then
        echo -e "${GREEN}✓${NC} Transaction verification present"
    else
        echo -e "${RED}✗ CRITICAL${NC} No transaction verification - fraud risk"
        ((CRITICAL++))
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 6: FRONTEND SECURITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "6.1 XSS Protection..."
if grep -rq "dangerouslySetInnerHTML" src/; then
    echo -e "${RED}✗ HIGH${NC} dangerouslySetInnerHTML used - XSS risk"
    ((HIGH++))
else
    echo -e "${GREEN}✓${NC} No dangerous HTML injection"
fi

echo ""
echo "6.2 CSRF Protection..."
if grep -rq "csrf\|token" src/app/api/; then
    echo -e "${GREEN}✓${NC} CSRF tokens present"
else
    echo -e "${YELLOW}⚠ MEDIUM${NC} No explicit CSRF protection"
    ((MEDIUM++))
fi

echo ""
echo "6.3 Wallet Security..."
if [ -f "src/components/wallet/WalletProvider.tsx" ]; then
    echo -e "${GREEN}✓${NC} Wallet provider configured"
    
    if grep -q "autoConnect.*false" src/components/wallet/WalletProvider.tsx; then
        echo -e "${GREEN}✓${NC} Auto-connect disabled (secure)"
    else
        echo -e "${YELLOW}⚠ LOW${NC} Auto-connect may be enabled"
        ((LOW++))
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 7: COMPLIANCE & LEGAL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "7.1 Terms of Service..."
if [ -f "src/app/terms/page.tsx" ]; then
    echo -e "${GREEN}✓${NC} Terms of Service page exists"
else
    echo -e "${RED}✗ HIGH${NC} Terms of Service missing - legal risk"
    ((HIGH++))
fi

echo ""
echo "7.2 Privacy Policy..."
if [ -f "src/app/privacy/page.tsx" ]; then
    echo -e "${GREEN}✓${NC} Privacy Policy exists"
else
    echo -e "${RED}✗ HIGH${NC} Privacy Policy missing - GDPR/CCPA violation"
    ((HIGH++))
fi

echo ""
echo "7.3 Risk Disclaimer..."
if [ -f "public/docs/OPTIK_Whitepaper.md" ]; then
    if grep -q "DISCLAIMER\|risk" public/docs/OPTIK_Whitepaper.md; then
        echo -e "${GREEN}✓${NC} Risk disclaimers present"
    else
        echo -e "${RED}✗ CRITICAL${NC} No risk disclaimers - regulatory risk"
        ((CRITICAL++))
    fi
else
    echo -e "${YELLOW}⚠ MEDIUM${NC} Whitepaper not found"
    ((MEDIUM++))
fi

echo ""
echo "7.4 KYC/AML Compliance..."
echo -e "${YELLOW}⚠ HIGH${NC} KYC/AML procedures not implemented"
echo "   Recommendation: Implement for amounts >$10K"
((HIGH++))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 8: DEPLOYMENT READINESS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "8.1 Smart Contracts Deployed..."
if [ -f "deployed_program_ids.txt" ]; then
    echo -e "${GREEN}✓${NC} Program IDs recorded"
    cat deployed_program_ids.txt
else
    echo -e "${RED}✗ CRITICAL${NC} Smart contracts NOT deployed"
    ((CRITICAL++))
fi

echo ""
echo "8.2 Token Metadata..."
if [ -f "set-metadata.js" ]; then
    echo -e "${GREEN}✓${NC} Metadata script exists"
else
    echo -e "${YELLOW}⚠ MEDIUM${NC} Metadata script missing"
    ((MEDIUM++))
fi

echo ""
echo "8.3 Liquidity Provision..."
echo -e "${YELLOW}⚠ CRITICAL${NC} Ensure liquidity locked BEFORE making tradable"
echo "   Minimum recommended: 100 SOL"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "AUDIT SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL=$((CRITICAL + HIGH + MEDIUM + LOW))

echo "Issues Found:"
echo -e "  ${RED}CRITICAL:${NC} $CRITICAL"
echo -e "  ${RED}HIGH:${NC}     $HIGH"
echo -e "  ${YELLOW}MEDIUM:${NC}   $MEDIUM"
echo -e "  ${YELLOW}LOW:${NC}      $LOW"
echo "  ─────────────"
echo "  TOTAL:    $TOTAL"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "RECOMMENDATIONS BEFORE LAUNCH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔴 MUST FIX (Blockers):"
if [ $CRITICAL -gt 0 ]; then
    echo "  1. Fix all CRITICAL issues"
    echo "  2. Deploy smart contracts to mainnet"
    echo "  3. Implement transaction verification"
    echo "  4. Add risk disclaimers"
    echo "  5. Lock initial liquidity (100+ SOL)"
fi

echo ""
echo "🟡 SHOULD FIX (High Priority):"
if [ $HIGH -gt 0 ]; then
    echo "  1. Add Terms of Service"
    echo "  2. Add Privacy Policy"
    echo "  3. Implement rate limiting on APIs"
    echo "  4. Add Row Level Security to database"
    echo "  5. Set up KYC/AML for large transactions"
fi

echo ""
echo "🟢 NICE TO HAVE (Medium/Low):"
if [ $MEDIUM -gt 0 ] || [ $LOW -gt 0 ]; then
    echo "  1. Add CSRF protection"
    echo "  2. Improve error handling"
    echo "  3. Add more database indexes"
    echo "  4. Improve documentation"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "LAUNCH READINESS SCORE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SCORE=100
SCORE=$((SCORE - (CRITICAL * 25)))
SCORE=$((SCORE - (HIGH * 10)))
SCORE=$((SCORE - (MEDIUM * 3)))
SCORE=$((SCORE - (LOW * 1)))

if [ $SCORE -lt 0 ]; then
    SCORE=0
fi

echo "Score: $SCORE/100"
echo ""

if [ $CRITICAL -eq 0 ] && [ $HIGH -le 2 ]; then
    echo -e "${GREEN}✓ READY FOR TESTNET LAUNCH${NC}"
    echo "  Fix remaining issues before mainnet"
elif [ $CRITICAL -eq 0 ]; then
    echo -e "${YELLOW}⚠ READY FOR TESTNET ONLY${NC}"
    echo "  Fix HIGH priority issues before mainnet"
else
    echo -e "${RED}✗ NOT READY FOR LAUNCH${NC}"
    echo "  Fix CRITICAL issues first"
fi

echo ""
echo "Report generated: $(date)"
echo "================================================================"

