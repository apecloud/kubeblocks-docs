"use client";

import {
  Avatar,
  Button,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  useTheme,
} from "@mui/material";
import { DropDown } from "../DropDown";
import { Link } from "../Link";
import { useI18n } from "@/locales/client";
import {
  CodeOutlined,
  ExpandMore,
  SupervisorAccountOutlined,
  TerminalOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import uniqolor from "uniqolor";

export default function DocumentationNav() {
  const [open, setOpen] = useState<boolean>(false);
  const t = useI18n();
  const theme = useTheme();
  const documentations = [
    {
      title: t("navigation.user"),
      description: t("navigation.user"),
      icon: <SupervisorAccountOutlined />,
      href: "/docs/preview/user_docs",
    },
    {
      title: t("navigation.developer"),
      description: t("navigation.developer"),
      icon: <CodeOutlined />,
      href: "/docs/preview/developer_docs",
    },
    {
      title: "KubeBlocks CLI",
      description: "KubeBlocks CLI",
      icon: <TerminalOutlined />,
      href: "/docs/preview/cli",
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
        {documentations.map((item, index) => (
          <MenuItem
            key={index}
            component={Link}
            href={item.href}
            sx={{ paddingBlock: 1.2 }}
          >
            <Stack direction="row" gap={1.5} alignItems="center">
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: uniqolor(item.href).color,
                  width: 32,
                  height: 32,
                  color: '#FFF',
                }}
              >
                {item.icon}
              </Avatar>

              <ListItemText>{item.title}</ListItemText>
            </Stack>
          </MenuItem>
        ))}
      </MenuList>
    </DropDown>
  );
}
