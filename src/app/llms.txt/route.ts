import { normalizeRoutePath, readLlmDocEntries } from '@/utils/llms';
import { toAbsoluteUrl } from '@/utils/site';

export async function GET() {
  const entries = readLlmDocEntries();
  const docsEntries = entries.filter((entry) =>
    entry.path.startsWith('docs/preview/'),
  );
  const blogEntries = entries.filter((entry) => entry.path.startsWith('blog/'));

  const quickstarts = docsEntries
    .filter((entry) => /\/02-quickstart$/.test(entry.path))
    .sort((a, b) => a.path.localeCompare(b.path))
    .slice(0, 30);

  const overviews = docsEntries
    .filter((entry) => /\/01-overview$/.test(entry.path))
    .sort((a, b) => a.path.localeCompare(b.path))
    .slice(0, 30);

  const latestBlogs = [...blogEntries]
    .sort((a, b) =>
      (b.lastModified || '').localeCompare(a.lastModified || ''),
    )
    .slice(0, 20);

  const lines: string[] = [
    '# KubeBlocks LLM Index',
    '',
    `- Site: ${toAbsoluteUrl('/')}`,
    `- Full index: ${toAbsoluteUrl('/llms-full.txt')}`,
    `- XML sitemap: ${toAbsoluteUrl('/sitemap.xml')}`,
    '',
    '## Product quickstarts',
    ...quickstarts.map(
      (entry) =>
        `- ${entry.title || entry.path}: ${toAbsoluteUrl(
          normalizeRoutePath(entry.path),
        )}`,
    ),
    '',
    '## Product overviews',
    ...overviews.map(
      (entry) =>
        `- ${entry.title || entry.path}: ${toAbsoluteUrl(
          normalizeRoutePath(entry.path),
        )}`,
    ),
    '',
    '## Recent blogs',
    ...latestBlogs.map(
      (entry) =>
        `- ${entry.title || entry.path}: ${toAbsoluteUrl(
          normalizeRoutePath(entry.path),
        )}`,
    ),
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
