import React from "react";
import { Typography, Stack } from "@mui/material";
import HeroLogo from "./HeroLogo";

export default function HeroContainer() {
  return (
    <Stack direction="row" sx={{ mt: { xs: 2, sm: 6 }, mb: { xs: 6, sm: 10 } }}>
      <HeroLogo />
      <Stack sx={{ px: 2 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            flexGrow: 1,
            typography: { xs: "h5", sm: "h3", md: "h2" },
          }}
        >
          Perfos Avions
        </Typography>
        <Typography
          sx={{
            maxWidth: "sm",
            typography: { xs: "body2", sm: "h6", md: "body1" },
          }}
          color="textSecondary"
          align="justify"
        >
          Utilisez le moteur de recherche ci-dessous pour trouver un type
          d&apos;avion par son nom, son code ou son constructeur.
        </Typography>
      </Stack>
    </Stack>
  );
}
