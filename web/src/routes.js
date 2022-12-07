import React from "react";
import { URL_ROOT } from "constants";

import {
  HomePage,
  ResultPage,
  AircraftPage,
  ErrorPage,
  HelpPage,
  ContactPage,
} from "components/pages";

export const ROUTES = {
  home: {
    path: `${URL_ROOT}/`,
    element: <HomePage />,
  },
  results: {
    path: `${URL_ROOT}/results`,
    element: <ResultPage />,
  },
  aircraftByCode: {
    path: `${URL_ROOT}/aircraft/by_code/:code`,
    element: <AircraftPage />,
  },
  aircraftByPk: {
    path: `${URL_ROOT}/aircraft/:pk`,
    element: <AircraftPage />,
  },
  help: {
    path: `${URL_ROOT}/help`,
    element: <HelpPage />,
  },
  contact: {
    path: `${URL_ROOT}/contact`,
    element: <ContactPage />,
  },
  error404: {
    path: "*",
    element: <ErrorPage />,
  },
};
