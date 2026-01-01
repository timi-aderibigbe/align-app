import React, { useRef } from 'react';
import { useStore } from '../context/store';
import { Modal } from './Modal';
import { Download, Sun, Moon, Upload } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { userSettings, updateSettings } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleTheme = () => {
        updateSettings({ theme: userSettings.theme === 'light' ? 'dark' : 'light' });
    };

    const handleExport = () => {
        const data = {
            visions: JSON.parse(localStorage.getItem('align_visions') || '[]'),
            goals: JSON.parse(localStorage.getItem('align_goals') || '[]'),
            tasks: JSON.parse(localStorage.getItem('align_tasks') || '[]'),
            logs: JSON.parse(localStorage.getItem('align_logs') || '[]'),
            settings: JSON.parse(localStorage.getItem('align_settings') || '{}')
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `align-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);

                if (json.visions) localStorage.setItem('align_visions', JSON.stringify(json.visions));
                if (json.goals) localStorage.setItem('align_goals', JSON.stringify(json.goals));
                if (json.tasks) localStorage.setItem('align_tasks', JSON.stringify(json.tasks));
                if (json.logs) localStorage.setItem('align_logs', JSON.stringify(json.logs));
                if (json.settings) localStorage.setItem('align_settings', JSON.stringify(json.settings));

                window.location.reload();
            } catch (err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings">
            <div className="settings-section">
                <h3>Appearance</h3>
                <div className="setting-row">
                    <span>Theme</span>
                    <button className="theme-toggle-btn" onClick={toggleTheme}>
                        {userSettings.theme === 'light' ? (
                            <>
                                <Sun size={18} /> Light Mode
                            </>
                        ) : (
                            <>
                                <Moon size={18} /> Dark Mode
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <h3>Data</h3>
                <div className="setting-actions">
                    <button className="btn btn-primary" onClick={handleExport}>
                        <Download size={18} /> Export Data
                    </button>

                    <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={18} /> Import Data
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".json"
                        onChange={handleImport}
                    />
                </div>
                <p className="help-text">
                    Export your data to JSON for backup. Import to restore (overwrites current data).
                </p>
            </div>

            <style>{`
         .settings-section {
           margin-bottom: var(--spacing-xl);
         }
         .settings-section h3 {
           margin-bottom: var(--spacing-md);
           font-size: 1rem;
           color: var(--color-text-main);
         }
         .setting-row {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: var(--spacing-sm) 0;
           border-bottom: 1px solid var(--color-border);
         }
         .theme-toggle-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--color-surface-hover);
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            color: var(--color-text-main);
            font-weight: 500;
         }
         .setting-actions {
            display: flex;
            gap: var(--spacing-md);
            margin-bottom: 8px;
         }
       `}</style>
        </Modal>
    );
};
