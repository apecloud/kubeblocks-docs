"use client";

import { useGlobalStore } from "@/store/global";
import {
  AppBar,
  AppBarProps,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import DocumentationNav from "./nav-document";
import DatabasesNav from "./nav-databases";
import { GitHub, LaunchOutlined } from "@mui/icons-material";
import ThemeSwitcher from "./theme-switch";
import { useI18n } from "@/locales/client";
import Link from "next/link";

// import LocaleSwitcher from "./locale-switch";

export const ElevationScrollAppBar = (props: AppBarProps) => {
  const pathname = usePathname();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const t = useI18n();
  const theme = useTheme();

  const { isMobile, setIsMobile, toggleSidebarCollapsed } = useGlobalStore();

  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setIsMobile(mobile);
    toggleSidebarCollapsed(mobile);
  }, [mobile, setIsMobile, toggleSidebarCollapsed]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <AppBar
      {...props}
      sx={{
        boxShadow: trigger ? `0 10px 10px rgba(0,0,0, 0.1)` : "none",
        zIndex: theme.zIndex.drawer + 1,
        paddingInline: isMobile ? 2 : 0,
      }}
      position="fixed"
    >
      <Toolbar>
        <Stack direction="row" spacing={1}>
          <Link
            href="/"
            style={{ display: "block" }}
            underline="none"
            color="textPrimary"
          >
            <Image
              src="/logo.png"
              alt="KubeBlocks"
              width={165}
              height={36}
              style={{ display: "block" }}
            />
          </Link>
        </Stack>
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
            sx={{
              paddingInline: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
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
            sx={{
              paddingInline: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            KubeBlocks Cloud
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
          {/* <LocaleSwitcher /> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
