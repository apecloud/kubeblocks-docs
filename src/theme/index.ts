import { Theme } from '@mui/material/styles';
import dark from './dark';
import light from './light';

export const THEME_AVAILABLE = ['dark', 'light'] as const;
export const THEME_DEFAULT = 'dark' as const;
export const THEME_COOKIE_NAME = 'theme' as const;

export const THEME_CONFIG = {
  light,
  dark,
};

export type ThemeName = (typeof THEME_AVAILABLE)[number];
export type ThemeConfig = typeof THEME_CONFIG;

export const getMuiTheme = (name?: ThemeName): Theme => {
  let themeName: ThemeName;
  if (name && THEME_AVAILABLE.includes(name)) {
    themeName = name;
  } else {
    themeName = THEME_DEFAULT;
  }
  return THEME_CONFIG[themeName];
};
