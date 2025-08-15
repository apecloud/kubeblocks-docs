import { SxProps, Theme } from '@mui/material/styles';

export const searchBarComponentStyles = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: 600,
  } as SxProps<Theme>,

  textField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'background.paper',
    },
  } as SxProps<Theme>,

  resultsContainer: {
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
  } as SxProps<Theme>,

  resultsList: {
    py: 0,
  } as SxProps<Theme>,

  resultItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'action.hover',
    },
    py: 1,
    px: 2,
  } as SxProps<Theme>,

  categoryTag: {
    fontSize: '0.75rem',
    color: '#1976d2',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    padding: '2px 6px',
    borderRadius: '8px',
    marginLeft: '8px',
  } as React.CSSProperties,

  resultMeta: {
    fontSize: '0.7rem',
    color: '#666',
  } as React.CSSProperties,

  primaryContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,

  secondaryContainer: {
    marginBottom: '4px',
  } as React.CSSProperties,
};
