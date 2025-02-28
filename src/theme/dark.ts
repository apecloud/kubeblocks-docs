import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";

const borderColor = "#1D2226";

export default createTheme({
  cssVariables: {
    cssVarPrefix: "css",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#0165CB",
    },
    background: {
      default: "#0E1214",
      paper: "#121619",
    },
    action: {},
    text: {},
    divider: borderColor,
  },
  typography: {
    fontSize: 13,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha("#0E1214", 0.7),
          color: "inherit",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
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
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
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
        underline: "hover",
      },
    },
  },
});
