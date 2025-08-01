'use client';

import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  let icon;
  switch (resolvedTheme) {
    case 'light':
      icon = <LightModeOutlined />;
      break;
    case 'dark':
      icon = <DarkModeOutlined />;
      break;
    default:
      icon = undefined;
      break;
  }

  return (
    <IconButton
      onClick={() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
      }}
    >
      {icon}
    </IconButton>
  );
}
