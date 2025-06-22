//frontend/src/components/Chat/ChatMessage.jsx
import React from 'react';

const ChatMessage = ({ message, isUser }) => {
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`message-bubble p-3 rounded-lg ${
                isUser 
                    ? 'bg-primary text-primary-content' 
                    : 'bg-base-200 text-base-content'
            }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;