import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class', '[data-theme="dark"]'],
    content: [
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    safelist: [
        { pattern: /grid-cols-\d+/ },      // чтобы работали динамические grid-cols-XX
        { pattern: /w-\[\d+px\]/ },       // чтобы работали классы вида w-[50px], w-[100px] и т.д.
        { pattern: /h-\[\d+px\]/ },
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
