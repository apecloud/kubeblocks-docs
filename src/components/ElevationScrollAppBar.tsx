"use client";

import { AppBar, AppBarProps, useTheme } from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const ElevationScrollAppBar = (props: AppBarProps) => {
  const pathname = usePathname();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const theme = useTheme();

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
        zIndex: theme.zIndex.drawer + 1
      }}
      position="fixed"
    />
  );
};
