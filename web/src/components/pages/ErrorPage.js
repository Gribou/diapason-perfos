import React from "react";
import { Typography, Container } from "@mui/material";

export default function ErrorNotFound() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Page introuvable
      </Typography>
      <Typography variant="subtitle1" align="center">
        La page que vous cherchez n&apos;existe pas.
      </Typography>
    </Container>
  );
}
