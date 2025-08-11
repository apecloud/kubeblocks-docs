import { BLOGS_DIR } from '@/utils/markdown';
import fs from 'fs';
import type { MetadataRoute } from 'next';

const lastModified = new Date();

import { getStaticParams } from '@/locales/server';
import path from 'path';
export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

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

        // ignore some category
        if(["release_notes"].includes(category)) {
          return;
        }

        paths.forEach((p) => {
          const items = p.split('/');
          sitemap.push({
            url: `https://kubeblocks.io/docs/${version}/${category}/${items?.join(
              '/',
            )}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.5,
          });
        });
      });
    });
  });

  getStaticParams().forEach((item) => {
    const dir = path.join(BLOGS_DIR, item.locale);
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir)
        .filter((f) => f.endsWith('.mdx'))
        .forEach((f) => {
          sitemap.push({
            url: `https://kubeblocks.io/blog/${f.replace(/\.mdx/, '')}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.5,
          });
        });
    }
  });

  return sitemap;
}
