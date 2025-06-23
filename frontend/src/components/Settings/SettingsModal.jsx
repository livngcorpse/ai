// frontend/src/components/Settings/SettingsModal.jsx
import React, { useState } from 'react';
import { themes } from '../../utils/themeUtils';

const SettingsModal = ({ isOpen, onClose, currentUser, onUpdateSettings }) => {
    const [settings, setSettings] = useState({
        username: currentUser.username,
        theme: currentUser.preferred_theme || 'light',
        model: currentUser.preferred_model || 'gpt-4o'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            await onUpdateSettings(settings);
            onClose();
        } catch (error) {
            console.error('Failed to update settings:', error);
            setError(error.response?.data?.detail || 'Failed to update settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setSettings({
            username: currentUser.username,
            theme: currentUser.preferred_theme || 'light',
            model: currentUser.preferred_model || 'gpt-4o'
        });
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Settings</h3>
                
                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}
                
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
                            placeholder="Enter username"
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
                        >
                            <option value="gpt-4o">GPT-4o (Latest)</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Account Information</span>
                        </label>
                        <div className="bg-base-200 p-3 rounded">
                            <p className="text-sm"><strong>Email:</strong> {currentUser.email}</p>
                            <p className="text-sm"><strong>Account Created:</strong> {new Date(currentUser.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                
                <div className="modal-action">
                    <button 
                        className="btn" 
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button 
                        className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                        onClick={handleSave}
                        disabled={isLoading || !settings.username.trim()}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;