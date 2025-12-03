

# Solana Blog dApp

A decentralized blog application built on Solana using the Anchor framework. This dApp allows users to create, update, and delete blog posts stored on-chain using Program Derived Addresses (PDAs).

Application forntend is running to test at: https://defire.finance/solanablog/

## Project Overview

This project provides a complete Solana dApp implementation with:
- **Anchor program** ready for deployment to Solana Devnet
- **PDA-based account storage** for blog posts with two-level derivation
- **Comprehensive TypeScript tests** covering all success and error scenarios
- **React frontend** with UI demonstration (wallet integration in progress)

## Current Implementation Status

✅ **Completed:**
- Anchor program with all instructions (initialize_blog, create_post, update_post, delete_post)
- PDA-based blog and post account structures
- Input validation and authorization checks
- Custom error types for all edge cases
- Comprehensive TypeScript test suite (happy and unhappy paths)
- React frontend with UI components
- Vite development server configured for port 5005
- Complete project documentation

🔄 **Pending:**
- Deploy program to Devnet (requires Solana CLI and wallet with SOL)
- Install wallet adapter packages (@solana/wallet-adapter-react, @solana/wallet-adapter-wallets)
- Wire frontend components to on-chain program via Anchor client
- Test end-to-end functionality on Devnet

## Architecture

### Smart Contract (Anchor Program)

**Program ID:** `HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9c8`

#### Account Structures

1. **Blog Account**
   - Authority: Pubkey of the blog owner
   - Post Count: Counter for total posts created
   - PDA Seeds: `["blog", authority_pubkey]`

2. **BlogPost Account**
   - Author: Pubkey of the post author
   - Title: String (max 100 characters)
   - Content: String (max 1000 characters)
   - Post ID: Unique identifier (u64)
   - Timestamp: Unix timestamp of creation/last update
   - PDA Seeds: `["post", blog_pubkey, post_id]`

#### Program Instructions

0. **Create_account**
   ```
   solana-keygen new
   solana config set --url https://api.devnet.solana.com
   solana config get
   ```

1. **initialize_blog**
   - Initializes a blog account for a user
   - Creates a PDA for the blog using the user's public key
   - Sets post count to 0

2. **create_post**
   - Creates a new blog post
   - Validates title and content length
   - Increments the blog's post count
   - Stores the post in a PDA derived from blog + post_id

3. **update_post**
   - Updates an existing blog post
   - Only the author can update their posts
   - Validates title and content length
   - Updates the timestamp

4. **delete_post**
   - Deletes a blog post and closes the account
   - Only the author can delete their posts
   - Returns rent to the author

#### Error Codes

- `TitleTooLong`: Title exceeds 100 characters
- `ContentTooLong`: Content exceeds 1000 characters
- `TitleEmpty`: Title is empty
- `ContentEmpty`: Content is empty
- `UnauthorizedUpdate`: Non-author attempting to update post
- `UnauthorizedDelete`: Non-author attempting to delete post

### PDA Design

The program uses a two-level PDA structure:

```
Blog PDA: ["blog", user_pubkey] -> Stores post count and authority
Post PDA: ["post", blog_pda, post_id] -> Stores individual blog posts
```

This design ensures:
- Each user has a unique blog account
- Posts are uniquely identified by blog + post ID
- Efficient lookups by author
- Predictable addresses for frontend queries

### Frontend

**Current State:** UI demonstration with local state management

**Tech Stack:**
- **React**: UI framework
- **Vite**: Build tool and dev server (port 5005)

**UI Components Implemented:**
- Blog post creation form with validation
- Post list display
- Delete post functionality
- Character count tracking (title: 100, content: 1000)
- Responsive layout

## Testing

Comprehensive TypeScript tests cover all program instructions:

### Happy Path Tests
- Initialize blog successfully
- Create first post
- Create multiple posts
- Update post content
- Delete post

### Unhappy Path Tests
- Cannot initialize blog twice
- Empty title validation
- Empty content validation
- Title too long (>100 chars)
- Unauthorized update attempt
- Unauthorized delete attempt

Run tests with:
```bash
anchor test
```

## Setup and Testing

### Prerequisites

- **Rust** 1.88.0+ (installed)
- **Solana CLI** 2.1.15+ (required for deployment)
- **Anchor Framework** 0.32.1 (installed via AVM)
- **Node.js** 20+ (installed)

### Build and Test the Program

1. **Build the Anchor program:**
   ```bash
   cd solana_blog
   anchor build
   ```

2. **Run comprehensive tests:**
   ```bash
   anchor test
   ```

   Or if you already deployed the program:
   ```
   anchor test --skip-deploy
   ```
   
   Tests cover:
   - Blog initialization
   - Post creation (with validation)
   - Post updates (with authorization)
   - Post deletion (with authorization)
   - Error handling (empty fields, too long, unauthorized)

### Running the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5005`

**Note:** Current frontend shows UI demonstration. To connect to the on-chain program, install wallet adapter packages and deploy the program first.

## Deployment to Devnet

### Step 1: Install Solana CLI

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
solana --version
```

### Step 2: Configure Wallet

```bash
# Set to Devnet
solana config set --url devnet

# Create or use existing wallet
solana-keygen new

# Airdrop SOL for deployment
solana airdrop 1
```

### Step 3: Deploy Program

```bash
anchor build
anchor deploy
```

### Step 4: Update Program ID

After deployment, update the program ID in:
- `Anchor.toml` (line 11)
- `programs/solana_blog/src/lib.rs` (line 3, declare_id!)
- `app/src/components/Blog.jsx` (line 9, PROGRAM_ID)

Then rebuild:
```bash
anchor build
anchor deploy
```

### Step 5: Complete Frontend Integration

```bash
cd frontend

# Install wallet adapter packages
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets @solana/wallet-adapter-base \
  @solana/web3.js @coral-xyz/anchor

# Update App.jsx to use wallet providers
# Update Blog.jsx to use Anchor client
npm run dev
```

## Project Structure

```
solana_blog/
├── programs/
│   └── solana_blog/
│       ├── src/
│       │   └── lib.rs          # Main program code
│       ├── Cargo.toml          # Rust dependencies
│       └── Xargo.toml
├── tests/
│   └── solana_blog.ts          # TypeScript tests
├── frontend/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Blog.jsx       # Main blog component
│   │   │   ├── CreatePost.jsx # Post creation form
│   │   │   ├── PostList.jsx   # List of posts
│   │   │   └── PostCard.jsx   # Individual post display
│   │   ├── App.jsx            # App with wallet providers
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Styles
│   ├── index.html
│   ├── vite.config.js         # Vite configuration
│   └── package.json
├── Anchor.toml                 # Anchor configuration
├── package.json                # Root package.json
├── tsconfig.json               # TypeScript configuration
└── PROJECT_DESCRIPTION.md      # This file
```

## Security Considerations

1. **Authorization Checks**: All update and delete operations verify that the signer is the post author
2. **PDA Validation**: All accounts use PDAs to prevent unauthorized account creation
3. **Input Validation**: Title and content length are validated on-chain
4. **Account Ownership**: has_one constraints ensure proper account relationships

## Development Notes

- Program uses Anchor 0.32.1 features including `InitSpace` derive macro
- Frontend configured for Devnet by default
- Wallet adapters support Phantom and Solflare wallets
- All timestamps are Unix timestamps (i64)
- PDAs are deterministic and can be recalculated by the frontend

## License

ISC

## Author
https://github.com/cmayorga
Built with Anchor Framework on Solana
