import { cleanSearchParam } from "features/utils";

export default (builder) => ({
  aircraftByCode: builder.query({
    query: (icao_code) => ({
      url: "aircrafts/",
      params: { search: cleanSearchParam(icao_code) },
    }),
    transformResponse: (response) => response?.results?.[0], //return first result only
  }),
  aircraftByPk: builder.query({
    query: (pk) => `aircrafts/${pk}/`,
  }),
  searchAircrafts: builder.query({
    query: ({ search, page, page_size }) => ({
      url: "aircrafts/",
      params: {
        search: cleanSearchParam(search),
        page,
        page_size,
      },
    }),
  }),
  mostFrequents: builder.query({
    query: () => "aircrafts/most_searched/",
  }),
});
