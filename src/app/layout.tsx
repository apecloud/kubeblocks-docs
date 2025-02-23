import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { MuiThemeProvider } from "@/components/MuiThemeProvider";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ScrollTop from "@/components/ScrollTop";
import { LinkButton, LinkCardActionArea } from "@/components/Link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { getCurrentLocale, getI18n } from "@/locales/server";
import I18nProvider from "@/components/I18nProvider";
import { NextThemeProvider } from "@/components/NextThemeProvider";
import {
  CodeOutlined,
  GitHub,
  LaunchOutlined,
  SupervisorAccountOutlined,
  TerminalOutlined,
} from "@mui/icons-material";
import uniqolor from "uniqolor";
import Logo from "@/components/Logo";
import { DropDown } from "@/components/DropDown";

import "./global.css";

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

  const documentations = [
    {
      title: t("navigation.user"),
      description: t("navigation.user"),
      icon: <SupervisorAccountOutlined />,
      href: "/docs/preview/user_docs/overview/introduction",
    },
    {
      title: t("navigation.developer"),
      description: t("navigation.developer"),
      icon: <CodeOutlined />,
      href: "/docs/preview/developer_docs/overview",
    },
    {
      title: "Command Line",
      description: "Command Line",
      icon: <TerminalOutlined />,
      href: "/docs/preview/cli/cli",
    },
  ];

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
                    <Box
                      sx={{
                        flexGrow: 1,
                        paddingInline: 4,
                        display: "flex",
                        gap: 1,
                      }}
                      component="nav"
                      alignItems="center"
                    >
                      <DropDown
                        offset={[0, 14]}
                        trigger={
                          <Button
                            color="inherit"
                            sx={{ paddingInline: 2 }}
                            size="large"
                          >
                            {t("navigation.documentation")}
                          </Button>
                        }
                        sx={{ width: 400 }}
                        placement="bottom-start"
                      >
                        <Stack divider={<Divider />}>
                          {documentations.map((item, index) => (
                            <Card key={index} sx={{ boxShadow: "none" }}>
                              <LinkCardActionArea
                                href={item.href}
                                underline="none"
                              >
                                <CardContent>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={2}
                                  >
                                    <Avatar
                                      sx={
                                        {
                                          // background: uniqolor(item.title).color,
                                        }
                                      }
                                    >
                                      {item.icon}
                                    </Avatar>
                                    <Box>
                                      <Typography>{item.title}</Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        {item.description}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </CardContent>
                              </LinkCardActionArea>
                            </Card>
                          ))}
                        </Stack>
                      </DropDown>
                      <LinkButton
                        color="inherit"
                        href="/"
                        size="large"
                        sx={{ paddingInline: 2 }}
                      >
                        {t("navigation.databases")}
                      </LinkButton>
                      <LinkButton
                        color="inherit"
                        href="/"
                        size="large"
                        sx={{ paddingInline: 2 }}
                      >
                        Blogs
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
                    </Box>
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
