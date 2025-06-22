//frontend/src/components/Layout/Header.jsx
import React from 'react';

const Header = ({ onToggleSidebar, currentUser, onOpenSettings }) => {
    return (
        <div className="navbar bg-base-100 border-b border-base-300">
            <div className="navbar-start">
                <button 
                    className="btn btn-ghost btn-square md:hidden"
                    onClick={onToggleSidebar}
                >
                    <i className="fas fa-bars"></i>
                </button>
                <h1 className="text-xl font-bold ml-2">AI Assistant</h1>
            </div>
            
            <div className="navbar-end">
                <button 
                    className="btn btn-ghost btn-square"
                    onClick={onOpenSettings}
                >
                    <i className="fas fa-cog"></i>
                </button>
            </div>
        </div>
    );
};

export default Header;