import { readFileSync, readdirSync } from 'fs';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { join } from 'path';

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

// 从文件内容中提取标题和正文
function extractContent(filePath: string): SearchDocument {
  const content = readFileSync(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);

  // 过滤掉 mdx 的 import/export 语句和宏/JSX函数
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
    .replace(/<[^>]+>/g, '') // 去除内联 JSX 标签
    .replace(/\{[^}]+\}/g, ''); // 去除内联 JS 表达式

  // 移除 markdown 语法，只保留纯文本
  const plainContent = filteredContent
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`.*?`/g, '') // 移除行内代码
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 将链接转换为纯文本
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*/g, '') // 移除加粗标记
    .replace(/\*/g, '') // 移除斜体标记
    .replace(/\n/g, ' ') // 将换行转换为空格
    .replace(/\s+/g, ' ') // 将多个空格转换为单个空格
    .trim();

  // 生成摘要
  const summary = plainContent.length > 200 ?
    plainContent.substring(0, 200) + '...' :
    plainContent;

  // 提取关键词
  const keywords = plainContent
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .reduce((acc: string[], word) => {
      if (!acc.includes(word)) acc.push(word);
      return acc;
    }, [])
    .slice(0, 20);

  // 提取标题层级
  const headings: Array<{ level: number; text: string }> = [];
  const headingMatches = markdownContent.match(/^#{1,6}\s+.+$/gm);
  if (headingMatches) {
    headingMatches.forEach(heading => {
      const level = (heading.match(/^#+/) || [''])[0].length;
      const text = heading.replace(/^#+\s+/, '').trim();
      headings.push({ level, text });
    });
  }

  // 确定文档类型和类别
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

    // 只获取preview目录下的文档和博客文件
    const allFiles: string[] = [];

    // 获取docs/en/preview下的文件
    const previewDir = join(rootDir, 'docs', 'en', 'preview');
    if (require('fs').existsSync(previewDir)) {
      const previewFiles = getAllMdxFiles(previewDir, 'docs/en/preview');
      allFiles.push(...previewFiles.map(file => join(rootDir, file)));
    }

    // 获取blogs/en下的文件
    const blogsEnDir = join(rootDir, 'blogs', 'en');
    if (require('fs').existsSync(blogsEnDir)) {
      const blogFiles = getAllMdxFiles(blogsEnDir, 'blogs/en');
      allFiles.push(...blogFiles.map(file => join(rootDir, file)));
    }

    const documents = allFiles.map((filePath) =>
      extractContent(filePath),
    );

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error generating search index:', error);
    return NextResponse.json(
      { error: 'Failed to generate search index' },
      { status: 500 },
    );
  }
}
