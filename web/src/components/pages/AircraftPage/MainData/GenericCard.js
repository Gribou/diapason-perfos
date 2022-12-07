import React from "react";
import { Stack, Typography } from "@mui/material";

export default function GenericCard({ Icon, text, textList = [], color }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        border: 2,
        borderRadius: 5,
        borderColor: color || "action.disabled",
        px: 2,
        py: 1,
      }}
    >
      {Icon && <Icon fontSize="large" sx={{ color }} />}

      {text ? (
        <Typography variant="h5" sx={{ flexGrow: 1 }} align="end" noWrap>
          {text}
        </Typography>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ flexGrow: 1 }}
        >
          {textList?.map((t, index) => (
            <Typography variant="h5" key={index} noWrap>
              {t}
            </Typography>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
