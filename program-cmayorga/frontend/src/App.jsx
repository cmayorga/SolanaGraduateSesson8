import React from 'react';
import { WalletContextProvider } from './components/WalletContextProvider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import BlogDemo from './components/BlogDemo';
import BlogWithWallet from './components/BlogWithWallet';

function App() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
        <nav style={{ 
          backgroundColor: 'rgba(5, 5, 5, 0.8)', 
          borderBottom: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <div className="container mx-auto px-4 py-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--solana-green) 0%, var(--solana-cyan) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              Solana Blog dApp for Lesson5 School of Solana by @cmayorga
            </h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <WalletMultiButton style={{
                backgroundColor: 'var(--accent-green)',
                color: '#000',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: '600',
                fontSize: '0.95rem',
                padding: '0.7rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                height: 'auto'
              }} />
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-12">
          <BlogDemo />
        </main>
        
        <footer style={{ 
          backgroundColor: 'var(--bg-darker)', 
          borderTop: '1px solid var(--border-color)',
          marginTop: '4rem',
          padding: '2rem 0',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>Built with Anchor Framework on Solana Devnet</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Program ID: HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9c8
          </p>
        </footer>
      </div>
    </WalletContextProvider>
  );
}

export default App;
