import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        applyThemeToDom(newTheme);
      },
      setTheme: (theme) => {
        set({ theme });
        applyThemeToDom(theme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyThemeToDom(state.theme);
        }
      },
    }
  )
);

function applyThemeToDom(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme-storage');
  let initialTheme: Theme = 'dark';
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      initialTheme = parsed.state?.theme || 'dark';
    } catch {
      initialTheme = 'dark';
    }
  }
  applyThemeToDom(initialTheme);
}
