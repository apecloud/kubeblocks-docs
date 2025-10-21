import { SidebarMenuItem } from '@/components/SidebarMenu';
import HtmlRenderer from '@/components/HtmlRenderer';
import { getStaticParams } from '@/locales/server';
import {
  DOCS_DIR,
  getFirstMenuItem,
  getMarkDownMetaData,
  getMarkDownSideBar,
  MarkdownPageParams,
} from '@/utils/markdown';
import fs from 'fs';
import _ from 'lodash';
import matter from 'gray-matter';
import { redirect } from 'next/navigation';
import path from 'path';

export async function generateStaticParams() {
  const data: MarkdownPageParams[] = [];
  const docsDir = path.join(process.cwd(), 'docs');

  const getPaths = (dir: string, initData: string[] = []): string[] => {
    fs.readdirSync(dir).forEach((f) => {
      const d = path.join(dir, f);
      const stat = fs.statSync(d);
      if (stat.isDirectory()) {
        getPaths(d, initData);
      }
      if (stat.isFile() && f.endsWith('.mdx')) {
        initData.push(d);
      }
    });
    return initData;
  };

  getStaticParams().forEach((item) => {
    // locals
    const localeDir = path.join(docsDir, item.locale);

    fs.readdirSync(localeDir).forEach((version) => {
      // versions
      const versionDir = path.join(localeDir, version);
      fs.readdirSync(versionDir).forEach((category) => {
        // categories
        const cateDir = path.join(versionDir, category);
        const paths: string[] = getPaths(cateDir).map((item) =>
          item.replace(cateDir + '/', '').replace('.mdx', ''),
        );

        paths.forEach((p) => {
          const items = p.split('/');
          data.push({
            locale: item.locale,
            version,
            category,
            paths: items,
          });
        });
      });
    });
  });
  return data;
}

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
  const defaultEnDir = path.join(DOCS_DIR, 'en', version, category);
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

  const defaultRelativeEnPath = path.join('en', version, category, ...paths);
  const defaultMdxEnPath = path.join(DOCS_DIR, `${defaultRelativeEnPath}.mdx`);

  // Check if this is an api-reference file
  const isApiReference = paths.some(p => p.includes('api-reference')) ||
                         relativePath.includes('api-reference');

  if (fs.existsSync(mdxPath)) {
    if (isApiReference) {
      // For api-reference files, read as raw HTML
      const fileContent = fs.readFileSync(mdxPath, 'utf-8');
      const { content } = matter(fileContent);
      return (
          <HtmlRenderer content={content} />
      );
    } else {
      const { default: MDXContent } = await import(`@docs/${relativePath}.mdx`);
      return <MDXContent />;
    }
  } else if (fs.existsSync(defaultMdxEnPath)) {
    if (isApiReference) {
      // For api-reference files, read as raw HTML
      const fileContent = fs.readFileSync(defaultMdxEnPath, 'utf-8');
      const { content } = matter(fileContent);
      return (
          <HtmlRenderer content={content} />
      );
    } else {
      const { default: MDXContent } = await import(
        `@docs/${defaultRelativeEnPath}.mdx`
      );
      return <MDXContent />;
    }
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
    path.join(DOCS_DIR, locale, version, category, ...paths) + '.mdx';

  const defaultDdxEnPath =
    path.join(DOCS_DIR, 'en', version, category, ...paths) + '.mdx';

  if (fs.existsSync(mdxPath)) {
    return await getMarkDownMetaData(mdxPath);
  } else {
    return await getMarkDownMetaData(defaultDdxEnPath);
  }
}
