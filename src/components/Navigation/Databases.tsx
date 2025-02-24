"use client";

import {
  Button,
  useTheme,
} from "@mui/material";
import { DropDown } from "../DropDown";
import { useI18n } from "@/locales/client";
import {
  ExpandMore,
} from "@mui/icons-material";
import { useState } from "react";

export default function DatabasesNav() {
  const [open, setOpen] = useState<boolean>(false);
  const t = useI18n();
  const theme = useTheme();
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
          {t("navigation.databases")}
        </Button>
      }
      onChange={(v) => setOpen(v)}
      sx={{ width: 280 }}
      placement="bottom-start"
    >
      asdasd
    </DropDown>
  );
}
