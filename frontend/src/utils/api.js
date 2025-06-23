import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const api = {
  login: async (credentials) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, new URLSearchParams({
      username: credentials.email,
      password: credentials.password
    }));
    return res.data;
  },

  register: async (data) => {
    const res = await axios.post(`${BASE_URL}/auth/register`, data);
    return res.data;
  },

  oauthLogin: async (provider, code) => {
    const res = await axios.post(`${BASE_URL}/auth/oauth/${provider}?code=${code}`);
    return res.data;
  },

  updateProfile: async (updates) => {
    const res = await axios.put(`${BASE_URL}/user/profile`, updates, {
      headers: { Authorization: `Bearer ${updates.token}` }
    });
    return res.data;
  },

  getChatHistory: async () => {
    const res = await axios.get(`${BASE_URL}/history/chats`);
    return res.data;
  },

  sendMessage: async function* (message, chatId) {
    const res = await fetch(`${BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, chat_id: chatId })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split('\n\n');
      for (let i = 0; i < parts.length - 1; i++) {
        const line = parts[i].replace(/^data:\s*/, '');
        const json = JSON.parse(line);
        if (json.content) yield json.content;
      }

      buffer = parts[parts.length - 1];

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

export const api = {
  login: async (credentials) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, new URLSearchParams({
      username: credentials.email,
      password: credentials.password
    }));
    // Store token after successful login
    if (res.data.access_token) {
      setToken(res.data.access_token);
    }
    return res.data;
  },

  register: async (data) => {
    const res = await axios.post(`${BASE_URL}/auth/register`, data);
    // Store token after successful registration
    if (res.data.access_token) {
      setToken(res.data.access_token);
    }
    return res.data;
  },

  updateProfile: async (updates) => {
    const res = await axios.put(`${BASE_URL}/user/profile`, updates, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },

  getChatHistory: async () => {
    const res = await axios.get(`${BASE_URL}/history/chats`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return res.data;
  },

  sendMessage: async function* (message, chatId) {
    const token = getToken();
    if (!token) throw new Error('No authentication token');
    
    const res = await fetch(`${BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, chat_id: chatId })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // ... rest remains same
  }
};
    }
  }
};
