import { SxProps, Theme } from '@mui/material/styles';

export const searchModalStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(20,22,30,0.98)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 60,
  } as React.CSSProperties,

  container: {
    minWidth: 600,
    maxWidth: 700,
    width: '60vw',
    background: '#23262f',
    borderRadius: 12,
    boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
    padding: '2rem 2rem 1rem 2rem',
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,

  searchInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  } as React.CSSProperties,

  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '1.3rem',
  } as React.CSSProperties,

  shortcutHint: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  } as React.CSSProperties,

  kbd: {
    background: '#e5e7eb',
    color: '#222',
    borderRadius: 6,
    padding: '2px 8px',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'inherit',
    border: 'none',
    marginLeft: 2,
    marginRight: 2,
  } as React.CSSProperties,

  resultsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  } as React.CSSProperties,

  resultItem: (isActive: boolean) => ({
    padding: '1rem',
    borderBottom: '1px solid #333',
    background: isActive ? '#2a3956' : 'transparent',
    color: '#fff',
    cursor: 'pointer',
    position: 'relative',
  } as React.CSSProperties),

  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  } as React.CSSProperties,

  resultTitle: {
    fontSize: 18,
    fontWeight: 600,
    flex: 1,
  } as React.CSSProperties,

  categoryTag: {
    fontSize: 12,
    color: '#6CB6FF',
    background: 'rgba(108, 182, 255, 0.1)',
    padding: '2px 8px',
    borderRadius: 12,
    marginLeft: 8,
  } as React.CSSProperties,

  resultDescription: {
    fontSize: 14,
    color: '#b0b8c1',
    marginBottom: 8,
    lineHeight: 1.4,
  } as React.CSSProperties,

  resultFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,

  resultMeta: {
    fontSize: 12,
    color: '#888',
  } as React.CSSProperties,

  activePath: {
    color: '#6CB6FF',
    fontSize: 13,
    background: '#23262f',
    borderRadius: 6,
    padding: '2px 8px',
  } as React.CSSProperties,

  noResults: {
    color: '#b0b8c1',
    padding: '1rem 0',
  } as React.CSSProperties,

  searchIcon: {
    color: '#b0b8c1',
    fontSize: 26,
  } as React.CSSProperties,

  shortcutText: {
    color: '#b0b8c1',
    fontSize: 14,
  } as React.CSSProperties,
};
