import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-geist-sans)'],
                mono: ['var(--font-geist-mono)'],
            },
            colors: {
                background: 'rgb(var(--background-rgb))',
                foreground: 'rgb(var(--foreground-rgb))',
                // Add semantic color variables for better dark mode support
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
            },
            height: {
                navbar: '4rem', // 64px
            },
            spacing: {
                navbar: '4rem', // 64px
            },
            zIndex: {
                navbar: '100',
            },
        },
    },
    plugins: [
        forms,
    ],
    prefix: 'tw-', // To match the frontend rules
};

// Remove hardcoded input styles that override dark mode
// Let Tailwind's dark mode classes handle input styling

export default config; 