import { existsSync, readFileSync, readdirSync } from 'fs';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { join } from 'path';

export const dynamic = 'force-static'; // force-dynamic | force-static

interface SearchDocument {
  id: string;
  title: string;
  content: string;
  path: string;
  description?: string;
  summary?: string;
  keywords?: string[];
  headings?: Array<{ level: number; text: string }>;
  docType?: string;
  category?: string;
  tags?: string[];
  lastModified?: string;
  wordCount?: number;
}

// 递归获取所有 MDX 文件
function getAllMdxFiles(dir: string, basePath: string = ''): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath, join(basePath, entry.name)));
    } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      files.push(join(basePath, entry.name));
    }
  }

  return files;
}

// Extract title and main content from file content
function extractContent(filePath: string): SearchDocument {
  const content = readFileSync(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);

  // Filter out import/export statements and macro/JSX functions from mdx
  const filteredContent = markdownContent
    .split('\n')
    .filter(
      (line) =>
        !line.trim().startsWith('import ') &&
        !line.trim().startsWith('export ') &&
        !/^<[A-Z][A-Za-z0-9]*[\s/>]/.test(line.trim()) &&
        !/^\{.*\}$/.test(line.trim()),
    )
    .join('\n')
    .replace(/<[^>]+>/g, '') // Remove inline JSX tags
    .replace(/\{[^}]+\}/g, ''); // Remove inline JS expressions

  // Remove markdown syntax, only keep plain text
  const plainContent = filteredContent
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`.*?`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to plain text
    .replace(/#{1,6}\s/g, '') // Remove title markers
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '') // Remove italic markers
    .replace(/\n/g, ' ') // Convert line breaks to spaces
    .replace(/\s+/g, ' ') // Convert multiple spaces to single space
    .trim();

  // Generate summary
  const summary =
    plainContent.length > 200
      ? plainContent.substring(0, 200) + '...'
      : plainContent;

  // Extract keywords
  const keywords = plainContent
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .reduce((acc: string[], word) => {
      if (!acc.includes(word)) acc.push(word);
      return acc;
    }, [])
    .slice(0, 20);

  // Extract title hierarchy
  const headings: Array<{ level: number; text: string }> = [];
  const headingMatches = markdownContent.match(/^#{1,6}\s+.+$/gm);
  if (headingMatches) {
    headingMatches.forEach((heading) => {
      const level = (heading.match(/^#+/) || [''])[0].length;
      const text = heading.replace(/^#+\s+/, '').trim();
      headings.push({ level, text });
    });
  }

  // Determine document type and category
  let docType = 'documentation';
  let category = 'general';

  if (filePath.includes('/blogs/')) {
    docType = 'blog';
    category = 'Blog';
  } else if (filePath.includes('kubeblocks-for-')) {
    const match = filePath.match(/kubeblocks-for-([^/]+)/);
    category = match ? match[1] : 'general';
  } else if (filePath.includes('cli')) {
    category = 'CLI';
  }

  return {
    id: filePath,
    title:
      data.title ||
      data.sidebar_label ||
      filePath
        .split('/')
        .pop()
        ?.replace(/\.mdx?$/, '') ||
      '',
    content: plainContent,
    path: filePath.replace(/\.mdx?$/, ''),
    description: data.description || summary,
    summary,
    keywords,
    headings,
    docType,
    category,
    tags: data.tags || [],
    wordCount: plainContent.split(/\s+/).length,
  };
}

export async function GET() {
  try {
    const rootDir = process.cwd();

    // Only get documents and blog files in the preview directory
    const allFiles: string[] = [];

    // Get files in docs/en/preview
    const previewDir = join(rootDir, 'docs', 'en', 'preview');
    if (existsSync(previewDir)) {
      const previewFiles = getAllMdxFiles(previewDir, 'docs/en/preview');
      allFiles.push(...previewFiles.map((file) => join(rootDir, file)));
    }

    // Get files in blogs/en
    const blogsEnDir = join(rootDir, 'blogs', 'en');
    if (existsSync(blogsEnDir)) {
      const blogFiles = getAllMdxFiles(blogsEnDir, 'blogs/en');
      allFiles.push(...blogFiles.map((file) => join(rootDir, file)));
    }

    const documents = allFiles.map((filePath) => extractContent(filePath));

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error generating search index:', error);
    return NextResponse.json(
      { error: 'Failed to generate search index' },
      { status: 500 },
    );
  }
}
