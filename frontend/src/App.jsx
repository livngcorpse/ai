// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { api, removeToken } from './utils/api';

const App = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const initializeApp = async () => {
            try {
                // Try to get user profile if token exists
                const token = localStorage.getItem('token');
                if (token) {
                    const profile = await api.getUserProfile();
                    setUser(profile);
                    // Apply saved theme
                    document.documentElement.setAttribute('data-theme', profile.preferred_theme || 'light');
                }
            } catch (error) {
                console.error('Failed to initialize app:', error);
                // Clear invalid token
                removeToken();
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    useEffect(() => {
        if (user) {
            document.documentElement.setAttribute('data-theme', user.preferred_theme || 'light');
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
            throw error; // Let the component handle the error
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        setUser(null);
        document.documentElement.setAttribute('data-theme', 'light');
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
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

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