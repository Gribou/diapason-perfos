import api from "features/api";

export const { useConfigQuery } = api;

export const useVersion = () => {
  const { data } = useConfigQuery();
  return data?.version;
};
