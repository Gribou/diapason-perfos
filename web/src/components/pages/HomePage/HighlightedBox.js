import React, { Fragment } from "react";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";

import ErrorBox from "components/misc/ErrorBox";
import AircraftCard from "components/misc/AircraftCard";
import { useMostFrequentsQuery } from "features/aircrafts/hooks";

const POLLING_INTERVAL = 3 * 60 * 1000; // 3 minutes

export default function HighlightedBox() {
  const { data, isLoading, isError, error } = useMostFrequentsQuery(
    {},
    { pollingInterval: POLLING_INTERVAL }
  );

  return isLoading ? (
    <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
      <CircularProgress size="24px" />
    </Box>
  ) : isError ? (
    <ErrorBox errorDict={error} sx={{ mt: 4 }} />
  ) : (
    data?.length > 0 && (
      <Fragment>
        <Typography
          align="center"
          color="textSecondary"
          sx={{ my: 1, typography: { xs: "body2", sm: "h6", md: "body1" } }}
        >
          Recherches fréquentes :
        </Typography>
        <Grid
          container
          direction="row"
          spacing={2}
          alignItems="stretch"
          justifyContent="center"
        >
          {data?.map((item) => (
            <Grid item key={item?.code} xs>
              <AircraftCard item={item} small />
            </Grid>
          ))}
        </Grid>
      </Fragment>
    )
  );
}
