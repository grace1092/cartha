'use client';

import { useTheme } from '@/lib/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light mode' },
    { value: 'dark', icon: Moon, label: 'Dark mode' },
    { value: 'system', icon: Monitor, label: 'System preference' }
  ];

  const currentTheme = themes.find(t => t.value === theme);
  const Icon = currentTheme?.icon || Sun;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-xl card-primary backdrop-blur-sm hover:bg-card-hover transition-colors duration-200"
        onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5"
          >
            <Icon className="w-5 h-5 text-body" />
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Theme indicator */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1">
          {themes.map((t) => (
            <div
              key={t.value}
              className={`w-1 h-1 rounded-full transition-colors duration-200 ${
                theme === t.value
                  ? 'bg-blue-500 dark:bg-blue-400'
                  : 'bg-border-secondary'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Alternative: Dropdown theme selector
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light mode' },
    { value: 'dark', icon: Moon, label: 'Dark mode' },
    { value: 'system', icon: Monitor, label: 'System preference' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg card-primary backdrop-blur-sm hover:bg-card-hover transition-colors duration-200">
        <Sun className="w-4 h-4 text-body" />
        <span className="text-sm font-medium text-body capitalize">
          {theme}
        </span>
        <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="absolute right-0 mt-2 w-48 card-primary rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {themes.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              onClick={() => setTheme(t.value as 'light' | 'dark' | 'system')}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 ${
                theme === t.value
                  ? 'bg-accent text-heading'
                  : 'text-body hover:bg-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="capitalize">{t.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
} 