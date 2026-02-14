import { normalizeRoutePath, readLlmDocEntries } from '@/utils/llms';
import { toAbsoluteUrl } from '@/utils/site';

export async function GET() {
  const entries = readLlmDocEntries().sort((a, b) =>
    a.path.localeCompare(b.path),
  );

  const lines: string[] = [
    '# KubeBlocks LLM Full Index',
    '',
    `- Generated from: ${toAbsoluteUrl('/docs-index.json')}`,
    `- Site: ${toAbsoluteUrl('/')}`,
    '',
    '## URLs',
    ...entries.map((entry) => {
      const title = entry.title || entry.path;
      const absoluteUrl = toAbsoluteUrl(normalizeRoutePath(entry.path));
      return `- ${title}: ${absoluteUrl}`;
    }),
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
