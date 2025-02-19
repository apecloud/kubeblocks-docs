import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { MuiThemeProvider } from "@/client-components/MuiThemeProvider";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import HideOnScroll from "@/client-components/HideOnScroll";
import { AppBar, Box, CssBaseline, Toolbar } from "@mui/material";
import ThemeSwitcher from "@/client-components/ThemeSwitcher";
import ScrollTop from "@/client-components/ScrollTop";

import "./globals.css";

export const metadata: Metadata = {
  title: "KubeBlocks",
  description: "Run Any Database on Kubernetes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ key: "css" }}>
          <NextThemeProvider>
            <MuiThemeProvider>
              <CssBaseline />
              <HideOnScroll>
                <AppBar>
                  <Toolbar>
                    <Box>asd</Box>
                    <Box sx={{ flexGrow: 1 }}>asd</Box>
                    <ThemeSwitcher />
                  </Toolbar>
                </AppBar>
              </HideOnScroll>
              <Toolbar id="back-to-top-anchor" />
              <main>{children}</main>
              <ScrollTop />
            </MuiThemeProvider>
          </NextThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
