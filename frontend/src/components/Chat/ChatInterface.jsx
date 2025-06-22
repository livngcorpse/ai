//frontend/src/components/Chat/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const ChatInterface = ({ messages, onSendMessage, isTyping }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 chat-container">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <i className="fas fa-robot text-4xl text-base-content/30 mb-4"></i>
                            <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                            <p className="text-base-content/70">Ask me anything and I'll help you out!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <ChatMessage 
                                key={index} 
                                message={message} 
                                isUser={message.role === 'user'} 
                            />
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-base-200 rounded-lg p-3">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t border-base-300">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        className="input input-bordered flex-1"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isTyping}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={!input.trim() || isTyping}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;