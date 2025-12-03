import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaBlog } from "../target/types/solana_blog";
import { expect } from "chai";

describe("solana_blog", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaBlog as Program<SolanaBlog>;
  const authority = provider.wallet as anchor.Wallet;

  let blogPda: anchor.web3.PublicKey;
  let blogBump: number;
  let post1Pda: anchor.web3.PublicKey;
  let post2Pda: anchor.web3.PublicKey;

  before(async () => {
    [blogPda, blogBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("blog"), authority.publicKey.toBuffer()],
      program.programId
    );
  });

  describe("initialize_blog", () => {
    it("should successfully initialize a blog", async () => {
      const tx = await program.methods
        .initializeBlog()
        .accountsPartial({
          blog: blogPda,
          authority: authority.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const blogAccount = await program.account.blog.fetch(blogPda);
      expect(blogAccount.authority.toString()).to.equal(
        authority.publicKey.toString()
      );
      expect(blogAccount.postCount.toNumber()).to.equal(0);
      console.log("Blog initialized successfully:", tx);
    });

    it("should fail to initialize blog twice", async () => {
      try {
        await program.methods
          .initializeBlog()
          .accountsPartial({
            blog: blogPda,
            authority: authority.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).to.exist;
        console.log("Expected error: Cannot initialize blog twice");
      }
    });
  });

  describe("create_post", () => {
    it("should successfully create a blog post", async () => {
      const postCount = 0;
      [post1Pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("post"),
          blogPda.toBuffer(),
          new anchor.BN(postCount).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const title = "My First Post";
      const content = "This is the content of my first blog post on Solana!";

      const tx = await program.methods
        .createPost(title, content)
        .accountsPartial({
          blog: blogPda,
          post: post1Pda,
          authority: authority.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const postAccount = await program.account.blogPost.fetch(post1Pda);
      expect(postAccount.author.toString()).to.equal(
        authority.publicKey.toString()
      );
      expect(postAccount.title).to.equal(title);
      expect(postAccount.content).to.equal(content);
      expect(postAccount.postId.toNumber()).to.equal(0);
      expect(postAccount.timestamp.toNumber()).to.be.greaterThan(0);

      const blogAccount = await program.account.blog.fetch(blogPda);
      expect(blogAccount.postCount.toNumber()).to.equal(1);

      console.log("Post created successfully:", tx);
    });

    it("should successfully create a second blog post", async () => {
      const postCount = 1;
      [post2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("post"),
          blogPda.toBuffer(),
          new anchor.BN(postCount).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const title = "Second Post";
      const content = "This is my second blog post!";

      const tx = await program.methods
        .createPost(title, content)
        .accountsPartial({
          blog: blogPda,
          post: post2Pda,
          authority: authority.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const postAccount = await program.account.blogPost.fetch(post2Pda);
      expect(postAccount.postId.toNumber()).to.equal(1);

      const blogAccount = await program.account.blog.fetch(blogPda);
      expect(blogAccount.postCount.toNumber()).to.equal(2);

      console.log("Second post created successfully:", tx);
    });

    it("should fail with empty title", async () => {
      const postCount = 2;
      const [post3Pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("post"),
          blogPda.toBuffer(),
          new anchor.BN(postCount).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      try {
        await program.methods
          .createPost("", "Some content")
          .accountsPartial({
            blog: blogPda,
            post: post3Pda,
            authority: authority.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.error.errorMessage).to.include("Title cannot be empty");
        console.log("Expected error: Title cannot be empty");
      }
    });

    it("should fail with empty content", async () => {
      const postCount = 2;
      const [post3Pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("post"),
          blogPda.toBuffer(),
          new anchor.BN(postCount).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      try {
        await program.methods
          .createPost("Valid Title", "")
          .accountsPartial({
            blog: blogPda,
            post: post3Pda,
            authority: authority.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.error.errorMessage).to.include("Content cannot be empty");
        console.log("Expected error: Content cannot be empty");
      }
    });

    it("should fail with title too long", async () => {
      const postCount = 2;
      const [post3Pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("post"),
          blogPda.toBuffer(),
          new anchor.BN(postCount).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const longTitle = "a".repeat(101);

      try {
        await program.methods
          .createPost(longTitle, "Valid content")
          .accountsPartial({
            blog: blogPda,
            post: post3Pda,
            authority: authority.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.error.errorMessage).to.include("Title is too long");
        console.log("Expected error: Title is too long");
      }
    });
  });

  describe("update_post", () => {
    it("should successfully update a blog post", async () => {
      const newTitle = "Updated First Post";
      const newContent = "This content has been updated!";

      const tx = await program.methods
        .updatePost(newTitle, newContent)
        .accountsPartial({
          post: post1Pda,
          blog: blogPda,
          author: authority.publicKey,
        })
        .rpc();

      const postAccount = await program.account.blogPost.fetch(post1Pda);
      expect(postAccount.title).to.equal(newTitle);
      expect(postAccount.content).to.equal(newContent);

      console.log("Post updated successfully:", tx);
    });

    it("should fail to update post with empty title", async () => {
      try {
        await program.methods
          .updatePost("", "Some content")
          .accountsPartial({
            post: post1Pda,
            blog: blogPda,
            author: authority.publicKey,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.error.errorMessage).to.include("Title cannot be empty");
        console.log("Expected error: Title cannot be empty on update");
      }
    });

    it("should fail when unauthorized user tries to update", async () => {
      const unauthorizedUser = anchor.web3.Keypair.generate();

      const airdropSig = await provider.connection.requestAirdrop(
        unauthorizedUser.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      try {
        await program.methods
          .updatePost("Hacked Title", "Hacked Content")
          .accountsPartial({
            post: post1Pda,
            blog: blogPda,
            author: unauthorizedUser.publicKey,
          })
          .signers([unauthorizedUser])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error).to.exist;
        console.log("Expected error: Unauthorized user cannot update post");
      }
    });
  });

  describe("delete_post", () => {
    it("should fail when unauthorized user tries to delete", async () => {
      const unauthorizedUser = anchor.web3.Keypair.generate();

      const airdropSig = await provider.connection.requestAirdrop(
        unauthorizedUser.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      try {
        await program.methods
          .deletePost()
          .accountsPartial({
            post: post2Pda,
            blog: blogPda,
            author: unauthorizedUser.publicKey,
          })
          .signers([unauthorizedUser])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error).to.exist;
        console.log("Expected error: Unauthorized user cannot delete post");
      }
    });

    it("should successfully delete a blog post", async () => {
      const tx = await program.methods
        .deletePost()
        .accountsPartial({
          post: post2Pda,
          blog: blogPda,
          author: authority.publicKey,
        })
        .rpc();

      try {
        await program.account.blogPost.fetch(post2Pda);
        expect.fail("Post should have been deleted");
      } catch (error) {
        expect(error).to.exist;
        console.log("Post deleted successfully:", tx);
      }
    });
  });
});
