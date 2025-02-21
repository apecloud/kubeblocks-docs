"use client";

import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { alpha } from "@mui/material";

interface Props {
  title?: string;
  type?: "default" | "success" | "info" | "warning" | "error";
  children?: React.ReactElement<unknown>;
}

export default function NoteBox({ children, title, type = "default" }: Props) {
  const theme = useTheme();
  let color: string;
  switch (type) {
    case "success":
      color = theme.palette.success.main;
      break;
    case "info":
      color = theme.palette.info.main;
      break;
    case "warning":
      color = theme.palette.warning.main;
      break;
    case "error":
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.text.disabled;
  }
  return (
    <Box sx={{ borderLeft: 4, borderColor: color, background: alpha(color, 0.15) }} p={2} pl={3} mt={4} mb={4}>
      {title && <Typography color={color} sx={{ fontWeight: 'bold' }}>{title}</Typography>}
      {children}
    </Box>
  );
}
