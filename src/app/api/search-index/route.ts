import { readFileSync, readdirSync } from 'fs';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { join } from 'path';

interface SearchDocument {
  id: string;
  title: string;
  content: string;
  path: string;
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

  // 移除 markdown 语法，只保留纯文本
  const plainContent = markdownContent
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`.*?`/g, '') // 移除行内代码
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 将链接转换为纯文本
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*/g, '') // 移除加粗标记
    .replace(/\*/g, '') // 移除斜体标记
    .replace(/\n/g, ' ') // 将换行转换为空格
    .replace(/\s+/g, ' ') // 将多个空格转换为单个空格
    .trim();

  return {
    id: filePath,
    title:
      data.title ||
      filePath
        .split('/')
        .pop()
        ?.replace(/\.mdx?$/, '') ||
      '',
    content: plainContent,
    path: filePath.replace(/\.mdx?$/, ''),
  };
}

export async function GET() {
  try {
    const docsDir = join(process.cwd(), 'docs');
    const mdxFiles = getAllMdxFiles(docsDir);

    const documents = mdxFiles.map((filePath) =>
      extractContent(join(docsDir, filePath)),
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
