'use client';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from '@mui/material';
import MiniSearch from 'minisearch';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
// import SearchIcon from "@mui/icons-material/Search";

interface SearchDocument {
  id: string;
  title: string;
  content: string;
  path: string;
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

  // 初始化搜索索引
  useEffect(() => {
    const initializeSearchIndex = async () => {
      try {
        const response = await fetch('/api/search-index');
        const documents: SearchDocument[] = await response.json();

        const index = new MiniSearch<SearchDocument>({
          fields: ['title', 'content'],
          storeFields: ['id', 'title', 'path'],
          searchOptions: {
            boost: { title: 2, content: 1 },
            fuzzy: 0.2,
            prefix: true,
          },
        });

        index.addAll(documents);
        setSearchIndex(index);
      } catch (error) {
        console.error('Failed to initialize search index:', error);
      }
    };

    initializeSearchIndex();
  }, []);

  // 处理搜索
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      if (!searchIndex || !term.trim()) {
        setSearchResults([]);
        return;
      }

      const results = searchIndex
        .search(term, {
          filter: (result: SearchResult) => result.score > 0.1,
        })
        .map((result) => ({
          ...result,
          title: (result as unknown as SearchDocument).title,
          path: (result as unknown as SearchDocument).path,
        })) as MiniSearchResult[];

      setSearchResults(results);
    },
    [searchIndex],
  );

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
    <Box
      sx={{ position: 'relative', width: '100%', maxWidth: 600 }}
      ref={searchBoxRef}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
          },
        }}
      />

      {searchResults.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: '300px',
            overflow: 'auto',
            zIndex: 1000,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
              '&:hover': {
                background: '#555',
              },
            },
          }}
        >
          <List sx={{ py: 0 }}>
            {searchResults.map((result) => (
              <ListItem
                key={result.id}
                component="div"
                onClick={() => handleResultClick(result.path)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  py: 1,
                  px: 2,
                }}
              >
                <ListItemText
                  primary={highlightText(result.title, searchTerm)}
                  secondary={highlightText(result.path, searchTerm)}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
