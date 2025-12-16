#!/bin/bash

echo "🚀 PHASE 1: SOLANA VAULT PROGRAM - EXACT SPEC"
echo "=============================================="
echo ""

# Clean start
rm -rf programs/vault/src/lib.rs

cat > programs/vault/src/lib.rs << 'RUSTEND'
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Gh45BveckGYC9Eq13kagQcPp8qgQuRYq5RgB3mgLC72q");

const LOCK_PERIOD: i64 = 90 * 24 * 60 * 60; // 90 days in seconds

#[program]
pub mod vault {
    use super::*;

    pub fn deposit_user_liquidity(
        ctx: Context<DepositLiquidity>,
        amount: u64,
    ) -> Result<()> {
        let deposit = &mut ctx.accounts.deposit_record;
        let clock = Clock::get()?;

        // Transfer LP tokens to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_lp_account.to_account_info(),
            to: ctx.accounts.vault_lp_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Record deposit
        deposit.depositor = ctx.accounts.user.key();
        deposit.lp_mint = ctx.accounts.lp_mint.key();
        deposit.amount = amount;
        deposit.deposit_timestamp = clock.unix_timestamp;
        deposit.lock_expiry = clock.unix_timestamp + LOCK_PERIOD;
        deposit.withdrawn = false;

        emit!(LiquidityDeposited {
            depositor: deposit.depositor,
            lp_mint: deposit.lp_mint,
            amount: deposit.amount,
            lock_expiry: deposit.lock_expiry,
        });

        Ok(())
    }

    pub fn withdraw_user_liquidity(
        ctx: Context<WithdrawLiquidity>,
    ) -> Result<()> {
        let deposit = &mut ctx.accounts.deposit_record;
        let clock = Clock::get()?;

        require!(!deposit.withdrawn, VaultError::AlreadyWithdrawn);
        require!(
            clock.unix_timestamp >= deposit.lock_expiry,
            VaultError::StillLocked
        );
        require!(
            deposit.depositor == ctx.accounts.user.key(),
            VaultError::Unauthorized
        );

        // Transfer LP tokens back to user
        let seeds = &[
            b"vault".as_ref(),
            &[ctx.bumps.vault_authority],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_lp_account.to_account_info(),
            to: ctx.accounts.user_lp_account.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, deposit.amount)?;

        deposit.withdrawn = true;

        emit!(LiquidityWithdrawn {
            depositor: deposit.depositor,
            lp_mint: deposit.lp_mint,
            amount: deposit.amount,
        });

        Ok(())
    }

    pub fn distribute_trading_fees(
        ctx: Context<DistributeFees>,
        fee_amount: u64,
    ) -> Result<()> {
        let creator_share = fee_amount / 2;
        let optik_share = fee_amount - creator_share;

        // Transfer to creator
        let cpi_accounts_creator = Transfer {
            from: ctx.accounts.fee_source.to_account_info(),
            to: ctx.accounts.creator_account.to_account_info(),
            authority: ctx.accounts.fee_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts_creator);
        token::transfer(cpi_ctx, creator_share)?;

        // Transfer to Optik treasury
        let cpi_accounts_optik = Transfer {
            from: ctx.accounts.fee_source.to_account_info(),
            to: ctx.accounts.optik_treasury.to_account_info(),
            authority: ctx.accounts.fee_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts_optik);
        token::transfer(cpi_ctx, optik_share)?;

        emit!(FeesDistributed {
            total: fee_amount,
            creator_share,
            optik_share,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct DepositLiquidity<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + DepositRecord::LEN,
    )]
    pub deposit_record: Account<'info, DepositRecord>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub user_lp_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub vault_lp_account: Account<'info, TokenAccount>,

    pub lp_mint: Account<'info, token::Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawLiquidity<'info> {
    #[account(mut)]
    pub deposit_record: Account<'info, DepositRecord>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub user_lp_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub vault_lp_account: Account<'info, TokenAccount>,

    /// CHECK: PDA authority
    #[account(
        seeds = [b"vault"],
        bump
    )]
    pub vault_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct DistributeFees<'info> {
    #[account(mut)]
    pub fee_source: Account<'info, TokenAccount>,

    #[account(mut)]
    pub creator_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub optik_treasury: Account<'info, TokenAccount>,

    pub fee_authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
pub struct DepositRecord {
    pub depositor: Pubkey,
    pub lp_mint: Pubkey,
    pub amount: u64,
    pub deposit_timestamp: i64,
    pub lock_expiry: i64,
    pub withdrawn: bool,
}

impl DepositRecord {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 1;
}

#[event]
pub struct LiquidityDeposited {
    pub depositor: Pubkey,
    pub lp_mint: Pubkey,
    pub amount: u64,
    pub lock_expiry: i64,
}

#[event]
pub struct LiquidityWithdrawn {
    pub depositor: Pubkey,
    pub lp_mint: Pubkey,
    pub amount: u64,
}

#[event]
pub struct FeesDistributed {
    pub total: u64,
    pub creator_share: u64,
    pub optik_share: u64,
}

#[error_code]
pub enum VaultError {
    #[msg("Liquidity is still locked")]
    StillLocked,
    #[msg("Already withdrawn")]
    AlreadyWithdrawn,
    #[msg("Unauthorized")]
    Unauthorized,
}
RUSTEND

echo "✅ Vault program created with EXACT spec:"
echo "   - deposit_user_liquidity() ONLY"
echo "   - withdraw_user_liquidity() ONLY"
echo "   - distribute_trading_fees() ONLY"
echo "   - 90-day lock enforced"
echo "   - No admin bypass"
echo "   - No pool creation"
echo "   - No Optik-funded LP"
echo ""

cd programs/vault
cargo check

if [ $? -eq 0 ]; then
    echo "✅ Vault compiles"
else
    echo "❌ Vault has errors - fix before deploy"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NEXT: Deploy to devnet and test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Commands:"
echo "  cd programs/vault"
echo "  anchor build"
echo "  solana config set --url devnet"
echo "  anchor deploy"

