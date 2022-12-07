import React, { Fragment } from "react";
import { Typography, Stack, useMediaQuery } from "@mui/material";
import SearchField from "components/misc/SearchField";
import HeroContainer from "./HeroContainer";
import HighlightedBox from "./HighlightedBox";

export default function Home() {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const search_field = (
    <Fragment>
      <SearchField
        placeholder="Entrez votre recherche ici"
        sx={{
          bgcolor: (theme) => theme.palette.grey[900],
          "&:hover": {
            bgcolor: (theme) => theme.palette.grey[800],
          },
          maxWidth: "sm",
          color: "text.secondary",
        }}
      />
      <Typography
        align="center"
        variant="caption"
        color="textSecondary"
        sx={{ mt: 1, mb: { xs: 0, sm: 12 } }}
      >
        (ex : A320, cessna, …)
      </Typography>
    </Fragment>
  );

  return (
    <Stack alignItems="center" sx={{ maxWidth: "md", mx: "auto" }}>
      <HeroContainer />
      {search_field}
      {smUp && <HighlightedBox />}
    </Stack>
  );
}
