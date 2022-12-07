import React from "react";
import { Stack, Card } from "@mui/material";
import TableHeaders from "./TableHeaders";
import AltitudeLayer from "./AltitudeLayer";
import { pretty_altitude } from "../utils";

export default function SpeedTable({
  max_operating_altitude,
  transition_altitude,
  phases,
}) {
  const show_high =
    max_operating_altitude > transition_altitude && transition_altitude > 25000;
  const show_medium = max_operating_altitude > 10000;
  return (
    <Card
      sx={{
        mt: 4,
        mb: 2,
        maxHeight: "400px",
        p: 2,
        flexGrow: 1,
        display: "flex",
      }}
    >
      <Stack sx={{ flexGrow: 1 }}>
        <TableHeaders title={pretty_altitude(max_operating_altitude)} />
        {show_high && (
          <AltitudeLayer
            phases={phases?.filter(
              ({ altitude_range }) => altitude_range === "HIGH"
            )}
            mach
            sx={{
              borderTop: 1,
              borderColor: "divider",
              flexGrow: 1,
            }}
            title={pretty_altitude(transition_altitude)}
          />
        )}
        {show_medium && (
          <AltitudeLayer
            phases={phases?.filter(
              ({ altitude_range }) => altitude_range === "MEDIUM"
            )}
            sx={{
              borderTop: (theme) =>
                `1px dashed ${theme.palette.text.secondary}`,
              flexGrow: 1,
            }}
            title="FL100"
          />
        )}
        <AltitudeLayer
          phases={phases?.filter(
            ({ altitude_range }) => altitude_range === "LOW"
          )}
          no_rocd
          sx={{
            borderTop: (theme) => `1px dashed ${theme.palette.text.secondary}`,
            borderBottom: 1,
            flexGrow: 1,
          }}
          title="Sol"
        />
      </Stack>
    </Card>
  );
}
