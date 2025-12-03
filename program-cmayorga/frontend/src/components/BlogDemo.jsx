import React, { useState } from 'react';

const BlogDemo = () => {
  const [posts, setPosts] = useState([
    {
      postId: 0,
      title: "Welcome to Solana Blog",
      content: "This is a demonstration of the blog UI. Connect your wallet to interact with the on-chain program.",
      timestamp: Date.now() / 1000
    }
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const newPost = {
      postId: posts.length,
      title: newTitle,
      content: newContent,
      timestamp: Date.now() / 1000
    };

    setPosts([...posts, newPost]);
    setNewTitle('');
    setNewContent('');
    setShowCreateForm(false);
  };

  const handleDeletePost = (postId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.postId !== postId));
    }
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    transition: 'all 0.2s ease'
  };

  const buttonPrimaryStyle = {
    backgroundColor: 'var(--accent-green)',
    color: '#000',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--bg-darker)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div style={cardStyle} className="mb-8">
        <div style={{
          backgroundColor: 'rgba(20, 241, 149, 0.08)',
          border: '1px solid rgba(20, 241, 149, 0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontWeight: '700', color: 'var(--accent-green)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
            About This dApp
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            This is a Solana blog dApp built by @cmayorga for Lesson 5 School of Solana requirements featuring:
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <li>PDA-based blog post storage</li>
            <li>On-chain create, update, and delete operations</li>
            <li>Comprehensive TypeScript tests</li>
            <li>Deployed on Solana Devnet</li>
          </ul>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          Blog Posts ({posts.length})
        </h2>
        
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            style={buttonPrimaryStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-green-hover)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent-green)'}
            className="mb-6"
          >
            Create New Post
          </button>
        ) : (
          <div style={{
            backgroundColor: 'var(--bg-darker)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Create New Post
            </h3>
            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Title (max 100 characters)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={100}
                  style={inputStyle}
                  placeholder="Enter post title..."
                  required
                />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {newTitle.length}/100 characters
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Content (max 1000 characters)
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  maxLength={1000}
                  rows={6}
                  style={{...inputStyle, resize: 'vertical'}}
                  placeholder="Write your blog post content..."
                  required
                />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {newContent.length}/1000 characters
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={buttonPrimaryStyle}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-green-hover)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent-green)'}
                >
                  Publish Post (Demo)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewTitle('');
                    setNewContent('');
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color)',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map((post) => (
            <div
              key={post.postId}
              style={{
                backgroundColor: 'var(--bg-darker)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-green)';
                e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.backgroundColor = 'var(--bg-darker)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {post.title}
                </h3>
                <button
                  onClick={() => handleDeletePost(post.postId)}
                  style={{
                    color: '#ff4444',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginBottom: '1rem', lineHeight: '1.6' }}>
                {post.content}
              </p>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                fontSize: '0.875rem', 
                color: 'var(--text-muted)' 
              }}>
                <span>Post #{post.postId}</span>
                <span>{new Date(post.timestamp * 1000).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(20, 241, 149, 0.05)',
        border: '1px solid rgba(20, 241, 149, 0.15)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h3 style={{ fontWeight: '700', color: 'var(--accent-green)', marginBottom: '1rem', fontSize: '1.1rem' }}>
          Program Instructions
        </h3>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '2' }}>
          <p><strong style={{ color: 'var(--text-primary)' }}>initialize_blog:</strong> Create a blog account for your wallet</p>
          <p><strong style={{ color: 'var(--text-primary)' }}>create_post:</strong> Add a new blog post (stored on-chain via PDA)</p>
          <p><strong style={{ color: 'var(--text-primary)' }}>update_post:</strong> Edit your existing posts</p>
          <p><strong style={{ color: 'var(--text-primary)' }}>delete_post:</strong> Remove a post and reclaim rent</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDemo;
