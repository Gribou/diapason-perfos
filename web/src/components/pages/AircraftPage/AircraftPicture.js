import React from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import { getStaticFile } from "features/utils";

export default function AircraftPicture({ picture, code, reference }) {
  const { wing_span, length } = reference || {};
  const default_url = getStaticFile("/img/airplane_big.svg");
  return (
    <Stack
      alignItems="stretch"
      justifyContent="flex-end"
      sx={{ flex: "1 1 0%", mt: 2, maxWidth: "50%" }}
    >
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          maxWidth: { xs: "300px", sm: "100%" },
          flexGrow: 1,
        }}
      >
        <Link href={picture} target="_blank" underline="none">
          <img
            src={picture || default_url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              border: "1px solid #272727",
            }}
            onError={(e) => {
              e.currentTarget.src = default_url;
            }}
          />
        </Link>
      </Box>
      {reference?.code === code && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={0}
          sx={{ mt: 1, flexWrap: "wrap" }}
        >
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            flexWrap="nowrap"
          >
            <Typography variant="caption" color="textSecondary" noWrap>
              Longueur de l&apos;appareil :
            </Typography>
            <Typography variant="caption" noWrap>{`${
              length || "?"
            } m`}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography variant="caption" color="textSecondary" noWrap>
              Envergure de l&apos;appareil :
            </Typography>
            <Typography variant="caption" noWrap>{`${
              wing_span || "?"
            } m`}</Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
