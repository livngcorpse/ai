// frontend/src/components/Forms/LoginForm.jsx
import React, { useState } from 'react';

const LoginForm = ({ onLogin, isLoading }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isRegister) {
                if (!formData.username.trim()) {
                    setError('Username is required');
                    return;
                }
                await onLogin(formData, 'register');
            } else {
                await onLogin(formData, 'login');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setError(error.response?.data?.detail || 'Authentication failed');
        }
    };

    const handleOAuth = (provider) => {
        // TODO: Replace with actual OAuth client IDs from environment variables
        const redirectUri = `${window.location.origin}/oauth-callback/${provider}`;
        let oauthUrl = '';

        if (provider === 'google') {
            // Replace YOUR_GOOGLE_CLIENT_ID with actual client ID
            oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
        } else {
            // Replace YOUR_GITHUB_CLIENT_ID with actual client ID
            oauthUrl = `https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&redirect_uri=${redirectUri}&scope=user:email`;
        }

        window.location.href = oauthUrl;
    };

    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title justify-center mb-4">
                    {isRegister ? 'Create Account' : 'Sign In'}
                </h2>

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required={isRegister}
                                placeholder="Enter your username"
                            />
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            className="input input-bordered"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="Enter your password"
                            minLength={6}
                        />
                    </div>

                    <div className="form-control mt-6">
                        <button
                            type="submit"
                            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
                        </button>
                    </div>
                </form>

                <div className="divider">OR</div>

                <div className="space-y-2">
                    <button 
                        className="btn btn-outline w-full" 
                        onClick={() => handleOAuth('google')}
                        disabled={isLoading}
                    >
                        <i className="fab fa-google mr-2"></i>
                        Continue with Google
                    </button>
                    <button 
                        className="btn btn-outline w-full" 
                        onClick={() => handleOAuth('github')}
                        disabled={isLoading}
                    >
                        <i className="fab fa-github mr-2"></i>
                        Continue with GitHub
                    </button>
                </div>

                <p className="text-center mt-4">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        className="link link-primary ml-1"
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                            setFormData({ email: '', password: '', username: '' });
                        }}
                        disabled={isLoading}
                    >
                        {isRegister ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;