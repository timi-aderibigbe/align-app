import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader, CheckCircle, AlertCircle, ArrowLeft, Target } from 'lucide-react';

export const Login: React.FC = () => {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, user } = useAuth();
    const navigate = useNavigate();

    const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    React.useEffect(() => {
        if (user) navigate('/app/dashboard');
    }, [user, navigate]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (view === 'signup') {
                const { error, data } = await signUpWithEmail(email, password);
                if (error) throw error;
                if (data.user && !data.session) {
                    setMessage({ type: 'success', text: 'Registration successful! Check your email to confirm your account.' });
                } else {
                    navigate('/app/dashboard');
                }
            } else if (view === 'login') {
                const { error } = await signInWithEmail(email, password);
                if (error) throw error;
                // useEffect will handle navigation
            } else if (view === 'forgot') {
                const { error } = await resetPassword(email);
                if (error) throw error;
                setMessage({ type: 'success', text: 'Password reset link sent to your email.' });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Authentication failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: '420px', position: 'relative' }}>

                {view === 'forgot' && (
                    <button
                        onClick={() => { setView('login'); setMessage(null); }}
                        style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--color-surface-hover)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Target size={30} color="var(--color-primary)" />
                    </div>
                    <h1 style={{ marginBottom: '0.5rem' }}>
                        {view === 'signup' ? 'Create Account' : (view === 'forgot' ? 'Reset Password' : 'Welcome to Align')}
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        {view === 'forgot' ? 'Enter your email to receive a reset link.' : 'Sync your visions and goals across devices.'}
                    </p>
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: message.type === 'error' ? '#ef4444' : '#22c55e',
                        border: `1px solid ${message.type === 'error' ? '#ef4444' : '#22c55e'}`,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-surface)',
                                color: 'var(--color-text-main)'
                            }}
                            placeholder="you@example.com"
                        />
                    </div>

                    {view !== 'forgot' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
                                {view === 'login' && (
                                    <button
                                        type="button"
                                        onClick={() => { setView('forgot'); setMessage(null); }}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.85rem', cursor: 'pointer' }}
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-surface)',
                                    color: 'var(--color-text-main)'
                                }}
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                    >
                        {loading ? <Loader className="spin" size={20} /> : (view === 'signup' ? 'Sign Up' : (view === 'forgot' ? 'Send Reset Link' : 'Log In'))}
                    </button>
                </form>

                {view !== 'forgot' && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--color-text-secondary)' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
                            <span style={{ padding: '0 1rem', fontSize: '0.8rem' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
                        </div>

                        <button
                            className="btn"
                            onClick={signInWithGoogle}
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-surface)'
                            }}
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" style={{ width: '18px', marginRight: '8px' }} />
                            Continue with Google
                        </button>

                        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                            {view === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setMessage(null); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-primary)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    marginLeft: '0.5rem'
                                }}
                            >
                                {view === 'signup' ? 'Log In' : 'Sign Up'}
                            </button>
                        </p>
                    </>
                )}

                <style>{`
                    .spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        </div>
    );
};
