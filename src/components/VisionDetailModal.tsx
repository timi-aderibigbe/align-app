import React, { useState } from 'react';
import type { Vision } from '../types';
import { useStore } from '../context/store';
import { Modal } from './Modal';
import { Plus, Check, Trash2 } from 'lucide-react';

interface VisionDetailModalProps {
  vision: Vision | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VisionDetailModal: React.FC<VisionDetailModalProps> = ({ vision, isOpen, onClose }) => {
  const { goals, addGoal, updateGoal, deleteGoal, deleteVision } = useStore();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  if (!vision) return null;

  const visionGoals = goals.filter(g => g.visionId === vision.id);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle) return;

    addGoal({
      visionId: vision.id,
      title: newGoalTitle,
      deadline: newGoalDeadline || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      currentValue: 0,
      targetValue: 100, // Default to % based if not specified
      unit: '%'
    });

    setNewGoalTitle('');
    setNewGoalDeadline('');
    setIsAddingGoal(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={vision.title}>
      <div className="vision-detail">
        <div className="vision-hero" style={{ backgroundColor: vision.color }}>
          {/* Maybe show image here if available */}
          <div className="overlay-text">
            <p className="vision-quote">"{vision.description}"</p>
          </div>
          <button
            className="delete-vision-btn"
            onClick={() => {
              if (confirm('Delete this Vision? This cannot be undone.')) {
                deleteVision(vision.id);
                onClose();
              }
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="goals-section">
          <div className="section-header">
            <h4>Goals & Milestones</h4>
            <button className="btn btn-sm btn-ghost" onClick={() => setIsAddingGoal(true)}>
              <Plus size={16} /> Add Goal
            </button>
          </div>

          {isAddingGoal && (
            <form onSubmit={handleAddGoal} className="add-goal-form">
              <input
                autoFocus
                type="text"
                placeholder="What exactly will you achieve?"
                value={newGoalTitle}
                onChange={e => setNewGoalTitle(e.target.value)}
                className="goal-input"
              />
              <input
                type="date"
                value={newGoalDeadline}
                onChange={e => setNewGoalDeadline(e.target.value)}
                className="date-input"
              />
              <button type="submit" className="btn btn-sm btn-primary">Save</button>
            </form>
          )}

          <div className="goals-list">
            {visionGoals.length === 0 && !isAddingGoal && (
              <p className="empty-text">No goals set yet. Break this vision down!</p>
            )}

            {visionGoals.map(goal => (
              <div key={goal.id} className="goal-item">
                <div className="goal-content">
                  <div className="goal-top">
                    <span className={`goal-status ${goal.isCompleted ? 'completed' : ''}`}>
                      {goal.isCompleted ? <Check size={12} /> : null}
                    </span>
                    <h5 className={goal.isCompleted ? 'text-strike' : ''}>{goal.title}</h5>
                    <button className="delete-btn" onClick={() => deleteGoal(goal.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="goal-progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${goal.progress}%`, backgroundColor: vision.color }}
                    />
                  </div>
                  <div className="goal-meta">
                    <span>{goal.progress}% Complete</span>
                    <input
                      type="range"
                      min="0" max="100"
                      value={goal.progress}
                      onChange={(e) => updateGoal(goal.id, { progress: parseInt(e.target.value), isCompleted: parseInt(e.target.value) === 100 })}
                      className="progress-slider"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .vision-hero {
          padding: var(--spacing-lg);
          border-radius: 8px;
          color: white;
          margin-bottom: var(--spacing-lg);
        }
        .vision-quote {
          font-style: italic;
          opacity: 0.9;
        }
        .vision-hero {
            position: relative;
        }
        .delete-vision-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0,0,0,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .delete-vision-btn:hover {
            background: rgba(220, 38, 38, 0.8);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        .add-goal-form {
          display: flex;
          gap: 8px;
          margin-bottom: var(--spacing-md);
          background: var(--color-surface-hover);
          padding: 8px;
          border-radius: 8px;
        }
        .goal-input {
          flex: 1;
        }
        .goals-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .goal-item {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          padding: var(--spacing-md);
          border-radius: 8px;
        }
        .goal-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .goal-status {
          width: 18px;
          height: 18px;
          border: 2px solid var(--color-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .goal-status.completed {
          background-color: var(--color-success);
          border-color: var(--color-success);
          color: white;
        }
        .delete-btn {
          margin-left: auto;
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .goal-item:hover .delete-btn {
          opacity: 1;
        }
        .goal-progress-bar {
          height: 6px;
          background: var(--color-surface-hover);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .goal-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--color-text-secondary);
        }
        .progress-slider {
          width: 100px;
        }
        .text-strike {
          text-decoration: line-through;
          color: var(--color-text-muted);
        }
      `}</style>
    </Modal>
  );
};
