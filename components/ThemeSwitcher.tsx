'use client';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        setTheme(
            window.document
                .querySelector('html')
                ?.getAttribute('data-theme') as string
        );
    }, []);

    const changeTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    if (!mounted) return null;

    return (
        <IconButton onClick={changeTheme}>
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
    );
};
