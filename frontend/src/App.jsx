//frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { api } from './utils/api';

const App = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            document.documentElement.setAttribute('data-theme', user.preferred_theme);
        }
    }, [user]);

    const handleLogin = async (credentials, type) => {
        setIsLoading(true);
        try {
            let result;
            if (type === 'register') {
                result = await api.register(credentials);
            } else {
                result = await api.login(credentials);
            }
            setUser(result.user);
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleUpdateSettings = async (newSettings) => {
        try {
            await api.updateProfile(newSettings);
            setUser(prev => ({
                ...prev,
                username: newSettings.username,
                preferred_theme: newSettings.theme,
                preferred_model: newSettings.model
            }));
            document.documentElement.setAttribute('data-theme', newSettings.theme);
        } catch (error) {
            console.error('Failed to update settings:', error);
        }
    };

    if (!user) {
        return <LoginPage onLogin={handleLogin} isLoading={isLoading} />;
    }

    return (
        <ChatPage 
            user={user} 
            onLogout={handleLogout}
            onUpdateSettings={handleUpdateSettings}
        />
    );
};

export default App;