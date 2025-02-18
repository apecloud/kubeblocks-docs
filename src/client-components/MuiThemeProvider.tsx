'use client';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getMuiTheme, ThemeName } from "@/theme";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LayoutBasicProps {
  children?: React.ReactNode;
}

export const MuiThemeProvider = ({ children }: LayoutBasicProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  console.log(resolvedTheme)

  const theme = getMuiTheme(resolvedTheme as ThemeName);


  // useEffect(() => {
  //   setMounted(true)
  // }, [])

  // if (!mounted) {
  //   return null
  // }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </>
  );
};
