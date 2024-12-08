import { Box } from '@mui/material';
import React from 'react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const Header = () => {
    return (
        <header className="h-14 bg-header px-5">
            <Box className="h-full flex justify-end items-center">
                <Box className="w-10 h-10 rounded-full border">
                    <ThemeSwitcher />
                </Box>
            </Box>
        </header>
    );
};

export default Header;
