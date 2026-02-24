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
import { getSiteUrl } from '@/utils/site';
import { ElevationScrollAppBar } from './ElevationScrollAppBar';

import 'highlight.js/styles/github-dark.css';
import Script from 'next/script';
import './global.css';

const geist = Geist({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'KubeBlocks',
    template: '%s | KubeBlocks',
  },
  description:
    'Meet KubeBlocks, the open-source, unified database operator for Kubernetes. Simplify cloud-native data management with a single API for MySQL, PostgreSQL, MongoDB, Kafka, and more. Tame operator sprawl and streamline Day-2 operations.',
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning className={geist.className}>
      <body>
        <Script src="/c.js" />
        <I18nProvider locale={locale as 'en'}>
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
