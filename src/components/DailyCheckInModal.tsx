import React, { useState } from 'react';
import { useStore } from '../context/store';
import { Modal } from './Modal';
import type { DayLog } from '../types';
import { format } from 'date-fns';

interface DailyCheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({ isOpen, onClose }) => {
    const { addLog, tasks } = useStore();
    const today = format(new Date(), 'yyyy-MM-dd');

    const [energy, setEnergy] = useState(3);
    const [focus, setFocus] = useState(3);
    const [progressRating, setProgressRating] = useState<'Yes' | 'Maybe' | 'No'>('Yes');
    const [notes, setNotes] = useState('');

    const todayTasks = tasks.filter(t => t.date === today && t.isCompleted).length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const log: DayLog = {
            date: today,
            energyLevel: energy,
            focusLevel: focus,
            progressRating: progressRating,
            notes: notes,
            completedTaskCount: todayTasks
        };

        addLog(log);
        onClose();
    };

    const getEmoji = (val: number) => {
        if (val <= 1) return '😫';
        if (val === 2) return '😕';
        if (val === 3) return '😐';
        if (val === 4) return '🙂';
        return '🤩';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Evening Reflection">
            <form onSubmit={handleSubmit} className="checkin-form">
                <p className="checkin-intro">Take a moment to close your day. You completed {todayTasks} tasks.</p>

                <div className="rating-group">
                    <label>How was your energy? {getEmoji(energy)}</label>
                    <input
                        type="range" min="1" max="5"
                        value={energy}
                        onChange={e => setEnergy(parseInt(e.target.value))}
                        className="slider energy-slider"
                    />
                </div>

                <div className="rating-group">
                    <label>How was your focus?</label>
                    <input
                        type="range" min="1" max="5"
                        value={focus}
                        onChange={e => setFocus(parseInt(e.target.value))}
                        className="slider focus-slider"
                    />
                </div>

                <div className="rating-group">
                    <label>Did you make meaningful progress?</label>
                    <div className="radio-group">
                        {['Yes', 'Maybe', 'No'].map(opt => (
                            <button
                                key={opt}
                                type="button"
                                className={`radio-btn ${progressRating === opt ? 'selected' : ''}`}
                                onClick={() => setProgressRating(opt as any)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Notes / Journal</label>
                    <textarea
                        placeholder="What went well? What did you learn?"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div>

                <div className="modal-actions">
                    <button type="submit" className="btn btn-primary btn-full">Save Day</button>
                </div>
            </form>

            <style>{`
        .checkin-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        .checkin-intro {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }
        .rating-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .slider {
          width: 100%;
          accent-color: var(--color-primary);
        }
        .radio-group {
          display: flex;
          gap: 8px;
        }
        .radio-btn {
          flex: 1;
          padding: 8px;
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          border-radius: 8px;
          color: var(--color-text-secondary);
        }
        .radio-btn.selected {
          background: var(--color-primary-light);
          border-color: var(--color-primary);
          color: var(--color-primary);
          font-weight: 500;
        }
      `}</style>
        </Modal>
    );
};
