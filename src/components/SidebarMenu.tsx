"use client";

import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { Link } from "./Link";
import { useEffect, useState } from "react";
import _ from "lodash";
import Collapse from "@mui/material/Collapse";
import { ExpandMore } from "@mui/icons-material";
import { usePathname } from "next/navigation";

export type SidebarMenuItem = {
  label?: string;
  children?: SidebarMenuItem[];
  href?: string;
  position: number;
  description?: string;
};

type SidebatMenuItemProps = {
  level?: number;
  item: SidebarMenuItem;
  children?: React.ReactNode;
};

const checkOpen = (item: SidebarMenuItem, pathname: string): boolean => {
  const child = item.children?.find((d) => {
    return (
      (d.href && new RegExp(d.href).test(pathname)) || checkOpen(d, pathname)
    );
  });
  return Boolean(child);
};

export function SidebarMenuItem({ level = 1, item }: SidebatMenuItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const sx = {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: 1,
    marginBlock: "1px",
    paddingLeft: level * 2,
    cursor: "pointer",
    color: theme.palette.text.secondary,
    borderLeft: `2px solid transparent`,
    "&:hover": {
      background: theme.palette.divider,
      color: theme.palette.text.primary,
    },
    "&.active": {
      background: theme.palette.divider,
      color: theme.palette.text.primary,
      borderLeftColor: theme.palette.primary.main,
    },
  };

  useEffect(() => {
    const isOpen = checkOpen(item, pathname);
    if (isOpen) {
      setOpen(true);
    }
  }, [pathname, item]);

  return (
    <Box className="item">
      <Box>
        {item.href && _.isEmpty(item.children) ? (
          <Tooltip title={item.description} placement="right" arrow>
            <Link
              className={new RegExp(item.href).test(pathname) ? "active" : undefined}
              href={item.href}
              sx={sx}
              underline="none"
            >
              {item.label}
            </Link>
          </Tooltip>
        ) : (
          <Stack
            direction="row"
            sx={{
              ...sx,
              display: "flex",
            }}
            justifyContent="space-between"
            onClick={() => setOpen(!open)}
            alignItems="center"
          >
            <Typography
              color="textSecondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </Typography>
            <ExpandMore
              sx={{
                transition: "rotate, 0.3s",
                transform: open ? "rotate(0)" : "rotate(-90deg)",
                scale: 0.6,
                opacity: 0.8,
              }}
            />
          </Stack>
        )}
      </Box>
      {!_.isEmpty(item.children) && (
        <Collapse in={open}>
          <SidebarMenu level={level + 1} data={item.children} />
        </Collapse>
      )}
    </Box>
  );
}

type SidebatMenuProps = {
  level?: number;
  data?: SidebarMenuItem[];
  children?: React.ReactNode;
};
export function SidebarMenu({ level = 1, data = [] }: SidebatMenuProps) {
  return data.map((item) => {
    return <SidebarMenuItem level={level} key={item.label} item={item} />;
  });
}
