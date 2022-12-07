import React from "react";
import { Stack } from "@mui/material";
import EngineCard from "./EngineCard";
import WakeCatCard from "./WakeCatCard";
import SpeedCard from "./SpeedCard";
import LandingDistanceCard from "./LandingDistanceCard";

export default function GeneralParameters({ reference }) {
  return (
    <Stack spacing={2} sx={{ pt: 2, flexGrow: 1 }} justifyContent="flex-end">
      <WakeCatCard {...reference} />
      <EngineCard {...reference} />
      <SpeedCard {...reference} />
      <LandingDistanceCard {...reference} />
    </Stack>
  );
}
