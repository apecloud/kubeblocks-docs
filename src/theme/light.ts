import { alpha } from '@mui/material';
import { createTheme } from '@mui/material/styles';
const borderColor = '#E7EAEE';

export default createTheme({
  cssVariables: {
    cssVarPrefix: 'css',
  },
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 860,
  //     md: 1024,
  //     lg: 1328,
  //     xl: 1536,
  //   },
  // },
  palette: {
    mode: 'light',
    primary: {
      main: '#0165CB',
    },
    background: {
      default: '#FFF',
      paper: '#FFF',
    },
    action: {},
    text: {},
    divider: borderColor,
  },
  typography: {
    fontSize: 14,
    fontFamily:
      'Geist, "Geist Fallback", "Roboto","Helvetica","Arial",sans-serif',
  },
  mixins: {
    toolbar: {
      minHeight: 64,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha('#FFF', 0.7),
          color: 'inherit',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: `1px solid ${borderColor}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          // textTransform: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: () => ({
          backgroundImage: 'none',
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& > fieldset': {
            transition: 'border-color 0.3s',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 12,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
  },
});
