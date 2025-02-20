import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";

const borderColor = "#21262A";

export default createTheme({
  // cssVariables: {
  //   cssVarPrefix: "css",
  // },
  palette: {
    mode: "dark",
    primary: {
      main: "#7c48ff",
    },
    background: {
      default: "#000",
      paper: "#16181B",
    },
    action: {},
    text: {},
    divider: borderColor,
  },
  typography: {
    // fontSize: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#101214',
          color: 'inherit',
          boxShadow: "none",
          borderBottom: `1px solid #21262A`,
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& > fieldset": {
            transition: "border-color 0.3s",
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
        underline: 'hover'
      }
    }
  },
});
