"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { Link } from "./Link";
import { useState } from "react";
import _ from "lodash";
import Collapse from "@mui/material/Collapse";
import { ExpandMore } from "@mui/icons-material";

export type SidebarMenuItem = {
  label?: string;
  children?: SidebarMenuItem[];
  href?: string;
  position: number;
};

type SidebatMenuItemProps = {
  level?: number;
  item: SidebarMenuItem;
  children?: React.ReactNode;
};

export function SidebarMenuItem({ level = 1, item }: SidebatMenuItemProps) {
  const [open, setOpen] = useState<boolean>(true);
  const theme = useTheme();
  const sx = {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "6px",
    paddingLeft: level * 2,
    transitionDuration: "0.3s",
    fontSize: '0.9em',
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.divider,
    },
  };
  return (
    <Box className="item">
      <Box>
        {item.href && _.isEmpty(item.children) ? (
          <Link href={item.href} sx={sx} underline="none" color="textPrimary">
            {item.label}
          </Link>
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
                fontSize: '0.9em',
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
