import { getStaticParams } from '@/locales/server';
import { BLOGS_DIR, getMarkDownMetaData } from '@/utils/markdown';
import fs from 'fs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import path from 'path';

type ParamsProps = { name: string; locale: string };

export async function generateStaticParams() {
  const data: ParamsProps[] = [];
  getStaticParams().forEach((item) => {
    const dir = path.join(BLOGS_DIR, item.locale);
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir)
        .filter((f) => f.endsWith('.mdx'))
        .forEach((f) => {
          data.push({
            locale: item.locale,
            name: f.replace(/\.mdx/, ''),
          });
        });
    }
  });
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ParamsProps>;
}): Promise<Metadata> {
  const { locale, name } = await params;
  const mdxPath = path.join(BLOGS_DIR, locale, `${name}.mdx`);
  const defaultMdxEnPath = path.join(BLOGS_DIR, 'en', `${name}.mdx`);
  const canonicalPath = `/blog/${name}`;

  if (fs.existsSync(mdxPath)) {
    const metadata = (await getMarkDownMetaData(mdxPath)) as Metadata;
    return {
      ...metadata,
      alternates: {
        ...metadata.alternates,
        canonical: canonicalPath,
      },
      openGraph: {
        ...metadata.openGraph,
        url: canonicalPath,
        type: 'article',
      },
    };
  } else {
    const metadata = (await getMarkDownMetaData(defaultMdxEnPath)) as Metadata;
    return {
      ...metadata,
      alternates: {
        ...metadata.alternates,
        canonical: canonicalPath,
      },
      openGraph: {
        ...metadata.openGraph,
        url: canonicalPath,
        type: 'article',
      },
    };
  }
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
    const { default: MDXContent } = await import(
      `@blogs/${locale}/${name}.mdx`
    );
    return <MDXContent />;
  } else if (fs.existsSync(defaultMdxEnPath)) {
    const _locale = 'en';
    const { default: MDXContent } = await import(
      `@blogs/${_locale}/${name}.mdx`
    );
    return <MDXContent />;
  } else {
    notFound();
  }
}
