'use client';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<'dark' | 'light' | null>(null);

    useEffect(() => {
        const theme = localStorage.getItem('theme') as 'dark' | 'light';
        if (!theme) return;

        setTheme(theme);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || !theme) return;

        document.querySelector('html')?.setAttribute('theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    function changeTheme() {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }

    return (
        <IconButton onClick={changeTheme}>
            {theme !== 'dark' ? (
                <DarkModeIcon />
            ) : (
                <LightModeIcon />
            )}
        </IconButton>
    );
};
