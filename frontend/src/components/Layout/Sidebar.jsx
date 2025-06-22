//frontend/src/components/Layout/Sidebar.jsx
import React from 'react';

const Sidebar = ({ isOpen, onClose, chats, onNewChat, onSelectChat, currentUser, onLogout }) => {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                ></div>
            )}
            
            <div className={`fixed left-0 top-0 h-full w-64 bg-base-200 z-50 sidebar-transition ${!isOpen ? 'sidebar-mobile' : 'sidebar-mobile open'} md:relative md:translate-x-0`}>
                <div className="p-4 border-b border-base-300">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">AI Chat</h2>
                        <button 
                            className="btn btn-ghost btn-sm md:hidden"
                            onClick={onClose}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <button 
                        className="btn btn-primary w-full mt-2"
                        onClick={onNewChat}
                    >
                        <i className="fas fa-plus mr-2"></i>
                        New Chat
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-sm font-semibold text-base-content/70 mb-2">Recent Chats</h3>
                    <div className="space-y-2">
                        {chats.map(chat => (
                            <button
                                key={chat.id}
                                className="w-full text-left p-2 rounded hover:bg-base-300 text-sm"
                                onClick={() => onSelectChat(chat.id)}
                            >
                                <div className="truncate">{chat.title}</div>
                                <div className="text-xs text-base-content/50">
                                    {new Date(chat.created_at).toLocaleDateString()}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 border-t border-base-300">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                <span className="text-xs">{currentUser.username[0].toUpperCase()}</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{currentUser.username}</div>
                            <div className="text-xs text-base-content/50 truncate">{currentUser.email}</div>
                        </div>
                    </div>
                    <button 
                        className="btn btn-ghost btn-sm w-full"
                        onClick={onLogout}
                    >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;