import { BLOGS_DIR } from "@/utils/markdown";
import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";

type ParamsProps = { name: string; locale: string };

export default async function BlogDetail({
  params,
}: {
  params: Promise<ParamsProps>;
}) {
  const { name, locale } = await params;

  const mdxPath = path.join(BLOGS_DIR, locale, `${name}.mdx`);
  const defaultMdxEnPath = path.join(BLOGS_DIR, "en", `${name}.mdx`);

  if (fs.existsSync(mdxPath)) {
    const { default: MDXContent } = await import(
      `@blogs/${locale}/${name}.mdx`
    );
    return <MDXContent />;
  } else if (fs.existsSync(defaultMdxEnPath)) {
    const _locale = "en";
    const { default: MDXContent } = await import(
      `@blogs/${_locale}/${name}.mdx`
    );
    return <MDXContent />;
  } else {
    notFound();
  }
}
