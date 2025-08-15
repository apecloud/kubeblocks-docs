import { SxProps, Theme } from '@mui/material/styles';

export const searchBarStyles = {
  container: {
    minWidth: { xs: 120, sm: 200 },
    maxWidth: { xs: 150, sm: 300 },
    flex: 0,
  } as SxProps<Theme>,

  textField: {
    width: '100%',
    '& .MuiInputBase-input::placeholder': {
      color: 'text.secondary',
      opacity: 0.8,
    },
  } as SxProps<Theme>,

  inputRoot: {
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    fontSize: { xs: '0.8rem', sm: '0.875rem' },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '& input': {
      cursor: 'pointer',
      color: 'text.secondary',
      padding: { xs: '6px 8px', sm: '8.5px 14px' },
    },
  } as SxProps<Theme>,

  searchIcon: {
    color: 'text.secondary',
    mr: { xs: 0.5, sm: 1 },
  } as SxProps<Theme>,

  shortcutContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    opacity: 0.7,
  } as SxProps<Theme>,

  shortcutKey: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'text.secondary',
    borderRadius: 1,
    padding: '2px 6px',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  } as SxProps<Theme>,
};
