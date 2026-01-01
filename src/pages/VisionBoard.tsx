import React, { useState } from 'react';
import { useStore } from '../context/store';
import { VisionCard } from '../components/VisionCard';
import { Modal } from '../components/Modal';
import { Plus } from 'lucide-react';
import type { Vision, Timeframe } from '../types';
import { VisionDetailModal } from '../components/VisionDetailModal';

export const VisionBoard: React.FC = () => {
    const { visions, addVision } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVision, setSelectedVision] = useState<Vision | null>(null);
    const [newVisionData, setNewVisionData] = useState<Partial<Vision>>({
        title: '',
        description: '',
        timeframe: '1 year',
        color: '#D97757'
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVisionData.title) return;

        addVision({
            title: newVisionData.title,
            description: newVisionData.description || '',
            timeframe: (newVisionData.timeframe as Timeframe) || '1 year',
            imageUrl: newVisionData.imageUrl,
            color: newVisionData.color
        });

        setIsModalOpen(false);
        setNewVisionData({ title: '', description: '', timeframe: '1 year', color: '#D97757', imageUrl: '' });
    };

    return (
        <div className="vision-board">
            <header className="page-header">
                <div>
                    <h2>Vision Board</h2>
                    <p className="subtitle">Focus on your long-term dreams.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> New Vision
                </button>
            </header>

            <div className="vision-grid">
                {visions.map(vision => (
                    <VisionCard
                        key={vision.id}
                        vision={vision}
                        onClick={() => setSelectedVision(vision)}
                    />
                ))}

                {visions.length === 0 && (
                    <div className="empty-state">
                        <p>You haven't defined any visions yet.</p>
                        <button className="btn btn-ghost" onClick={() => setIsModalOpen(true)}>
                            Get Started
                        </button>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Vision">
                <form onSubmit={handleCreate} className="vision-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. Financial Freedom"
                            value={newVisionData.title}
                            onChange={e => setNewVisionData({ ...newVisionData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (What does this look like?)</label>
                        <textarea
                            placeholder="Describe your vision in detail..."
                            value={newVisionData.description}
                            onChange={e => setNewVisionData({ ...newVisionData, description: e.target.value })}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Timeframe</label>
                            <select
                                value={newVisionData.timeframe}
                                onChange={e => setNewVisionData({ ...newVisionData, timeframe: e.target.value as Timeframe })}
                            >
                                <option value="6 months">6 months</option>
                                <option value="1 year">1 year</option>
                                <option value="3 years">3 years</option>
                                <option value="Life">Lifetime</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Color</label>
                            <div className="color-picker-simple">
                                {/* Simple color swatches */}
                                {['#D97757', '#E8C39E', '#7FB069', '#3D2924', '#F2A541'].map(c => (
                                    <div
                                        key={c}
                                        className={`color-swatch ${newVisionData.color === c ? 'selected' : ''}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setNewVisionData({ ...newVisionData, color: c })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image URL (Optional)</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={newVisionData.imageUrl || ''}
                            onChange={e => setNewVisionData({ ...newVisionData, imageUrl: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Vision</button>
                    </div>
                </form>
            </Modal>

            <VisionDetailModal
                vision={selectedVision}
                isOpen={!!selectedVision}
                onClose={() => setSelectedVision(null)}
            />

            <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-2xl);
        }

        .subtitle {
          color: var(--color-text-secondary);
        }

        .vision-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--spacing-2xl);
          background: var(--color-surface);
          border-radius: 12px;
          border: 1px dashed var(--color-border);
          color: var(--color-text-secondary);
        }

        .vision-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .form-row {
          display: flex;
          gap: var(--spacing-md);
        }

        .form-row .form-group {
          flex: 1;
        }

        label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        input, textarea, select {
          padding: 0.625rem;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          color: var(--color-text-main);
          font-family: inherit;
          transition: border-color var(--transition-fast);
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .color-picker-simple {
          display: flex;
          gap: 8px;
          align-items: center;
          height: 38px; /* Match input height */
        }

        .color-swatch {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: transform 0.1s;
        }

        .color-swatch:hover {
          transform: scale(1.1);
        }

        .color-swatch.selected {
          border-color: var(--color-text-main);
          transform: scale(1.1);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
        }
      `}</style>
        </div>
    );
};

export default VisionBoard; // Default export for lazy loading/import
