"use client";

import { Box, Fade } from "@mui/material";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

interface LayoutBasicProps {
  children?: React.ReactNode;
}

export const NextThemeProvider = ({ children }: LayoutBasicProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const element = (
    <Fade
      in={mounted}
      timeout={{
        enter: 600,
      }}
    >
      <Box>{children}</Box>
    </Fade>
  );

  return mounted ? <ThemeProvider>{element}</ThemeProvider> : element;
};
