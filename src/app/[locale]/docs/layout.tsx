import { Box } from "@mui/material";

import "highlight.js/styles/tomorrow-night-bright.css";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box sx={{ maxWidth: 1280, margin: '0 auto' }}>
      {children}
    </Box>
  )
}