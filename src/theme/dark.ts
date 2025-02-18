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
      default: "#101214",
      paper: "#16181B",
    },
    action: {},
    text: {},
    divider: borderColor,
  },
  typography: {
    // fontSize: 13,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha('#101214', 0.05),
          color: 'inherit',
          backdropFilter: "blur(10px)",
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
