import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Box } from "@mui/material";
import { ROUTES } from "routes";

export default function SimilarAircraftLink({ reference }) {
  return (
    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
      <Link
        component={RouterLink}
        to={ROUTES.aircraftByCode.path.replace(":code", reference?.code)}
        variant="h6"
        gutterBottom
        sx={{ flexGrow: 1 }}
        align="center"
      >
        Performances similaires au {reference?.code}
      </Link>
    </Box>
  );
}
