import I18nProvider from '@/components/I18nProvider';
import MessageBox from '@/components/MessageBox';
import { MuiThemeProvider } from '@/components/MuiThemeProvider';
import { NextThemeProvider } from '@/components/NextThemeProvider';
import ScrollTop from '@/components/ScrollTop';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { Geist } from 'next/font/google';
import { ElevationScrollAppBar } from './ElevationScrollAppBar';

import 'highlight.js/styles/github-dark.css';
import './global.css';

const geist = Geist({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KubeBlocks',
  description: 'Run Any Database on Kubernetes',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: 'en' }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning className={geist.className}>
      <body>
        <I18nProvider locale={locale}>
          <AppRouterCacheProvider options={{ key: 'css' }}>
            <NextThemeProvider>
              <MuiThemeProvider>
                <CssBaseline />
                <MessageBox />
                <ElevationScrollAppBar />
                <Toolbar />
                <Box component="main">{children}</Box>
                <ScrollTop />
              </MuiThemeProvider>
            </NextThemeProvider>
          </AppRouterCacheProvider>
        </I18nProvider>
      </body>
      <GoogleAnalytics gaId="G-1P80WT42PB" />
    </html>
  );
}
