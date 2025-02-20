'use client';
import { ThemeProvider } from "@mui/material";
import { getMuiTheme, ThemeName } from "@/theme";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LayoutBasicProps {
  children?: React.ReactNode;
}

export const MuiThemeProvider = ({ children }: LayoutBasicProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const theme = getMuiTheme(resolvedTheme as ThemeName);

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ display: 'none' }}>{children}</div>
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </>
  );
};
