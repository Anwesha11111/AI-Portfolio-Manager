import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('app-theme') || 'midnight',
  setTheme: (newTheme) => {
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    set({ theme: newTheme });
  },
  initializeTheme: () => {
    const theme = localStorage.getItem('app-theme') || 'midnight';
    document.documentElement.setAttribute('data-theme', theme);
  }
}));

export default useThemeStore;
