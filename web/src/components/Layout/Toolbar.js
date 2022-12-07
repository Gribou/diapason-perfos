import React from "react";
import { Link, Toolbar, IconButton, Box, Tooltip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { HelpCircleOutline } from "mdi-material-ui";
import PerfIcon from "components/logos/PerfIcon";

import { ROUTES } from "routes";
import { DEBUG } from "constants";
import { useVersion } from "features/config/hooks";
import SearchField from "components/misc/SearchField";

export default function MyToolbar() {
  const version = useVersion();

  const logo = (
    <Tooltip title={version || "version ?"}>
      <IconButton
        component={RouterLink}
        to={ROUTES.home.path}
        edge="start"
        color="inherit"
        size="large"
      >
        <PerfIcon baseColor="#fff" accentColor="#fff" fontSize="large" />
      </IconButton>
    </Tooltip>
  );

  const help_button = (
    <IconButton
      sx={{ mr: { sm: 2 } }}
      component={RouterLink}
      to={ROUTES.help.path}
      color="inherit"
    >
      <HelpCircleOutline />
    </IconButton>
  );

  const app_display = (
    <Link
      component={RouterLink}
      to={ROUTES.home.path}
      sx={{ mr: { sm: 2 }, display: { xs: "none", sm: "block" } }}
      variant="h5"
      underline="none"
      noWrap
      color="inherit"
    >{`Perfos${DEBUG ? " Debug" : ""}`}</Link>
  );

  const search_field = (
    <Box
      sx={{
        position: "relative",
        width: { xs: "100%", sm: "30ch" },
        minWidth: "20ch",
      }}
    >
      <SearchField />
    </Box>
  );

  return (
    <Toolbar>
      {logo}
      {app_display}
      <Box sx={{ flexGrow: 1 }} />
      {help_button}
      {search_field}
    </Toolbar>
  );
}
