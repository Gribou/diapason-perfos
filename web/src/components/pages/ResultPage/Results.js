import React from "react";
import { useMediaQuery } from "@mui/material";
import { useSearchAircraftsQuery } from "features/aircrafts/hooks";
import ResultDisplay from "./ResultDisplay";
import AircraftCard from "components/misc/AircraftCard";

const usePageSize = () => {
  const mdDown = useMediaQuery((t) => t.breakpoints.down("md"));
  if (mdDown) return 9;
  return 12;
};

export function useAircraftResults(params) {
  const page_size = usePageSize();
  const query = useSearchAircraftsQuery({
    page_size,
    ...Object.fromEntries(params),
  });
  const is_empty = query?.isSuccess && !query?.data?.length;
  const single =
    query?.isSuccess && query?.data?.count === 1 && query?.data?.results?.[0];

  const display = (
    <ResultDisplay
      query={query}
      entityName="type"
      CardComponent={AircraftCard}
      pageSize={page_size}
    />
  );

  return {
    display,
    is_empty,
    single,
    count: query?.data?.count || 0,
    is_loading: query?.isFetching,
  };
}
