import { Box, Container, Stack } from "@mui/material";
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
import Sidebar from "@/components/Sidebar";

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
      <Stack direction="row">
        {menu.length ? (
          <Sidebar>
            <VersionList version={version} versions={versions} />
            <Box
              flex={1}
              sx={{
                overflow: "auto",
              }}
              pb={1}
              pt={1}
            >
              <SidebarMenu data={menu} />
            </Box>
          </Sidebar>
        ) : null}

        <Container sx={{ paddingBlock: 3 }}>
          <Box
            className="markdown-body with-sidebar"
            sx={{ minHeight: "var(--container-min-height)" }}
          >
            {children}
          </Box>

          <Footer border={false} />
        </Container>
      </Stack>
    </>
  );
}
