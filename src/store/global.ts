import { create } from "zustand";

interface GlobalStore {
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: (collapsed: boolean) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isMobile: false,
  setIsMobile: (mobile) => set(() => ({ isMobile: mobile })),
  sidebarCollapsed: false,
  toggleSidebarCollapsed: (collapsed) =>
    set(() => ({ sidebarCollapsed: collapsed })),
}));
