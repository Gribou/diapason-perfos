import React from "react";
import { Outlet } from "react-router-dom";
import { CssBaseline, AppBar, Container, Toolbar, Stack } from "@mui/material";

import CustomToolbar from "./Toolbar";
import Notifier from "./Notifier";

export default function Layout() {
  return (
    <Stack
      sx={{
        //https://allthingssmitty.com/2020/05/11/css-fix-for-100vh-in-mobile-webkit/
        minHeight: ["100vh", "-webkit-fill-available"],
      }}
      direction="column"
      alignItems="stretch"
      justifyContent="center"
    >
      <CssBaseline />
      <AppBar>
        <CustomToolbar />
      </AppBar>
      <Notifier style={{ top: 0, marginTop: 64 }} />
      <Toolbar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: "auto",
          mt: 2,
          mb: 2,
          display: "flex",
        }}
      >
        <Outlet />
      </Container>
    </Stack>
  );
}
