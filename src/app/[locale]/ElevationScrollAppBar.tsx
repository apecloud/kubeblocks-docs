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
import { useEffect, useState } from "react";
import Image from "next/image";
import DocumentationNav from "./nav-document";
import DatabasesNav from "./nav-databases";
import { GitHub, LaunchOutlined, Search as SearchIcon } from "@mui/icons-material";
import ThemeSwitcher from "./theme-switch";
import { useI18n } from "@/locales/client";
import Link from "next/link";
import SearchModal from "@/components/SearchModal";
import { SlackIconNoColor } from "@/components/icons";

import LocaleSwitcher from "./locale-switch";

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

  const [showSearch, setShowSearch] = useState(false);

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

  // 监听快捷键
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
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
            <Box sx={{ minWidth: 36, maxWidth: 40, flex: 0 }}>
              <IconButton onClick={() => setShowSearch(true)}>
                <SearchIcon />
              </IconButton>
            </Box>
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
              href="https://kubeblocks.slack.com"
              target="_blank"
            >
              <SlackIconNoColor />
            </IconButton>
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
      <SearchModal open={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};
