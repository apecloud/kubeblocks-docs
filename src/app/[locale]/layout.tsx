import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { MuiThemeProvider } from "@/components/MuiThemeProvider";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import ScrollTop from "@/components/ScrollTop";
import { getI18n } from "@/locales/server";
import I18nProvider from "@/components/I18nProvider";
import { NextThemeProvider } from "@/components/NextThemeProvider";
import { GitHub, LaunchOutlined } from "@mui/icons-material";
import { Link } from "@/components/Link";
import { setStaticParamsLocale } from "next-international/server";
import DocumentationNav from "./nav-document";
import DatabasesNav from "./nav-databases";
import Logo from "./logo";

import "highlight.js/styles/github-dark.css";
import "./global.css";
import LocaleSwitcher from "./locale-switch";
import ThemeSwitcher from "./theme-switch";

export const metadata: Metadata = {
  title: "KubeBlocks",
  description: "Run Any Database on Kubernetes",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "zh" | "en" }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <I18nProvider locale={locale}>
          <AppRouterCacheProvider options={{ key: "css" }}>
            <NextThemeProvider>
              <MuiThemeProvider>
                <CssBaseline />
                <AppBar>
                  <Toolbar>
                    <Logo />
                    <Stack
                      sx={{
                        paddingInline: 4,
                        flex: 1,
                      }}
                      component="nav"
                      direction="row"
                      alignItems="center"
                      gap={1}
                    >
                      <DocumentationNav />
                      <DatabasesNav />
                      <Button
                        component={Link}
                        color="inherit"
                        size="large"
                        href="/blog"
                        sx={{ paddingInline: 2 }}
                      >
                        {t("navigation.blogs")}
                      </Button>
                      <Button
                        component={Link}
                        color="inherit"
                        size="large"
                        href="https://console.kubeblocks.io"
                        target="_blank"
                        endIcon={<LaunchOutlined />}
                        sx={{ paddingInline: 2 }}
                      >
                        Kubeblocks Cloud
                      </Button>
                    </Stack>
                    <Box
                      sx={{
                        gap: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        href="https://github.com/apecloud/kubeblocks"
                        target="_blank"
                      >
                        <GitHub />
                      </IconButton>
                      <ThemeSwitcher />
                      <LocaleSwitcher />
                    </Box>
                  </Toolbar>
                </AppBar>
                <Toolbar />
                <Box component="main">{children}</Box>
                <ScrollTop />
              </MuiThemeProvider>
            </NextThemeProvider>
          </AppRouterCacheProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
