import React from 'react';
import { useStore } from '../context/store';
import { format, eachDayOfInterval, subDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Flame } from 'lucide-react';

export const MomentumCalendar: React.FC = () => {
    const { tasks, logs } = useStore();

    // Generate last 365 days or so for the view
    const today = new Date();
    // User asked for "momentum calendar", usually a heatmap.
    // Let's do a GitHub-style Contribution Graph but vertical or bigger cells?
    // "Beautiful calendar view where each day is a cell"
    // Let's do a standard Month view for current month? Or a scrolling heatmap.
    // "Days glow with intensity"

    // Let's do a standard Month View but enhanced.
    const calendarStart = startOfWeek(subDays(today, 28)); // roughly last month
    const calendarEnd = endOfWeek(today);

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const getDayIntensity = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayTasks = tasks.filter(t => t.date === dateStr && t.isCompleted);
        const dayLog = logs.find(l => l.date === dateStr);

        // Calculate score 0-4
        let score = 0;
        if (dayTasks.length > 0) score += 1;
        if (dayTasks.length > 2) score += 1;
        if (dayLog) score += 1;
        if (dayLog?.energyLevel && dayLog.energyLevel > 3) score += 1;

        return Math.min(score, 4);
    };

    const getStreak = () => {
        // Calculate current streak
        let streak = 0;
        let d = today;
        while (true) {
            const dateStr = format(d, 'yyyy-MM-dd');
            const hasActivity = tasks.some(t => t.date === dateStr && t.isCompleted) || logs.some(l => l.date === dateStr);
            if (hasActivity) {
                streak++;
                d = subDays(d, 1);
            } else {
                if (!isSameDay(d, today)) break; // If today has no activity yet, don't break streak, just don't count it? 
                // Actually usually strict streaks require yesterday.
                d = subDays(d, 1); // check yesterday
            }
            if (streak > 365) break;
        }
        return streak;
    };

    const streak = getStreak();

    return (
        <div className="calendar-page">
            <div className="calendar-header">
                <div>
                    <h2>Momentum</h2>
                    <p className="subtitle">Visualizing your consistency.</p>
                </div>
                <div className="streak-counter">
                    <div className="streak-icon">
                        <Flame size={24} fill="var(--color-primary)" color="var(--color-primary)" />
                    </div>
                    <div className="streak-info">
                        <span className="streak-num">{streak} Day Streak</span>
                        <span className="streak-label">Keep it burning!</span>
                    </div>
                </div>
            </div>

            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="day-header">{day}</div>
                ))}

                {days.map(day => {
                    const intensity = getDayIntensity(day);
                    const isTodayVal = isSameDay(day, today);

                    return (
                        <div
                            key={day.toISOString()}
                            className={`day-cell intensity-${intensity} ${isTodayVal ? 'today' : ''}`}
                        >
                            <span className="day-num">{format(day, 'd')}</span>
                            {/* Could show dots for tasks */}
                        </div>
                    );
                })}
            </div>

            <div className="legend">
                <span>Less</span>
                <div className="legend-squares">
                    <div className="day-cell intensity-0 sm" />
                    <div className="day-cell intensity-1 sm" />
                    <div className="day-cell intensity-2 sm" />
                    <div className="day-cell intensity-3 sm" />
                    <div className="day-cell intensity-4 sm" />
                </div>
                <span>More</span>
            </div>

            <style>{`
        .calendar-page {
          max-width: 800px;
          margin: 0 auto;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
        }

        .streak-counter {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          background: var(--color-surface);
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: 12px;
          border: 1px solid var(--color-primary-light);
          box-shadow: var(--shadow-sm);
        }

        .streak-num {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
          display: block;
        }

        .streak-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .day-header {
          text-align: center;
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          padding-bottom: 8px;
          font-weight: 500;
        }

        .day-cell {
          aspect-ratio: 1;
          background: var(--color-surface);
          border-radius: 8px;
          border: 1px solid var(--color-border);
          position: relative;
          padding: 8px;
          transition: all 0.2s;
        }

        .day-cell:hover {
          transform: scale(1.05);
          z-index: 1;
          box-shadow: var(--shadow-md);
        }

        .day-num {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .today {
          border-color: var(--color-text-main);
          border-width: 2px;
        }

        .intensity-0 { background: var(--color-surface); }
        .intensity-1 { background: #FCECE8; border-color: #FACdc5; }
        .intensity-2 { background: #fab5a0; border-color: #f79d80; }
        .intensity-3 { background: #e68d71; border-color: #D97757; color: white !important; } 
        .intensity-4 { background: #D97757; border-color: #bf5b3b; color: white !important; }

        .intensity-3 .day-num, .intensity-4 .day-num {
          color: rgba(255,255,255,0.9);
        }

        .legend {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-top: var(--spacing-lg);
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .legend-squares {
          display: flex;
          gap: 4px;
        }

        .day-cell.sm {
          width: 20px;
          height: 20px;
          padding: 0;
          border-radius: 4px;
        }
      `}</style>
        </div>
    );
};

export default MomentumCalendar;
