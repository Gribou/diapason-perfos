import axios from "axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import { API_URI, DEBUG } from "constants";
import aircraftsEndpoints from "features/aircrafts/api";
import contactEndpoints from "features/contact/api";
import configEndpoints from "features/config/api";

axios.defaults.baseURL = `${API_URI}/`;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = `application/json`;

const axiosBaseQuery = () => async (call) => {
  try {
    const result = await axios(call);
    return { data: result.data };
  } catch (error) {
    const { response } = error;
    if (DEBUG) {
      console.error(error, response);
    }
    if (response && response.status === 503) {
      //503 Service Unavailable
      window.location.reload();
      return;
    }
    return { error: generateErrorMessage(error) };
  }
};

function generateErrorMessage(error) {
  const { response, message } = error;
  if (response) {
    if (response.data) {
      if (
        typeof response.data === "string" ||
        response.data instanceof String
      ) {
        return {
          non_field_errors: `${response.status} - ${response.statusText}`,
        };
      } else {
        return response.data;
      }
    } else if (response.status >= 500) {
      return {
        non_field_errors: `Erreur serveur (${response.status} ${response.statusText}) : rafraîchissez la page ou réessayez plus tard.`,
      };
    } else {
      return {
        non_field_errors: `${response.status} - ${response.statusText}`,
      };
    }
  } else {
    return {
      non_field_errors: `Erreur serveur (${message}) : rafraîchissez la page ou réessayez plus tard.`,
    };
  }
}

const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});

export default api
  .injectEndpoints({
    endpoints: aircraftsEndpoints,
    overrideExisting: false,
  })
  .injectEndpoints({ endpoints: configEndpoints, overrideExisting: false })
  .injectEndpoints({ endpoints: contactEndpoints, overrideExisting: false });
