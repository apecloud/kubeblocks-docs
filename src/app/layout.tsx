import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { MuiThemeProvider } from "@/client-components/MuiThemeProvider";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import HideOnScroll from "@/client-components/HideOnScroll";
import { AppBar, Fab, Toolbar } from "@mui/material";

import ThemeSwitcher from "@/client-components/ThemeSwitcher";
import ScrollTop from "@/client-components/ScrollTop";
import { KeyboardArrowUp } from "@mui/icons-material";

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
          <NextThemeProvider enableColorScheme enableSystem >
            <MuiThemeProvider>
              <HideOnScroll>
                <AppBar>
                  <Toolbar>
                    <ThemeSwitcher />
                  </Toolbar>
                </AppBar>
              </HideOnScroll>
              <Toolbar id="back-to-top-anchor" />

              {children}

              <ScrollTop>
                <Fab color="primary">
                  <KeyboardArrowUp />
                </Fab>
              </ScrollTop>
            </MuiThemeProvider>
          </NextThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
