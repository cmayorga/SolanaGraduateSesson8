//-------------------------------------------------------------------------------
///
/// TASK: Implement the deposit functionality for the on-chain vault
/// 
/// Requirements:
/// - Verify that the user has enough balance to deposit
/// - Verify that the vault is not locked
/// - Transfer lamports from user to vault using CPI (Cross-Program Invocation)
/// - Emit a deposit event after successful transfer
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction::transfer;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::DepositEvent;

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    let user = &ctx.accounts.user;
    let vault = &ctx.accounts.vault;

    require!(!vault.locked, VaultError::VaultLocked);
    require!(
        **user.to_account_info().lamports.borrow() >= amount,
        VaultError::InsufficientBalance
    );

    let ix = transfer(&user.key(), &vault.key(), amount);
    invoke(&ix, &[user.to_account_info(), vault.to_account_info()])?;

    emit!(DepositEvent {
        amount,
        user: user.key(),
        vault: vault.key(),
    });

    Ok(())
}
