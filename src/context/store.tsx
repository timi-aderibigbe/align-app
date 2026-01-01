import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import type { AppState, Vision, Goal, Task, DayLog } from '../types';

interface AppContextType extends AppState {
    addVision: (vision: Omit<Vision, 'id' | 'order'>) => void;
    updateVision: (id: string, updates: Partial<Vision>) => void;
    deleteVision: (id: string) => void;
    reorderVisions: (newOrder: Vision[]) => void;

    addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'isCompleted'>) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;

    addTask: (task: Omit<Task, 'id' | 'isCompleted' | 'order'>) => void;
    toggleTask: (id: string) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;

    addLog: (log: DayLog) => void;

    updateSettings: (settings: Partial<AppState['userSettings']>) => void;
    resetData: () => void;
}

const StoreContext = createContext<AppContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    // Core Data State
    const [visions, setVisions] = useState<Vision[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [logs, setLogs] = useState<DayLog[]>([]);

    // Settings always track local storage for device preference
    const defaultSettings: AppState['userSettings'] = {
        theme: 'light',
        name: 'User',
        hasSeenOnboarding: false
    };
    const [userSettings, setUserSettings] = useLocalStorage<AppState['userSettings']>('align_settings', defaultSettings);

    // Load Data Effect
    useEffect(() => {
        const loadData = async () => {
            if (user && supabase) {
                // Cloud Mode: Fetch and Map from Supabase (snake_case -> camelCase)

                const { data: vData } = await supabase.from('visions').select('*').order('order', { ascending: true });
                if (vData) setVisions(vData as Vision[]);

                const { data: gData } = await supabase.from('goals').select('*');
                if (gData) {
                    setGoals(gData.map((g: any) => ({
                        id: g.id,
                        visionId: g.vision_id,
                        title: g.title,
                        deadline: g.deadline,
                        progress: g.progress,
                        isCompleted: g.is_completed // Map back
                    })));
                }

                const { data: tData } = await supabase.from('tasks').select('*');
                if (tData) {
                    setTasks(tData.map((t: any) => ({
                        id: t.id,
                        goalId: t.goal_id,
                        title: t.title,
                        isCompleted: t.is_completed,
                        order: t.order,
                        date: t.date // Assuming date matches
                    })));
                }

                const { data: lData } = await supabase.from('day_logs').select('*');
                if (lData) setLogs(lData as DayLog[]);

            } else {
                // Guest Mode: Load from Local Storage
                setVisions(JSON.parse(localStorage.getItem('align_visions') || '[]'));
                setGoals(JSON.parse(localStorage.getItem('align_goals') || '[]'));
                setTasks(JSON.parse(localStorage.getItem('align_tasks') || '[]'));
                setLogs(JSON.parse(localStorage.getItem('align_logs') || '[]'));
            }
        };
        loadData();
    }, [user]);

    // Save Data Effect (Guest Mode Only)
    useEffect(() => {
        if (!user) {
            localStorage.setItem('align_visions', JSON.stringify(visions));
            localStorage.setItem('align_goals', JSON.stringify(goals));
            localStorage.setItem('align_tasks', JSON.stringify(tasks));
            localStorage.setItem('align_logs', JSON.stringify(logs));
        }
    }, [visions, goals, tasks, logs, user]);

    // Apply Theme
    useEffect(() => {
        if (userSettings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [userSettings.theme]);

    const updateSettings = (settings: Partial<AppState['userSettings']>) => {
        setUserSettings({ ...userSettings, ...settings });
    };

    // --- Actions with Supabase Mapping ---

    const addVision = async (vision: Omit<Vision, 'id' | 'order'>) => {
        const newVision = { ...vision, id: uuidv4(), order: visions.length };
        setVisions(prev => [...prev, newVision]);

        if (user && supabase) {
            await supabase.from('visions').insert({
                id: newVision.id,
                user_id: user.id,
                title: newVision.title,
                description: newVision.description,
                timeframe: newVision.timeframe,
                order: newVision.order
            });
        }
    };

    const updateVision = async (id: string, updates: Partial<Vision>) => {
        setVisions(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
        if (user && supabase) {
            await supabase.from('visions').update(updates).eq('id', id);
        }
    };

    const deleteVision = async (id: string) => {
        setVisions(prev => prev.filter(v => v.id !== id));
        if (user && supabase) {
            await supabase.from('visions').delete().eq('id', id);
        }
    };

    const reorderVisions = async (newOrder: Vision[]) => {
        const ordered = newOrder.map((v, idx) => ({ ...v, order: idx }));
        setVisions(ordered);
        if (user && supabase) {
            for (const v of ordered) {
                await supabase.from('visions').update({ order: v.order }).eq('id', v.id);
            }
        }
    };

    const addGoal = async (goal: Omit<Goal, 'id' | 'progress' | 'isCompleted'>) => {
        const newGoal = { ...goal, id: uuidv4(), progress: 0, isCompleted: false };
        setGoals(prev => [...prev, newGoal]);

        if (user && supabase) {
            await supabase.from('goals').insert({
                id: newGoal.id,
                user_id: user.id,
                vision_id: newGoal.visionId, // Map to Snake
                title: newGoal.title,
                deadline: newGoal.deadline,
                is_completed: false, // Map to Snake
                progress: 0
            });
        }
    };

    const updateGoal = async (id: string, updates: Partial<Goal>) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
        if (user && supabase) {
            const dbUpdates: any = {};
            if (updates.title !== undefined) dbUpdates.title = updates.title;
            if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
            if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
            if (updates.isCompleted !== undefined) dbUpdates.is_completed = updates.isCompleted;
            if (updates.visionId !== undefined) dbUpdates.vision_id = updates.visionId;

            await supabase.from('goals').update(dbUpdates).eq('id', id);
        }
    };

    const deleteGoal = async (id: string) => {
        setGoals(prev => prev.filter(g => g.id !== id));
        if (user && supabase) await supabase.from('goals').delete().eq('id', id);
    };

    const addTask = async (task: Omit<Task, 'id' | 'isCompleted' | 'order'>) => {
        const newTask = { ...task, id: uuidv4(), isCompleted: false, order: tasks.length };
        setTasks(prev => [...prev, newTask]);
        if (user && supabase) {
            await supabase.from('tasks').insert({
                id: newTask.id,
                user_id: user.id,
                goal_id: newTask.goalId,
                title: newTask.title,
                is_completed: false,
                date: newTask.date,
                order: newTask.order
            });
        }
    };

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        const newVal = !task.isCompleted;
        // Optimistic Update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: newVal } : t));

        if (user && supabase) {
            await supabase.from('tasks').update({ is_completed: newVal }).eq('id', id);
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        if (user && supabase) {
            const dbUpdates: any = {};
            if (updates.title !== undefined) dbUpdates.title = updates.title;
            if (updates.isCompleted !== undefined) dbUpdates.is_completed = updates.isCompleted;
            if (updates.goalId !== undefined) dbUpdates.goal_id = updates.goalId;
            if (updates.date !== undefined) dbUpdates.date = updates.date;
            if (updates.order !== undefined) dbUpdates.order = updates.order;

            await supabase.from('tasks').update(dbUpdates).eq('id', id);
        }
    };

    const deleteTask = async (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        if (user && supabase) await supabase.from('tasks').delete().eq('id', id);
    };

    const addLog = async (log: DayLog) => {
        // Local logic
        const exists = logs.findIndex(l => l.date === log.date);
        let newLogs = [...logs];
        if (exists >= 0) newLogs[exists] = log;
        else newLogs.push(log);
        setLogs(newLogs);

        if (user && supabase) {
            // Simple insert, assuming no conflict or user handles it. 
            // Ideally we'd delete old log for date then insert, or update.
            // Let's try inserting.
            await supabase.from('day_logs').insert({
                id: uuidv4(),
                user_id: user.id,
                date: log.date,
                mood: log.mood,
                notes: log.notes
            });
        }
    };

    const resetData = () => {
        setVisions([]); setGoals([]); setTasks([]); setLogs([]);
        if (!user) {
            localStorage.removeItem('align_visions');
            localStorage.removeItem('align_goals');
            localStorage.removeItem('align_tasks');
            localStorage.removeItem('align_logs');
        }
    };

    const value: AppContextType = {
        visions, goals, tasks, logs, userSettings,
        addVision, updateVision, deleteVision, reorderVisions,
        addGoal, updateGoal, deleteGoal,
        addTask, toggleTask, updateTask, deleteTask,
        addLog, updateSettings, resetData
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within StoreProvider');
    return context;
};
