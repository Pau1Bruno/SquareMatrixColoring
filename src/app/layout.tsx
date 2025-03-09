import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/system';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
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
        <html suppressHydrationWarning lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
            >
                <NextThemesProvider attribute="data-theme">
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <Header />
                            <main className="grow flex flex-col font-[family-name:var(--font-geist-sans)]">
                                {children}
                            </main>
                            <Footer />
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </NextThemesProvider>
            </body>
        </html>
    );
}
