import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Stack } from "@mui/material";
import { Magnify } from "mdi-material-ui";
import HeaderTitle from "components/misc/HeaderTitle";
import { ROUTES } from "routes";
import { useAircraftResults } from "./Results";

export default function Results() {
  const [params] = useSearchParams();
  const results = {
    aircrafts: useAircraftResults(params),
  };

  const isLoading = !!Object.values(results)?.find(
    ({ is_loading }) => is_loading
  );

  return results?.aircrafts?.single ? (
    <Navigate
      to={ROUTES.aircraftByPk.path.replace(
        ":pk",
        results?.aircrafts?.single?.pk
      )}
      replace
    />
  ) : (
    <Stack alignItems="stretch" sx={{ flexGrow: 1 }}>
      <HeaderTitle
        Icon={Magnify}
        title={`${results?.aircrafts?.count} résultat${
          results?.aircrafts?.count <= 1 ? "" : "s"
        } pour "${params.get("search")}"`}
        sx={{ my: 2 }}
        alignItems="center"
        loading={isLoading}
      />
      {results?.aircrafts?.display}
    </Stack>
  );
}
