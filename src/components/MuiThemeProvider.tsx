"use client";
import { ThemeProvider } from "@mui/material";
import { getMuiTheme, ThemeName } from "@/theme";
import { useTheme } from "next-themes";

interface LayoutBasicProps {
  children?: React.ReactNode;
}

export const MuiThemeProvider = ({ children }: LayoutBasicProps) => {
  const { resolvedTheme } = useTheme();
  const theme = getMuiTheme(resolvedTheme as ThemeName);
  
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
