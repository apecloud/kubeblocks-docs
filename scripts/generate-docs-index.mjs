import fg from 'fast-glob';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const ROOT_DIR = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  '..',
);
const OUTPUT = path.join(ROOT_DIR, 'public/docs-index.json');

// Simple keyword extraction implementation
function extractKeywords(text, minLength = 3, maxCount = 20) {
  // Common stop words
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'was', 'were',
    'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'must', 'shall', 'of', 'in', 'for', 'with', 'by',
    'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'to', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'can', 'just', 'now', 'also', 'if', 'this',
    'that', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours',
    'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him',
    'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
    'they', 'them', 'their', 'theirs', 'themselves'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word =>
      word.length >= minLength &&
      !stopWords.has(word) &&
      !/^\d+$/.test(word)
    );

  // Calculate word frequency
  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // Sort by frequency and return top N words
  return Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxCount)
    .map(([word]) => word);
}

// 生成摘要
function generateSummary(content, maxLength = 200) {
  // 移除markdown语法
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // 找到最后一个完整句子
  const truncated = plainText.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );

  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }

  return truncated + '...';
}

// 提取文档类型和类别
function extractMetadata(filePath, frontmatter) {
  const segments = filePath.split('/');
  let category = '';
  let docType = '';

  if (filePath.startsWith('blogs/')) {
    docType = 'blog';
    category = 'Blog';
  } else if (filePath.startsWith('docs/')) {
    docType = 'documentation';

    // 从路径中提取产品类别
    const productMatch = filePath.match(/docs\/en\/[^/]*\/kubeblocks-for-([^/]+)/);
    if (productMatch) {
      category = productMatch[1];
    } else if (filePath.includes('user_docs')) {
      category = 'user-guide';
    } else if (filePath.includes('cli')) {
      category = 'cli';
    } else if (filePath.includes('release_notes')) {
      category = 'release-notes';
    } else {
      category = 'general';
    }
  }

  return {
    docType,
    category,
    tags: frontmatter.tags || [],
    sidebar_position: frontmatter.sidebar_position,
    sidebar_label: frontmatter.sidebar_label,
  };
}

async function main() {
  // 只匹配 docs/en/preview 和 blogs/en 下的 md/mdx 文件，排除 CLI 和 release notes
  const files = await fg(
    [
      'docs/en/preview/**/*.md',
      'docs/en/preview/**/*.mdx',
      'blogs/en/**/*.md',
      'blogs/en/**/*.mdx',
      '!docs/en/preview/**/cli/**',
      '!docs/en/preview/**/release_notes/**',
      '!docs/en/release-*/**',  // 明确排除所有release版本目录
    ],
    { cwd: ROOT_DIR, absolute: true },
  );

  const docs = files.map((file) => {
    // 统一相对路径
    const relPath = path.relative(ROOT_DIR, file);
    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);

    // 替换 path 中的 blogs/en 和 docs/en，并去除 .md/.mdx 后缀
    let normPath = relPath
      .replace(/^blogs\/en\//, 'blog/')
      .replace(/^docs\/en\//, 'docs/');
    normPath = normPath.replace(/\.(md|mdx)$/, '');

    // 过滤掉 mdx 的 import/export 语句和宏/JSX函数
    const filteredContent = content
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

    // 提取更多内容，不限制在2000字符
    const fullContent = filteredContent;

    // 生成摘要和关键词
    const summary = generateSummary(filteredContent);
    const keywords = extractKeywords(filteredContent);
    const metadata = extractMetadata(relPath, data);

    // 提取标题层级结构
    const headings = [];
    const headingMatches = content.match(/^#{1,6}\s+.+$/gm);
    if (headingMatches) {
      headingMatches.forEach(heading => {
        const level = (heading.match(/^#+/) || [''])[0].length;
        const text = heading.replace(/^#+\s+/, '').trim();
        headings.push({ level, text });
      });
    }

    return {
      id: relPath.replace(/\//g, '_').replace(/\.(md|mdx)$/, ''),
      title: data.title || data.sidebar_label || path.basename(file, path.extname(file)),
      content: fullContent,
      path: normPath,
      description: data.description || summary,
      summary,
      keywords,
      headings,
      ...metadata,
      // 保留原有字段以兼容现有搜索
      lastModified: fs.statSync(file).mtime.toISOString(),
      wordCount: fullContent.split(/\s+/).length,
    };
  });

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(docs, null, 2), 'utf-8');
  console.log(`Indexed ${docs.length} docs to ${OUTPUT}`);
}

main();
