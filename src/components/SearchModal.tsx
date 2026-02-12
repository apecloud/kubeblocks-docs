'use client';

import { createSearchModalStyles } from '@/styles/searchModal.styles';
import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery } from '@mui/material';
import MiniSearch from 'minisearch';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SearchDocument {
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
  locale?: string;
  lastModified?: string;
  wordCount?: number;
}

interface SearchResult extends SearchDocument {
  score: number;
  contextSummary?: string;
  matchedTerms?: string[];
}

const SEARCH_HISTORY_KEY = 'kb-search-history';
const MAX_HISTORY_ITEMS = 10;
const MAX_RESULTS = 10;

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [miniSearch, setMiniSearch] = useState<MiniSearch<SearchDocument> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:767px)');
  const searchModalStyles = useMemo(
    () => createSearchModalStyles(isMobile),
    [isMobile],
  );

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (saved) {
          setSearchHistory(JSON.parse(saved));
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }, []);

  // Save search history
  const saveToHistory = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      const newHistory = [
        term.trim(),
        ...searchHistory.filter(
          (h) => h.toLowerCase() !== term.trim().toLowerCase()
        ),
      ].slice(0, MAX_HISTORY_ITEMS);
      setSearchHistory(newHistory);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
        } catch {
          // Ignore localStorage errors
        }
      }
    },
    [searchHistory]
  );

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(SEARCH_HISTORY_KEY);
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      setShowHistory(!query.trim() && searchHistory.length > 0);
    }
  }, [open, query, searchHistory.length]);

  // Initialize search index
  useEffect(() => {
    if (!open || miniSearch) return;

    const initSearch = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await fetch('/docs-index.json');
        if (!response.ok) {
          throw new Error('Failed to load search index');
        }
        const documents: SearchDocument[] = await response.json();

        const ms = new MiniSearch<SearchDocument>({
          fields: [
            'title',
            'content',
            'summary',
            'keywords',
            'headings',
            'category',
            'tags',
          ],
          storeFields: [
            'id',
            'title',
            'path',
            'content',
            'description',
            'summary',
            'keywords',
            'category',
            'docType',
            'headings',
            'wordCount',
            'locale',
          ],
          searchOptions: {
            boost: {
              title: 5,
              summary: 3,
              keywords: 3,
              headings: 2,
              category: 1.5,
              tags: 1.2,
              content: 1,
            },
            fuzzy: 0.25,
            prefix: true,
            combineWith: 'AND',
          },
          tokenize: (string) => {
            return (
              string
                .toLowerCase()
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/[-_./]/g, ' ')
                .match(/\b[\w\u4e00-\u9fa5]+\b/g) || []
            );
          },
          processTerm: (term) => {
            const processed = [term];
            // Simple stemming for English words
            if (term.length > 4) {
              const stemmed = term
                .replace(/(ing|ed|er|est|ly|tion|sion|ness|ment)$/, '');
              if (stemmed !== term && stemmed.length > 2) {
                processed.push(stemmed);
              }
            }
            return processed;
          },
        });

        // Process documents for search - convert array fields to strings for indexing
        const processedDocs = documents.map((doc) => ({
          ...doc,
          keywords: doc.keywords ? doc.keywords.join(' ') : '',
          headings: doc.headings
            ? doc.headings.map((h) => h.text).join(' ')
            : '',
          tags: doc.tags ? doc.tags.join(' ') : '',
        }));

        // Type cast needed because MiniSearch expects exact field types
        // @ts-expect-error - fields are converted to strings for indexing
        ms.addAll(processedDocs);
        setMiniSearch(ms);
      } catch (error) {
        console.error('Search initialization error:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    initSearch();
  }, [open, miniSearch]);

  // Generate context summary with highlighted matches
  const generateContextSummary = useMemo(
    () =>
      (content: string, query: string): { text: string; hasMatch: boolean } => {
        if (!content || !query) {
          return { text: content?.slice(0, 200) + '...' || '', hasMatch: false };
        }

        const queryWords = query
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 1);
        const sentences = content
          .split(/[.!?。！？]+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 10);

        // Find sentences containing query words
        const scoredSentences = sentences.map((sentence) => {
          const lowerSentence = sentence.toLowerCase();
          const matchCount = queryWords.filter((word) =>
            lowerSentence.includes(word)
          ).length;
          return { sentence, score: matchCount };
        });

        scoredSentences.sort((a, b) => b.score - a.score);

        const bestMatch = scoredSentences.find((s) => s.score > 0);
        if (bestMatch) {
          return {
            text: bestMatch.sentence.slice(0, 250),
            hasMatch: true,
          };
        }

        return {
          text: content.slice(0, 200) + '...',
          hasMatch: false,
        };
      },
    []
  );

  // Perform search
  useEffect(() => {
    if (!miniSearch) return;

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResults([]);
      setShowHistory(searchHistory.length > 0);
      return;
    }

    setShowHistory(false);

    try {
      const rawResults = miniSearch.search(trimmedQuery, {
        prefix: true,
        fuzzy: 0.25,
        combineWith: trimmedQuery.length > 8 ? 'OR' : 'AND',
        filter: (result) => result.score > 0.2,
      });

      const enhancedResults: SearchResult[] = rawResults
        .slice(0, MAX_RESULTS)
        .map((r) => {
          const doc = r as unknown as SearchDocument;
          const { text: contextSummary } = generateContextSummary(
            doc.content,
            trimmedQuery
          );

          return {
            ...doc,
            score: r.score,
            contextSummary,
            matchedTerms: Object.keys(r.match || {}),
          };
        });

      setResults(enhancedResults);
      setActiveIndex(0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  }, [miniSearch, query, generateContextSummary, searchHistory.length]);

  // Highlight matched terms in text
  const highlightText = (text: string, query: string) => {
    if (!text || !query) return text;

    const terms = query
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 1)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (terms.length === 0) return text;

    const regex = new RegExp(`(${terms.join('|')})`, 'gi');
    const parts = text.split(regex);
    const lowerTerms = new Set(terms.map((term) => term.toLowerCase()));

    return parts.map((part, i) =>
      lowerTerms.has(part.toLowerCase()) ? (
        <mark
          key={i}
          style={{
            backgroundColor: 'rgba(108, 182, 255, 0.3)',
            color: 'inherit',
            padding: '0 2px',
            borderRadius: '3px',
          }}
        >
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  // Navigate to result
  const navigateToResult = useCallback(
    (path: string, saveHistory = true) => {
      if (saveHistory && query.trim()) {
        saveToHistory(query.trim());
      }
      const href = path.startsWith('/') ? path : `/${path}`;
      router.push(href);
      onClose();
    },
    [query, onClose, router, saveToHistory],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      const items = showHistory ? searchHistory : results;
      if (items.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev >= items.length - 1 ? 0 : prev + 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
          break;
        case 'Tab':
          e.preventDefault();
          setActiveIndex((prev) => {
            if (e.shiftKey) {
              return prev <= 0 ? items.length - 1 : prev - 1;
            }
            return prev >= items.length - 1 ? 0 : prev + 1;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (showHistory) {
            setQuery(searchHistory[activeIndex]);
          } else if (results[activeIndex]) {
            if (e.metaKey || e.ctrlKey) {
              // Open in new tab
              const path = results[activeIndex].path;
              const href = path.startsWith('/') ? path : `/${path}`;
              window.open(href, '_blank', 'noopener,noreferrer');
            } else {
              navigateToResult(results[activeIndex].path);
            }
          }
          break;
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, results, searchHistory, activeIndex, showHistory, onClose, query, navigateToResult]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsRef.current) {
      const activeItem = resultsRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div style={searchModalStyles.overlay} onClick={onClose}>
      <div
        style={searchModalStyles.container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={searchModalStyles.searchInputContainer}>
          <SearchIcon style={searchModalStyles.searchIcon} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation..."
            style={searchModalStyles.searchInput}
            aria-label="Search documentation"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={
              results.length > 0 ? `search-result-${activeIndex}` : undefined
            }
          />
          <span style={searchModalStyles.shortcutHint}>
            <kbd style={searchModalStyles.kbd}>ESC</kbd>
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={searchModalStyles.loadingState}>
            <div style={searchModalStyles.spinner} />
            <span>Loading search index...</span>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div style={searchModalStyles.errorState}>
            <div style={searchModalStyles.errorIcon}>⚠️</div>
            <div>Failed to load search index</div>
            <button
              onClick={() => window.location.reload()}
              style={searchModalStyles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {/* Search History */}
        {showHistory && !isLoading && !hasError && (
          <div>
            <div style={searchModalStyles.sectionHeader}>
              <span>Recent Searches</span>
              <button
                onClick={clearHistory}
                style={searchModalStyles.clearButton}
              >
                Clear
              </button>
            </div>
            <ul ref={resultsRef} style={searchModalStyles.resultsList}>
              {searchHistory.map((term, idx) => (
                <li
                  key={term}
                  style={searchModalStyles.historyItem(idx === activeIndex)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setQuery(term)}
                  id={`search-result-${idx}`}
                >
                  <span style={searchModalStyles.historyIcon}>🕐</span>
                  <span style={searchModalStyles.historyText}>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Search Results */}
        {!showHistory && !isLoading && !hasError && (
          <div>
            {results.length > 0 ? (
              <>
                <div style={searchModalStyles.resultsCount}>
                  {results.length} result{results.length !== 1 ? 's' : ''} for &quot;
                  {query}&quot;
                </div>
                <ul
                  ref={resultsRef}
                  style={searchModalStyles.resultsList}
                  id="search-results"
                  role="listbox"
                >
                  {results.map((r, idx) => {
                    const summary =
                      r.contextSummary ||
                      r.summary ||
                      r.description ||
                      r.content?.slice(0, 200) ||
                      '';

                    return (
                      <li
                        key={r.id}
                        id={`search-result-${idx}`}
                        role="option"
                        aria-selected={idx === activeIndex}
                        style={searchModalStyles.resultItem(idx === activeIndex)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => navigateToResult(r.path)}
                      >
                        <div style={searchModalStyles.resultHeader}>
                          <div style={searchModalStyles.resultTitle}>
                            {highlightText(r.title, query)}
                          </div>
                          {r.category && (
                            <span style={searchModalStyles.categoryTag}>
                              {r.category}
                            </span>
                          )}
                        </div>
                        <div style={searchModalStyles.resultDescription}>
                          {highlightText(summary, query)}
                        </div>
                        <div style={searchModalStyles.resultFooter}>
                          <div style={searchModalStyles.resultMeta}>
                            {r.docType === 'blog' ? '📝 Blog' : '📚 Docs'}
                            {r.wordCount && ` • ${r.wordCount} words`}
                            {r.locale && r.locale !== 'en' && ` • ${r.locale}`}
                          </div>
                          {idx === activeIndex && (
                            <div style={searchModalStyles.activeHint}>
                              <kbd style={searchModalStyles.keyHint}>↵</kbd>
                              <span>to open</span>
                              <kbd style={searchModalStyles.keyHint}>⌘↵</kbd>
                              <span>in new tab</span>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : query.trim() ? (
              <div style={searchModalStyles.noResults}>
                <div style={searchModalStyles.noResultsIcon}>🔍</div>
                <div style={searchModalStyles.noResultsTitle}>
                  No results for &quot;{query}&quot;
                </div>
                <div style={searchModalStyles.noResultsHint}>
                  Try different keywords or check your spelling
                </div>
                {searchHistory.length > 0 && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setShowHistory(true);
                    }}
                    style={searchModalStyles.viewHistoryButton}
                  >
                    View recent searches
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Footer Hints */}
        {!isLoading && !hasError && (
          <div style={searchModalStyles.footer}>
            <div style={searchModalStyles.footerHints}>
              <span style={searchModalStyles.footerHint}>
                <kbd style={searchModalStyles.footerKbd}>↑↓</kbd> to navigate
              </span>
              <span style={searchModalStyles.footerHint}>
                <kbd style={searchModalStyles.footerKbd}>↵</kbd> to select
              </span>
              <span style={searchModalStyles.footerHint}>
                <kbd style={searchModalStyles.footerKbd}>esc</kbd> to close
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
