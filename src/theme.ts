import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#131921", // Amazon navbar color
      light: "#232f3e", // Amazon secondary navbar color
      dark: "#0F1111",
    },
    secondary: {
      main: "#ff9900", // Amazon orange
      light: "#ffb74d",
      dark: "#f57c00",
    },
    background: {
      default: "#EAEDED", // Amazon background gray
      paper: "#FFFFFF",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#ff9900",
          "&:hover": {
            backgroundColor: "#f57c00",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#131921",
        },
      },
    },
  },
});

export default theme;
