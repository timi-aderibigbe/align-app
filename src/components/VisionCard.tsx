import React from 'react';
import type { Vision } from '../types';
import { MoreHorizontal, Clock } from 'lucide-react';

interface VisionCardProps {
    vision: Vision;
    onClick: () => void;
}

export const VisionCard: React.FC<VisionCardProps> = ({ vision, onClick }) => {
    return (
        <div className="vision-card" onClick={onClick}>
            <div className="vision-image-container">
                {vision.imageUrl ? (
                    <img src={vision.imageUrl} alt={vision.title} className="vision-image" />
                ) : (
                    <div className="vision-placeholder" style={{ backgroundColor: vision.color || 'var(--color-primary-light)' }}>
                        <span style={{ fontSize: '3rem', opacity: 0.3 }}>✨</span>
                    </div>
                )}
                <div className="vision-overlay" />
            </div>

            <div className="vision-content">
                <div className="vision-header">
                    <span className="vision-timeframe">
                        <Clock size={12} /> {vision.timeframe}
                    </span>
                    <button className="vision-menu-btn" onClick={(e) => { e.stopPropagation(); /* Menu logic */ }}>
                        <MoreHorizontal size={16} />
                    </button>
                </div>
                <h3 className="vision-title">{vision.title}</h3>
                <p className="vision-description">{vision.description}</p>
            </div>

            <style>{`
        .vision-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: var(--color-surface);
          box-shadow: var(--shadow-md);
          cursor: pointer;
          transition: transform var(--transition-smooth), box-shadow var(--transition-smooth);
          height: 320px;
          display: flex;
          flex-direction: column;
        }

        .vision-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-float);
        }

        .vision-image-container {
          height: 60%;
          position: relative;
          background-color: var(--color-surface-hover);
        }

        .vision-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vision-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vision-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
          opacity: 0.6;
        }

        .vision-content {
          padding: var(--spacing-md);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .vision-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .vision-timeframe {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--color-surface-hover);
          padding: 2px 8px;
          border-radius: 12px;
        }

        .vision-menu-btn {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          padding: 4px;
          border-radius: 4px;
        }

        .vision-menu-btn:hover {
          background: var(--color-surface-hover);
          color: var(--color-text-main);
        }

        .vision-title {
          font-size: 1.125rem;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .vision-description {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};
