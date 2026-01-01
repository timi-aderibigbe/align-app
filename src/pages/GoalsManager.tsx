import React, { useState } from 'react';
import { useStore } from '../context/store';
import { Calendar, Trash2 } from 'lucide-react';

export const GoalsManager: React.FC = () => {
  const { goals, visions, updateGoal, deleteGoal } = useStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const filteredGoals = goals.filter(g => {
    if (filter === 'active') return !g.isCompleted;
    if (filter === 'completed') return g.isCompleted;
    return true;
  });

  const getVisionTitle = (visionId: string) => {
    return visions.find(v => v.id === visionId)?.title || 'Unknown Vision';
  };

  const getVisionColor = (visionId: string) => {
    return visions.find(v => v.id === visionId)?.color || 'var(--color-primary)';
  };

  return (
    <div className="goals-page">
      <div className="page-header">
        <div>
          <h2>Goals System</h2>
          <p className="subtitle">Track your milestones across all visions.</p>
        </div>
        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
        </div>
      </div>

      <div className="goals-grid">
        {filteredGoals.length === 0 && (
          <div className="empty-state">
            <p>No goals found. Go to your Vision Board to set new goals!</p>
          </div>
        )}

        {filteredGoals.map(goal => (
          <div key={goal.id} className="goal-card">
            <div className="goal-card-header">
              <span
                className="vision-tag"
                style={{ backgroundColor: getVisionColor(goal.visionId) + '20', color: getVisionColor(goal.visionId) }}
              >
                {getVisionTitle(goal.visionId)}
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className={`status-badge ${goal.isCompleted ? 'completed' : 'active'}`}>
                  {goal.isCompleted ? 'Done' : 'In Progress'}
                </span>
                <button
                  className="delete-icon-btn"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this goal?')) {
                      deleteGoal(goal.id);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className={`goal-title ${goal.isCompleted ? 'strike' : ''}`}>{goal.title}</h3>

            <div className="goal-meta">
              <div className="meta-item">
                <Calendar size={14} />
                <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-labels">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${goal.progress}%`, backgroundColor: getVisionColor(goal.visionId) }}
                />
              </div>
              <input
                type="range"
                className="goal-slider"
                min="0" max="100"
                value={goal.progress}
                onChange={(e) => updateGoal(goal.id, { progress: Number(e.target.value), isCompleted: Number(e.target.value) === 100 })}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .goals-page {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
        }

        .filter-tabs {
          display: flex;
          background: var(--color-surface);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }

        .tab {
          padding: 8px 16px;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: var(--color-bg);
          color: var(--color-text-main);
          box-shadow: var(--shadow-sm);
          font-weight: 500;
        }

        .goals-grid {
          display: grid;
          gap: var(--spacing-md);
        }

        .goal-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: var(--spacing-lg);
          transition: transform 0.2s;
        }

        .goal-card:hover {
          border-color: var(--color-primary-light);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .goal-card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--spacing-sm);
        }

        .vision-tag {
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        .status-badge {
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 12px;
          background: var(--color-surface-hover);
          color: var(--color-text-secondary);
        }

        .status-badge.completed {
          background: var(--color-success);
          color: white;
        }

        .goal-title {
          font-size: 1.1rem;
          margin-bottom: var(--spacing-md);
        }

        .goal-title.strike {
          text-decoration: line-through;
          color: var(--color-text-muted);
        }

        .goal-meta {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }

        .progress-bar-bg {
          height: 8px;
          background: var(--color-surface-hover);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .goal-slider {
          width: 100%;
          margin-top: 4px;
          accent-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
};

export default GoalsManager;
