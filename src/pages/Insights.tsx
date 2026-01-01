import React from 'react';
import { useStore } from '../context/store';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { subDays, format, eachDayOfInterval } from 'date-fns';

const GoalProjection: React.FC<{ goals: any[] }> = ({ goals }) => {
    const [selectedGoalId, setSelectedGoalId] = React.useState<string>('');
    const [pace, setPace] = React.useState<number>(5); // % per week

    const activeGoals = goals.filter(g => !g.isCompleted);
    const selectedGoal = goals.find(g => g.id === selectedGoalId);

    React.useEffect(() => {
        if (activeGoals.length > 0 && !selectedGoalId) {
            setSelectedGoalId(activeGoals[0].id);
        }
    }, [activeGoals, selectedGoalId]);

    if (!selectedGoal) return <div className="empty-chart">No active goals to project.</div>;

    const remaining = 100 - selectedGoal.progress;
    const weeksToComplete = pace > 0 ? remaining / pace : 999;
    const projectedDate = new Date();
    projectedDate.setDate(projectedDate.getDate() + (weeksToComplete * 7));

    const deadline = new Date(selectedGoal.deadline);
    const today = new Date();
    const weeksToDeadline = Math.max(0, (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const requiredPace = weeksToDeadline > 0 ? remaining / weeksToDeadline : 100;

    // Generate Projection Data for Chart
    const data = [];
    let currentP = selectedGoal.progress;
    let week = 0;

    // existing progress point
    data.push({ week: 'Now', actual: selectedGoal.progress, projected: selectedGoal.progress, target: selectedGoal.progress });

    // Project forward 10 weeks or until complete
    while (currentP < 100 && week < 12) {
        week++;
        currentP += pace;
        const targetP = Math.min(100, selectedGoal.progress + (requiredPace * week));

        data.push({
            week: `+${week}w`,
            projected: Math.min(100, currentP),
            target: targetP
        });
    }

    return (
        <div className="projection-container">
            <div className="projection-controls">
                <label>Select Goal:</label>
                <select value={selectedGoalId} onChange={e => setSelectedGoalId(e.target.value)} className="goal-select">
                    {activeGoals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>

                <div className="pace-control">
                    <label>Projected Pace: <strong>{pace}% / week</strong></label>
                    <input type="range" min="1" max="50" value={pace} onChange={e => setPace(parseInt(e.target.value))} />
                    <div className="pace-meta">
                        <span>Required to hit deadline: {requiredPace.toFixed(1)}% / week</span>
                    </div>
                </div>

                <div className="projection-result">
                    <div className="result-item">
                        <span className="label">Current</span>
                        <span className="value">{selectedGoal.progress}%</span>
                    </div>
                    <div className="result-item">
                        <span className="label">Projected Finish</span>
                        <span className="value">{format(projectedDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="result-item">
                        <span className="label">Deadline</span>
                        <span className="value" style={{ color: projectedDate > deadline ? 'var(--color-error)' : 'var(--color-success)' }}>
                            {format(deadline, 'MMM d, yyyy')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="projection-chart">
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={data}>
                        <XAxis dataKey="week" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                        <Line type="monotone" dataKey="projected" stroke="var(--color-primary)" strokeWidth={3} name="Your Pace" dot={false} />
                        <Line type="monotone" dataKey="target" stroke="var(--color-text-muted)" strokeDasharray="5 5" strokeWidth={2} name="Ideal Path" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                <div className="chart-legend-simple">
                    <span style={{ color: 'var(--color-primary)' }}>— Your Pace</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>--- Ideal Path</span>
                </div>
            </div>

            <style>{`
          .projection-container {
             display: flex;
             gap: var(--spacing-xl);
             flex-direction: column;
          }
          @media (min-width: 768px) {
             .projection-container {
               flex-direction: row;
             }
          }
          .projection-controls {
             flex: 1;
             display: flex;
             flex-direction: column;
             gap: var(--spacing-lg);
          }
          .projection-chart {
             flex: 1.5;
             background: var(--color-bg);
             border-radius: 12px;
             padding: var(--spacing-md);
          }
          .projection-result {
             display: grid;
             grid-template-columns: 1fr 1fr;
             gap: var(--spacing-md);
             background: var(--color-bg);
             padding: var(--spacing-md);
             border-radius: 12px;
          }
          .result-item {
             display: flex;
             flex-direction: column;
          }
          .result-item .label {
             font-size: 0.75rem;
             color: var(--color-text-secondary);
          }
          .result-item .value {
             font-weight: 600;
             font-size: 0.95rem;
          }
          .pace-meta {
             font-size: 0.75rem;
             color: var(--color-text-muted);
             margin-top: 4px;
          }
          .chart-legend-simple {
             display: flex;
             gap: var(--spacing-md);
             justify-content: center;
             font-size: 0.8rem;
             margin-top: 8px;
          }
       `}</style>
        </div>
    );
};

export const Insights: React.FC = () => {
    const { tasks, logs, visions } = useStore();

    // 1. Weekly Momentum (Last 7 Days)
    const today = new Date();
    const last7Days = eachDayOfInterval({
        start: subDays(today, 6),
        end: today
    });

    const weeklyData = last7Days.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const completed = tasks.filter(t => t.date === dateStr && t.isCompleted).length;
        const log = logs.find(l => l.date === dateStr);
        return {
            day: format(date, 'EEE'),
            tasks: completed,
            energy: log?.energyLevel || 0,
            focus: log?.focusLevel || 0,
        };
    });

    // 2. Vision Focus Distribution (All time)
    const { goals } = useStore(); // Need goals to lookup visionId

    const tasksByVision = tasks
        .filter(t => t.isCompleted)
        .reduce((acc, task) => {
            // 1. Try direct visionId (unlikely in current schema)
            let vId = task.visionId;

            // 2. If not found, lookup via Goal
            if (!vId && task.goalId) {
                const goal = goals.find(g => g.id === task.goalId);
                if (goal) vId = goal.visionId;
            }

            if (vId) {
                acc[vId] = (acc[vId] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

    const pieData = Object.entries(tasksByVision).map(([visionId, count]) => {
        const vision = visions.find(v => v.id === visionId);
        return {
            name: vision?.title || 'Unknown',
            value: count,
            color: vision?.color || '#cbd5e1' // Default gray
        };
    });

    return (
        <div className="insights-page">
            <header className="insights-header">
                <h1>Insights & Patterns</h1>
                <p className="subtitle">Understanding your rhythm.</p>
            </header>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Weekly Momentum</h3>
                    <p className="chart-desc">Tasks completed over the last 7 days</p>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <XAxis dataKey="day" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                                    cursor={{ fill: 'var(--color-bg)' }}
                                />
                                <Bar dataKey="tasks" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Energy & Focus</h3>
                    <p className="chart-desc">Your daily reported levels (1-5)</p>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData}>
                                <XAxis dataKey="day" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis domain={[0, 5]} hide />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="energy" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B' }} name="Energy" />
                                <Line type="monotone" dataKey="focus" stroke="#6366F1" strokeWidth={3} dot={{ fill: '#6366F1' }} name="Focus" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Vision Distribution</h3>
                    <p className="chart-desc">Where your completed tasks align</p>
                    <div className="chart-container">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">No data yet</div>
                        )}
                    </div>
                    {pieData.length > 0 && (
                        <div className="chart-legend">
                            {pieData.map(d => (
                                <div key={d.name} className="legend-item">
                                    <span className="dot" style={{ backgroundColor: d.color }} />
                                    <span>{d.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Goal Trajectory Section */}
                <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                    <h3>Trajectory Projections</h3>
                    <p className="chart-desc">Estimate when you'll achieve your goals based on pace.</p>

                    <GoalProjection goals={useStore().goals} />
                </div>
            </div>

            <style>{`
        .insights-page {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .insights-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .chart-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-sm);
        }

        .chart-desc {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-lg);
        }

        .chart-container {
          height: 200px;
          width: 100%;
        }
        
        .empty-chart {
           height: 100%;
           display: flex;
           align-items: center;
           justify-content: center;
           color: var(--color-text-muted);
        }

        .chart-legend {
          margin-top: var(--spacing-md);
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.8rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
       `}</style>
        </div>
    );
};

export default Insights;
