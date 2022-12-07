import React from "react";
import PerfIcon from "components/logos/PerfIcon";

export default function HeroLogo() {
  return (
    <PerfIcon
      sx={{
        width: { xs: "3em", sm: "5em" },
        height: { xs: "3em", sm: "5em" },
        m: { xs: 0, sm: 1 },
        ml: 1,
        color: "primary.dark",
      }}
    />
  );
}
