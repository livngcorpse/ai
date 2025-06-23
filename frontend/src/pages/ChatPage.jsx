// frontend/src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import ChatInterface from '../components/Chat/ChatInterface';
import SettingsModal from '../components/Settings/SettingsModal';
import { api } from '../utils/api';

const ChatPage = ({ user, onLogout, onUpdateSettings }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        try {
            const chatHistory = await api.getChatHistory();
            setChats(chatHistory);
        } catch (error) {
            console.error('Failed to load chats:', error);
            setError('Failed to load chat history');
        }
    };

    const handleNewChat = () => {
        setCurrentChat(null);
        setMessages([]);
        setSidebarOpen(false);
        setError('');
    };

    const handleSelectChat = async (chatId) => {
        try {
            // TODO: Implement getChatMessages API endpoint
            // const chatMessages = await api.getChatMessages(chatId);
            // setMessages(chatMessages);
            
            setCurrentChat({ id: chatId, title: `Chat ${chatId}` });
            setMessages([]); // Placeholder until API is implemented
            setSidebarOpen(false);
            setError('');
        } catch (error) {
            console.error('Failed to load chat:', error);
            setError('Failed to load chat messages');
        }
    };

    const handleSendMessage = async (content) => {
        if (!content.trim()) return;

        const userMessage = {
            role: 'user',
            content,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        setError('');

        try {
            const responseGenerator = api.sendMessage(content, currentChat?.id);
            let assistantMessage = {
                role: 'assistant',
                content: '',
                created_at: new Date().toISOString()
            };

            let hasAddedMessage = false;

            for await (const chunk of responseGenerator) {
                assistantMessage = {
                    ...assistantMessage,
                    content: chunk
                };

                setMessages(prev => {
                    const newMessages = [...prev];
                    if (!hasAddedMessage) {
                        newMessages.push(assistantMessage);
                        hasAddedMessage = true;
                    } else {
                        // Update the last message if it's from assistant
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage && lastMessage.role === 'assistant') {
                            newMessages[newMessages.length - 1] = assistantMessage;
                        }
                    }
                    return newMessages;
                });
            }

            // Reload chats to get updated list
            loadChats();

        } catch (error) {
            console.error('Failed to send message:', error);
            setError('Failed to send message. Please try again.');
            
            // Add error message to chat
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                created_at: new Date().toISOString(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleUpdateSettings = async (newSettings) => {
        try {
            await onUpdateSettings(newSettings);
            setSettingsOpen(false);
        } catch (error) {
            console.error('Failed to update settings:', error);
            throw error; // Let SettingsModal handle the error
        }
    };

    return (
        <div className="h-screen flex bg-base-100">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                chats={chats}
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
                currentUser={user}
                onLogout={onLogout}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    currentUser={user}
                    onOpenSettings={() => setSettingsOpen(true)}
                />

                {error && (
                    <div className="alert alert-error m-4">
                        <span>{error}</span>
                        <button 
                            className="btn btn-sm btn-ghost"
                            onClick={() => setError('')}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="flex-1 min-h-0">
                    <ChatInterface
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isTyping={isTyping}
                    />
                </div>
            </div>

            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                currentUser={user}
                onUpdateSettings={handleUpdateSettings}
            />
        </div>
    );
};

export default ChatPage;