// Style definitions for SearchModal component
export const createSearchModalStyles = (isMobile: boolean) => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: isMobile ? 20 : 60,
    paddingLeft: 16,
    paddingRight: 16,
  } as React.CSSProperties,

  container: {
    width: '100%',
    maxWidth: 700,
    minWidth: 'auto',
    maxHeight: isMobile ? '90vh' : '80vh',
    background: 'var(--background, #23262f)',
    borderRadius: 12,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  } as React.CSSProperties,

  searchInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    borderBottom: '1px solid var(--border, #333)',
  } as React.CSSProperties,

  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary, #fff)',
    fontSize: '1.1rem',
    padding: '8px 0',
  } as React.CSSProperties,

  shortcutHint: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  } as React.CSSProperties,

  kbd: {
    background: 'var(--kbd-bg, #3a3f4b)',
    color: 'var(--text-secondary, #b0b8c1)',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'inherit',
    border: '1px solid var(--border, #444)',
  } as React.CSSProperties,

  // Loading State
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '40px 20px',
    color: 'var(--text-secondary, #b0b8c1)',
  } as React.CSSProperties,

  spinner: {
    width: 24,
    height: 24,
    border: '2px solid var(--border, #444)',
    borderTopColor: 'var(--primary, #6CB6FF)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  } as React.CSSProperties,

  // Error State
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '40px 20px',
    color: 'var(--text-secondary, #b0b8c1)',
  } as React.CSSProperties,

  errorIcon: {
    fontSize: 40,
  } as React.CSSProperties,

  retryButton: {
    marginTop: 8,
    padding: '8px 20px',
    background: 'var(--primary, #6CB6FF)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
  } as React.CSSProperties,

  // Section Header
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted, #888)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  clearButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--primary, #6CB6FF)',
    cursor: 'pointer',
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 4,
  } as React.CSSProperties,

  // History Items
  resultsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    overflow: 'auto',
    maxHeight: 'calc(80vh - 180px)',
  } as React.CSSProperties,

  historyItem: (isActive: boolean) =>
    ({
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 20px',
      background: isActive ? 'var(--hover-bg, #2a3956)' : 'transparent',
      color: 'var(--text-primary, #fff)',
      cursor: 'pointer',
      borderLeft: isActive ? '3px solid var(--primary, #6CB6FF)' : '3px solid transparent',
    }) as React.CSSProperties,

  historyIcon: {
    fontSize: 16,
    opacity: 0.6,
  } as React.CSSProperties,

  historyText: {
    fontSize: 14,
  } as React.CSSProperties,

  // Results
  resultsCount: {
    padding: '8px 20px',
    fontSize: 12,
    color: 'var(--text-muted, #888)',
    borderBottom: '1px solid var(--border, #333)',
  } as React.CSSProperties,

  resultItem: (isActive: boolean) =>
    ({
      padding: '16px 20px',
      borderBottom: '1px solid var(--border, #333)',
      background: isActive ? 'var(--hover-bg, #2a3956)' : 'transparent',
      color: 'var(--text-primary, #fff)',
      cursor: 'pointer',
      borderLeft: isActive ? '3px solid var(--primary, #6CB6FF)' : '3px solid transparent',
      transition: 'background 0.15s ease',
    }) as React.CSSProperties,

  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 6,
  } as React.CSSProperties,

  resultTitle: {
    fontSize: 16,
    fontWeight: 600,
    flex: 1,
    lineHeight: 1.3,
  } as React.CSSProperties,

  categoryTag: {
    fontSize: 11,
    color: 'var(--primary, #6CB6FF)',
    background: 'rgba(108, 182, 255, 0.1)',
    padding: '3px 10px',
    borderRadius: 12,
    flexShrink: 0,
    fontWeight: 500,
  } as React.CSSProperties,

  resultDescription: {
    fontSize: 14,
    color: 'var(--text-secondary, #b0b8c1)',
    marginBottom: 10,
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  } as React.CSSProperties,

  resultFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  } as React.CSSProperties,

  resultMeta: {
    fontSize: 12,
    color: 'var(--text-muted, #888)',
  } as React.CSSProperties,

  activeHint: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--text-muted, #888)',
  } as React.CSSProperties,

  keyHint: {
    background: 'var(--kbd-bg, #3a3f4b)',
    color: 'var(--text-secondary, #b0b8c1)',
    borderRadius: 4,
    padding: '2px 6px',
    fontSize: 11,
    fontFamily: 'inherit',
    border: '1px solid var(--border, #444)',
  } as React.CSSProperties,

  // No Results
  noResults: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '50px 30px',
    color: 'var(--text-secondary, #b0b8c1)',
  } as React.CSSProperties,

  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  } as React.CSSProperties,

  noResultsTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: 'var(--text-primary, #fff)',
    marginBottom: 8,
  } as React.CSSProperties,

  noResultsHint: {
    fontSize: 14,
    marginBottom: 20,
  } as React.CSSProperties,

  viewHistoryButton: {
    padding: '10px 20px',
    background: 'var(--button-secondary-bg, #3a3f4b)',
    color: 'var(--text-primary, #fff)',
    border: '1px solid var(--border, #444)',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
  } as React.CSSProperties,

  // Footer
  footer: {
    padding: '12px 20px',
    borderTop: '1px solid var(--border, #333)',
    background: 'var(--footer-bg, #1a1d26)',
  } as React.CSSProperties,

  footerHints: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    flexWrap: 'wrap',
  } as React.CSSProperties,

  footerHint: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: 'var(--text-muted, #888)',
  } as React.CSSProperties,

  footerKbd: {
    background: 'var(--kbd-bg, #3a3f4b)',
    color: 'var(--text-secondary, #b0b8c1)',
    borderRadius: 4,
    padding: '2px 6px',
    fontSize: 11,
    fontFamily: 'inherit',
    border: '1px solid var(--border, #444)',
    minWidth: 20,
    textAlign: 'center',
  } as React.CSSProperties,

  // Icons
  searchIcon: {
    color: 'var(--text-muted, #888)',
    fontSize: 24,
  } as React.CSSProperties,

  shortcutText: {
    color: 'var(--text-muted, #888)',
    fontSize: 14,
  } as React.CSSProperties,
});
