import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { lightBlue, pink } from "@mui/material/colors";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: lightBlue,
    secondary: pink,
  },
});

const Theming = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theming;
