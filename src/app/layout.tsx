import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { MuiThemeProvider } from "@/components/MuiThemeProvider";

import HideOnScroll from "@/components/HideOnScroll";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { AppBar, Box, CssBaseline, Divider, Toolbar } from "@mui/material";
import ScrollTop from "@/components/ScrollTop";
import { Link } from "@/components/Link";
import Image from "next/image";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { getScopedI18n } from "@/locales/server";

export const metadata: Metadata = {
  title: "KubeBlocks",
  description: "Run Any Database on Kubernetes",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const i18nNavigation = await getScopedI18n("navigation");

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
                      <Link href="/docs">{i18nNavigation("docs")}</Link>
                      <Link href="/">{i18nNavigation("databases")}</Link>
                    </Box>
                    <Box
                      sx={{
                        gap: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ThemeSwitcher />
                      <Divider orientation="vertical" sx={{ height: 20 }} />
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
      </body>
    </html>
  );
}
