"use client";

import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { DropDown } from "../DropDown";
import { LinkListItemButton } from "../Link";
import { useI18n } from "@/locales/client";
import {
  CodeOutlined,
  ExpandMore,
  SupervisorAccountOutlined,
  TerminalOutlined,
} from "@mui/icons-material";
import { useState } from "react";

export default function DocumentationNav() {
  const [open, setOpen] = useState<boolean>(false);
  const t = useI18n();
  const theme = useTheme();
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
      title: "KubeBlocks CLI",
      description: "KubeBlocks CLI",
      icon: <TerminalOutlined />,
      href: "/docs/preview/cli/cli",
    },
  ];
  return (
    <DropDown
      offset={[0, 14]}
      trigger={
        <Button
          color="inherit"
          sx={{
            paddingInline: 2,
            bgcolor: open ? theme.palette.action.hover : "transparent",
            "&:hover": { bgcolor: theme.palette.action.hover },
          }}
          size="large"
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
      <List>
        
        {documentations.map((item, index) => (
          <ListItem key={index} disablePadding>
            <LinkListItemButton href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.title}</ListItemText>
            </LinkListItemButton>
          </ListItem>
        ))}
      </List>
    </DropDown>
  );
}
