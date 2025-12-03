#![allow(deprecated)]
use anchor_lang::prelude::*;

declare_id!("DBy3PaPJ9v3bTQgidFdfZiBcsJv4B6YwoAAd8b88JhGE");

#[program]
pub mod solana_blog {
    use super::*;

    #[inline(never)]
    pub fn initialize_blog(ctx: Context<InitializeBlog>) -> Result<()> {
        let blog = &mut ctx.accounts.blog;
        blog.authority = ctx.accounts.authority.key();
        blog.post_count = 0;
        msg!("Blog initialized for authority: {}", blog.authority);
        Ok(())
    }

    #[inline(never)]
    pub fn create_post(
        ctx: Context<CreatePost>,
        title: String,
        content: String,
    ) -> Result<()> {
        require!(title.len() <= 100, ErrorCode::TitleTooLong);
        require!(content.len() <= 1000, ErrorCode::ContentTooLong);
        require!(!title.is_empty(), ErrorCode::TitleEmpty);
        require!(!content.is_empty(), ErrorCode::ContentEmpty);

        let blog = &mut ctx.accounts.blog;
        let post = &mut ctx.accounts.post;

        post.author = ctx.accounts.authority.key();
        post.title = title;
        post.content = content;
        post.post_id = blog.post_count;
        post.timestamp = Clock::get()?.unix_timestamp;

        blog.post_count = blog
            .post_count
            .checked_add(1)
            .ok_or(error!(ErrorCode::MathOverflow))?;


        msg!("Post created: {} by {}", post.title, post.author);
        Ok(())
    }

    #[inline(never)]
    pub fn update_post(
        ctx: Context<UpdatePost>,
        title: String,
        content: String,
    ) -> Result<()> {
        require!(title.len() <= 100, ErrorCode::TitleTooLong);
        require!(content.len() <= 1000, ErrorCode::ContentTooLong);
        require!(!title.is_empty(), ErrorCode::TitleEmpty);
        require!(!content.is_empty(), ErrorCode::ContentEmpty);

        let post = &mut ctx.accounts.post;
        
        post.title = title;
        post.content = content;
        post.timestamp = Clock::get()?.unix_timestamp;

        msg!("Post updated: {}", post.title);
        Ok(())
    }

    #[inline(never)]
    pub fn delete_post(_ctx: Context<DeletePost>) -> Result<()> {
        msg!("Post deleted");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeBlog<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Blog::INIT_SPACE,
        seeds = [b"blog", authority.key().as_ref()],
        bump
    )]
    pub blog: Box<Account<'info, Blog>>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        mut,
        seeds = [b"blog", authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub blog: Box<Account<'info, Blog>>,
    #[account(
        init,
        payer = authority,
        space = 8 + BlogPost::INIT_SPACE,
        seeds = [b"post", blog.key().as_ref(), &blog.post_count.to_le_bytes()],
        bump
    )]
    pub post: Box<Account<'info, BlogPost>>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePost<'info> {
    #[account(
        mut,
        seeds = [b"post", blog.key().as_ref(), &post.post_id.to_le_bytes()],
        bump,
        has_one = author
    )]
    pub post: Box<Account<'info, BlogPost>>,
    #[account(
        seeds = [b"blog", author.key().as_ref()],
        bump
    )]
    pub blog: Box<Account<'info, Blog>>,
    #[account(mut, constraint = author.key() == post.author @ ErrorCode::UnauthorizedUpdate)]
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeletePost<'info> {
    #[account(
        mut,
        close = author,
        seeds = [b"post", blog.key().as_ref(), &post.post_id.to_le_bytes()],
        bump,
        has_one = author
    )]
    pub post: Box<Account<'info, BlogPost>>,
    #[account(
        seeds = [b"blog", author.key().as_ref()],
        bump
    )]
    pub blog: Box<Account<'info, Blog>>,
    #[account(mut, constraint = author.key() == post.author @ ErrorCode::UnauthorizedDelete)]
    pub author: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Blog {
    pub authority: Pubkey,
    pub post_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct BlogPost {
    pub author: Pubkey,
    #[max_len(100)]
    pub title: String,
    #[max_len(2000)]    
    pub content: String,
    pub post_id: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Title is too long (max 100 characters)")]
    TitleTooLong,
    #[msg("Content is too long (max 1000 characters)")]
    ContentTooLong,
    #[msg("Title cannot be empty")]
    TitleEmpty,
    #[msg("Content cannot be empty")]
    ContentEmpty,
    #[msg("Only the author can update this post")]
    UnauthorizedUpdate,
    #[msg("Only the author can delete this post")]
    UnauthorizedDelete,
    #[msg("Math overflow detected")]
    MathOverflow,
}
