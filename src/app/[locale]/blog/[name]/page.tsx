import { DOCS_DIR, getBlogs } from "@/utils/markdown";
import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";
import { Box } from "@mui/material";
import { getStaticParams } from "@/locales/server";

type ParamsProps = { name: string; locale: string }

export async function generateStaticParams() {
  const localesParams = getStaticParams();
  const fns = localesParams.map(async (item) => await getBlogs(item.locale));
  const data = await Promise.all(fns);
  const result: ParamsProps[] = [];
  localesParams.forEach((item, index) => {
    data[index].forEach(blog => {
      result.push({
        locale: item.locale,
        name: blog.name
      })
    })
  })
  return result;
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<ParamsProps>;
}) {
  const { name, locale } = await params;

  const relativePath = path.join(locale, "blogs");
  const mdxPath = path.join(DOCS_DIR, `${relativePath}/${name}.mdx`);

  const defaultRelativeEnPath = path.join("en", "blogs");
  const defaultMdxEnPath = path.join(
    DOCS_DIR,
    "en",
    "blogs",
    `${relativePath}/${name}.mdx`
  );

  if (fs.existsSync(mdxPath)) {
    const { default: MDXContent } = await import(
      `@docs/${relativePath}/${name}.mdx`
    );
    return (
      <Box pr="300px">
        <MDXContent />
      </Box>
    );
  } else if (fs.existsSync(defaultMdxEnPath)) {
    const { default: MDXContent } = await import(
      `@docs/${defaultRelativeEnPath}.mdx`
    );
    return (
      <Box pr="300px">
        <MDXContent />
      </Box>
    );
  } else {
    notFound();
  }
}
