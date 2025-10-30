'use client';

import { useTheme } from '@/providers/theme';
import { useState } from 'react';
import {
  SunIcon,
  MoonIcon,
  CheckIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: ComputerDesktopIcon },
  ] as const;

  // For the button icon, show the resolved theme (light/dark), but for the dropdown selection, use the actual theme setting
  const displayTheme = theme === 'system' ? resolvedTheme : theme;
  const currentTheme = themes.find(t => t.value === displayTheme) || themes[0];

  return (
    <div className="tw-relative">
      <button
        type="button"
        className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-p-2 tw-text-gray-700 hover:tw-bg-gray-100 hover:tw-text-gray-900 dark:tw-text-gray-200 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-100 tw-transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
      >
        <currentTheme.icon className="tw-h-5 tw-w-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="tw-fixed tw-inset-0 tw-z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="tw-absolute tw-right-0 tw-top-full tw-z-50 tw-mt-2 tw-w-48 tw-rounded-md tw-bg-white tw-py-1 tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 dark:tw-bg-gray-800 dark:tw-ring-gray-700 tw-transition-colors tw-duration-200 tw-ease-in-out">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                type="button"
                className={`tw-flex tw-w-full tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-transition-colors ${
                  theme === themeOption.value
                    ? 'tw-bg-blue-50 tw-text-blue-600 dark:tw-bg-blue-900/20 dark:tw-text-blue-400'
                    : 'tw-text-gray-700 hover:tw-bg-gray-50 dark:tw-text-gray-200 dark:hover:tw-bg-gray-700'
                }`}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
              >
                <themeOption.icon className="tw-mr-3 tw-h-4 tw-w-4" />
                <span className="tw-flex-1 tw-text-left">{themeOption.label}</span>
                {theme === themeOption.value && (
                  <CheckIcon className="tw-h-4 tw-w-4" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

