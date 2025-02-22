import { createTheme } from "@mui/material/styles";

const borderColor = "#E7EAEE";

export default createTheme({
  cssVariables: {
    cssVarPrefix: "css",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#7c48ff",
    },
    background: {
      default: "#FFF",
      paper: "#FFF",
    },
    action: {},
    text: {},
    divider: borderColor,
  },
  typography: {
    fontSize: 14,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#FFF",
          color: "inherit",
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
