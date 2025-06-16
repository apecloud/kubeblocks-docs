import fg from 'fast-glob';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const ROOT_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const OUTPUT = path.join(ROOT_DIR, 'public/docs-index.json');

async function main() {
  // 匹配 docs/en 和 blogs/en 下的 md/mdx 文件，排除 docs/en/**/cli/**
  const files = await fg([
    'docs/en/**/*.md',
    'docs/en/**/*.mdx',
    'blogs/en/**/*.md',
    'blogs/en/**/*.mdx',
    '!docs/en/**/cli/**',
    '!docs/en/**/release_notes',
  ], { cwd: ROOT_DIR, absolute: true });

  const docs = files.map(file => {
    // 统一相对路径
    const relPath = path.relative(ROOT_DIR, file);
    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    // 替换 path 中的 blogs/en 和 docs/en，并去除 .md/.mdx 后缀
    let normPath = relPath.replace(/^blogs\/en\//, 'blogs/').replace(/^docs\/en\//, 'docs/');
    normPath = normPath.replace(/\.(md|mdx)$/, '');

    // 过滤掉 mdx 的 import/export 语句和宏/JSX函数（如 import ...、export ...、<XXX ... />、{ ... }）
    const filteredContent = content
      .split('\n')
      .filter(line =>
        !line.trim().startsWith('import ') &&
        !line.trim().startsWith('export ') &&
        !/^<[A-Z][A-Za-z0-9]*[\s/>]/.test(line.trim()) &&
        !/^\{.*\}$/.test(line.trim())
      )
      .join('\n')
      .replace(/<[^>]+>/g, '') // 去除内联 JSX 标签
      .replace(/\{[^}]+\}/g, ''); // 去除内联 JS 表达式

    const description =  filteredContent.replace(/\n/g, ' ').slice(0, 300);
    return {
      id: relPath.replace(/\//g, '_').replace(/\.(md|mdx)$/, ''),
      title: data.title || path.basename(file),
      content: filteredContent.slice(0, 2000),
      path: normPath,
      description,
    };
  });

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(docs, null, 2), 'utf-8');
  console.log(`Indexed ${docs.length} docs to ${OUTPUT}`);
}

main();