import React, { useEffect, useRef, useState } from "react";
import MiniSearch from "minisearch";
import SearchIcon from "@mui/icons-material/Search";

interface SearchResult {
  id: string;
  title: string;
  path: string;
  content: string;
  description?: string;
}

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [miniSearch, setMiniSearch] = useState<MiniSearch | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    fetch("/docs-index.json")
      .then((res) => res.json())
      .then((json) => {
        const ms = new MiniSearch({
          fields: ["title", "content"],
          storeFields: ["id", "title", "path", "content", "description"],
        });
        ms.addAll(json);
        setMiniSearch(ms);
      });
  }, []);

  useEffect(() => {
    if (miniSearch && query.trim()) {
      const rawResults = miniSearch.search(query, { prefix: true });
      setResults(
        rawResults.map(r => ({
          id: r.id,
          title: r.title,
          path: r.path,
          content: r.content,
          description: r.description,
        }))
      );
      setActiveIndex(0);
    } else {
      setResults([]);
      setActiveIndex(0);
    }
  }, [miniSearch, query]);

  // 关闭逻辑和键盘导航
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (!open) return;
      if (results.length === 0) return;
      if (e.key === "Tab") {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (e.shiftKey) {
            return prev === 0 ? results.length - 1 : prev - 1;
          } else {
            return prev === results.length - 1 ? 0 : prev + 1;
          }
        });
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev === results.length - 1 ? 0 : prev + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev === 0 ? results.length - 1 : prev - 1));
      }
      if (e.key === "Enter") {
        if (results[activeIndex]) {
          window.location.href = `/${results[activeIndex].path}`;
        }
      }
    }
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, results, activeIndex, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,22,30,0.98)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 60,
      }}
      onClick={onClose}
    >
      <div
        style={{
          minWidth: 600,
          maxWidth: 700,
          width: "60vw",
          background: "#23262f",
          borderRadius: 12,
          boxShadow: "0 4px 32px rgba(0,0,0,0.25)",
          padding: "2rem 2rem 1rem 2rem",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <SearchIcon style={{ color: "#b0b8c1", fontSize: 26 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search docs and blogs..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "1.3rem",
            }}
          />
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <kbd style={kbdStyle}>⌘</kbd>
            <span style={{ color: "#b0b8c1", fontSize: 14 }}>/</span>
            <kbd style={kbdStyle}>ctrl</kbd>
            <kbd style={kbdStyle}>K</kbd>
          </span>
        </div>
        <div>
          {results.length > 0 ? (
            <ul ref={resultsRef} style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {results.slice(0, 10).map((r, idx) => {
                const summary = r.description || r.content?.slice(0, 300) || "";
                return (
                  <li
                    key={r.id}
                    style={{
                      padding: "0.75rem 0",
                      borderBottom: "1px solid #333",
                      background: idx === activeIndex ? "#2a3956" : "transparent",
                      color: idx === activeIndex ? "#fff" : "#fff",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => window.location.href = `/${r.path}`}
                  >
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: 14, color: "#b0b8c1", marginTop: 2, marginBottom: 2 }}>{summary}</div>
                    {idx === activeIndex && (
                      <div style={{
                        position: "absolute",
                        right: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6CB6FF",
                        fontSize: 13,
                        background: "#23262f",
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}>{`/${r.path}`}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div style={{ color: "#b0b8c1", padding: "1rem 0" }}>No results</div>
          )}
        </div>
      </div>
    </div>
  );
}

const kbdStyle = {
  background: "#e5e7eb",
  color: "#222",
  borderRadius: 6,
  padding: "2px 8px",
  fontSize: 16,
  fontWeight: 600,
  fontFamily: "inherit",
  border: "none",
  marginLeft: 2,
  marginRight: 2,
};