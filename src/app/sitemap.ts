import { BLOGS_DIR, DOCS_DIR } from '@/utils/markdown';
import { getSiteUrl } from '@/utils/site';
import fs from 'fs';
import type { MetadataRoute } from 'next';
import path from 'path';

import { getStaticParams } from '@/locales/server';
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const sitemap: MetadataRoute.Sitemap = [];

  const withLocalePath = (locale: string, routePath: string) => {
    if (locale === 'en') {
      return routePath;
    }
    return `/${locale}${routePath}`;
  };

  const addStaticRoute = (
    routePath: string,
    locale = 'en',
    priority = 0.7,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly',
  ) => {
    sitemap.push({
      url: `${siteUrl}${withLocalePath(locale, routePath)}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    });
  };

  const getMdxFiles = (dir: string, files: string[] = []): string[] => {
    if (!fs.existsSync(dir)) {
      return files;
    }

    fs.readdirSync(dir).forEach((entryName) => {
      if (entryName.startsWith('_')) {
        return;
      }
      const entryPath = path.join(dir, entryName);
      const stat = fs.statSync(entryPath);
      if (stat.isDirectory()) {
        getMdxFiles(entryPath, files);
        return;
      }
      if (stat.isFile() && entryName.endsWith('.mdx')) {
        files.push(entryPath);
      }
    });

    return files;
  };

  addStaticRoute('/', 'en', 1, 'daily');
  addStaticRoute('/blog', 'en', 0.8, 'daily');

  getStaticParams().forEach((item) => {
    const localeDir = path.join(DOCS_DIR, item.locale);

    if (!fs.existsSync(localeDir)) {
      return;
    }

    if (item.locale !== 'en') {
      addStaticRoute('/', item.locale, 0.9, 'daily');
      addStaticRoute('/blog', item.locale, 0.7, 'weekly');
    }

    const versions = fs.readdirSync(localeDir);

    versions.forEach((version) => {
      const versionDir = path.join(localeDir, version);
      if (!fs.statSync(versionDir).isDirectory()) {
        return;
      }
      const categories = fs.readdirSync(versionDir);

      categories.forEach((category) => {
        if (category.startsWith('_') || category === 'release_notes') {
          return;
        }

        const categoryDir = path.join(versionDir, category);
        if (!fs.statSync(categoryDir).isDirectory()) {
          return;
        }

        const files = getMdxFiles(categoryDir);
        files.forEach((filePath) => {
          const relative = filePath
            .replace(`${categoryDir}/`, '')
            .replace(/\.mdx$/, '');

          if (relative.split('/').some((segment) => segment.startsWith('_'))) {
            return;
          }

          const routePath = `/docs/${version}/${category}/${relative}`;
          const fileLastModified = fs.statSync(filePath).mtime;

          sitemap.push({
            url: `${siteUrl}${withLocalePath(item.locale, routePath)}`,
            lastModified: fileLastModified,
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        });
      });
    });
  });

  getStaticParams().forEach((item) => {
    const dir = path.join(BLOGS_DIR, item.locale);
    if (!fs.existsSync(dir)) {
      return;
    }

    fs.readdirSync(dir)
      .filter((f) => f.endsWith('.mdx'))
      .forEach((f) => {
        const filePath = path.join(dir, f);
        const fileLastModified = fs.statSync(filePath).mtime;
        const slug = f.replace(/\.mdx/, '');
        const routePath = `/blog/${slug}`;

        sitemap.push({
          url: `${siteUrl}${withLocalePath(item.locale, routePath)}`,
          lastModified: fileLastModified,
          changeFrequency: 'weekly',
          priority: 0.5,
        });
      });
  });

  addStaticRoute('/llms.txt', 'en', 0.5, 'weekly');
  addStaticRoute('/llms-full.txt', 'en', 0.4, 'weekly');

  return sitemap;
}
