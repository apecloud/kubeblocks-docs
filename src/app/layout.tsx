import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { MuiThemeProvider } from "@/components/MuiThemeProvider";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import ScrollTop from "@/components/ScrollTop";
import { LinkButton } from "@/components/Link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { getCurrentLocale, getI18n } from "@/locales/server";
import I18nProvider from "@/components/I18nProvider";
import { NextThemeProvider } from "@/components/NextThemeProvider";
import { GitHub, LaunchOutlined } from "@mui/icons-material";
import Logo from "@/components/Logo";
import DocumentationNav from "@/components/Navigation/Documentation";

import "./global.css";
import DatabasesNav from "@/components/Navigation/Databases";

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
                      gap={0.5}
                    >
                      <DocumentationNav />
                      <DatabasesNav />
                      <LinkButton
                        color="inherit"
                        href="/"
                        size="large"
                        sx={{ paddingInline: 2 }}
                      >
                        {t("navigation.blogs")}
                      </LinkButton>
                      <LinkButton
                        color="inherit"
                        href="https://console.kubeblocks.io"
                        target="_blank"
                        endIcon={<LaunchOutlined />}
                        sx={{ paddingInline: 2 }}
                        size="large"
                      >
                        Kubeblocks Cloud
                      </LinkButton>
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
