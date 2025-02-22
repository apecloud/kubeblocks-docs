import { Box, Chip, Container, Divider, Stack } from "@mui/material";
import fs from "fs";
import "highlight.js/styles/github-dark.css";
import "./style.css";
import Footer from "@/components/Footer";

import path from "path";
import { getCurrentLocale } from "@/locales/server";
import { MarkdownPageParams, DOCS_DIR, getMarkDownSideBar } from "@/utils/markdown";

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
  const sidebarData = fs.existsSync(dir) ? await getMarkDownSideBar(dir) : [];
  console.log(sidebarData);
  return (
    <>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
      >
        {sidebarData.length && (
          <Box component="aside" sx={{ width: 240 }}>
            sidebar
          </Box>
        )}
        <Container sx={{ marginTop: 3, marginBottom: 3 }}>
          <Chip color="primary" size="small" label={`Version: ${version}`} />
          <Box
            className="markdown-body"
            sx={{ paddingRight: "260px", position: "relative" }}
          >
            {children}
          </Box>
        </Container>
      </Stack>
      <Footer />
    </>
  );
}
