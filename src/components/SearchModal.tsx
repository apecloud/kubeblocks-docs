import SearchIcon from '@mui/icons-material/Search';
import MiniSearch from 'minisearch';
import { useEffect, useRef, useState } from 'react';
import { searchModalStyles } from '@/styles/searchModal.styles';

interface SearchResult {
  id: string;
  title: string;
  path: string;
  content: string;
  description?: string;
  summary?: string;
  keywords?: string[];
  headings?: Array<{ level: number; text: string }>;
  docType?: string;
  category?: string;
  tags?: string[];
  lastModified?: string;
  wordCount?: number;
  score?: number;
  contextSummary?: string;
}

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [miniSearch, setMiniSearch] = useState<MiniSearch | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    fetch('/docs-index.json')
      .then((res) => res.json())
      .then((json) => {
        const ms = new MiniSearch({
          // 扩展搜索字段，包含更多元数据
          fields: ['title', 'content', 'summary', 'keywords', 'headings', 'category', 'tags'],
          // 存储更多字段用于显示
          storeFields: ['id', 'title', 'path', 'content', 'description', 'summary', 'keywords', 'category', 'docType', 'headings', 'wordCount'],
          // 优化搜索选项
          searchOptions: {
            // 字段权重：标题最重要，然后是摘要和关键词
            boost: {
              title: 3,
              summary: 2,
              keywords: 2,
              headings: 1.5,
              category: 1.5,
              tags: 1.2,
              content: 1
            },
            // 启用模糊搜索，容忍拼写错误
            fuzzy: 0.2,
            // 启用前缀匹配
            prefix: true,
            // 组合多个字段的匹配
            combineWith: 'AND',
          },
          // 自定义分词器，处理驼峰命名和特殊字符
          tokenize: (string) => {
            return string
              .toLowerCase()
              // 处理驼峰命名
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              // 处理连字符和下划线
              .replace(/[-_]/g, ' ')
              // 提取单词
              .match(/\b\w+\b/g) || [];
          },
          // 自定义处理器，提取更多有用信息
          processTerm: (term) => {
            // 保留原词和词根
            const processed = [term];
            // 简单的词根提取（移除常见后缀）
            if (term.length > 4) {
              const stemmed = term.replace(/(ing|ed|er|est|ly|tion|sion)$/, '');
              if (stemmed !== term && stemmed.length > 2) {
                processed.push(stemmed);
              }
            }
            return processed;
          }
        });

        // 处理数据，确保keywords和headings是可搜索的文本
        const processedDocs = json.map((doc: any) => ({
          ...doc,
          keywords: doc.keywords ? doc.keywords.join(' ') : '',
          headings: doc.headings ? doc.headings.map((h: any) => h.text).join(' ') : '',
          tags: doc.tags ? doc.tags.join(' ') : '',
        }));

        ms.addAll(processedDocs);
        setMiniSearch(ms);
      });
  }, []);

  useEffect(() => {
    if (miniSearch && query.trim()) {
      // 使用优化的搜索选项
      const rawResults = miniSearch.search(query, {
        prefix: true,
        fuzzy: 0.2,
        // 根据查询长度调整策略
        combineWith: query.length > 10 ? 'OR' : 'AND',
        // 提高结果质量阈值
        filter: (result) => result.score > 0.5,
      });

      // 处理和增强搜索结果
      const enhancedResults = rawResults.map((r) => {
        // 生成上下文摘要
        const contextSummary = generateContextSummary(r.content, query);

        return {
          id: r.id,
          title: r.title,
          path: r.path,
          content: r.content,
          description: r.summary || r.description || contextSummary,
          summary: r.summary,
          keywords: r.keywords,
          category: r.category,
          docType: r.docType,
          headings: r.headings,
          wordCount: r.wordCount,
          score: r.score,
          contextSummary,
        };
      });

      setResults(enhancedResults);
      setActiveIndex(0);
    } else {
      setResults([]);
      setActiveIndex(0);
    }
  }, [miniSearch, query]);

  // 生成包含查询上下文的摘要
  const generateContextSummary = (content: string, query: string) => {
    if (!content || !query) return '';

    const queryWords = query.toLowerCase().split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim());

    // 找到包含查询词的句子
    const relevantSentences = sentences.filter((sentence: string) => {
      const lowerSentence = sentence.toLowerCase();
      return queryWords.some((word: string) => lowerSentence.includes(word));
    });

    if (relevantSentences.length === 0) {
      return content.slice(0, 200) + '...';
    }

    // 返回最相关的句子
    return relevantSentences[0].trim().slice(0, 200) + '...';
  };

  // 关闭逻辑和键盘导航
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (!open) return;
      if (results.length === 0) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (e.shiftKey) {
            return prev === 0 ? results.length - 1 : prev - 1;
          } else {
            return prev === results.length - 1 ? 0 : prev + 1;
          }
        });
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev === results.length - 1 ? 0 : prev + 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev === 0 ? results.length - 1 : prev - 1));
      }
      if (e.key === 'Enter') {
        if (results[activeIndex]) {
          window.location.href = `/${results[activeIndex].path}`;
        }
      }
    }
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, results, activeIndex, onClose]);

  if (!open) return null;

  return (
    <div style={searchModalStyles.overlay} onClick={onClose}>
      <div style={searchModalStyles.container} onClick={(e) => e.stopPropagation()}>
        <div style={searchModalStyles.searchInputContainer}>
          <SearchIcon style={searchModalStyles.searchIcon} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs and blogs..."
            style={searchModalStyles.searchInput}
          />
          <span style={searchModalStyles.shortcutHint}>
            <kbd style={searchModalStyles.kbd}>⌘</kbd>
            <span style={searchModalStyles.shortcutText}>/</span>
            <kbd style={searchModalStyles.kbd}>ctrl</kbd>
            <kbd style={searchModalStyles.kbd}>K</kbd>
          </span>
        </div>
        <div>
          {results.length > 0 ? (
            <ul ref={resultsRef} style={searchModalStyles.resultsList}>
              {results.slice(0, 10).map((r, idx) => {
                const summary = r.contextSummary || r.description || r.content?.slice(0, 300) || '';
                return (
                  <li
                    key={r.id}
                    style={searchModalStyles.resultItem(idx === activeIndex)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => (window.location.href = `/${r.path}`)}
                  >
                    <div style={searchModalStyles.resultHeader}>
                      <div style={searchModalStyles.resultTitle}>
                        {r.title}
                      </div>
                      {r.category && (
                        <span style={searchModalStyles.categoryTag}>
                          {r.category}
                        </span>
                      )}
                    </div>
                    <div style={searchModalStyles.resultDescription}>
                      {summary}
                    </div>
                    <div style={searchModalStyles.resultFooter}>
                      <div style={searchModalStyles.resultMeta}>
                        {r.docType === 'blog' ? '📝 Blog' : '📚 Docs'}
                        {r.wordCount && ` • ${r.wordCount} words`}
                        {r.score && ` • ${Math.round(r.score * 100)}% match`}
                      </div>
                      {idx === activeIndex && (
                        <div style={searchModalStyles.activePath}>
                          {`/${r.path}`}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div style={searchModalStyles.noResults}>
              No results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


