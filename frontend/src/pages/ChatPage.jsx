//frontend/src/pages/ChatPage.jsx
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

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        try {
            const chatHistory = await api.getChatHistory();
            setChats(chatHistory);
        } catch (error) {
            console.error('Failed to load chats:', error);
        }
    };

    const handleNewChat = () => {
        setCurrentChat({ id: Date.now(), title: 'New Chat' });
        setMessages([]);
        setSidebarOpen(false);
    };

    const handleSelectChat = (chatId) => {
        setCurrentChat({ id: chatId, title: `Chat ${chatId}` });
        setMessages([]);
        setSidebarOpen(false);
    };

    const handleSendMessage = async (content) => {
        const userMessage = {
            role: 'user',
            content,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const responseGenerator = api.sendMessage(content, currentChat?.id);
            let assistantMessage = {
                role: 'assistant',
                content: '',
                created_at: new Date().toISOString()
            };

            for await (const chunk of responseGenerator) {
                assistantMessage.content = chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                        newMessages[newMessages.length - 1] = assistantMessage;
                    } else {
                        newMessages.push(assistantMessage);
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsTyping(false);
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
                onUpdateSettings={onUpdateSettings}
            />
        </div>
    );
};

export default ChatPage;