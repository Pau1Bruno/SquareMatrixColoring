import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/system';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import theme from '@/theme';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Раскраска квадратных матриц',
    description: 'Преобразование квадратных (0,1)-матриц',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
            >
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <Header />
                        <main className="grow flex flex-col">{children}</main>
                        <Footer />
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
