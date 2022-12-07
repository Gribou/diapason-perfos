import React from "react";
import { Stack, Box, Typography } from "@mui/material";

function AltitudePhase({
  min_speed,
  max_speed,
  min_mach,
  max_mach,
  max_rocd,
  show_rocd,
  mach,
}) {
  const speed_display =
    max_speed === min_speed
      ? `${min_speed || 0} kt`
      : `${min_speed}-${max_speed} kt`;

  const mach_display =
    max_mach === min_mach ? `M ${min_mach || 0}` : `M ${min_mach}-${max_mach}`;

  const rocd_display =
    max_rocd !== 0 && ` max ${Math.ceil(max_rocd / 10) * 10} ft/min`;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ flexGrow: 1, py: 1, flexBasis: 0 }}
    >
      <Typography>{mach ? mach_display : speed_display}</Typography>
      {show_rocd && <Typography>{rocd_display || "-"}</Typography>}
    </Stack>
  );
}

export default function AltitudeLayer({ title, phases, mach, no_rocd, sx }) {
  return (
    <Stack direction="row" alignItems="center" sx={sx}>
      <Box disabled sx={{ width: "120px", alignSelf: "end" }}>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <AltitudePhase
        {...phases?.find(({ phase }) => phase === "CLIMB")}
        show_rocd={!no_rocd}
        mach={mach}
      />
      <AltitudePhase
        {...phases?.find(({ phase }) => phase === "CRUISE")}
        mach={mach}
      />
      <AltitudePhase
        {...phases?.find(({ phase }) => phase === "DESCENT")}
        mach={mach}
      />
    </Stack>
  );
}
