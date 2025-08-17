import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-geist-sans)'],
                mono: ['var(--font-geist-mono)'],
            },
            colors: {
                background: 'rgb(var(--background-rgb))',
                foreground: 'rgb(var(--foreground-rgb))',
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
        require('@tailwindcss/forms'),
    ],
    prefix: 'tw-', // To match the frontend rules
};

// Add base styles
const customStyles = {
    'input, textarea, select': {
        color: 'rgb(17 24 39)', // text-gray-900
        '&::placeholder': {
            color: 'rgb(156 163 175)', // text-gray-400
        },
    },
    'body': {
        color: 'rgb(17 24 39)', // text-gray-900
    }
};

config.plugins?.push(({ addBase }: PluginAPI) => {
    addBase(customStyles);
});

export default config; 