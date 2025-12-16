use anchor_lang::prelude::*;

declare_id!("7xcz3vYfUnsesiPKdE47yHdN2JUZ3WbcR4MCk928br2i");

#[program]
pub mod memecoin_factory {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Memecoin Factory Initialized!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
