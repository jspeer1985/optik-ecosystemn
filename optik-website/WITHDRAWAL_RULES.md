# OPTIK REVENUE WITHDRAWAL RULES

## WITHDRAWABLE IMMEDIATELY

### 1. Launch Fees
- **Source:** User payments via Stripe
- **Amount:** $100-$2,500 per token
- **Rule:** Withdraw ANY TIME after payment confirmed
- **Method:** Direct to Optik treasury wallet
- **No Lock:** Available instantly

### 2. Platform Fees (2.5%)
- **Source:** Additional fee on top of launch fee
- **Amount:** 2.5% of launch fee
- **Rule:** Withdraw ANY TIME after payment confirmed
- **Method:** Direct to Optik treasury wallet
- **No Lock:** Available instantly

### 3. Trading Fees (50% share)
- **Source:** 0.5% of all DEX trades
- **Split:** 50% creator / 50% Optik
- **Rule:** Withdraw weekly OR instantly
- **Method:** Via vault program distribute_trading_fees()
- **No Lock:** Your 50% is NOT locked

## NEVER WITHDRAWABLE BY OPTIK

### User LP Principal
- **Source:** User-supplied liquidity
- **Amount:** 1-100 SOL + tokens
- **Rule:** LOCKED for 90 days
- **Owner:** User wallet ONLY
- **Optik Access:** ZERO - Cannot touch, cannot unlock, cannot withdraw
- **After 90 days:** User withdraws, NOT Optik

## REVENUE CALCULATION

### Daily (10 tokens/day)
```
Launch Fees: 10 × $500 = $5,000 ✅ Withdraw now
Platform Fees: $5,000 × 2.5% = $125 ✅ Withdraw now
Trading Fees: $10K volume × 0.5% × 50% = $25 ✅ Withdraw weekly
DAILY TOTAL: $5,150 (ALL WITHDRAWABLE)
```

### Monthly (300 tokens)
```
Launch Fees: $150,000 ✅
Platform Fees: $3,750 ✅
Trading Fees: $7,500 ✅
MONTHLY TOTAL: $161,250 (ALL WITHDRAWABLE)
```

### 6 Months (1,800 tokens)
```
Launch Fees: $900,000 ✅
Platform Fees: $22,500 ✅
Trading Fees: $45,000 ✅
6-MONTH TOTAL: $967,500 (ALL WITHDRAWABLE)
```

## WITHDRAWAL API
```typescript
POST /api/revenue/withdraw
{
  "type": "launch_fees" | "platform_fees" | "trading_fees",
  "amount": 1000,
  "signature": "solana_transaction_signature"
}
```

## SECURITY RULES

1. ✅ Optik earns revenue Day 1
2. ✅ All revenue immediately withdrawable
3. ❌ Optik NEVER touches user LP
4. ❌ No lock on Optik revenue
5. ❌ No admin override on user funds
6. ✅ User LP locked 90 days BY VAULT
7. ✅ User withdraws LP AFTER 90 days
8. ❌ Optik has ZERO access to LP principal

## TRANSPARENCY

All revenue tracked in Supabase:
- `revenue` table: Source, amount, timestamp
- `transactions` table: Every payment logged
- `tokens` table: Every launch tracked

Users can verify on-chain:
- Vault address: 6iryZ3M8nWfZa6WPmeVuW9C3tA5X63LFFUSyVLboFs9t
- Treasury wallet: Check Solscan
- Trading fee splits: Automated by vault
