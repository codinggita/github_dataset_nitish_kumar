import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getInitialDensity = () => {
  return localStorage.getItem('density') || 'comfortable'; // 'compact' or 'comfortable'
};

const initialState = {
  darkMode: getInitialTheme(),
  sidebarCollapsed: false,
  density: getInitialDensity(),
  notification: null, // { message, type: 'success' | 'error' | 'info' | 'warning', id }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      const theme = state.darkMode ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setDensity: (state, action) => {
      state.density = action.payload;
      localStorage.setItem('density', action.payload);
    },
    showNotification: (state, action) => {
      const { message, type } = action.payload;
      state.notification = {
        message,
        type: type || 'info',
        id: Date.now(),
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  toggleTheme,
  toggleSidebar,
  setSidebarCollapsed,
  setDensity,
  showNotification,
  clearNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
