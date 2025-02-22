import { Box, Chip, Stack, Toolbar } from "@mui/material";
import fs from "fs";
import { SidebarMenu } from "@/components/SidebarMenu";
import path from "path";
import { getCurrentLocale } from "@/locales/server";
import {
  MarkdownPageParams,
  DOCS_DIR,
  getMarkDownSideBar,
} from "@/utils/markdown";

import "highlight.js/styles/github-dark.css";
import "./style.css";
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
  const menu = fs.existsSync(dir) ? await getMarkDownSideBar(dir) : [];
  return (
    <>
      {menu.length && (
        <Stack
          component="aside"
          sx={{
            width: "300px",
            borderRight: 1,
            borderColor: "var(--css-palette-divider)",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Toolbar />
          <Box flex={1} sx={{ overflow: "auto" }} pt={1} pb={1}>
            <SidebarMenu data={menu} />
          </Box>
        </Stack>
      )}
      <Box sx={{ marginLeft: menu.length ? "300px" : 0, marginRight: "300px" }}>
        <Box
          sx={{
            padding: 3,
            maxWidth: "1440px",
            marginInline: "auto",
            minHeight: "calc(100vh - 265px)",
          }}
        >
          <Chip color="primary" size="small" label={`Version: ${version}`} />
          <Box className="markdown-body">
            {children}
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
}
