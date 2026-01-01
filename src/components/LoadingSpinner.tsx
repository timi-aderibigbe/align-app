import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'var(--color-bg)',
            fontSize: '1.2rem',
            color: 'var(--color-primary)'
        }}>
            <div style={{ animation: 'spin 2s linear infinite' }}>
                <Sparkles size={48} />
            </div>
            <p style={{ marginTop: '1rem', fontFamily: 'var(--font-display)' }}>Aligning...</p>
            <style>{`
        @keyframes spin { 
          100% { transform: rotate(360deg); } 
        }
      `}</style>
        </div>
    );
};
