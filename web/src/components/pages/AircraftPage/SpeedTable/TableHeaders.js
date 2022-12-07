import React from "react";
import { Stack, Button, Box, Typography } from "@mui/material";
import { AirplaneTakeoff, Airplane, AirplaneLanding } from "mdi-material-ui";

export default function TableHeaders({ title }) {
  return (
    <Stack direction="row" alignItems="center">
      <Box disabled sx={{ width: "120px", alignSelf: "end" }}>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Button
        disabled
        startIcon={<AirplaneTakeoff />}
        sx={{ flexGrow: 1, "&.Mui-disabled": { color: "text.secondary" } }}
      >
        Montée
      </Button>
      <Button
        disabled
        startIcon={<Airplane />}
        sx={{ flexGrow: 1, "&.Mui-disabled": { color: "text.secondary" } }}
      >
        Croisière
      </Button>
      <Button
        disabled
        startIcon={<AirplaneLanding />}
        sx={{ flexGrow: 1, "&.Mui-disabled": { color: "text.secondary" } }}
      >
        Descente
      </Button>
    </Stack>
  );
}
