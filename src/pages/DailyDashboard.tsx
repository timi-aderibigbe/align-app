import React, { useState } from 'react';
import { useStore } from '../context/store';
import { Plus, Target, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { Modal } from '../components/Modal';
import { DailyCheckInModal } from '../components/DailyCheckInModal';
import { OnboardingModal } from '../components/OnboardingModal';

export const DailyDashboard: React.FC = () => {
    const { tasks, addTask, toggleTask, goals, visions, userSettings } = useStore();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedGoalId, setSelectedGoalId] = useState<string>('');
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    React.useEffect(() => {
        if (userSettings && userSettings.hasSeenOnboarding === false) {
            const timer = setTimeout(() => setShowOnboarding(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [userSettings]);

    const today = format(new Date(), 'yyyy-MM-dd');
    const todayDisplay = format(new Date(), 'EEEE, MMMM do');
    const todaysTasks = tasks.filter(t => t.date === today);
    const completedCount = todaysTasks.filter(t => t.isCompleted).length;
    const progress = todaysTasks.length > 0 ? (completedCount / todaysTasks.length) * 100 : 0;

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask({
                title: newTaskTitle,
                date: today,
                goalId: selectedGoalId || undefined
            });
            setNewTaskTitle('');
            setSelectedGoalId('');
            setIsAddingTask(false);
        }
    };

    const getVisionColor = (visionId?: string) => {
        if (!visionId) return 'var(--color-primary)';
        const vision = visions.find(v => v.id === visionId);
        return vision ? vision.color : 'var(--color-primary)';
    };

    const getGoalTitle = (goalId?: string) => {
        if (!goalId) return null;
        return goals.find(g => g.id === goalId)?.title;
    };

    // Helper to get vision ID from goal ID
    const getVisionIdFromGoal = (goalId?: string) => {
        if (!goalId) return undefined;
        const goal = goals.find(g => g.id === goalId);
        return goal?.visionId;
    }

    return (
        <div className="dashboard">
            <header className="dash-header">
                <div>
                    <h1>{todayDisplay}</h1>
                    <p className="subtitle">
                        {todaysTasks.length === 0
                            ? "Ready to design your day?"
                            : `${completedCount} of ${todaysTasks.length} tasks completed`}
                    </p>
                </div>

                {todaysTasks.length > 0 && (
                    <div className="daily-progress">
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="progress-text">{Math.round(progress)}%</span>
                    </div>
                )}
            </header>

            <div className="todays-focus">
                {todaysTasks.length === 0 ? (
                    <div className="empty-state-dash">
                        <p>What are your 3 main priorities today?</p>
                        <button className="btn btn-primary" onClick={() => setIsAddingTask(true)}>
                            <Plus size={18} /> Plan My Day
                        </button>
                    </div>
                ) : (
                    <div className="task-list">
                        {todaysTasks.map(task => {
                            const visionId = task.visionId || getVisionIdFromGoal(task.goalId);
                            const accentColor = getVisionColor(visionId);

                            return (
                                <div
                                    key={task.id}
                                    className={`task-item ${task.isCompleted ? 'completed' : ''}`}
                                    onClick={() => toggleTask(task.id)}
                                    // @ts-ignore
                                    style={{ '--accent-color': accentColor }}
                                >
                                    <div className="task-checkbox">
                                        {task.isCompleted ? (
                                            <CheckCircle size={22} color={accentColor} fill={accentColor} />
                                        ) : (
                                            <Circle size={22} color="var(--color-text-secondary)" />
                                        )}
                                    </div>

                                    <div className="task-content">
                                        <span className="task-title">{task.title}</span>
                                        {task.goalId && (
                                            <div className="task-badge">
                                                <Target size={12} />
                                                <span>{getGoalTitle(task.goalId)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <div className="add-task-row">
                            <button className="btn-icon" onClick={() => setIsAddingTask(true)}>
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="daily-actions">
                <button className="btn btn-primary" onClick={() => setIsCheckInOpen(true)}>
                    Daily Check-in
                </button>
            </div>

            {isAddingTask && (
                <Modal isOpen={isAddingTask} onClose={() => setIsAddingTask(false)} title="Add New Task">
                    <form onSubmit={handleAddTask} className="add-task-form">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Sort out taxes..."
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            className="task-input-lg"
                        />

                        <div className="form-group">
                            <label>Link to Goal (Optional)</label>
                            <select
                                value={selectedGoalId}
                                onChange={e => setSelectedGoalId(e.target.value)}
                                className="goal-select"
                            >
                                <option value="">No specific goal</option>
                                {goals.filter(g => !g.isCompleted).map(goal => (
                                    <option key={goal.id} value={goal.id}>
                                        {goal.title}
                                    </option>
                                ))}
                            </select>
                            <p className="help-text">Linking tasks to goals builds momentum!</p>
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="btn btn-primary btn-full">Add to Today</button>
                        </div>
                    </form>
                </Modal>
            )}

            {isCheckInOpen && (
                <DailyCheckInModal
                    isOpen={isCheckInOpen}
                    onClose={() => setIsCheckInOpen(false)}
                />
            )}

            {showOnboarding && (
                <OnboardingModal
                    isOpen={showOnboarding}
                    onClose={() => setShowOnboarding(false)}
                />
            )}

            <style>{`
        .dashboard {
            padding: var(--spacing-md);
            max-width: 800px;
            margin: 0 auto;
        }
        .dash-header {
            margin-bottom: var(--spacing-xl);
        }
        .dash-header h1 {
            font-size: 1.8rem;
            margin-bottom: var(--spacing-xs);
        }
        .daily-progress {
            margin-top: var(--spacing-md);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .progress-bar-bg {
            flex: 1;
            height: 8px;
            background: var(--color-surface-hover);
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-bar-fill {
            height: 100%;
            background: var(--color-primary);
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        .progress-text {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--color-text-secondary);
        }
        
        .empty-state-dash {
            text-align: center;
            padding: var(--spacing-xl);
            background: var(--color-surface);
            border-radius: var(--radius-lg);
            border: 2px dashed var(--color-border);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-md);
        }

        .task-list {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
        }
        
        .task-item {
            background: var(--color-surface);
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            border-left: 4px solid var(--accent-color, var(--color-primary));
        }
        .task-item:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-sm);
        }
        .task-item.completed {
            opacity: 0.6;
            background: var(--color-bg);
        }
        .task-item.completed .task-title {
            text-decoration: line-through;
            color: var(--color-text-muted);
        }
        
        .task-checkbox {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .task-content {
            flex: 1;
        }
        .task-title {
            display: block;
            font-size: 1.05rem;
            margin-bottom: 4px;
            font-weight: 500;
        }
        .task-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.8rem;
            color: var(--color-text-secondary);
            background: var(--color-surface-hover);
            padding: 2px 8px;
            border-radius: 12px;
        }

        .add-task-row {
            display: flex;
            justify-content: center;
            margin-top: var(--spacing-md);
            gap: 12px;
        }
        .btn-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--color-text-secondary);
            transition: all 0.2s;
        }
        .btn-icon:hover {
            background: var(--color-primary);
            color: white;
            border-color: var(--color-primary);
        }

        .daily-actions {
            margin-top: var(--spacing-xl);
            display: flex;
            justify-content: center;
        }

        .add-task-form {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }
        .task-input-lg {
            width: 100%;
            padding: var(--spacing-md);
            font-size: 1.2rem;
            border: none;
            border-bottom: 2px solid var(--color-border);
            background: transparent;
            outline: none;
            color: var(--color-text-main);
        }
        .task-input-lg:focus {
            border-bottom-color: var(--color-primary);
        }
        .goal-select {
            width: 100%;
            padding: var(--spacing-sm);
            border-radius: var(--radius-sm);
            border: 1px solid var(--color-border);
            background: var(--color-bg);
            color: var(--color-text-main);
        }
        .btn-full {
            width: 100%;
        }
      `}</style>
        </div>
    );
};
