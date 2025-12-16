use anchor_lang::prelude::*;

declare_id!("5uuemsSu2LNH5Vv3EBzt74WRZzZq15Vk8UwB1vLQ5VNp");

#[program]
pub mod optik_token {
    use super::*;
    
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("OPTIK Token initialized!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
