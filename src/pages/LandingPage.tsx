import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Calendar, ArrowRight, LayoutDashboard, BarChart2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="logo-container">
                    <Sparkles className="logo-icon" size={24} />
                    <span className="logo-text">Align</span>
                </div>
                <div className="nav-actions">
                    <button className="btn-text" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn-primary" onClick={() => navigate('/login')}>Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Align your daily actions with your <span className="highlight">Life's Vision</span>.
                    </h1>
                    <p className="hero-subtitle">
                        Most to-do lists are endless. Align helps you focus on what actually moves the needle towards your long-term goals.
                    </p>
                    <button className="btn-hero" onClick={() => navigate('/login')}>
                        Start Your Journey <ArrowRight size={20} />
                    </button>
                </div>
                <div className="hero-visual">
                    {/* Abstract Visual Representation */}
                    <div className="card-mockup card-1">
                        <div className="mockup-header"><Target size={16} /> Update Portfolio</div>
                        <div className="mockup-bar" style={{ width: '70%' }}></div>
                    </div>
                    <div className="card-mockup card-2">
                        <div className="mockup-header"><Calendar size={16} /> 30m Run</div>
                        <div className="mockup-bar" style={{ width: '100%' }}></div>
                    </div>
                    <div className="card-mockup card-3">
                        <div className="mockup-header"><Sparkles size={16} /> Vision: Health</div>
                        <div className="mockup-circle"></div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="features-section">
                <div className="feature-card">
                    <div className="icon-box"><Sparkles size={24} /></div>
                    <h3>Vision Board</h3>
                    <p>Define your North Star. Set high-level pillars for 1 year, 3 years, or life.</p>
                </div>
                <div className="feature-card">
                    <div className="icon-box"><Target size={24} /></div>
                    <h3>Goal Setting</h3>
                    <p>Break visions down into concrete milestones with deadlines and progress tracking.</p>
                </div>
                <div className="feature-card">
                    <div className="icon-box"><LayoutDashboard size={24} /></div>
                    <h3>Daily Focus</h3>
                    <p>A clutter-free dashboard for today's tasks. Only see what matters right now.</p>
                </div>
                <div className="feature-card">
                    <div className="icon-box"><BarChart2 size={24} /></div>
                    <h3>Momentum & Insights</h3>
                    <p>Track your consistency with heatmaps and visualize where your effort goes.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} Align. Built for focus.</p>
            </footer>

            <style>{`
        .landing-page {
          min-height: 100vh;
          background-color: var(--color-bg);
          color: var(--color-text-main);
          font-family: var(--font-header);
        }

        /* Nav */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 1.5rem;
        }
        .logo-icon { color: var(--color-primary); }
        .nav-actions { display: flex; gap: 16px; align-items: center; }

        /* Buttons */
        .btn-text {
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-weight: 600;
        }
        .btn-primary {
          background-color: var(--color-primary);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-hero {
          background-color: var(--color-text-main);
          color: var(--color-bg);
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 32px;
          transition: all 0.2s;
        }
        .btn-hero:hover {
          opacity: 0.9;
          gap: 16px;
        }

        /* Hero */
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 80px 24px;
          max-width: 1000px;
          margin: 0 auto;
          gap: 48px;
        }
        @media (min-width: 768px) {
          .hero-section {
            padding: 120px 24px;
          }
        }

        .hero-title {
          font-size: 3rem;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .hero-title .highlight {
          color: var(--color-primary);
          background: linear-gradient(120deg, rgba(var(--color-primary-rgb), 0.1) 0%, rgba(var(--color-primary-rgb), 0.1) 100%);
          background-repeat: no-repeat;
          background-size: 100% 40%;
          background-position: 0 90%;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--color-text-secondary);
          max-width: 600px;
          line-height: 1.6;
        }

        /* Visuals */
        .hero-visual {
          position: relative;
          height: 300px;
          width: 100%;
          max-width: 600px;
          margin-top: 40px;
        }
        .card-mockup {
          position: absolute;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 16px;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .card-1 {
          top: 0; left: 10%; width: 240px; transform: rotate(-6deg); z-index: 1;
        }
        .card-2 {
          top: 40px; right: 10%; width: 260px; transform: rotate(3deg); z-index: 2;
          border-color: var(--color-primary);
        }
        .card-3 {
          bottom: 20px; left: 30%; width: 200px; transform: rotate(-2deg); z-index: 3;
          background: var(--color-primary);
          color: white;
          border: none;
        }
        .mockup-header { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; }
        .mockup-bar { height: 8px; background: var(--color-bg); border-radius: 4px; opacity: 0.5; }
        .mockup-circle { width: 32px; height: 32px; border-radius: 50%; background: white; opacity: 0.2; }

        /* Features */
        .features-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 32px;
          padding: 80px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .feature-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .icon-box {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-surface);
          border-radius: 12px;
          color: var(--color-primary);
        }
        .feature-card h3 { font-size: 1.25rem; font-weight: 700; }
        .feature-card p { color: var(--color-text-secondary); line-height: 1.5; }

        /* Footer */
        .landing-footer {
          text-align: center;
          padding: 48px;
          color: var(--color-text-muted);
          border-top: 1px solid var(--color-border);
          margin-top: 40px;
        }
      `}</style>
        </div>
    );
};
