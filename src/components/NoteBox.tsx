"use client";

import { Box, Stack, useTheme } from "@mui/material";
import React from "react";
import { alpha } from "@mui/material";
import {
  ErrorOutlineOutlined,
  LightbulbOutlined,
  SmsFailedOutlined,
  ThumbUpOutlined,
} from "@mui/icons-material";

export interface NoteBoxProps {
  title?: string;
  type?: "default" | "success" | "info" | "warning" | "error";
  children?: React.ReactNode;
}

export default function NoteBox({ children, title, type = "default" }: NoteBoxProps) {
  const theme = useTheme();
  let color: string;
  let icon;
  switch (type) {
    case "success":
      color = theme.palette.success.main;
      icon = <ThumbUpOutlined />;
      break;
    case "info":
      color = theme.palette.info.main;
      icon = <LightbulbOutlined />;
      break;
    case "warning":
      color = theme.palette.warning.main;
      icon = <SmsFailedOutlined />;
      break;
    case "error":
      color = theme.palette.error.main;
      icon = <ErrorOutlineOutlined />;
      break;
    default:
      color = theme.palette.text.disabled;
  }
  return (
    <Box
      sx={{
        borderLeft: 4,
        borderColor: color,
        background: alpha(color, 0.15),
        borderRadius: "4px",
      }}
      p={2}
      pl={3}
      mt={4}
      mb={4}
    >
      {title && (
        <Stack
          direction="row"
          gap={1}
          color={color}
          sx={{ fontWeight: "bold" }}
        >
          {icon}
          {title}
        </Stack>
      )}
      {children}
    </Box>
  );
}
