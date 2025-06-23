// frontend/src/components/Chat/ChatMessage.jsx
import React from 'react';

const ChatMessage = ({ message, isUser }) => {
    const formatTime = (timestamp) => {
        try {
            return new Date(timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (error) {
            return '';
        }
    };

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`message-bubble max-w-[80%] p-3 rounded-lg ${
                isUser 
                    ? 'bg-primary text-primary-content' 
                    : message.isError 
                        ? 'bg-error text-error-content'
                        : 'bg-base-200 text-base-content'
            }`}>
                <div className="whitespace-pre-wrap break-words">
                    {message.content}
                </div>
                {message.created_at && (
                    <div className="text-xs opacity-70 mt-1">
                        {formatTime(message.created_at)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;