// frontend/src/utils/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Token management functions
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const api = {
  login: async (credentials) => {
    const res = await axios.post('/auth/login', new URLSearchParams({
      username: credentials.email,
      password: credentials.password
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    // Store token after successful login
    if (res.data.access_token) {
      setToken(res.data.access_token);
    }
    return res.data;
  },

  register: async (data) => {
    const res = await axios.post('/auth/register', {
      email: data.email,
      username: data.username,
      password: data.password
    });
    
    // Store token after successful registration
    if (res.data.access_token) {
      setToken(res.data.access_token);
    }
    return res.data;
  },

  oauthLogin: async (provider, code) => {
    const res = await axios.post(`/auth/oauth/${provider}?code=${code}`);
    
    if (res.data.access_token) {
      setToken(res.data.access_token);
    }
    return res.data;
  },

  updateProfile: async (updates) => {
    const res = await axios.put('/user/profile', {
      username: updates.username,
      preferred_theme: updates.theme,
      preferred_model: updates.model
    });
    return res.data;
  },

  getChatHistory: async () => {
    const res = await axios.get('/history/chats');
    return res.data;
  },

  sendMessage: async function* (message, chatId) {
    const token = getToken();
    if (!token) throw new Error('No authentication token');
    
    let reader;
    try {
        const res = await fetch(`${BASE_URL}/chat/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message, 
                chat_id: chatId || null 
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullContent = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim();
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') return;
                    
                    try {
                        const json = JSON.parse(data);
                        if (json.content) {
                            fullContent += json.content;
                            yield fullContent;
                        }
                    } catch (e) {
                        console.warn('Failed to parse SSE data:', data);
                    }
                }
            }
            buffer = lines[lines.length - 1];
        }
    } catch (error) {
        console.error('Stream reading error:', error);
        throw error;
    } finally {
        if (reader) {
            try {
                reader.releaseLock();
            } catch (e) {
                console.warn('Failed to release reader lock:', e);
            }
        }
    }
},

  getUserProfile: async () => {
    const res = await axios.get('/user/profile');
    return res.data;
  }
};

// Export token management functions for use in other components
export { getToken, setToken, removeToken };