import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { MuiThemeProvider } from "@/components/MuiThemeProvider";

import HideOnScroll from "@/components/HideOnScroll";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  IconButton,
  Toolbar,
} from "@mui/material";
import ScrollTop from "@/components/ScrollTop";
import { Link } from "@/components/Link";
import Image from "next/image";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { getCurrentLocale, getI18n } from "@/locales/server";
import I18nProvider from "@/components/I18nProvider";
import { NextThemeProvider } from "@/components/NextThemeProvider";
import { GitHub } from "@mui/icons-material";

export const metadata: Metadata = {
  title: "KubeBlocks",
  description: "Run Any Database on Kubernetes",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getI18n();
  const currentLocale = await getCurrentLocale();

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <body>
        <I18nProvider locale={currentLocale}>
          <AppRouterCacheProvider options={{ key: "css" }}>
            <NextThemeProvider>
              <MuiThemeProvider>
                <CssBaseline />
                <HideOnScroll>
                  <AppBar>
                    <Toolbar>
                      <Box>
                        <Link href="/" style={{ display: "block" }}>
                          <Image
                            src="/logo.png"
                            alt="KubeBlocks"
                            width={165}
                            height={36}
                            style={{ display: "block" }}
                          />
                        </Link>
                      </Box>
                      <Box
                        sx={{
                          flexGrow: 1,
                          paddingInline: 4,
                          display: "flex",
                          gap: 4,
                        }}
                        component="nav"
                      >
                        <Link href="/docs">{t("navigation.docs")}</Link>
                        <Link href="/">{t("navigation.databases")}</Link>
                      </Box>
                      <Box
                        sx={{
                          gap: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconButton href="https://github.com" target="_blank">
                          <GitHub />
                        </IconButton>
                        <ThemeSwitcher />
                        {/* <Divider orientation="vertical" sx={{ height: 20 }} /> */}
                        <LocaleSwitcher />
                      </Box>
                    </Toolbar>
                  </AppBar>
                </HideOnScroll>
                <Toolbar id="back-to-top-anchor" />
                <main>{children}</main>
                <ScrollTop />
              </MuiThemeProvider>
            </NextThemeProvider>
          </AppRouterCacheProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
