"use client";

import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  useTheme,
} from "@mui/material";
import { useI18n } from "@/locales/client";
import {
  DataObjectOutlined,
  ExpandMore,
  PermIdentityOutlined,
  PestControlOutlined,
  DataArray,
} from "@mui/icons-material";
import { useState } from "react";
import { DropDown } from "@/components/DropDown";
import { Link } from "@/components/Link";

export default function DocumentationNav() {
  const [open, setOpen] = useState<boolean>(false);
  const t = useI18n();
  const theme = useTheme();
  const documentations = [
    {
      title: t("navigation.user"),
      description: t("navigation.user"),
      icon: <PermIdentityOutlined />,
      href: "/docs/preview/user_docs",
    },
    {
      title: "KubeBlocks CLI",
      description: "KubeBlocks CLI",
      icon: <DataObjectOutlined />,
      href: "/docs/preview/cli",
    },
    {
      title: "API Reference",
      description: "API Reference",
      icon: <DataArray />,
      href: "/docs/preview/user_docs/references/api-reference/cluster",
    },
    {
      type: "divider",
    },
    {
      title: t("navigation.reports"),
      description: t("navigation.reports"),
      icon: <PestControlOutlined />,
      href: "/reports",
    },
  ];
  return (
    <DropDown
      offset={[0, 13]}
      trigger={
        <Button
          color="inherit"
          size="large"
          sx={{
            paddingInline: 2,
            bgcolor: open ? theme.palette.action.hover : "transparent",
            "&:hover": { bgcolor: theme.palette.action.hover },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          endIcon={
            <ExpandMore
              sx={{
                transition: "rotate, 0.3s",
                transform: open ? "rotate(-180deg)" : "rotate(0deg)",
                scale: 0.6,
                opacity: 0.8,
              }}
            />
          }
        >
          {t("navigation.documentation")}
        </Button>
      }
      onChange={(v) => setOpen(v)}
      sx={{ width: 280 }}
      placement="bottom-start"
    >
      <MenuList dense>
        {documentations.map((item, index) => {
          if (item.type === "divider") {
            return <Divider key={index} />;
          } else if (item.href) {
            return (
              <MenuItem
                key={index}
                component={Link}
                href={item.href}
                sx={{ paddingBlock: 1.5 }}
              >
                <ListItemIcon>
                {item.icon}
                </ListItemIcon>
                <ListItemText>{item.title}</ListItemText>
              </MenuItem>
            );
          }
        })}
      </MenuList>
    </DropDown>
  );
}
