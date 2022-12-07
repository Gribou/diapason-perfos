import React, { Fragment } from "react";
import { Grid, Stack } from "@mui/material";
import ErrorBox from "components/misc/ErrorBox";
import ResultPaginator from "./ResultPaginator";

function ResultsList({ results, CardComponent }) {
  return (
    <Grid
      container
      spacing={{ xs: 1, sm: 3 }}
      justify="flex-start"
      alignItems="stretch"
    >
      {results?.map(
        (map, i) =>
          map && (
            <Grid item md={3} sm={4} xs={12} key={i}>
              <CardComponent item={map} sx={{ height: "100%" }} />
            </Grid>
          )
      )}
    </Grid>
  );
}

export default function ResultDisplay({ query, pageSize, CardComponent }) {
  const { data, error, isFetching } = query;
  const { results, count } = data || {};
  return (
    <Stack>
      <ErrorBox errorDict={error} />
      {!isFetching && (
        <Fragment>
          {results?.length > 0 && (
            <ResultsList results={results} CardComponent={CardComponent} />
          )}
          <ResultPaginator count={count} pageSize={pageSize} />
        </Fragment>
      )}
    </Stack>
  );
}
