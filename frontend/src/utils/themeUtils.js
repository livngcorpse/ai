//frontend/src/utils/themeUtils.js
// Theme configurations
export const themes = [
    { id: 'light', name: 'Light', icon: '🌞' },
    { id: 'dark', name: 'Dark', icon: '🌚' },
    { id: 'hacker', name: 'Hacker', icon: '🕸️' },
    { id: 'retro', name: 'Retro Terminal', icon: '💾' },
    { id: 'cyberpunk', name: 'Neon Cyberpunk', icon: '🌈' },
    { id: 'zen', name: 'Zen Minimal', icon: '💡' }
];

export const applyTheme = (themeId) => {
    document.documentElement.setAttribute('data-theme', themeId);
};