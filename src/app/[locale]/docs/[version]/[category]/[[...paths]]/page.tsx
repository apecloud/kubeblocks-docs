import { getCurrentLocale } from "@/locales/server";

import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";
import {
  MarkdownPageParams,
  DOCS_DIR,
  getMarkDownMetaData,
} from "@/utils/markdown";

export default async function MarkdownPage({
  params,
}: {
  params: MarkdownPageParams;
}) {
  const currentLocale = await getCurrentLocale();
  const { version, category, paths = [] } = await params;
  const relativePath = path.join(currentLocale, version, category, ...paths);
  const mdxPath = path.join(DOCS_DIR, `${relativePath}.mdx`);
  const mdPath = path.join(DOCS_DIR, `${relativePath}.md`);

  if (fs.existsSync(mdxPath)) {
    const { default: MDXContent } = await import(`@docs/${relativePath}.mdx`);
    return <MDXContent />;
  } else if (fs.existsSync(mdPath)) {
    const { default: MDXContent } = await import(`@docs/${relativePath}.md`);
    fs.renameSync(mdPath, mdxPath);
    return <MDXContent />;
  } else {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<MarkdownPageParams>;
}) {
  const currentLocale = await getCurrentLocale();
  const { version, category, paths = [] } = await params;
  const filepath =
    path.join(DOCS_DIR, currentLocale, version, category, ...paths) + ".mdx";

  return await getMarkDownMetaData(filepath);
}
