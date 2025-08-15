'use client';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from '@mui/material';
import { searchBarComponentStyles } from '@/styles/searchBarComponent.styles';
import MiniSearch from 'minisearch';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
// import SearchIcon from "@mui/icons-material/Search";

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

type SearchResult = {
  id: string;
  score: number;
  matches?: Array<{
    indices: [number, number][];
    key: string;
  }>;
};

type MiniSearchResult = SearchResult & {
  title: string;
  path: string;
  summary?: string;
  category?: string;
  docType?: string;
  wordCount?: number;
  score?: number;
};

// 高亮匹配文本的函数
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <mark key={i} style={{ backgroundColor: '#ffd700', padding: 0 }}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

export const SearchBar = () => {
  const [searchIndex, setSearchIndex] =
    useState<MiniSearch<SearchDocument> | null>(null);
  const [searchResults, setSearchResults] = useState<MiniSearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // 添加防抖hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 初始化搜索索引
  useEffect(() => {
    const initializeSearchIndex = async () => {
      try {
        const response = await fetch('/api/search-index');
        const documents: SearchDocument[] = await response.json();

        const index = new MiniSearch<SearchDocument>({
          // 扩展搜索字段
          fields: ['title', 'content', 'summary', 'keywordsText', 'headingsText', 'category', 'tagsText'],
          // 存储更多字段
          storeFields: ['id', 'title', 'path', 'summary', 'category', 'docType', 'wordCount'],
          searchOptions: {
            // 优化权重
                        boost: {
              title: 3,
              summary: 2,
              keywordsText: 2,
              headingsText: 1.5,
              category: 1.5,
              tagsText: 1.2,
              content: 1
            },
            fuzzy: 0.2,
            prefix: true,
          },
          // 自定义分词器
          tokenize: (string) => {
            return string
              .toLowerCase()
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/[-_]/g, ' ')
              .match(/\b\w+\b/g) || [];
          },
        });

        // 处理数据，转换字段为搜索友好的格式
        const processedDocs = documents.map(doc => ({
          ...doc,
          keywordsText: doc.keywords ? doc.keywords.join(' ') : '',
          headingsText: doc.headings ? doc.headings.map((h: any) => h.text).join(' ') : '',
          tagsText: doc.tags ? doc.tags.join(' ') : '',
        }));

        index.addAll(processedDocs);
        setSearchIndex(index);
      } catch (error) {
        console.error('Failed to initialize search index:', error);
      }
    };

    initializeSearchIndex();
  }, []);

  // 使用防抖进行搜索
  useEffect(() => {
    if (!searchIndex || !debouncedSearchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const performSearch = () => {
      try {
        const results = searchIndex
          .search(debouncedSearchTerm, {
            prefix: true,
            fuzzy: 0.2,
            combineWith: debouncedSearchTerm.length > 10 ? 'OR' : 'AND',
            filter: (result: SearchResult) => result.score > 0.3,
          })
          .slice(0, 8) // 限制结果数量提高性能
          .map((result) => ({
            ...result,
            title: (result as unknown as SearchDocument).title,
            path: (result as unknown as SearchDocument).path,
            summary: (result as unknown as SearchDocument).summary,
            category: (result as unknown as SearchDocument).category,
            docType: (result as unknown as SearchDocument).docType,
            wordCount: (result as unknown as SearchDocument).wordCount,
          })) as MiniSearchResult[];

        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    };

    performSearch();
  }, [searchIndex, debouncedSearchTerm]);

  // 处理输入变化
  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // 处理结果点击
  const handleResultClick = (path: string) => {
    router.push(path);
    setSearchResults([]);
    setSearchTerm('');
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Box sx={searchBarComponentStyles.container} ref={searchBoxRef}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        sx={searchBarComponentStyles.textField}
      />

      {searchResults.length > 0 && (
        <Paper elevation={3} sx={searchBarComponentStyles.resultsContainer}>
          <List sx={searchBarComponentStyles.resultsList}>
            {searchResults.map((result) => (
              <ListItem
                key={result.id}
                component="div"
                onClick={() => handleResultClick(result.path)}
                sx={searchBarComponentStyles.resultItem}
              >
                <ListItemText
                                    primary={
                    <div style={searchBarComponentStyles.primaryContainer}>
                      <span>{highlightText(result.title, searchTerm)}</span>
                      {result.category && (
                        <span style={searchBarComponentStyles.categoryTag}>
                          {result.category}
                        </span>
                      )}
                    </div>
                  }
                  secondary={
                    <div>
                      <div style={searchBarComponentStyles.secondaryContainer}>
                        {result.summary ?
                          highlightText(result.summary.slice(0, 100) + '...', searchTerm) :
                          highlightText(result.path, searchTerm)
                        }
                      </div>
                      <div style={searchBarComponentStyles.resultMeta}>
                        {result.docType === 'blog' ? '📝 Blog' : '📚 Docs'}
                        {result.wordCount && ` • ${result.wordCount} words`}
                        {result.score && ` • ${Math.round(result.score * 100)}% match`}
                      </div>
                    </div>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
