import { BLOGS_DIR, getBlogs } from "@/utils/markdown";
import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";
import { Box } from "@mui/material";
import { getStaticParams } from "@/locales/server";

type ParamsProps = { name: string; locale: string };

export async function generateStaticParams() {
  const localesParams = getStaticParams();
  const fns = localesParams.map(async (item) => await getBlogs(item.locale));
  const data = await Promise.all(fns);
  const result: ParamsProps[] = [];
  localesParams.forEach((item, index) => {
    data[index].forEach((blog) => {
      result.push({
        locale: item.locale,
        name: blog.name,
      });
    });
  });
  return result;
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<ParamsProps>;
}) {
  const { name, locale } = await params;

  const mdxPath = path.join(BLOGS_DIR, locale, `${name}.mdx`);
  const defaultMdxEnPath = path.join(BLOGS_DIR, 'en', `${name}.mdx`);

  if (fs.existsSync(mdxPath)) {
    const { default: MDXContent } = await import(`@blogs/${locale}/${name}.mdx`);
    return (
      <Box pr="300px">
        <MDXContent />
      </Box>
    );
  } else if (fs.existsSync(defaultMdxEnPath)) {
    const _locale = 'en';
    const { default: MDXContent } = await import(`@blogs/${_locale}/${name}.mdx`);
    return (
      <Box pr="300px">
        <MDXContent />
      </Box>
    );
  } else {
    notFound();
  }
}
