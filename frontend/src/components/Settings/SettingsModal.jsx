//frontend/src/components/Settings/SettingsModal.jsx
import React, { useState } from 'react';
import { themes } from '../../utils/themeUtils';

const SettingsModal = ({ isOpen, onClose, currentUser, onUpdateSettings }) => {
    const [settings, setSettings] = useState({
        username: currentUser.username,
        theme: currentUser.preferred_theme,
        model: currentUser.preferred_model
    });

    const handleSave = async () => {
        await onUpdateSettings(settings);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Settings</h3>
                
                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={settings.username}
                            onChange={(e) => setSettings({...settings, username: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Theme</span>
                        </label>
                        <select 
                            className="select select-bordered"
                            value={settings.theme}
                            onChange={(e) => setSettings({...settings, theme: e.target.value})}
                        >
                            {themes.map(theme => (
                                <option key={theme.id} value={theme.id}>
                                    {theme.icon} {theme.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">AI Model</span>
                        </label>
                        <select 
                            className="select select-bordered"
                            value={settings.model}
                            onChange={(e) => setSettings({...settings, model: e.target.value})}
                        >
                            <option value="gpt-4o">GPT-4o (Latest)</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                    </div>
                </div>
                
                <div className="modal-action">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;