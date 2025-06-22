//frontend/src/pages/LoginPage.jsx

import React from 'react';
import LoginForm from '../components/Forms/LoginForm';

const LoginPage = ({ onLogin, isLoading }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <LoginForm onLogin={onLogin} isLoading={isLoading} />
        </div>
    );
};

export default LoginPage;