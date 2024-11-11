import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--color-bg)',
                text: 'var(--color-text)',
                header: 'var(--color-header)',
                headerText: 'var(--color-header-text)',
                footer: 'var(--color-footer)',
                footerText: 'var(--color-footer-text)',
                button: 'var(--color-button)',
                typography: 'var(--color-typography)',
            },
        },
    },
    plugins: [],
};
export default config;
