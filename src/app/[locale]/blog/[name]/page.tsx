import { getCurrentLocale } from "@/locales/server";
import { DOCS_DIR } from "@/utils/markdown";
import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";
import { Box } from "@mui/material";

export default async function BlogDetail({ params }: { params: Promise<{ name: string }> }) {
  const currentLocale = await getCurrentLocale();
  const { name } = await params;

  const relativePath = path.join(currentLocale, "blogs");
  const mdxPath = path.join(DOCS_DIR, `${relativePath}/${name}.mdx`);

  const defaultRelativeEnPath = path.join("en", "blogs");
  const defaultMdxEnPath = path.join(DOCS_DIR, 'en', "blogs", `${relativePath}/${name}.mdx`);

   if (fs.existsSync(mdxPath)) {
      const { default: MDXContent } = await import(`@docs/${relativePath}/${name}.mdx`);
      return <Box pr="300px"><MDXContent /></Box>;
    } else if (fs.existsSync(defaultMdxEnPath)) {
      const { default: MDXContent } = await import(
        `@docs/${defaultRelativeEnPath}.mdx`
      );
      return <Box pr="300px"><MDXContent /></Box>;
    } else {
      notFound();
    }
}