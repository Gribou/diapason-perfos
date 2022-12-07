import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import {
  IconButton,
  InputAdornment,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Magnify, Close } from "mdi-material-ui";
import { ROUTES } from "routes";
import { useDebounce } from "features/utils";
import { useSearchAircraftsQuery } from "features/aircrafts/hooks";

const useAircraftSearchAutocomplete = (default_value) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(default_value || ""); //the "real" search keyword
  const [input, setInput] = useState(default_value || ""); //only used to trigger suggestions query
  const debouncedInput = useDebounce(input, 500);
  const suggestions = useSearchAircraftsQuery(
    { search: debouncedInput },
    { skip: !debouncedInput }
  );
  const resultIsRelevant = (result, search) =>
    result?.toUpperCase()?.includes(search?.toUpperCase());

  const clear = () => {
    setKeyword("");
    setInput("");
  };

  useEffect(() => {
    //update field value when location changes (ex : filters are cleared)
    setKeyword(default_value || "");
    setInput(default_value || "");
  }, [default_value]);

  const onChange = (e, value, reason) => {
    if (reason === "selectOption") {
      //if user clicks on option, trigger search
      handleSearchRequest(value);
    }
    //if user selects an option with keyboard
    setKeyword(value);
  };

  const onInputChange = (e, value) => {
    //is user types in input field
    setInput(value); //triggers suggestions update
    setKeyword(value);
  };

  const onKeyUp = (e) => {
    //is user presses enter or escape
    if (e.charCode === 13 || e.key === "Enter") {
      handleSearchRequest(keyword);
    } else if (e.charCode === 27 || e.key === "Escape") {
      clear();
    }
  };

  const handleSearchRequest = (keyword) => {
    navigate({
      pathname: ROUTES.results.path,
      search: "?" + new URLSearchParams({ search: keyword }).toString(),
    });
  };

  const result = [
    ...new Set(
      suggestions?.data?.results
        ?.map(({ code, fullname, reference }) => [
          resultIsRelevant(code, debouncedInput) ? code : null,
          resultIsRelevant(fullname, debouncedInput) ? fullname : null,
          resultIsRelevant(reference?.wake_cat, debouncedInput)
            ? reference?.wake_cat
            : null,
        ])
        ?.flat()
        ?.filter((x) => x) || []
    ),
  ].sort();

  return {
    keyword,
    suggestions: result,
    clear,
    onInputChange,
    onChange,
    onKeyUp,
    handleSearchRequest,
    isLoading: suggestions.isFetching,
  };
};

export default function SearchField({
  placeholder = "Recherche…",
  sx = [],
  inputInputSx,
  ...props
}) {
  const [params] = useSearchParams();
  const {
    keyword,
    onInputChange,
    onKeyUp,
    onChange,
    handleSearchRequest,
    clear,
    suggestions,
    isLoading,
  } = useAircraftSearchAutocomplete(params.get("search"));

  return (
    <Autocomplete
      filterOptions={(x) => x}
      freeSolo
      options={suggestions || []}
      loading={isLoading}
      includeInputInList
      filterSelectedOptions
      value={keyword || ""}
      fullWidth
      disableClearable
      onChange={onChange}
      onInputChange={onInputChange}
      noOptionsText={"Aucune suggestion"}
      loadingText={"Chargement..."}
      renderInput={({ InputProps, ...params }) => (
        <TextField
          placeholder={placeholder}
          fullWidth
          variant="standard"
          size="medium"
          {...params}
          InputProps={{
            ...InputProps,
            onKeyUp,
            sx: {
              color: "inherit",
              p: 1,
              pl: {
                xs: "1em",
                sm: (theme) => `calc(1em + ${theme.spacing(2)}px)`,
                transition: (theme) => theme.transitions.create("width"),
              },
              ...inputInputSx,
            },
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end" sx={{ color: "inherit" }}>
                <IconButton
                  onClick={() => handleSearchRequest(keyword)}
                  size="small"
                  color="inherit"
                >
                  <Magnify />
                </IconButton>
                {keyword && (
                  <IconButton onClick={clear} size="small" color="inherit">
                    <Close />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      )}
      sx={[
        {
          borderRadius: 1,
          color: "common.white",
          bgcolor: (theme) => alpha(theme.palette.common.white, 0.15),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.common.white, 0.25),
          },
          "&.MuiAutocomplete-root": { pb: 0 },
          "& .MuiAutocomplete-inputRoot": { py: 0.5 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}
