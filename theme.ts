'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    cssVariables: true,
    components: {
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: 'var(--color-button)',
                },
            },
        },
    },
});

export default theme;
