import { Box, Stack, Toolbar } from "@mui/material";
import fs from "fs";
import { SidebarMenu, SidebarMenuItem } from "@/components/SidebarMenu";
import path from "path";
import { getCurrentLocale } from "@/locales/server";
import {
  MarkdownPageParams,
  DOCS_DIR,
  getMarkDownSideBar,
} from "@/utils/markdown";
import Footer from "@/components/Footer";

export default async function DocsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<MarkdownPageParams>;
}>) {
  const currentLocale = await getCurrentLocale();
  const { version, category } = await params;

  const dir = path.join(DOCS_DIR, currentLocale, version, category);
  const defaultEnDir = path.join(DOCS_DIR, "en", version, category);

  let menu: SidebarMenuItem[] = [];

  if (fs.existsSync(dir)) {
    menu = await getMarkDownSideBar(dir);
  } else if (fs.existsSync(defaultEnDir)) {
    menu = await getMarkDownSideBar(defaultEnDir);
  }

  return (
    <>
      {menu.length ? (
        <Stack
          component="aside"
          sx={{
            width: "300px",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Toolbar />
          <Box
            flex={1}
            sx={{
              overflow: "auto",
              borderRight: 1,
              borderColor: "var(--css-palette-divider)",
            }}
            pt={1}
            pb={1}
          >
            <SidebarMenu data={menu} />
          </Box>
        </Stack>
      ) : null}
      <Box sx={{ marginInline: menu.length ? "300px" : 0 }}>
        <Box
          sx={{
            padding: 3,
            maxWidth: "980px",
            marginInline: "auto",
            minHeight: "calc(100vh - 265px)",
          }}
          className="markdown-body"
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </>
  );
}
