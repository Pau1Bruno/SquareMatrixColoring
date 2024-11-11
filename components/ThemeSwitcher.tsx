'use client';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>(
        (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark'
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        document.querySelector('html')?.setAttribute('theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    function changeTheme() {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }

    return (
        <IconButton onClick={changeTheme} color="primary">
            {theme !== 'dark' ? (
                <DarkModeIcon color="inherit" />
            ) : (
                <LightModeIcon color="inherit" />
            )}
        </IconButton>
    );
};
