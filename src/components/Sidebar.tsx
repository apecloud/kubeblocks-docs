'use client';

import { useGlobalStore } from '@/store/global';
import { Menu, MenuOpen } from '@mui/icons-material';
import { Drawer, IconButton, Toolbar, useTheme } from '@mui/material';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const width = 280;

  const theme = useTheme();

  const { sidebarCollapsed, isMobile, toggleSidebarCollapsed } =
    useGlobalStore();

  return (
    <>
      {isMobile ? (
        <IconButton
          onClick={() => {
            toggleSidebarCollapsed(!sidebarCollapsed);
          }}
          sx={{
            position: 'fixed',
            top: 12,
            left: 4,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          {!sidebarCollapsed ? <MenuOpen /> : <Menu />}
        </IconButton>
      ) : undefined}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={!sidebarCollapsed}
        sx={{ width }}
        onClose={() => toggleSidebarCollapsed(true)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width,
            background: 'var(--css-palette-background-default)',
          },
        }}
      >
        <Toolbar />
        {children}
      </Drawer>
    </>
  );
}
