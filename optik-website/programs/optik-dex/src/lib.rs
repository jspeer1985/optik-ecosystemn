use anchor_lang::prelude::*;

declare_id!("Eefs4TWaVJLx6rLBC1Fbcoj58yRmadZMfQ8DQgVJzSB3");

#[program]
pub mod optik_dex {
    use super::*;
    
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("OPTIK DEX initialized!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
