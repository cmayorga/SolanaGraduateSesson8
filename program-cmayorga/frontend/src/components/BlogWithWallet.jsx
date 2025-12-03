import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey('HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9c8');

const BlogWithWallet = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const getProvider = () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return null;
    }
    return new AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
  };

  const getBlogPDA = (authority) => {
    const [blogPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('blog'), authority.toBuffer()],
      PROGRAM_ID
    );
    return blogPda;
  };

  const getPostPDA = (blogPda, postId) => {
    const [postPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('post'),
        blogPda.toBuffer(),
        new BN(postId).toArrayLike(Buffer, 'le', 8)
      ],
      PROGRAM_ID
    );
    return postPda;
  };

  const initializeBlog = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const provider = getProvider();
      const blogPda = getBlogPDA(wallet.publicKey);

      alert('Blog initialization would happen here. Deploy the program to Devnet first!');
      
    } catch (error) {
      console.error('Error initializing blog:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);
      
      alert('Post creation would happen here. Deploy the program to Devnet first!');
      
      const newPost = {
        postId: posts.length,
        title: newTitle,
        content: newContent,
        timestamp: Date.now() / 1000,
        author: wallet.publicKey.toString()
      };

      setPosts([...posts, newPost]);
      setNewTitle('');
      setNewContent('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setLoading(true);
      
      alert('Post deletion would happen here. Deploy the program to Devnet first!');
      
      setPosts(posts.filter(p => p.postId !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {!wallet.connected ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="font-bold text-yellow-900 mb-2">Wallet Not Connected</h3>
            <p className="text-yellow-800">
              Please connect your Phantom or Solflare wallet to interact with the blog dApp.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-green-900 mb-2">Wallet Connected</h3>
              <p className="text-green-800 text-sm font-mono">
                {wallet.publicKey?.toString()}
              </p>
              <button
                onClick={initializeBlog}
                disabled={loading}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Initialize Blog Account'}
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-4">Blog Posts ({posts.length})</h2>
            
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mb-6 disabled:bg-gray-400"
              >
                Create New Post
              </button>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Create New Post</h3>
                <form onSubmit={createPost}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Title (max 100 characters)
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      maxLength={100}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter post title..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">{newTitle.length}/100 characters</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Content (max 1000 characters)
                    </label>
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      maxLength={1000}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Write your blog post content..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">{newContent.length}/1000 characters</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                    >
                      {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewTitle('');
                        setNewContent('');
                      }}
                      disabled={loading}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 disabled:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No posts yet. Create your first post!
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.postId}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                      {post.author === wallet.publicKey?.toString() && (
                        <button
                          onClick={() => deletePost(post.postId)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-gray-400"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Post #{post.postId}</span>
                      <span>{new Date(post.timestamp * 1000).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="font-bold text-blue-900 mb-2">Program Instructions</h3>
        <div className="text-blue-800 space-y-2">
          <p><strong>initialize_blog:</strong> Create a blog account for your wallet</p>
          <p><strong>create_post:</strong> Add a new blog post (stored on-chain via PDA)</p>
          <p><strong>update_post:</strong> Edit your existing posts</p>
          <p><strong>delete_post:</strong> Remove a post and reclaim rent</p>
        </div>
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <p className="text-sm text-yellow-900">
            <strong>Note:</strong> The Anchor program needs to be deployed to Devnet for full functionality. 
            Currently showing wallet integration with demo interactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogWithWallet;
