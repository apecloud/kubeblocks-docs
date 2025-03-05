import { Box, Container, Stack, Toolbar } from "@mui/material";
import fs from "fs";
import { SidebarMenu, SidebarMenuItem } from "@/components/SidebarMenu";
import path from "path";
import {
  MarkdownPageParams,
  DOCS_DIR,
  getMarkDownSideBar,
} from "@/utils/markdown";
import Footer from "@/components/Footer";
import { setStaticParamsLocale } from "next-international/server";
import VersionList from "./version";

export default async function DocsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<MarkdownPageParams>;
}>) {

  const { locale, version, category } = await params;
  setStaticParamsLocale(locale);

  const dir = path.join(DOCS_DIR, locale, version, category);
  const defaultEnDir = path.join(DOCS_DIR, "en", version, category);

  let menu: SidebarMenuItem[] = [];

  if (fs.existsSync(dir)) {
    menu = await getMarkDownSideBar(dir);
  } else if (fs.existsSync(defaultEnDir)) {
    menu = await getMarkDownSideBar(defaultEnDir);
  }

  const versions = fs.readdirSync(path.join(DOCS_DIR, locale));

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

          <VersionList version={version} versions={versions} />
          <Box
            flex={1}
            sx={{
              overflow: "auto",
              borderRight: 1,
              borderColor: "var(--css-palette-divider)",
            }}
            pb={1}
            pt={1}
          >
            <SidebarMenu data={menu} />
          </Box>
        </Stack>
      ) : null}
      <Box sx={{ marginLeft: menu.length ? "300px" : 0 }}>
        <Container
          sx={{ minHeight: "var(--container-min-height)", paddingBlock: 3}}
          className="markdown-body"
        >
          {children}
        </Container>
        <Footer border={false} />
      </Box>
    </>
  );
}
