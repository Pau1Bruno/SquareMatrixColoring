import React from 'react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const Header = () => {
    return (
        <header className="h-10 bg-header">
            <div className="flex justify-end">
                <ThemeSwitcher />
            </div>
        </header>
    );
};

export default Header;
