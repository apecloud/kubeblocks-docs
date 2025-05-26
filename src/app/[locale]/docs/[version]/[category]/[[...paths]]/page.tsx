import { redirect } from "next/navigation";
import path from "path";
import fs from "fs";
import {
  MarkdownPageParams,
  DOCS_DIR,
  getMarkDownMetaData,
  getMarkDownSideBar,
  getFirstMenuItem,
} from "@/utils/markdown";
import _ from "lodash";
import { SidebarMenuItem } from "@/components/SidebarMenu";

export default async function MarkdownPage({
  params,
}: {
  params: Promise<MarkdownPageParams>;
}) {
  const { locale, version, category, paths = [] } = await params;

  /**
   * redirect to default document when docs path is empty;
   */
  const dir = path.join(DOCS_DIR, locale, version, category);
  const defaultEnDir = path.join(DOCS_DIR, "en", version, category);
  let menu: SidebarMenuItem[] = [];
  if (fs.existsSync(dir)) {
    menu = await getMarkDownSideBar(dir);
  } else if (fs.existsSync(defaultEnDir)) {
    menu = await getMarkDownSideBar(defaultEnDir);
  }
  const first = getFirstMenuItem(menu);

  if (_.isEmpty(paths) && first?.href) {
    redirect(first.href);
  }

  /**
   * render markdown.
   */
  const relativePath = path.join(locale, version, category, ...paths);
  const mdxPath = path.join(DOCS_DIR, `${relativePath}.mdx`);

  const defaultRelativeEnPath = path.join("en", version, category, ...paths);
  const defaultMdxEnPath = path.join(DOCS_DIR, `${defaultRelativeEnPath}.mdx`);

  if (fs.existsSync(mdxPath)) {
    const { default: MDXContent } = await import(`@docs/${relativePath}.mdx`);
    return <MDXContent />;
  } else if (fs.existsSync(defaultMdxEnPath)) {
    const { default: MDXContent } = await import(
      `@docs/${defaultRelativeEnPath}.mdx`
    );
    return <MDXContent />;
  } else if (first?.href) {
    redirect(first.href);
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<MarkdownPageParams>;
}) {
  const { locale, version, category, paths = [] } = await params;
  const mdxPath =
    path.join(DOCS_DIR, locale, version, category, ...paths) + ".mdx";

  const defaultDdxEnPath =
    path.join(DOCS_DIR, "en", version, category, ...paths) + ".mdx";

  if (fs.existsSync(mdxPath)) {
    return await getMarkDownMetaData(mdxPath);
  } else {
    return await getMarkDownMetaData(defaultDdxEnPath);
  }
}
